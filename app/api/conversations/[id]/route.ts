import { getConversation }
from "@/lib/conversations/getConversation";

import { assertConversationAccess }
from "@/lib/conversations/assertConversationAccess";

import { requireUser }
from "@/lib/auth/requireUser";

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

  const currentUser =
    await requireUser();

  const { id } =
    await params;

  await assertConversationAccess(
    id,
    currentUser.id
  );

  const conversation =
    await getConversation(
      id
    );

  return Response.json(
    conversation
  );
}