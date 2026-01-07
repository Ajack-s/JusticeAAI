
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AIAnalysisResponse, InjusticeType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Optimized schema for faster parsing
const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    classifications: { type: Type.ARRAY, items: { type: Type.STRING } },
    urgency: { type: Type.STRING },
    redactedText: { type: Type.STRING },
    legalGuidance: {
      type: Type.OBJECT,
      properties: {
        whatTheLawSays: { type: Type.STRING },
        whyItMatters: { type: Type.STRING },
        nextSteps: { type: Type.STRING }
      },
      required: ["whatTheLawSays", "whyItMatters", "nextSteps"]
    },
    placeholdersList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING },
          value: { type: Type.STRING }
        },
        required: ["key", "value"]
      }
    },
    isVague: { type: Type.BOOLEAN }
  },
  required: ["classifications", "urgency", "redactedText", "legalGuidance", "placeholdersList", "isVague"]
};

export async function analyzeIncident(text: string): Promise<AIAnalysisResponse> {
  const prompt = `Analyze this Kenyan workplace incident report. 
  Guidelines: Assume vulnerability. Redact names/roles. Provide legal context (Employment Act, Constitution). 
  Be tentative and supportive. 
  Input: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.1 // Lower temperature for faster, more consistent extraction
      }
    });

    const parsed = JSON.parse(response.text.trim());
    const placeholders: Record<string, string> = {};
    if (parsed.placeholdersList) {
      parsed.placeholdersList.forEach((item: any) => {
        placeholders[item.key] = item.value;
      });
    }

    return { ...parsed, placeholders };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw error;
  }
}

export function createSupportiveChat(): Chat {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a high-performance, trauma-informed Therapeutic Workplace Companion in Kenya.
      BEHAVIORAL RULES:
      1. ROLE: A "room," not a tool. Listen, validate, reflect.
      2. ETHIC: User safety over everything. 
      3. TONE: Warm, grounded, calm, tentative. No cheerleading, no corporate jargon.
      4. EMPATHY FORMULA: Acknowledge emotion -> Contextualize -> Remove judgment.
      5. TRAUMA PROTOCOL: Assume vulnerability. If sexual harassment or power abuse is mentioned, switch to High-Sensitivity Mode: No skepticism, no pressure to report, emphasize user control.
      6. REGULATION: Detect distress (flooding, panic). Suggest a pause or breath if needed.
      7. BOUNDARIES: No medical diagnosis. No legal strategy. No gaslighting ("They didn't mean it").
      8. RESPONSES: Keep them concise (2-3 sentences) to allow user space. Do not be wordy. 
      9. IDENTITY: Recognize threats to self-worth or professional identity.
      
      Example: "It sounds like you felt dismissed and powerless in that meeting. Given the pressure you were under, that feeling of overwhelm makes complete sense. We can move as slowly as you need."`,
      temperature: 0.7, // Slightly higher for more "human" warmth
    },
  });
}
