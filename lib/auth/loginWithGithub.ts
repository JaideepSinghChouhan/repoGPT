import createClient from "@/utils/supabase/client";

export async function loginWithGithub() {
  const supabase = await createClient();

  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo:
        `${window.location.origin}/auth/callback`,
    },
  });
}