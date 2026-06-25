import { Repofile } from "../github/scanRepo";
import { CodeChunk } from "../../types/chunk";

export function chunkFiles(
  files: Repofile[],
  chunkSize = 30,
  overlap = 5,
): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");

    for (let start = 0; start < lines.length; start += chunkSize - overlap) {
      const end = Math.min(start + chunkSize, lines.length);

      const content = lines.slice(start, end).join("\n").trim();

      if (!content) {
        continue;
      }

      chunks.push({
        id: `${file.filePath}:${start + 1}-${end}`,
        filePath: file.filePath,
        startLine: start + 1,
        endLine: end,
        content,
      });
    }
  }

  return chunks;
}
