import { getCurrentUser } from "@/lib/users/getCurrentUser";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}