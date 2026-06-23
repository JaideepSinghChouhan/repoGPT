// lib/repositories/deleteRepository.ts

import { supabaseAdmin }
from "@/lib/admin";

export async function deleteRepository(
  repositoryId: string,
  userId: string
) {
  const { error } =
    await supabaseAdmin
      .from("repositories")
      .delete()
      .eq("id", repositoryId)
      .eq("user_id", userId);

  if (error) throw error;
}