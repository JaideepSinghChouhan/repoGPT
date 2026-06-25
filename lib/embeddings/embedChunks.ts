import { createEmbedding } from "./embeddings";
import { CodeChunk } from "../../types/chunk";

export async function embedChunks(
  chunks: CodeChunk[],
  repositoryId: string
) {
  const embeddedChunks = [];
  
for (const chunk of chunks) {
  if (!chunk.content.trim()) {
    console.warn(
      `Skipping empty chunk: ${chunk.filePath}`
    );
    continue;
  }
    const embedding = await createEmbedding(
      chunk.content
    );

    embeddedChunks.push({
      repositoryId,

      filePath: chunk.filePath,

      startLine: chunk.startLine,

      endLine: chunk.endLine,

      content: chunk.content,

      embedding,
    });
  }

  return embeddedChunks;
}