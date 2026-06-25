export interface Repository {
  id: string;
  name: string;
  github_url: string;

  status: string;

  chunk_count: number;

  indexed_at: string;

  created_at: string;

  conversation_count: number;
}