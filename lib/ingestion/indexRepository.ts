import { cloneRepo } from "@/lib/github/cloneRepo";
import { scanRepo } from "@/lib/github/scanRepo";

import { chunkFiles } from "@/lib/ingestion/chunker";

import { saveChunks } from "@/lib/vector/saveEmbeddings";

import { embedChunks } from "@/lib/embeddings/embedChunks";
import { createRepository } from "../repositories/createRepository";
import { updateRepository } from "./updateRepository";
import { removeRepo } from "./removeRepo";

function extractRepoName(repoUrl: string) {
  return repoUrl.split("/").pop()?.replace(".git", "") ?? "unknown";
}

export async function indexRepository(repoUrl: string, userId: string) {
  const repoPath = await cloneRepo(repoUrl);

  const repoName = extractRepoName(repoUrl);

  const repository = await createRepository(repoName, repoUrl, userId);

  try {
    const files = await scanRepo(repoPath);

    const chunks = chunkFiles(files);
    const embeddedChunks = await embedChunks(chunks, repository.id);

    await saveChunks(embeddedChunks);

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
  finally{
    await removeRepo(repoPath);
  }
}
