"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await supabase.from("posts").delete().eq("id", postId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-300 transition-colors"
    >
      Delete
    </button>
  );
}