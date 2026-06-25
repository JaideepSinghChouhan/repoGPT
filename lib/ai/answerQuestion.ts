import { ai } from "./gemini";

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

export async function generateAnswer(
  prompt: string
) {
  let lastError: any = null;

  for (const model of MODELS) {
    try {
      // console.log(
      //   `Trying model: ${model}`
      // );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
        });

      // console.log(
      //   `Success with ${model}`
      // );

      return {
        answer: response.text,
        model,
      };
    } catch (error: any) {
      console.error(
        `${model} failed`,
        {
          status: error?.status,
          message: error?.message,
        }
      );

      lastError = error;

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
    }
  }

  // All models failed
  if (
    lastError?.status === 429 ||
    lastError?.message?.includes(
      "RESOURCE_EXHAUSTED"
    ) ||
    lastError?.message?.includes(
      "Quota exceeded"
    )
  ) {
    throw new Error(
      "All Gemini models have exhausted their quota. Please try again later."
    );
  }

  if (
    lastError?.status === 503
  ) {
    throw new Error(
      "All Gemini models are currently overloaded. Please try again later."
    );
  }

  throw new Error(
    "Unable to generate AI response."
  );
}