//This is just a test page for login, you can remove it if you want to implement your own login page

"use client";

import createClient from "@/utils/supabase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = await createClient();

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:
          "http://localhost:3000/auth/callback",
      },
    });
  };
  
  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login with GitHub
    </button>
  );
}