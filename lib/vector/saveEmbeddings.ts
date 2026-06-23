
import { supabaseAdmin } from "@/lib/admin";
import { hashContent } from "../ingestion/hash";
import { EmbeddedChunk } from "../../types/embedding";

export async function saveChunk(
  chunk: EmbeddedChunk
) {
  const { error } =
    await supabaseAdmin
      .from("repo_chunks")
      .insert({
        repository_id: chunk.repositoryId,
        file_path: chunk.filePath,
        start_line: chunk.startLine,
        end_line: chunk.endLine,
        content: chunk.content,
        content_hash: hashContent(chunk.content),
        embedding: chunk.embedding,
      });

  if (error) {
    throw error;
  }
}

export async function saveChunks(
  chunks: EmbeddedChunk[]
) {
  for (const chunk of chunks) {
    await saveChunk(chunk);
  }

  console.log(
    `Saved ${chunks.length} chunks`
  );
}