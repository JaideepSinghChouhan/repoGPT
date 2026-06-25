
import { getRepoFiles } from "@/lib/github/getRepoFiles";

import { chunkFiles } from "@/lib/ingestion/chunker";

import { saveChunks } from "@/lib/vector/saveEmbeddings";

import { embedChunks } from "@/lib/embeddings/embedChunks";
import { createRepository } from "../repositories/createRepository";
import { updateRepository } from "./updateRepository";


function extractRepoName(repoUrl: string) {
  return repoUrl.split("/").pop()?.replace(".git", "") ?? "unknown";
}

export async function indexRepository(repoUrl: string, userId: string) {


  const repoName = extractRepoName(repoUrl);

  const repository = await createRepository(repoName, repoUrl, userId);

  try {
    console.time("download")
    const files = await getRepoFiles(repoUrl);
    console.timeEnd("download")

    console.time("chunking")
    const chunks = chunkFiles(files);
    console.timeEnd("chunking")

    console.time("embedding")
    const embeddedChunks = await embedChunks(chunks, repository.id);
    console.timeEnd("embedding")
    
    console.time("saving")
    await saveChunks(embeddedChunks.filter((chunk) => chunk !== null));
    console.timeEnd("saving")

    await updateRepository(repository.id, {
      status: "completed",
      chunkCount: chunks.length,
      indexedAt: new Date().toISOString(),
      errorMessage: null,
    });

    return {
      repoName,
      files: files.length,
      chunks: chunks.length,
    };
  } catch (error) {
    await updateRepository(repository.id, {
      status: "failed",
      chunkCount: 0,
      indexedAt: null,
      errorMessage:
        error instanceof Error ? error.message : "Unknown indexing error",
    });
    throw error;
  }
}
