// lib/repositories/listRepositories.ts
import { supabaseAdmin } from "@/lib/admin";

export async function listRepositories( userId: string) {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}