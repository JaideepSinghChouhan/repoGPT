import { askRepo } from "@/lib/rag/chat";

import { createMessage }
from "@/lib/messages/createMessages";

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

  const result =
    await askRepo(
      question,
      repositoryId
    );

  await createMessage(
    conversationId,
    "assistant",
    result.answer ?? ""
  );

  return result;
}