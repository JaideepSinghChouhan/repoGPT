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

  const { error } = await supabaseAdmin
    .from("repo_chunks")
    .insert(rows);

  if (error) {
    throw error;
  }
}