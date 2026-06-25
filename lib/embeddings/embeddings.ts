import { GoogleGenAI } from "@google/genai";


import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});



export async function createEmbedding(
  text: string
) {
    if (!text.trim()) {
    throw new Error(
      "Attempted to embed empty text."
    );
    }
  const result =
    await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: [{ text }]
    });

  return result.embeddings?.[0].values ?? [];
}