import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Layout } from "@/components/Layout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Post } from "@/types/types";

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Fetch all posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .returns<Post[]>();

  const allPosts = posts ?? [];
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  // Filter by category if provided
  const filtered = category
    ? allPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : allPosts;

  const activeCategory = category
    ? categories.find((c) => c.toLowerCase() === category.toLowerCase())
    : null;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {activeCategory ?? "All Articles"}
        </h1>
        <p className="text-gray-500 text-sm">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          {activeCategory ? ` in ${activeCategory}` : ""}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap mb-10">
        <Link
          href="/blog"
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            !category
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${cat.toLowerCase()}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No posts found</p>
          <Link href="/blog" className="text-blue-600 text-sm hover:underline">
            View all posts
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white group"
            >
              <Link href={`/post/${post.slug}`}>
                <div className="relative w-full aspect-video bg-gray-100">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {post.category}
                </span>

                <h2 className="font-semibold text-gray-900 text-sm leading-snug mt-1 mb-2 line-clamp-2">
                  <Link
                    href={`/post/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views ?? 0}
                    </span>
                    <span>•</span>
                    <span>{post.read_time}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}