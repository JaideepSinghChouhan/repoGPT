import { indexRepository } from "@/lib/ingestion/indexRepository";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { repoUrl, userId } = await request.json();

    if (!repoUrl || !userId) {
      return NextResponse.json(
        { error: "Repository URL and user ID are required" },
        { status: 400 }
      );
    }

    const result = await indexRepository(repoUrl,userId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Repository already indexed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to index repository" },
      { status: 500 }
    );
  }
}