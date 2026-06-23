

import { cloneRepo } from "@/lib/github/cloneRepo";
import { scanRepo } from "@/lib/github/scanRepo";

import { chunkFiles } from "@/lib/ingestion/chunker";

import { saveChunks } from "@/lib/vector/saveEmbeddings";

import { embedChunks } from "@/lib/embeddings/embedChunks";
import { createRepository } from "../repositories/createRepository";

function extractRepoName(
  repoUrl: string
) {
  return repoUrl
    .split("/")
    .pop()
    ?.replace(".git", "") ?? "unknown";
}

export async function indexRepository(
  repoUrl: string,
  userId: string
) {
  const repoPath = await cloneRepo(repoUrl);

  const files =
    await scanRepo(repoPath);

  const chunks =
    chunkFiles(files);

const repoName =
  extractRepoName(repoUrl);

const repository =
  await createRepository(
    repoName,
    repoUrl,
    userId
  );

  const embeddedChunks =
    await embedChunks(
      chunks,
      repository.id
    );

  await saveChunks(
    embeddedChunks
  );

  return {
    repoName,
    files: files.length,
    chunks: chunks.length,
  };
}