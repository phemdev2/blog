import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeletePostButton } from "@/components/delete-post-button";
import type { Post } from "@/types/types";

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
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Title</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Author</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Date</th>
              <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{post.author}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-blue-600 hover:text-blue-500 transition-colors"
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
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No posts yet.{" "}
                  <Link href="/dashboard/posts/new" className="text-blue-600 hover:underline">
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