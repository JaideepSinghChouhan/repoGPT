import { supabaseAdmin }
from "@/lib/admin";

export async function getMessages(
  conversationId: string
) {

  const { data, error } =
    await supabaseAdmin
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        conversationId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

  if (error) {
    throw error;
  }

  return data;
}