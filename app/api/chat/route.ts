import { askRepo } from "@/lib/rag/chat";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, repositoryId } = body;

    if (!question || !repositoryId) {
      return Response.json(
        {
          error:
            "question and repositoryId are required",
        },
        {
          status: 400,
        }
      );
    }

    const result = await askRepo(
      question,
      repositoryId
    );

    return Response.json(result);
  } catch (error) {
    console.error(error);

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