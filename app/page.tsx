import { Layout } from "@/components/Layout";
import { Newsletter } from "@/components/newsletter";
import { AdBanner } from "@/components/ad-banner";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { selectAdsForContext } from "@/lib/ad-utils";
import { PostsGrid } from "@/components/posts-grid";
import type { Post } from "@/types/types";
import type { Ad } from "@/lib/supabase/ad-types";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: posts }, { data: ads }] = await Promise.all([
    supabase.from("posts").select("*").order("published_at", { ascending: false }).returns<Post[]>(),
    supabase.from("ads").select("*").eq("active", true).returns<Ad[]>(),
  ]);

  const allAds = ads ?? [];
  const topAds = selectAdsForContext(allAds);

  return (
    <Layout>
      {/* Top Ad Banner */}
      <AdBanner ads={topAds} />

      {/* Posts grid with live search + sort + category nav */}
      <PostsGrid posts={posts ?? []} ads={allAds} />

      <div className="mt-16">
        <Newsletter />
      </div>
    </Layout>
  );
}