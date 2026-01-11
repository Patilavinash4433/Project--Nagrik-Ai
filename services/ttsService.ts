
import { GoogleGenAI, Modality } from "@google/genai";

// Singleton Audio Context to prevent "cold start" latency
let sharedAudioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ 
      sampleRate: 24000 
    });
  }
  return sharedAudioContext;
};

/**
 * Advanced text cleaning to ensure natural, non-robotic delivery.
 * Strips Markdown artifacts that confuse TTS engines.
 */
function cleanTextForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Remove headers (### Title -> Title)
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove list markers to prevent "dash" or "asterisk" reading
    .replace(/^\s*[-*•]\s+/gm, '')
    // Remove numbered list markers "1." -> just read the text
    .replace(/^\d+\.\s+/gm, '')
    // Remove detailed URLs
    .replace(/https?:\/\/[^\s]+/g, 'the website')
    // Normalize legal acronyms for better pronunciation
    .replace(/CrPC/g, 'C R P C')
    .replace(/IPC/g, 'I P C')
    .replace(/FIR/g, 'F I R')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stops any currently playing audio immediately.
 */
export const stopCurrentSpeech = () => {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {
      // Ignore errors if already stopped
    }
    currentSource = null;
  }
};

/**
 * Fast, low-latency TTS using Gemini 2.5 Flash Native Audio.
 */
export const speakText = async (
  text: string, 
  voiceName: string = 'Zephyr', 
  speechRate: number = 1.0,
  onEnded?: () => void,
  onStart?: () => void
): Promise<void> => {
  try {
    // 1. Immediate Stop & Cleanup
    stopCurrentSpeech();

    // 2. Prepare Context (Resume if suspended by browser policy)
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 3. Clean Text
    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) {
      if (onEnded) onEnded();
      return;
    }

    // 4. API Call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: spokenText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      if (onEnded) onEnded();
      return;
    }

    // 5. Decode Audio (Fast)
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decoding raw PCM data (Mono, 24kHz usually)
    // Note: The API returns raw PCM. We need to decode it manually or use decodeAudioData if it has headers.
    // Gemini 2.5 TTS usually returns standard encodings.
    // However, to be safe and fast, we use ctx.decodeAudioData which handles WAV/MP3 wrappers automatically.
    // If raw PCM is sent without headers, we need the manual float32 conversion seen in liveService.
    // Current TTS endpoint wraps in a container usually compatible with decodeAudioData or we construct a WAV header.
    // *Correction*: The TTS endpoint returns a base64 that `decodeAudioData` can usually handle if formatted, 
    // but often it's raw PCM. Let's try the robust manual PCM decoding first for speed.

    const dataInt16 = new Int16Array(bytes.buffer);
    const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    // 6. Playback
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = speechRate;
    
    // Gain for clarity
    const gainNode = ctx.createGain();
    gainNode.gain.value = 1.2; 

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.onended = () => {
      if (currentSource === source) {
        currentSource = null;
        if (onEnded) onEnded();
      }
    };

    currentSource = source;
    if (onStart) onStart();
    source.start(0);

  } catch (error) {
    console.error("TTS Error:", error);
    if (onEnded) onEnded();
  }
};
