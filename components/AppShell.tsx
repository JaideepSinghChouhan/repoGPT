"use client";

import { useRouter } from "next/navigation";
import { Terminal, FolderClosed, LogOut } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;

  repository?: {
    id: string;
    name: string;
  };

  onNewChat?: () => void;

  conversations?: {
    id: string;
    title: string;
  }[];
}
export default function AppShell({
  children,
  repository,
  onNewChat,
  conversations = [],
}: AppShellProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-outline-variant bg-surface-container-low flex flex-col">
        <div
          className="p-6 border-b border-outline-variant cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-on-primary" />
            </div>

            <div>
              <h2 className="font-bold text-on-surface">RepoGPT</h2>

              <p className="text-xs text-on-surface-variant">
                AI Code Assistant
              </p>
            </div>
          </div>
        </div>
        {onNewChat && (
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full rounded-xl bg-primary text-on-primary px-4 py-3 font-semibold hover:opacity-90 transition"
            >
              + New Chat
            </button>
          </div>
        )}
        <nav className="flex-1 p-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-container-high transition"
          >
            <FolderClosed className="w-5 h-5" />
            <span>Repositories</span>
          </button>
          {repository && (
            <div className="px-4 mt-4">
              <div className="text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Active Repository
              </div>

              <div
                onClick={() => router.push(`/repositories/${repository.id}`)}
                className="cursor-pointer rounded-xl border border-outline-variant bg-surface-container-high p-3 hover:border-primary transition"
              >
                <div className="font-medium text-on-surface truncate">
                  {repository.name}
                </div>

                <div className="text-xs text-on-surface-variant">
                  Open Repository
                </div>
              </div>
            </div>
          )}
        {conversations.length > 0 && (
          <div className="px-4 mt-6">
            <div className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">
              Recent Chats
            </div>

            <div className="space-y-1">
              {conversations.slice(0, 8).map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => router.push(`/chat/${conversation.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-high transition"
                >
                  <div className="text-sm text-on-surface truncate">
                    {conversation.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        </nav>


        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
