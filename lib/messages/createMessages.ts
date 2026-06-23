import { supabaseAdmin } from "@/lib/admin";

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}