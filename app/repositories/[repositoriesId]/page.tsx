"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import RepositoryDetail from "@/components/RepositoryDetails";

import { Repository } from "@/types/repository";
import { Conversation } from "@/types/chat";
import AppShell from "@/components/AppShell";

export default function RepositoryPage() {
  const params = useParams();
  const router = useRouter();

  const repositoryId =
    params.repositoriesId as string;

  const [repository, setRepository] =
    useState<Repository | null>(null);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadRepository() {
    const res = await fetch(
      `/api/repository/${repositoryId}`
    );

    if (!res.ok) {
      throw new Error(
        "Failed to load repository"
      );
    }

    return res.json();
  }

  async function loadConversations() {
    const res = await fetch(
      `/api/conversations?repositoryId=${repositoryId}`
    );

    if (!res.ok) {
      throw new Error(
        "Failed to load conversations"
      );
    }

    return res.json();
  }

  async function loadData() {
    try {
      const [repo, convos] =
        await Promise.all([
          loadRepository(),
          loadConversations(),
        ]);

      setRepository(repo);
      setConversations(convos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [repositoryId]);

  async function handleNewConversation() {
    try {
      const res = await fetch(
        "/api/conversations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            repositoryId,
            title: "New Conversation",
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to create conversation"
        );
      }

      const conversation =
        await res.json();

      router.push(
        `/chat/${conversation.id}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleSelectConversation(
    conversation: Conversation
  ) {
    router.push(
      `/chat/${conversation.id}`
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading repository...
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Repository not found
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
  conversations={conversations}
>
    <RepositoryDetail
      repository={repository}
      conversations={conversations}
      onSelectConversation={
        handleSelectConversation
      }
      onNewConversation={
        handleNewConversation
      }
      onBack={() =>
        router.push("/dashboard")
      }
    />
  </AppShell>
);
}