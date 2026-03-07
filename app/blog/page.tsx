import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Layout } from "@/components/Layout";
import { AdBanner } from "@/components/ad-banner";
import { selectAdsForContext } from "@/lib/ad-utils";
import type { Post } from "@/types/types";
import type { Ad } from "@/lib/supabase/ad-types";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles",
  description: "Browse all articles and posts.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Fetch posts
  let query = supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.filter("category", "ilike", category);
  }

  const { data: posts } = await query.returns<Post[]>();
  const allPosts = posts ?? [];

  // Fetch ads
  const { data: adsData } = await supabase
    .from("ads")
    .select("*")
    .eq("active", true)
    .returns<Ad[]>();

  const ads = selectAdsForContext(adsData ?? [], category);

  // Get unique categories
  const { data: allPostsForCategories } = await supabase
    .from("posts")
    .select("category")
    .returns<Pick<Post, "category">[]>();

  const categories = Array.from(
    new Set((allPostsForCategories ?? []).map((p) => p.category))
  ).sort();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Articles</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            {category ? `Browsing: ${category}` : "All articles"}
            {" · "}
            {allPosts.length} post{allPosts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Ad Banner Section */}
        <div className="mb-6 sm:mb-8">
          {ads.length > 0 && (
            <div className="relative">
              {/* Mobile: Show ONLY the first ad using slice(0, 1) */}
              <div className="sm:hidden">
                <AdBanner ads={ads.slice(0, 1)} />
              </div>
              
              {/* Desktop: Show all ads (usually 3) */}
              <div className="hidden sm:block">
                <AdBanner ads={ads} />
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
          <Link
            href="/blog"
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              !category
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat.toLowerCase())}`}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                category?.toLowerCase() === cat.toLowerCase()
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {allPosts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-gray-400">
            <p className="text-lg font-medium">No posts found</p>
            <p className="text-sm mt-1">
              {category ? `No posts in "${category}" yet.` : "No posts yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                {/* Cover Image */}
                <div className="relative w-full aspect-video bg-gray-100">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 text-4xl">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <span className="text-xs sm:text-xs font-medium text-blue-600 uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 mt-1 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 sm:mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author}</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span>{post.read_time}</span>
                      <span>·</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}