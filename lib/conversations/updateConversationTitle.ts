import { supabaseAdmin } from "@/lib/admin";

export async function updateConversationTitle(
  conversationId: string,
  title: string
) {
  const { error } =
    await supabaseAdmin
      .from("conversations")
      .update({
        title,
      })
      .eq("id", conversationId);

  if (error) {
    throw error;
  }
}