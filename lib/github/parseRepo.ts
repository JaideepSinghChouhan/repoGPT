export interface ParsedRepo {
  owner: string;
  repo: string;
}

export function parseRepoUrl(repoUrl: string): ParsedRepo {
  try {
    const url = new URL(repoUrl);

    if (url.hostname !== "github.com") {
      throw new Error("Only GitHub repositories are supported.");
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL.");
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(".git", ""),
    };
  } catch {
    throw new Error("Invalid GitHub repository URL.");
  }
}