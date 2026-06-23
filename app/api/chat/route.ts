import { requireUser } from "@/lib/auth/requireUser";

import { assertRepositoryAccess }
from "@/lib/repositories/assertRepositoryAccess";

import { assertConversationAccess }
from "@/lib/conversations/assertConversationAccess";

import { sendMessage }
from "@/lib/chat/sendMessage";

export async function POST(
  request: Request
) {
  try {

    const {
      question,
      repositoryId,
      conversationId,
    } = await request.json();

    if (
      !question ||
      !repositoryId ||
      !conversationId
    ) {
      return Response.json(
        {
          error:
            "question, repositoryId and conversationId are required",
        },
        {
          status: 400,
        }
      );
    }

    const currentUser =
      await requireUser();

    await assertRepositoryAccess(
      repositoryId,
      currentUser.id
    );

    await assertConversationAccess(
      conversationId,
      currentUser.id
    );

    const result =
      await sendMessage(
        conversationId,
        repositoryId,
        question
      );

    return Response.json(
      result
    );

  } catch (error: any) {

    console.error(error);

    if (
      error.message ===
      "Forbidden"
    ) {
      return Response.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error.message ===
      "Unauthorized"
    ) {
      return Response.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        error:
          "Failed to process question",
      },
      {
        status: 500,
      }
    );
  }
}