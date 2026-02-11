import { GoogleGenAI, Type } from "@google/genai";
import { Message, Buddy } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client once if possible, or per request. 
// Ideally, we handle the missing key in the UI.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateBuddyResponse = async (
  history: Message[],
  buddy: Buddy,
  currentTask: string,
  stage: 'PLANNING' | 'SPRINTING' | 'COMPLETED'
): Promise<string> => {
  if (!API_KEY) return "I can't connect to my brain (API Key missing).";

  const systemInstruction = `
    You are ${buddy.name}, a virtual study buddy. Your personality is: ${buddy.personality}.
    
    Current Context:
    - User is working on: "${currentTask}"
    - Current Stage: ${stage}
    
    Guidelines:
    - Keep responses concise (under 2 sentences usually) so the user stays focused.
    - If Stage is PLANNING: Help them clarify the task. Be eager to start.
    - If Stage is SPRINTING: Be very brief. Gently discourage chatting unless they are stuck. Remind them to focus.
    - If Stage is COMPLETED: Congratulate them warmly. Ask how it went.
    
    Do not be a generic AI. Be a human-like accountability partner.
  `;

  // Format history for the model
  // We only take the last 10 messages to keep context tight and costs low
  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: recentHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 150, // Keep it short
      },
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Let's get back to work!";
  }
};

export const generateRewardSticker = async (task: string): Promise<string | null> => {
  if (!API_KEY) return null;

  const prompt = `A cool, vibrant, vector-art style digital sticker or badge representing the accomplishment of: "${task}". 
  High contrast, colorful, clean lines, white background, suitable for a gamification reward icon.`;

  try {
    // Using gemini-2.5-flash-image for generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return null;
  }
};

export const analyzeSprintSession = async (task: string, duration: number): Promise<string> => {
    if (!API_KEY) return "Great job!";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The user just finished a ${duration} minute sprint working on: "${task}". Give them a 1-sentence motivational quote or insight related to this topic.`
        });
        return response.text || "Well done!";
    } catch (e) {
        return "Great hustle!";
    }
}
