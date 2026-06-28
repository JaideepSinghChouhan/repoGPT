import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createClient }
from "@/utils/supabase/server";
import { syncUser } from "@/lib/users/syncUsers";

export async function GET(
  request: Request
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams.get(
      "code"
    );

  if (code) {
    const supabase =
      createClient(await cookies());

    await supabase.auth.exchangeCodeForSession(
      code
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await syncUser({
        authUserId: user.id,
        email: user.email,
        username:
          user.user_metadata.user_name ??
          user.user_metadata.preferred_username ??
          user.user_metadata.full_name,
        avatarUrl:
          user.user_metadata.avatar_url,
        githubId: user.user_metadata.provider_id,
      });
    }


  }
  

  return NextResponse.redirect(
    new URL("/dashboard", request.url)
  );
}