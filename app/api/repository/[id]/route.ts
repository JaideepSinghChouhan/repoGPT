import { deleteRepository }
from "@/lib/repositories/deleteRepositories";

import { NextResponse }
from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  req: Request,
  { params }: Props
) {
  try {
    const { id } =
      await params;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await deleteRepository(id, userId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to delete repository",
      },
      {
        status: 500,
      }
    );
  }
}