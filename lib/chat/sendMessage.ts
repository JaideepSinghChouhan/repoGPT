import { askRepo } from "@/lib/rag/chat";

import { createMessage }
from "@/lib/messages/createMessages";
import { updateConversationTitle } from "../conversations/updateConversationTitle";
import { supabaseAdmin } from "../admin";


export async function sendMessage(
  conversationId: string,
  repositoryId: string,
  question: string
) {

  await createMessage(
    conversationId,
    "user",
    question
  );

  const conversation =
    await supabaseAdmin
      .from("conversations")
      .select("title")
      .eq("id", conversationId)
      .single();

  if (
    conversation.data?.title ===
    "New Conversation"
  ) {
    await updateConversationTitle(
      conversationId,
      question.slice(0, 50)
    );
  }

  try {
  const result = await askRepo(
    question,
    repositoryId
  );

const assistantContent =
  typeof result?.answer === "string"
    ? result.answer
    : (result?.answer as any)?.answer ?? "";

await createMessage(
  conversationId,
  "assistant",
  assistantContent,
  result.sources
);
  return result;

} catch (error: any) {

  await createMessage(
    conversationId,
    "assistant",
    "⚠️ RepoGPT could not generate a response because the AI provider is temporarily unavailable. Please try again in a few moments."
  );

  throw error;
}

}