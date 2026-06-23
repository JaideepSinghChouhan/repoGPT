export interface CodeChunk {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

export interface RetrievedChunk {
  file_path: string;
  start_line: number;
  end_line: number;
  content: string;
  similarity: number;
}