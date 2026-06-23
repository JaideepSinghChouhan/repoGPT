import { supabaseAdmin } from "@/lib/admin";

export async function getConversation(
  conversationId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("conversations")
      .select(`
        *,
        repositories (
          id,
          name,
          github_url
        ),
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .eq("id", conversationId)
      .single();

  if (error) {
    throw error;
  }

  return data;
}