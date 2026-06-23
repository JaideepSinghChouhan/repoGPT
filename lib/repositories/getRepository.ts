import { supabaseAdmin } from "@/lib/admin";

export async function getRepository(
  repositoryId: string
) {
  const { data, error } =
    await supabaseAdmin
      .from("repositories")
      .select("*")
      .eq("id", repositoryId)
      .single();

  if (error) {
    throw error;
  }

  return data;
}