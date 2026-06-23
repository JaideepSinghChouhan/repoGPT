interface RetrievedChunk {
  file_path: string;
  start_line: number;
  end_line: number;
  content: string;
}

export function buildContext(
  chunks: RetrievedChunk[]
) {
  return chunks
    .map(
      (chunk) => `
FILE: ${chunk.file_path}
LINES: ${chunk.start_line}-${chunk.end_line}

${chunk.content}
`
    )
    .join("\n\n-------------------\n\n");
}