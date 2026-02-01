import { GoogleGenAI } from "@google/genai";  // ← exact import from docs [web:231]

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing from .env");
}

const ai = new GoogleGenAI({ apiKey });

export const generateGreetingWithGemini = async ({ name, serviceUsed, occasion }) => {
  const prompt = `You are a friendly business assistant writing personalized greeting messages.

Create 1 short WhatsApp/Email message (2-3 sentences) for this client:

Name: ${name}
Service: ${serviceUsed || "our premium taxi services"}
Occasion: ${occasion || "special occasion"}

Include:
- Warm personalized greeting  
- Thank them for past business
- Express excitement to work together again  
- Professional closing

Example: "Hi John, Happy Birthday! Thank you for trusting us for taxi service. Looking forward to serving you again soon!"

Keep it warm, professional, 80-120 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",  // ← latest fast model, free tier OK [web:231]
      maxTokens: 150,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text;  // ← plain text string
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw error;
  }
};
