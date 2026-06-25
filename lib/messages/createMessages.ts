import { supabaseAdmin } from "@/lib/admin";

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  sources?: {
    file: string;
    startLine: number;
    endLine: number;
    content: string;
  }[]
) {
  const { data, error } =
    await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
        sources,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}