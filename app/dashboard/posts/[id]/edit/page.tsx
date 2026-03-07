import { notFound } from "next/navigation";
import Image from "next/image";
import { Layout } from "@/components/Layout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Comments } from "@/components/comments";
import { PostViews } from "@/components/post-views";
import type { Post } from "@/types/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug.toLowerCase())
    .single();

  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: post.cover_image ? [post.cover_image] : [] },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single<Post>();

  if (!post) notFound();

  return (
    <Layout>
      <div className="mb-8">
        <a href="/" className="text-sm text-blue-600 font-medium hover:underline">
          ← Back to Posts
        </a>
      </div>

      <article className="max-w-2xl mx-auto">
        {/* Cover Image — 16:9 standard */}
        {post.cover_image && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        )}

        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {post.category}
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span className="font-medium text-gray-700">{post.author}</span>
          <span>•</span>
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.read_time}</span>
          <span>•</span>
          <PostViews postId={post.id} views={post.views ?? 0} />
        </div>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {post.content_html ? (
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        ) : (
          <div className="prose prose-gray max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6 text-base">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </article>

      <div className="max-w-2xl mx-auto mt-16">
        <Comments postId={post.id} />
      </div>
    </Layout>
  );
}