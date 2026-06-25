import React, { useState } from "react";
import {
  MessageSquare,
  Calendar,
  ChevronRight,
  FileText,
  Code,
  Shield,
  Brain,
  Settings,
  ArrowRight,
  FolderClosed,
  Activity,
  Sparkles,
  Filter,
} from "lucide-react";
import { Repository } from "@/types/repository";
import { Conversation } from "@/types/chat";

interface RepositoryDetailProps {
  repository: Repository;
  conversations: Conversation[];
  onSelectConversation: (convo: Conversation) => void;
  onNewConversation: () => void;
  onBack: () => void;
}

export default function RepositoryDetail({
  repository,
  conversations,
  onSelectConversation,
  onNewConversation,
  onBack,
}: RepositoryDetailProps) {



  return (
    <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
      {/* Repository Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-outline-variant/30">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-on-surface-variant font-geist text-xs mb-3">
            <span
              onClick={onBack}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              Repositories
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold">
              {repository.name}
            </span>
          </nav>

          <div className="flex items-center gap-6 mt-4 text-on-surface-variant text-xs">
            <div>
              Created: {new Date(repository.created_at).toLocaleDateString()}
            </div>

            <div className="truncate">{repository.github_url}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() =>
              alert("Settings for: " + repository.name + " are simulated.")
            }
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/60 hover:bg-surface-variant transition-all font-geist text-sm cursor-pointer font-bold"
          >
            <Settings className="w-4 h-4" />
            <span>Repo Settings</span>
          </button>

          <button
            onClick={onNewConversation}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 font-geist text-sm font-bold cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Conversations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-sans font-bold text-xl">Conversations</h3>
            <button className="p-2 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest cursor-pointer">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                onClick={() => onSelectConversation(convo)}
                className="glass-panel hover:border-primary/50 hover:bg-primary/[0.02] rounded-2xl p-5 flex items-center justify-between group cursor-pointer transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-base group-hover:text-primary transition-colors mb-1">
                      {convo.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm line-clamp-1 max-w-md opacity-80">
                    Repository conversation
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant/60 font-geist">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(
                        convo.created_at
                        ).toLocaleDateString()}
                    </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[11px] text-on-surface-variant/50 font-mono">
                    Active
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="p-8 border border-dashed border-outline-variant/50 rounded-xl text-center text-on-surface-variant">
                No active conversations yet. Click "New Conversation" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Stats & Code Explorer */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Repository Summary Card */}
          <div className="glass-panel rounded-2xl p-6 primary-glow relative overflow-hidden bg-gradient-to-br from-primary/[0.02] to-transparent">
            <h5 className="text-xs font-bold text-primary mb-4 flex items-center gap-2 tracking-wider uppercase font-geist">
              <Brain className="w-4 h-4" />
              AI Repository Summary
            </h5>
            <p className="text-sm leading-relaxed text-on-surface-variant/90 mb-6 italic font-geist">
              "{repository.name} has been indexed and is ready for AI-powered code search and repository chat."
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Indexing Status</span>
                <span className="text-green-400 font-bold">100% Complete</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-green-400 h-full w-full rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

