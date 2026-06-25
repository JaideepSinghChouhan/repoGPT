import { supabaseAdmin } from "@/lib/admin";

export async function updateRepository(
  repositoryId: string,
  {
    status,
    chunkCount,
    indexedAt,
    errorMessage
  }: {
    status: "indexing" | "completed" | "failed";
    chunkCount: number;
    indexedAt: string | null;
    errorMessage: string | null;
  }
) {
  const { error } =
    await supabaseAdmin
      .from("repositories")
      .update({
        chunk_count: chunkCount,
        status: status,
        indexed_at: indexedAt,
        error_message: errorMessage,
      })
      .eq("id", repositoryId);

  if (error) {
    throw error;
  }
}