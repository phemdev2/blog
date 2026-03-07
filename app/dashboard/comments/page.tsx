import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CommentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*, posts(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        Comments <span className="text-gray-500 text-lg font-normal">({comments?.length ?? 0})</span>
      </h1>

      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Comment</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Post</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {(comments ?? []).map((comment) => (
              <tr key={comment.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="px-6 py-4 text-white max-w-sm truncate">{comment.body}</td>
                <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                  {(comment.posts as any)?.title ?? "—"}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!comments || comments.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No comments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}