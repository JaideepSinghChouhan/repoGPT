import { listRepositories } from "@/lib/repositories/listRepositories";
import { getCurrentUser } from "@/lib/users/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const repositories =
      await listRepositories(
        currentUser.id
      );

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