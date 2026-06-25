// app/test-auth/page.tsx

import { getCurrentUser } from "@/lib/users/getCurrentUser";

export default async function TestAuth() {
  const user = await getCurrentUser();

  return (
    <pre>
      {JSON.stringify(user, null, 2)}
    </pre>
  );
}