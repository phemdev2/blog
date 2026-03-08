import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Comments } from "@/components/comments";
import { PostViews } from "@/components/post-views";
import type { Post } from "@/types/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image, meta_title, meta_description, tags, slug")
    .eq("slug", decodedSlug)
    .single();

  if (!post) return { title: "Post Not Found" };

  const metaTitle = post.meta_title || post.title;
  const metaDescription = post.meta_description || post.excerpt;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.tags?.join(", ") ?? undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", decodedSlug)
    .single<Post>();

  if (!post) notFound();

  // Related posts — same category, exclude current
  const { data: related } = await supabase
    .from("posts")
    .select("id, title, slug, cover_image, category, author, published_at")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("slug", post.slug)
    .limit(3)
    .returns<Partial<Post>[]>();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#e8380d] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e8380d] transition-colors">Articles</Link>
          <span>/</span>
          <Link
            href={`/blog?category=${post.category.toLowerCase()}`}
            className="font-medium text-[#e8380d]"
          >
            {post.category}
          </Link>
        </div>

        {/* Two-column: article + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* ── Article ── */}
          <article className="lg:col-span-8">

            {/* Category */}
            <span className="text-[11px] font-bold text-[#e8380d] uppercase tracking-widest">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-gray-950 mt-2 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Standfirst excerpt */}
            {post.excerpt && (
              <p className="font-serif text-lg sm:text-xl text-gray-500 mb-5 leading-relaxed border-l-[3px] border-[#e8380d] pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 pb-6 border-b border-gray-100 mb-6">
              <span className="font-semibold text-gray-800">{post.author}</span>
              <span className="text-gray-300">|</span>
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </time>
              <span className="text-gray-300">·</span>
              <span>{post.read_time}</span>
              <span className="text-gray-300">·</span>
              <PostViews postId={post.id} views={post.views ?? 0} />
            </div>

            {/* Cover image */}
            {post.cover_image && (
              <div className="relative w-full aspect-video overflow-hidden rounded-sm mb-8 bg-gray-100">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Body content */}
            {post.content_html ? (
              <div
                className="prose prose-lg max-w-none text-gray-800
                  prose-headings:font-serif prose-headings:text-gray-950
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8
                  prose-p:leading-relaxed prose-p:text-[17px]
                  prose-a:text-[#e8380d] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-[#e8380d] prose-blockquote:text-gray-600 prose-blockquote:font-serif prose-blockquote:italic
                  prose-img:rounded-sm
                  prose-code:text-[#e8380d] prose-code:bg-red-50 prose-code:px-1 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />
            ) : (
              <div className="space-y-5">
                {post.content.map((paragraph, i) => (
                  <p key={i} className="text-[17px] text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-sm transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`/post/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-gray-900 hover:bg-[#e8380d] px-4 py-2 rounded-sm transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`/post/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-gray-900 hover:bg-[#e8380d] px-4 py-2 rounded-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} /post/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-gray-900 hover:bg-[#e8380d] px-4 py-2 rounded-sm transition-colors"
              >
                WhatsApp
              </a>
            </div>

            {/* Comments */}
            <div className="mt-14 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-5 bg-[#e8380d] rounded-full" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Discussion</h3>
              </div>
              <Comments postId={post.id} />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 space-y-10">

            {/* Related articles */}
            {related && related.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 bg-[#e8380d] rounded-full" />
                  <h4 className="font-serif text-base font-bold text-gray-900">
                    More in {post.category}
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/post/${r.slug}`}
                      className="group flex gap-3 items-start py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-20 h-14 overflow-hidden rounded-sm bg-gray-100">
                        {r.cover_image ? (
                          <Image
                            src={r.cover_image}
                            alt={r.title ?? ""}
                            width={80}
                            height={56}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-sm font-bold text-gray-900 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3">
                          {r.title}
                        </h5>
                        <p className="text-xs text-gray-400 mt-1">
                          {r.author}
                          <span className="mx-1.5 text-gray-300">|</span>
                          {new Date(r.published_at!).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short",
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/blog?category=${post.category.toLowerCase()}`}
                  className="block mt-5 text-xs font-bold text-[#e8380d] hover:underline"
                >
                  More {post.category} →
                </Link>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gray-950 text-white p-6 rounded-sm">
              <div className="w-1 h-4 bg-[#e8380d] rounded-full mb-3" />
              <h4 className="font-serif text-lg font-bold mb-2">Stay in the loop</h4>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Get the latest articles straight to your inbox. No spam, ever.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#e8380d] placeholder-gray-600 mb-3"
              />
              <button className="w-full bg-[#e8380d] hover:bg-[#c72d08] text-white text-sm font-bold py-2.5 rounded-sm transition-colors">
                Subscribe
              </button>
            </div>

          </aside>
        </div>
      </div>
    </Layout>
  );
}