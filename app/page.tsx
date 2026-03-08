import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Layout } from "@/components/Layout";
import { PostsGrid } from "@/components/posts-grid";
import type { Post } from "@/types/types";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .returns<Post[]>();

  const allPosts: Post[] = posts ?? [];

  return (
    <Layout>
      <PostsGrid posts={allPosts} />
    </Layout>
  );
}