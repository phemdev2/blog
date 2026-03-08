import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import type { Post } from "@/types/types";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: postCount },
    { count: subscriberCount },
    { count: commentCount },
    { data: topPosts },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id, title, views, category, published_at")
      .order("views", { ascending: false })
      .limit(5)
      .overrideTypes<Pick<Post, "id" | "title" | "views" | "category" | "published_at">[]>(),
    supabase
      .from("posts")
      .select("id, title, views, published_at")
      .order("published_at", { ascending: false })
      .limit(30)
      .overrideTypes<Pick<Post, "id" | "title" | "views" | "published_at">[]>(),
  ]);

  const totalViews = (recentPosts ?? []).reduce((sum, p) => sum + (p.views ?? 0), 0);

  return (
    <AnalyticsDashboard
      stats={{
        posts: postCount ?? 0,
        subscribers: subscriberCount ?? 0,
        comments: commentCount ?? 0,
        totalViews,
      }}
      topPosts={topPosts ?? []}
      recentPosts={recentPosts ?? []}
    />
  );
}