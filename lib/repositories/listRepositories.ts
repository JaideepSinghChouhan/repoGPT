import { supabaseAdmin } from "@/lib/admin";

export async function listRepositories(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select(`
      *,
      conversations (
        id
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data.map((repo) => ({
    ...repo,
    conversation_count:
      repo.conversations?.length ?? 0,
  }));
}