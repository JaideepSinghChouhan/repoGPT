import { createConversation } from "@/lib/conversations/createConversation";
import { getRepositoryConversations } from "@/lib/conversations/getRepositoryConversation";

import { requireUser } from "@/lib/auth/requireUser";

export async function GET(
  request: Request
) {
  try {
    const currentUser =
      await requireUser();

    const { searchParams } =
      new URL(request.url);

    const repositoryId =
      searchParams.get(
        "repositoryId"
      );

    if (!repositoryId) {
      return Response.json(
        {
          error:
            "repositoryId is required",
        },
        {
          status: 400,
        }
      );
    }

    const conversations =
      await getRepositoryConversations(
        repositoryId,
        currentUser.id
      );

    return Response.json(
      conversations
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to fetch conversations",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const {
      repositoryId,
      title,
    } = await request.json();

    const currentUser =
      await requireUser();

    const conversation =
      await createConversation(
        currentUser.id,
        repositoryId,
        title
      );

    return Response.json(
      conversation
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to create conversation",
      },
      {
        status: 500,
      }
    );
  }
}