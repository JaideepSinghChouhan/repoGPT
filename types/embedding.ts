export interface EmbeddedChunk {
  repositoryId: string;
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
  embedding: number[];
}
