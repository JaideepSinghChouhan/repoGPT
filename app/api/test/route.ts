import { NextResponse } from "next/server";
import { createEmbeddings } from "@/lib/embeddings/embeddings";

export async function GET() {
  const vectors = await createEmbeddings([
    "Hello world",
    "React is awesome",
    "Next.js App Router",
  ]);

  return NextResponse.json({
    count: vectors.length,
    dimensions: vectors[0]?.length,
  });
}