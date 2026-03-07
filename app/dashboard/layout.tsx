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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 border-r border-gray-800 flex-col z-30 bg-gray-950">
        <div className="px-6 py-5 border-b border-gray-800">
          <Link
            href="/"
            className="text-sm font-semibold text-white tracking-tight hover:text-gray-300 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>

        <div className="px-6 py-5 border-b border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Dashboard</p>
          <p className="text-sm text-gray-300 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <DashboardNav />
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:ml-60 min-h-screen pb-20 md:pb-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950 sticky top-0 z-20">
          <span className="text-sm font-semibold text-white">Dashboard</span>
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Blog
          </Link>
        </div>

        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gray-950 border-t border-gray-800 z-30">
        <DashboardNav mobile />
      </nav>
    </div>
  );
}