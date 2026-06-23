import { requireUser } from "@/lib/auth/requireUser";
import { indexRepository } from "@/lib/ingestion/indexRepository";
import { getCurrentUser } from "@/lib/users/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { repoUrl} = await request.json();
    const currentUser = await requireUser();
        if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const result = await indexRepository(repoUrl,currentUser.id );

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