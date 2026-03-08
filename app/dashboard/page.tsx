import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostsList } from "@/components/posts-list";
import Link from "next/link";
import type { Post } from "@/types/types";

export default async function PostsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .returns<Post[]>();

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <PostsList posts={posts ?? []} />
    </div>
  );
}