
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisStatus } from "../types";

export const analyzeMessage = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a world-class AI scam detection specialist for social media. 
    Your task is to analyze text messages, posts, comments, or DMs to identify:
    1. Phishing attempts
    2. Impersonation (scammers pretending to be official support or celebrities)
    3. Urgency-based manipulation ("Act now!", "Account suspended")
    4. Fake offers/Lotteries ("You won!", "Get rich quick")
    5. Malicious or suspicious links
    6. Requests for sensitive data (OTP, password, SSN, credit card)

    Be friendly, non-alarming, but firm in your classification.
    Classify as:
    - SCAM: Clear fraudulent intent.
    - RISK: Suspicious patterns, unusual requests, but not definitive.
    - SAFE: Normal conversation, no red flags.

    Return the analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Must be SCAM, RISK, or SAFE",
            },
            riskScore: {
              type: Type.NUMBER,
              description: "0 to 100 risk probability",
            },
            explanation: {
              type: Type.STRING,
              description: "Brief explanation of the analysis in simple language",
            },
            flaggedPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific parts of the text that are suspicious",
            },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable advice for the user",
            },
          },
          propertyOrdering: ["status", "riskScore", "explanation", "flaggedPhrases", "actionableTips"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      inputText: text,
      status: data.status as AnalysisStatus || AnalysisStatus.SAFE,
      riskScore: data.riskScore || 0,
      explanation: data.explanation || "No suspicious patterns detected.",
      flaggedPhrases: data.flaggedPhrases || [],
      actionableTips: data.actionableTips || ["Stay vigilant online."],
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the message. Please try again later.");
  }
};
