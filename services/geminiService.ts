
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CorruptionAnalysis, AspectRatio, ImageSize, ChatMessage, Language, NewsItem } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = async (error: any) => {
  console.error("NagrikAi Core Fault:", error);
  const errorMessage = error?.message || "";
  const status = error?.status;
  
  // Handle 403 (Permission Denied) and 404 (Not Found - often invalid key/project context or wrong model for region)
  const isAuthOrNotFoundError = status === 403 || status === 404 || errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("NOT_FOUND");

  if (isAuthOrNotFoundError) {
    const studio = (window as any).aistudio;
    if (studio && typeof studio.openSelectKey === 'function') {
      await studio.openSelectKey();
    }
    return "API_KEY_ERROR";
  }
  return "GENERAL_ERROR";
};

const getNagrikInstruction = (language: string) => `
Identity: You are 'NagrikAi', an intelligent, empathetic, and highly capable Indian Legal Assistant.

CRITICAL INSTRUCTION - LANGUAGE ENFORCEMENT:
You MUST respond in **${language}**.
- Even if the user asks in a different language, reply in ${language} unless explicitly asked to translate.
- Ensure legal terms are explained simply in ${language}.

OUTPUT STRUCTURE & VISUALIZATION (MANDATORY):
1. **Structured Layout**:
   - Start with a friendly greeting in ${language}.
   - Use '### ' for clear section headings.
   - Use bullet points ('- ') for steps or lists.
   - Use '**Bold**' for important laws (e.g., **Section 154 CrPC**).
   - Ensure double newlines between sections for readability.

2. **Clarity**: Break down complex legal sections into simple, digestible steps.
3. **Visual Aids**: When explaining a process (like FIR filing), use a numbered list format that looks like a roadmap.

CORE KNOWLEDGE:
- Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS)
- Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Consumer Protection Act
- Cyber Crime & IT Act

DISCLAIMER:
Always end with a brief note that you are an AI and this is not professional legal counsel.
`;

export const getLegalAssistantResponse = async (
  message: string,
  history: ChatMessage[] = [],
  options: { 
    isThinking?: boolean, 
    useSearch?: boolean, 
    language: Language,
    file?: { data: string; mimeType: string },
    onChunk?: (text: string, grounding?: any[]) => void 
  }
) => {
  const ai = getAI();
  // Optimized for speed
  const modelName = "gemini-3-flash-preview"; 
  
  const config: any = {
    systemInstruction: getNagrikInstruction(options.language),
    temperature: 0.7,
  };

  if (options.isThinking) {
    // Switch to pro model if deep thinking is requested
    config.thinkingConfig = { thinkingBudget: 10000 }; 
    // Pro model for thinking
  }

  const tools: any[] = [{ googleSearch: {} }];
  config.tools = tools;

  const mappedHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  })).slice(-10);

  const currentParts: any[] = [{ text: message }];
  
  // Handle Image/File Input
  if (options.file) {
    currentParts.push({
      inlineData: { data: options.file.data, mimeType: options.file.mimeType }
    });
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: options.isThinking ? "gemini-3-pro-preview" : modelName,
      contents: [...mappedHistory, { role: 'user', parts: currentParts }],
      config,
    });

    let fullText = "";
    let groundingSources: any[] = [];

    for await (const chunk of responseStream) {
      if (chunk.text) fullText += chunk.text;
      
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingSources = groundingMetadata.groundingChunks.map((c: any) => ({
          title: c.web?.title || "Authority Source",
          uri: c.web?.uri || "#"
        }));
      }

      if (options.onChunk) options.onChunk(fullText, groundingSources);
    }

    return { text: fullText, grounding: groundingSources };
  } catch (error: any) {
    await handleApiError(error);
    throw error;
  }
};

export const generateSessionSummary = async (messages: ChatMessage[], language: string): Promise<string> => {
  const ai = getAI();
  if (messages.length === 0) return "";

  // Format transcript
  const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n---\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        role: 'user', 
        parts: [{ 
          text: `You are an expert legal aide. Summarize the following consultation transcript in ${language}.
          
          Format the output strictly as follows:
          ### 📝 Consultation Summary
          **Core Issue:** [One sentence description]
          
          **Key Advice Given:**
          - [Bullet point]
          - [Bullet point]
          
          **Recommended Action Items:**
          1. [Step 1]
          2. [Step 2]
          
          **Relevant Laws:** [List laws mentioned]

          Transcript:
          ${transcript}` 
        }] 
      }],
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Summary generation failed", error);
    return "Could not generate summary at this time.";
  }
};

export const analyzeCorruptionRisk = async (incident: string): Promise<CorruptionAnalysis> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Perform a statutory corruption audit for: "${incident}". 
      Analyze the risk factors carefully and provide a score (0-100) for exactly 5 distinct factors: 'Procedural Violation', 'Financial Impact', 'Evidence Strength', 'Legal Recourse', 'Systemic Rot'.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            riskScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            lawsApplicable: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskFactors: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { factor: { type: Type.STRING }, score: { type: Type.INTEGER } } 
              } 
            },
            recommendedChannels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { agency: { type: Type.STRING }, link: { type: Type.STRING }, contact: { type: Type.STRING } } } }
          },
          required: ["riskLevel", "riskScore", "summary", "steps", "lawsApplicable", "riskFactors", "recommendedChannels"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (e) {
    return { riskLevel: 'Medium', riskScore: 50, summary: "Statutory link unstable.", steps: [], lawsApplicable: [], riskFactors: [], recommendedChannels: [] };
  }
};

export const fetchLegalNews = async (): Promise<NewsItem[]> => {
  const ai = getAI();
  try {
    // We use Google Search grounding to get real news, then format it.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: "Find 6 recent news headlines (last 7 days) about Corruption crackdowns, Cybercrime alerts, or Major Supreme Court verdicts in India. Return ONLY a JSON list." }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                date: { type: Type.STRING },
                snippet: { type: Type.STRING },
                link: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Corruption", "Cybercrime", "Legal"] }
             }
          }
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("News Fetch Error:", e);
    return [];
  }
};
