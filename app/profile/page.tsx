import { createClient }
from "@/utils/supabase/server";

import { syncUser }
from "@/lib/users/syncUsers";

import { cookies } from "next/headers";

export default async function Page() {

  const supabase =
    await createClient(await cookies());

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return <div>Not logged in</div>;
  }

  const dbUser =
    await syncUser({
      authUserId: user.id,

      githubId:
        user.user_metadata
          ?.provider_id,

      username:
        user.user_metadata
          ?.user_name,

      email:
        user.email,

      avatarUrl:
        user.user_metadata
          ?.avatar_url,
    });

  return (
    <pre>
      {JSON.stringify(
        dbUser,
        null,
        2
      )}
    </pre>
  );
}