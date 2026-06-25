import { createClient }
from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { supabaseAdmin }
from "@/lib/admin";

export async function getCurrentUser() {

  const supabase = createClient(await cookies());
  console.time("auth");
 
 try{
  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

    console.timeEnd("auth");

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
  catch (error) {
    console.error("Error fetching current user:", error);
    throw new Error("Supabase Auth Unavailable");
  }
}