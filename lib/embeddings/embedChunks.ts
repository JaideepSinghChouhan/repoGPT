import { createEmbeddings } from "./embeddings";
import { CodeChunk } from "../../types/chunk";

const BATCH_SIZE = 20;

export async function embedChunks(
  chunks: CodeChunk[],
  repositoryId: string
) {
  const embeddedChunks = [];

  for (
    let i = 0;
    i < chunks.length;
    i += BATCH_SIZE
  ) {
    if ((i / BATCH_SIZE + 1) % 5 === 0) {
  console.log(
    "Cooling down for quota..."
  );

  await new Promise((r) =>
    setTimeout(r, 60000)
  );
}
    const batch = chunks
      .slice(i, i + BATCH_SIZE)
      .filter((chunk) => chunk.content.trim());

    if (batch.length === 0) {
      continue;
    }

    const embeddings =
      await createEmbeddings(
        batch.map((c) => c.content)
      );

    if (embeddings.length !== batch.length) {
      throw new Error(
        `Embedding count mismatch. Expected ${batch.length}, got ${embeddings.length}`
      );
    }

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];

      embeddedChunks.push({
        repositoryId,

        filePath: chunk.filePath,

        startLine: chunk.startLine,

        endLine: chunk.endLine,

        content: chunk.content,

        embedding: embeddings[j],
      });
    }

    console.log(
      `Embedded ${Math.min(
        i + BATCH_SIZE,
        chunks.length
      )}/${chunks.length}`
    );
  }

  return embeddedChunks;
}