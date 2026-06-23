import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function TestPage() {
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase
    .from("todos")
    .select("*");
    console.log("todos", todos);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Supabase Connected ✅</h1>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </div>
  );
}