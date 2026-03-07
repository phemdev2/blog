import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeletePostButton } from "@/components/delete-post-button";
import type { Post } from "@/lib/supabase/types";

export default async function PostsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .returns<Post[]>();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Title</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Author</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="px-6 py-4 text-white font-medium max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{post.author}</td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(post.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No posts yet.{" "}
                  <Link href="/dashboard/posts/new" className="text-blue-400 hover:underline">
                    Create one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}