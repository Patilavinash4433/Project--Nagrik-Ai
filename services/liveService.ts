
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Establishes a real-time, bi-directional voice connection with Gemini.
 */
export const connectLive = async (
  voiceName: string = 'Zephyr',
  callbacks: {
    onAudio: (buffer: AudioBuffer) => void;
    onInterrupted: () => void;
    onClose: () => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
  }
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Input Context (Microphone -> 16kHz PCM)
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  // Output Context (Model -> 24kHz PCM)
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
  } catch (err) {
    throw new Error("Microphone access denied.");
  }

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(2048, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          
          // Downsample/Convert Float32 to Int16 for Gemini
          const int16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            // Simple clamping
            let s = Math.max(-1, Math.min(1, inputData[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          
          sessionPromise.then(s => {
            try {
              s.sendRealtimeInput({
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
              });
            } catch (err) {
               // Session might be closing
            }
          });
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        // Handle interruptions first
        if (message.serverContent?.interrupted) {
          callbacks.onInterrupted();
        }

        // Transcriptions
        if (message.serverContent?.inputTranscription) {
          callbacks.onInputTranscription?.(message.serverContent.inputTranscription.text);
        }
        if (message.serverContent?.outputTranscription) {
          callbacks.onOutputTranscription?.(message.serverContent.outputTranscription.text);
        }

        // Audio Data
        const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (audioBase64) {
          const audioBuffer = await decodeAudioData(decode(audioBase64), outputAudioContext, 24000, 1);
          callbacks.onAudio(audioBuffer);
        }
      },
      onclose: () => {
        callbacks.onClose();
        cleanup();
      },
      onerror: (e) => {
        console.error("Live API Error:", e);
        callbacks.onClose();
        cleanup();
      },
    },
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {}, // Request transcriptions
      outputAudioTranscription: {},
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      systemInstruction: 'You are NagrikAi. You speak English or Hindi based on the user. You are helpful, precise, and fast.',
      // Disable thinking for maximum speed in Live mode
    }
  });

  const cleanup = () => {
    try {
      stream?.getTracks().forEach(t => t.stop());
      inputAudioContext.close();
      outputAudioContext.close();
    } catch(e) {}
  };

  return {
    disconnect: async () => {
      const session = await sessionPromise;
      session.close();
      cleanup();
    }
  };
};
