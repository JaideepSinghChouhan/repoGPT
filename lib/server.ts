import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config({ path: ["../.env.local", "../.env"] });

const cookieStore = await cookies();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);