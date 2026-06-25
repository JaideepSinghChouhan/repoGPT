
import fs from "fs/promises";

export async function removeRepo(repoPath: string) {
  try {
    await fs.rm(repoPath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Failed to remove repository at ${repoPath}:`, error);
  }
}