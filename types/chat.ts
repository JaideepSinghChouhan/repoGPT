export interface SourceReference {
  file: string;
  startLine: number;
  endLine: number;
  content: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "error";
  content: string;
  created_at: string;
  timestamp?: string;

  sources?: SourceReference[];
}

export interface Conversation {
  id: string;
  repository_id: string;
  title: string;
  created_at: string;
  messages: Message[];
}