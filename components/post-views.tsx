"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye } from "lucide-react";

interface PostViewsProps {
  postId: string;
  views: number;
}

export function PostViews({ postId, views }: PostViewsProps) {
  const supabase = createClient();
  const [count, setCount] = useState(views);

  useEffect(() => {
    async function increment() {
      const { error } = await supabase.rpc("increment_views", { post_id: postId });
      if (error) {
        console.error("increment_views error:", error.message);
      } else {
        setCount((c) => c + 1);
      }
    }
    increment();
  }, [postId]);

  return (
    <span className="flex items-center gap-1 text-gray-400 text-sm">
      <Eye className="h-4 w-4" />
      {count}
    </span>
  );
}