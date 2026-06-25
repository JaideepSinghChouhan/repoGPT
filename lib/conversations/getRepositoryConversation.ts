import { supabaseAdmin } from "@/lib/admin";

export async function getRepositoryConversations(
  repositoryId: string,
  userId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq(
        "repository_id",
        repositoryId
      )
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw error;
  }

  return data;
}