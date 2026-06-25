"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

import ChatView from "@/components/ChatView";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();

  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<any>(null);

  const [repository, setRepository] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [repositoryConversations, setRepositoryConversations] =
  useState([]);

  async function loadConversation() {
    const res = await fetch(`/api/conversations/${conversationId}`);

    if (!res.ok) {
      throw new Error("Failed to load conversation");
    }

    return res.json();
  }

  async function loadRepositoryConversations(
  repositoryId: string
) {
  const res = await fetch(
    `/api/conversations?repositoryId=${repositoryId}`
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

  async function refreshConversation() {
    const data = await loadConversation();

    const formattedConversation = {
      ...data,
      messages: data.messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.created_at).toLocaleString(),
      })),
    };
    // console.log(data.messages[data.messages.length - 1]);

    setConversation(formattedConversation);

    setRepository(data.repositories);
    const convos =
  await loadRepositoryConversations(
    data.repositories.id
  );

setRepositoryConversations(
  convos
);
  }
  async function handleNewConversation() {
  const res = await fetch(
    "/api/conversations",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        repositoryId:
          repository.id,
        title: "New Conversation",
      }),
    }
  );

  const conversation =
    await res.json();

  router.push(
    `/chat/${conversation.id}`
  );
}

  useEffect(() => {
    refreshConversation().finally(() => setLoading(false));
  }, [conversationId]);

  async function handleSendMessage(question: string) {
    if (!repository || !conversation) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question,
          repositoryId: repository.id,
          conversationId: conversation.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();

        throw new Error(error.error || "Failed to send message");
      }

      await refreshConversation();
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: crypto.randomUUID(),
        role: "error",
        content:
          error instanceof Error ? error.message : "Something went wrong",
        created_at: new Date().toISOString(),
      };

      setConversation((prev: any) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }
  if (!conversation || !repository) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading conversation...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading conversation...
      </div>
    );
  }
  return (
    <AppShell
  repository={{
    id: repository.id,
    name: repository.name,
  }}
  onNewChat={handleNewConversation}
  conversations={repositoryConversations}
>
      <ChatView
        repository={repository}
        conversation={conversation}
        onBack={() => router.back()}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </AppShell>
  );
}
