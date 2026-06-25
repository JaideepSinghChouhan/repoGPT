import React, { useState } from "react";
import {
  Folder,
  Layers,
  Database,
  Plus,
  Search,
  Link2,
  Info,
  X,
  MoreVertical,
  Bell,
  Trash2,
} from "lucide-react";
import { Repository } from "@/types/repository";

interface RepositoriesDashboardProps {
  repositories: Repository[];
  onAddRepository: (repoUrl: string) => Promise<void>;
  onSelectRepository: (repo: Repository) => void;
  onDeleteRepository: (repoId: string) => Promise<void>;
}

export default function RepositoriesDashboard({
  repositories,
  onAddRepository,
  onSelectRepository,
  onDeleteRepository,
}: RepositoriesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [repoToDelete, setRepoToDelete] = useState<Repository | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRepoUrl) {
      alert("Please enter a GitHub URL");
      return;
    }

    try {
      await onAddRepository(newRepoUrl);

      setNewRepoUrl("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);

      alert("Failed to index repository");
    }
  };

  const getIcon = (name: string) => {
    if (name.includes("api") || name.includes("processor")) {
      return <Database className="w-5 h-5 text-primary" />;
    }
    if (name.includes("dashboard")) {
      return <Layers className="w-5 h-5 text-primary" />;
    }
    return <Folder className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="min-h-full p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="font-sans font-bold text-3xl text-on-surface mb-2">
            Repositories
          </h2>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
            Manage your indexed codebase and interact with your personal AI
            assistant to explore architectural patterns.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 primary-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer font-geist text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Repository</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative max-w-md mb-8 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant w-4 h-4 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repositories..."
          className="bg-surface-container-lowest border border-outline-variant/60 rounded-full py-2.5 pl-11 pr-4 text-sm w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline"
        />
      </div>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase text-outline tracking-wider mb-2">
            Repositories
          </p>

          <p className="text-3xl font-bold text-on-surface">
            {repositories.length}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase text-outline tracking-wider mb-2">
            Conversations
          </p>

          <p className="text-3xl font-bold text-on-surface">
            {repositories.reduce(
              (sum, repo) => sum + repo.conversation_count,
              0,
            )}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <p className="text-xs uppercase text-outline tracking-wider mb-2">
            Indexed Chunks
          </p>

          <p className="text-3xl font-bold text-on-surface">
            {repositories
              .reduce((sum, repo) => sum + repo.chunk_count, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-row-auto gap-6">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="glass-panel p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-secondary-container/10 border border-outline-variant/30 rounded-xl flex items-center justify-center">
                  {getIcon(repo.name)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRepoToDelete(repo);
                  }}
                  className="p-2 rounded-lg hover:bg-surface-container-high transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-sans font-bold text-lg text-on-surface mb-1 truncate">
                {repo.name}
              </h3>
              <p className="text-on-surface-variant font-mono text-xs mb-4 truncate opacity-70">
                {repo.github_url}
              </p>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                Repository indexed and ready for AI analysis
              </p>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-y-4 mb-6 border-t border-outline-variant/30 pt-4">
                <div>
                  <p className="text-[10px] text-outline uppercase tracking-wider font-bold mb-1">
                    Created
                  </p>
                  <p className="text-xs text-on-surface font-semibold font-geist">
                    {new Date(repo.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-outline uppercase tracking-wider font-bold mb-1">
                    Conversations
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface font-semibold font-geist">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{repo.conversation_count}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-outline uppercase tracking-wider font-bold mb-1">
                    Chunks Indexed
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface font-semibold font-geist">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{repo.chunk_count}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectRepository(repo)}
                className="w-full py-2.5 rounded-xl border border-outline-variant/60 text-on-surface font-bold font-geist text-sm hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-[0.98] cursor-pointer"
              >
                Open Repository
              </button>
            </div>
          </div>
        ))}

        {/* Empty State / Add New Button Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-outline-variant/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group min-h-[300px] cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-outline-variant/60 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-outline-variant group-hover:text-primary transition-colors" />
          </div>
          <span className="font-geist text-sm text-on-surface-variant font-bold group-hover:text-primary transition-colors">
            Add New Repository
          </span>
        </button>
      </div>

      {/* Add Repository Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div
            className="glass-panel w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl scale-100 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link2 className="text-primary w-5 h-5" />
                <h2 className="font-sans font-bold text-xl text-on-surface">
                  Add Repository
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleConnect}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant font-geist">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 text-xs text-on-surface-variant/90 leading-relaxed">
                  <Info className="text-primary w-5 h-5 shrink-0" />
                  <p>
                    RepoGPT will scan your repository structure and index your
                    code for AI reasoning. Private repositories require
                    credentials configured.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-surface-container-high flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-on-surface-variant font-bold font-geist text-sm hover:text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold font-geist text-sm primary-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Connect & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {repoToDelete && (
        <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-panel rounded-3xl w-full max-w-md p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              Delete Repository
            </h2>

            <p className="text-center text-on-surface-variant mb-6">
              <b>{repoToDelete.name}</b>
            </p>

            <div className="space-y-3 mb-8 text-sm">
              <p>✓ Repository metadata</p>

              <p>✓ Indexed embeddings</p>

              <p>✓ Conversations</p>

              <p>✓ Chat history</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRepoToDelete(null)}
                className="px-5 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);

                  try {
                    await onDeleteRepository(repoToDelete.id);

                    setRepoToDelete(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
              >
                {isDeleting ? "Deleting..." : "Delete Repository"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
