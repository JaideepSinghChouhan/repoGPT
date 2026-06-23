import { retrieveChunks } from "../vector/retrieval";

import { buildContext } from "./buildContext";

import { createPrompt } from "./prompt";

import { generateAnswer } from "../ai/answerQuestion";
import { RetrievedChunk } from "@/types/chunk";

export async function askRepo(question: string, repositoryId: string) {
  const chunks = await retrieveChunks(question,repositoryId);

  const context = buildContext(chunks);

  const prompt = createPrompt(question, context);

  const answer = await generateAnswer(prompt);

  return {
    answer,

    sources: chunks.map(
      (
        chunk: RetrievedChunk
      ) => ({
        file: chunk.file_path,
        startLine:
          chunk.start_line,
        endLine:
          chunk.end_line,
      })
    ),
  };
}
