import { getConversation }
from "./getConversation";

export async function assertConversationAccess(
  conversationId: string,
  userId: string
) {
  const conversation =
    await getConversation(
      conversationId
    );

  if (!conversation) {
    throw new Error(
      "Conversation not found"
    );
  }

  if (
    conversation.user_id !==
    userId
  ) {
    throw new Error(
      "Forbidden"
    );
  }

  return conversation;
}