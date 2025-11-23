import { GoogleGenAI } from "@google/genai";
import { AnomalyEvent, UserEntity } from "../types";

// Initialize Gemini
// Note: In a real production app, this key should be handled via a secure proxy.
// For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeThreat = async (event: AnomalyEvent, user: UserEntity): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a senior cybersecurity analyst. Analyze the following anomaly event for a UEBA (User and Entity Behavior Analytics) system.
      
      User Context:
      - Name: ${user.name}
      - Role: ${user.role}
      - Department: ${user.department}
      - Current Risk Score: ${user.riskScore}/100
      
      Event Details:
      - Type: ${event.type}
      - Description: ${event.description}
      - Severity: ${event.riskLevel}
      - Details: ${JSON.stringify(event.details)}
      - Source IP: ${event.sourceIp}
      - Location: ${event.location}
      
      Provide a concise breakdown including:
      1. Immediate Threat Assessment.
      2. Potential Intent (e.g., Insider Threat, Compromised Credential).
      3. Recommended Actions (Bullet points).
      
      Keep the tone professional and urgent if necessary. Format with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for factual/analytical output
      }
    });

    return response.text || "Analysis could not be generated at this time.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Error generating AI analysis. Please check your API key and try again.";
  }
};