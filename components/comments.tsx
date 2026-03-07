"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment, User } from "@/lib/supabase/types";

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // Fetch comments
    supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments(data ?? []));

    // Get current user
    supabase.auth.getUser().then(({ data }) =>
      setUser(data.user ? { id: data.user.id, email: data.user.email! } : null)
    );
  }, [postId]);

  async function handleSubmit() {
    if (!body.trim() || !user) return;
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, body })
      .select()
      .single();

    if (error) {
      setError("Failed to post comment. Please try again.");
    } else {
      setComments((prev) => [...prev, data]);
      setBody("");
    }
    setLoading(false);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment list */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 rounded-xl p-4">
            <p className="text-gray-700 text-sm leading-relaxed">{comment.body}</p>
            <span className="text-xs text-gray-400 mt-2 block">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      {/* Comment form */}
      {user ? (
        <div className="space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading || !body.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}
    </section>
  );
}