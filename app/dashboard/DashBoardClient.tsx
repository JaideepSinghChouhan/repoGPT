"use client";

import { useEffect, useState } from "react";
import RepositoriesDashboard from "@/components/RepositoryDashboard";
import { Repository } from "@/types/repository";
import IndexingOverlay from "@/components/IndexingOverlay";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [isIndexing, setIsIndexing] = useState(false);

  async function loadRepositories() {
    try {
      const res = await fetch("/api/repository/list");

      if (!res.ok) {
        throw new Error("Failed to load repositories");
      }

      const data = await res.json();

      setRepositories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  async function handleAddRepository(repoUrl: string) {
    setIsIndexing(true);

    try {
      const res = await fetch("/api/repository/index", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          repoUrl,
        }),
      });

      if (!res.ok) {
        const error = await res.json();

        throw new Error(error.error ?? "Failed to index repository");
      }

      await loadRepositories();
    } finally {
      setIsIndexing(false);
    }
  }
async function handleDeleteRepository(
  repositoryId: string
) {
  const res = await fetch(
    `/api/repository/${repositoryId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to delete repository"
    );
  }

  await loadRepositories();
}

  function handleSelectRepository(repo: Repository) {
    window.location.href = `/repositories/${repo.id}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading repositories...
      </div>
    );
  }

  return (
    <>
      {isIndexing && <IndexingOverlay />}

      <AppShell>
        <RepositoriesDashboard
          repositories={repositories}
          onAddRepository={handleAddRepository}
          onSelectRepository={handleSelectRepository}
          onDeleteRepository={handleDeleteRepository}
        />
      </AppShell>
    </>
  );
}
