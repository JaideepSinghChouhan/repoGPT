// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/users/getCurrentUser";


import DashboardClient from "./DashBoardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return <DashboardClient />;
}