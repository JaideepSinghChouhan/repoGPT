export async function getRepositories() {
  const response = await fetch("/api/repository/list");

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
}

export async function indexRepository(
  repoUrl: string
) {
  const response = await fetch(
    "/api/repository/index",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        repoUrl,
      }),
    }
  );

  if (!response.ok) {
    const error =
      await response.json();

    throw new Error(
      error.error ||
        "Failed to index repository"
    );
  }

  return response.json();
}

export async function createConversation(
  repositoryId: string,
  title: string
) {
  const response = await fetch(
    "/api/conversations",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        repositoryId,
        title,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create conversation"
    );
  }

  return response.json();
}

export async function getConversation(
  conversationId: string
) {
  const response = await fetch(
    `/api/conversations/${conversationId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch conversation"
    );
  }

  return response.json();
}

export async function sendMessage(
  conversationId: string,
  repositoryId: string,
  question: string
) {
  const response = await fetch(
    "/api/chat",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        conversationId,
        repositoryId,
        question,
      }),
    }
  );

  if (!response.ok) {
        const error =
          await res.json();

        throw new Error(
          error.error ||
          "Failed to send message"
        );
  }

  return response.json();
}