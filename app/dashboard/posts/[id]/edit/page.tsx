import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/post-form";
import type { Post } from "@/types/types";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single<Post>();

  if (!post) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}