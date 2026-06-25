import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  FileCode,
  CheckCircle2,
  Copy,
  Sparkles,
  Code,
  ArrowLeft,
  History,
  Paperclip,
  ChevronRight,
  Activity,
  Cpu,
  Brain,
} from "lucide-react";
import { Conversation, Message } from "@/types/chat";
import { Repository } from "@/types/repository";

interface ChatViewProps {
  repository: Repository;
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatView({
  repository,
  conversation,
  onBack,
  onSendMessage,
  isLoading,
}: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };


  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Basic custom parsing for markdown code blocks to render them with premium styled code editors!
  const renderMessageContent = (msg: Message) => {
    const parts = msg.content.split("```");
    return (
      <div className="space-y-4 text-sm leading-relaxed text-on-surface/90">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // This is a code block! Let's parse language and extract content
            const lines = part.trim().split("\n");
            const language = lines[0] || "javascript";
            const code = lines.slice(1).join("\n");
            const blockId = `${msg.id}-${index}`;

            return (
              <div
                key={index}
                className="border border-outline-variant rounded-xl overflow-hidden bg-[#03060B] my-3"
              >
                <div className="h-10 bg-surface-container-high border-b border-outline-variant flex justify-between items-center px-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-primary w-4 h-4" />
                    <span className="text-[10px] font-mono font-semibold uppercase text-outline">
                      {language}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(code, blockId)}
                    className="text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 font-geist"
                  >
                    {copiedId === blockId ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-xs md:text-sm text-on-surface/90 leading-relaxed whitespace-pre">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>
            );
          } else {
            // Regular paragraphs, replace standard markers
            const paragraphs = part.split("\n\n");
            return paragraphs.map((para, paraIdx) => {
              if (!para.trim()) return null;

              // Handle quick bullet lists or bold texts inline
              const formattedPara = para.split("\n").map((line, lineIdx) => {
                if (line.startsWith("- ")) {
                  return (
                    <li key={lineIdx} className="ml-4 list-disc pl-1 mb-1">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                return (
                  <p key={lineIdx} className="mb-1.5 last:mb-0">
                    {line.split("**").map((text, textIdx) => {
                      if (textIdx % 2 === 1) {
                        return (
                          <strong
                            key={textIdx}
                            className="text-primary font-bold"
                          >
                            {text}
                          </strong>
                        );
                      }
                      return text;
                    })}
                  </p>
                );
              });

              return (
                <div key={paraIdx} className="mb-3">
                  {formattedPara}
                </div>
              );
            });
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Top sticky Breadcrumb / Navigation bar */}
      <header className="h-16 border-b border-outline-variant/30 px-6 flex items-center justify-between shrink-0 bg-surface-container-lowest/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <nav className="flex items-center gap-2 text-xs font-geist text-on-surface-variant">
            <span
              onClick={onBack}
              className="cursor-pointer hover:text-primary"
            >
              {repository.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold truncate max-w-[180px]">
              {conversation.title}
            </span>
          </nav>
        </div>

        {/* Workspace Active File Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-[11px] font-mono text-primary animate-pulse">
          <Cpu className="w-3.5 h-3.5" />
          <span>Context Repo: {repository.name}</span>
        </div>
      </header>

      {/* Main chat body with sidebar layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Scrollable Messages Panel */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 space-y-6 scroll-hide">
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            {/* System Info Bubble */}
            <div className="bg-surface-container-high border border-outline-variant/40 rounded-xl p-4 flex gap-3 text-xs text-on-surface-variant">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-bold text-on-surface mb-0.5">
                  RepoGPT Active Reasoning Module
                </p>
                <p>
                  Analyzing imports from your workspace. Ask me to refactor
                  logic or explain files.
                </p>
              </div>
            </div>

            {conversation.messages.map((msg) => {
              if (msg.role === "error") {
                return (
                  <div
                    key={msg.id}
                    className="flex justify-start animate-fade-in"
                  >
                    <div className="max-w-[85%] rounded-2xl p-5 bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-400 font-bold">⚠ Error</span>
                      </div>

                      <p className="text-sm text-red-200">{msg.content}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 animate-fade-in ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-primary text-on-primary font-bold"
                        : "bg-secondary-container/20 border border-secondary text-secondary"
                    }`}
                  >
                    {msg.role === "user" ? (
                      "ME"
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Box */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 ${
                      msg.role === "user"
                        ? "bg-surface-container-high border border-outline-variant text-on-surface"
                        : "bg-surface-container-lowest border border-outline-variant/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/40">
                        {msg.role === "user" ? "You" : "RepoGPT"}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/40 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {renderMessageContent(msg)}
                    {msg.role === "assistant" &&
                      msg.sources &&
                      msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-outline-variant/30">
                          <div className="text-xs font-bold text-primary mb-2">
                            Sources
                          </div>

                          <div className="space-y-2">
                            {msg.sources.map((source: any, index: number) => (
                              <div
                                key={index}
                                className="rounded-lg border border-outline-variant/30 bg-surface-container-high px-3 py-2"
                              >
                                <div className="font-mono text-xs text-on-surface">
                                  {source.file.split("/").pop()}
                                </div>  
                                <div className="text-[11px] text-on-surface-variant">
                                  Lines {source.startLine} - {source.endLine}
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-xs text-primary">
                                      View Code
                                    </summary>

                                    <pre className="mt-2 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs font-mono">
                                      {source.content}
                                      {/* {console.log("Source content:", source.content)} */}
                                    </pre>
                                  </details>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
            {/* AI thinking state */}
            {isLoading && (
              <div className="flex gap-4 items-start animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-secondary-container/20 border border-secondary text-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-spin duration-300" />
                </div>
                <div className="max-w-[85%] bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>
                      RepoGPT is parsing AST and generating response...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="max-w-3xl mx-auto w-full pt-4">
            {/* TEXT COMPOSER */}
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <input
                type="text"
                disabled={isLoading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask about ${repository.name}...`}
                className="w-full bg-surface-container-low border border-outline-variant/80 rounded-2xl py-4.5 pl-14 pr-16 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-75 shadow-lg"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary text-on-primary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
