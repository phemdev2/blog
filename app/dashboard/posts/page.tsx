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

      {/* ── Mobile card list ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {(posts ?? []).map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1">
                {post.title}
              </p>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {post.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-gray-800">
              <Link
                href={`/dashboard/posts/${post.id}/edit`}
                className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <div className="flex-1 flex justify-center">
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          </div>
        ))}

        {(!posts || posts.length === 0) && (
          <div className="text-center text-gray-500 py-16">
            No posts yet.{" "}
            <Link href="/dashboard/posts/new" className="text-blue-500 hover:underline">
              Create one
            </Link>
          </div>
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Author</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-900/60 transition-colors">
                <td className="px-6 py-4 text-white font-medium max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
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
                      className="text-blue-500 hover:text-blue-400 transition-colors"
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
                  <Link href="/dashboard/posts/new" className="text-blue-500 hover:underline">
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