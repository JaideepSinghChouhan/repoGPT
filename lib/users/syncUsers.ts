import { supabaseAdmin } from "@/lib/admin";

interface SyncUserInput {
  authUserId: string;
  githubId?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export async function syncUser(
  input: SyncUserInput
) {
  const { data, error } =
    await supabaseAdmin
      .from("users")
      .upsert(
        {
          auth_user_id:
            input.authUserId,

          github_id:
            input.githubId,

          username:
            input.username,

          email:
            input.email,

          avatar_url:
            input.avatarUrl,
        },
        {
          onConflict:
            "auth_user_id",
        }
      )
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}