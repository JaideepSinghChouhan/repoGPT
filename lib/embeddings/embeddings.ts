import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MAX_RETRIES = 5;

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export async function createEmbeddings(
  texts: string[]
) {
  const validTexts = texts.filter((t) => t.trim());

  if (validTexts.length === 0) {
    return [];
  }

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      const result =
        await ai.models.embedContent({
          model: "gemini-embedding-001",
          contents: validTexts.map((text) => ({
            text,
          })),
        });

      return (
        result.embeddings?.map(
          (e) => e.values ?? []
        ) ?? []
      );

    } catch (error: any) {
      console.log(
        `Embedding batch failed (Attempt ${attempt})`
      );

      if (error.status !== 429) {
        throw error;
      }

      // Default wait
      let waitSeconds = 35;

      // Parse Google's retry message if present
      const message =
        error?.message ?? "";

      const match =
        message.match(
          /retry in ([\d.]+)s/i
        );

      if (match) {
        waitSeconds = Math.ceil(
          Number(match[1])
        );
      }

      console.log(
        `Rate limited. Waiting ${waitSeconds}s...`
      );

      await sleep(
        waitSeconds * 1000
      );
    }
  }

  throw new Error(
    "Embedding failed after multiple retries."
  );
}