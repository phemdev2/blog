import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [{ count: postCount }, { count: subscriberCount }, { count: commentCount }] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Total Posts", value: postCount ?? 0 },
    { label: "Subscribers", value: subscriberCount ?? 0 },
    { label: "Comments", value: commentCount ?? 0 },
  ];

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}