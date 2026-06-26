# RepoGPT

RepoGPT lets you point it at any public GitHub repository and ask questions about the codebase in plain English. It indexes the repo into a vector store and answers questions using retrieval-augmented generation (RAG), grounded in the actual source rather than a model's general knowledge.

**Live demo:** https://repo-gpt-blue.vercel.app

## How it works

1. **Fetch** — The repo's file tree is pulled via the GitHub API (`git/trees`, recursive), then each allowed file is fetched and base64-decoded. No local clone, so it's safe to run on serverless infra with an ephemeral filesystem.
2. **Filter** — Config, lockfiles, build output, and noisy artifacts (`node_modules`, `.next`, `dist`, minified bundles, sourcemaps, etc.) are excluded before anything gets embedded, keeping the index focused on real source code.
3. **Chunk** — Each file is split into overlapping line-based windows (default: 30 lines, 5-line overlap) so retrieved context doesn't get cut off mid-function.
4. **Embed** — Chunks are embedded with Gemini's `gemini-embedding-001`, with retry handling that parses Google's rate-limit responses and backs off for the exact wait time it specifies.
5. **Store & retrieve** — Embeddings are stored in Postgres via Supabase/pgvector. Queries are answered by embedding the question and running a similarity search through a Postgres RPC function (`match_repo_chunks`), so retrieval happens in the database rather than in-memory.
6. **Generate** — Retrieved chunks are assembled into context and sent to Gemini for an answer. If a model is rate-limited or overloaded, the request automatically falls over to the next model in a fallback chain (`gemini-3.5-flash` → `gemini-3.1-flash-lite` → `gemini-2.5-flash-lite` → `gemini-2.5-flash` → `gemini-2.0-flash`) rather than failing outright.

Every answer is returned with its source chunks (file path + line range), so you can verify what the model actually based its response on.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Auth & data:** Supabase (Postgres + Auth + pgvector), with per-resource access checks (a user can only query repositories and conversations they own)
- **AI:** Google Gemini — `gemini-embedding-001` for embeddings, with a multi-model fallback chain for answer generation
- **Styling:** Tailwind CSS

## Getting started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   GEMINI_API_KEY=
   GITHUB_TOKEN=
   ```
3. Set up a Supabase project with the `pgvector` extension enabled and a `match_repo_chunks` RPC function for similarity search over your chunks table.
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Project structure

```
app/            Next.js routes (UI pages + API routes)
components/     React components (chat view, dashboard, landing page)
lib/
  ai/           Gemini client + answer generation with model fallback
  auth/         Auth guards (requireUser)
  embeddings/   Embedding generation with rate-limit-aware retries
  github/       GitHub API fetching + file filtering
  ingestion/    Chunking, indexing, and repo update pipeline
  rag/          Context assembly, prompting, and the question-answering flow
  vector/       Saving embeddings and similarity-search retrieval
  repositories/ conversations/ messages/ users/   Data access layer
types/          Shared TypeScript types
```

## Notes

This is a personal project built to understand RAG pipelines end-to-end — chunking strategy, embedding generation, vector retrieval, and grounding LLM answers in retrieved context — rather than to wrap an existing library. There's no test suite yet, and large repos are currently indexed in full on first import (no incremental re-indexing beyond what's in `updateRepository.ts`).