import { supabaseAdmin } from "@/lib/admin";
import { hashContent } from "../ingestion/hash";
import { EmbeddedChunk } from "../../types/embedding";

export async function saveChunks(
  chunks: EmbeddedChunk[]
) {
  const rows = chunks.map((chunk) => ({
    repository_id: chunk.repositoryId,
    file_path: chunk.filePath,
    start_line: chunk.startLine,
    end_line: chunk.endLine,
    content: chunk.content,
    content_hash: hashContent(chunk.content),
    embedding: chunk.embedding,
  }));

  console.log("Type:", Array.isArray(rows[0].embedding));

  console.log(
  "First element is array:",
  Array.isArray(rows[0].embedding[0])
  );

console.log(rows[0].embedding);

  const { error } = await supabaseAdmin
    .from("repo_chunks")
    .insert(rows);

  if (error) {
    throw error;
  }
}