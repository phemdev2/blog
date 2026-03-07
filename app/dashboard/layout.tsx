import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-gray-800 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/" className="text-sm font-semibold text-white tracking-tight">
            ← Back to Blog
          </Link>
        </div>

        <div className="px-6 py-5 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Dashboard</p>
          <p className="text-sm text-gray-300 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <DashboardNav />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}