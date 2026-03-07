"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye } from "lucide-react";

interface PostViewsProps {
  postId: string;
  views: number;
}

export function PostViews({ postId, views }: PostViewsProps) {
  const supabase = createClient();

  useEffect(() => {
    supabase.rpc("increment_views", { post_id: postId });
  }, [postId]);

  return (
    <span className="flex items-center gap-1 text-gray-400 text-sm">
      <Eye className="h-4 w-4" />
      {views + 1}
    </span>
  );
}