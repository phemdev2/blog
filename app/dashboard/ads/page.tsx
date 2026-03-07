import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdsDashboard } from "@/components/ads-dashboard";
import type { Ad } from "@/lib/supabase/ad-types";
import type { Post } from "@/types/types";

export default async function AdsPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: ads }, { data: posts }] = await Promise.all([
    supabase.from("ads").select("*").order("created_at", { ascending: false }).returns<Ad[]>(),
    supabase.from("posts").select("category").returns<Pick<Post, "category">[]>(),
  ]);

  const categories = Array.from(new Set((posts ?? []).map((p) => p.category)));

  return <AdsDashboard initialAds={ads ?? []} categories={categories} />;
}