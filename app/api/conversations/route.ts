import { createConversation } from "@/lib/conversations/createConversation";
import { requireUser } from "@/lib/auth/requireUser";

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