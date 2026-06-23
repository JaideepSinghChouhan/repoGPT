import { listRepositories } from "@/lib/repositories/listRepositories";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const repositories = await listRepositories(userId);

    return NextResponse.json(
      repositories
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch repositories",
      },
      {
        status: 500,
      }
    );
  }
}