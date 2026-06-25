import { deleteRepository }
from "@/lib/repositories/deleteRepositories";

import { NextResponse }
from "next/server";

import { getRepository }
from "@/lib/repositories/getRepository";

import { requireUser }
from "@/lib/auth/requireUser";

interface Props {
  params: Promise<{
    id: string;
  }>;
}




export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireUser();

    const { id } =
      await params;

    const repository =
      await getRepository(id);

    return NextResponse.json(
      repository
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch repository",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    const currentUser =
      await requireUser();

    const { id } =
      await params;

    await deleteRepository(
      id,
      currentUser.id
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    console.error(error);

    if (
      error.message ===
      "Unauthorized"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      error.message ===
      "Forbidden"
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

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