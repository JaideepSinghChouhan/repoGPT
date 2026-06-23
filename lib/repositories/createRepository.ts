// lib/repositories/createRepository.ts
import { supabaseAdmin } from "@/lib/admin";

export async function createRepository(
  name: string,
  githubUrl: string,
  userId: string
) {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .insert({
      name,
      github_url: githubUrl,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}