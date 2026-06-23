import { requireUser } from "@/lib/auth/requireUser";

export async function GET() {
  const user = await requireUser();

  return Response.json(user);
}