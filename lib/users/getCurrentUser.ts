import { createClient }
from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { supabaseAdmin }
from "@/lib/admin";

export async function getCurrentUser() {

  const supabase = createClient(await cookies());

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } =
    await supabaseAdmin
      .from("users")
      .select("*")
      .eq(
        "auth_user_id",
        user.id
      )
      .single();

  return data;
}