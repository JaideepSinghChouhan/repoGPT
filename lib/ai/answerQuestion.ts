import { ai } from "./gemini";

export async function generateAnswer(
  prompt: string
) {
  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

  return response.text;
}