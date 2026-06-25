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

          if (
        error?.cause?.code ===
        "UND_ERR_CONNECT_TIMEOUT"
      ) {
        return Response.json(
          {
            error:
              "Authentication service is taking too long to respond. Please try again in a few moments.",
          },
          {
            status: 503,
          }
        );
      }

      if (
  error?.status === 429 ||
  error?.message?.includes(
    "RESOURCE_EXHAUSTED"
  ) ||
  error?.message?.includes(
    "Quota exceeded"
  )
) {
  return Response.json(
    {
      error:
        "AI model quota exceeded. Please try again later.",
    },
    {
      status: 429,
    }
  );
}


    return Response.json(
      {
        error:
          "Authentication service temporarily unavailable",
      },
      {
        status: 503,
      }
    );
  }
}