import { supabaseAdmin } from "@/lib/admin";

export async function createConversation(
  userId: string,
  repositoryId: string,
  title: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("conversations")
      .insert({
        user_id: userId,
        repository_id: repositoryId,
        title,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}