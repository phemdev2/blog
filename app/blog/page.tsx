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

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.filter("category", "ilike", category);
  }

  const { data: posts } = await query.returns<Post[]>();
  const allPosts = posts ?? [];

  const { data: adsData } = await supabase
    .from("ads")
    .select("*")
    .eq("active", true)
    .returns<Ad[]>();

  const ads = selectAdsForContext(adsData ?? [], category);

  const { data: allPostsForCategories } = await supabase
    .from("posts")
    .select("category")
    .eq("status", "published")
    .returns<Pick<Post, "category">[]>();

  const categories = Array.from(
    new Set((allPostsForCategories ?? []).map((p) => p.category))
  ).sort();

  const featured = !category ? allPosts[0] : null;
  const gridPosts = !category ? allPosts.slice(1) : allPosts;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-[#e8380d] rounded-full flex-shrink-0" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950">
            {category ? category : "All Articles"}
          </h1>
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {allPosts.length} article{allPosts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Ads */}
        {ads.length > 0 && (
          <div className="mb-8">
            <div className="sm:hidden"><AdBanner ads={ads.slice(0, 1)} /></div>
            <div className="hidden sm:block"><AdBanner ads={ads} /></div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/blog"
            className={`text-xs font-bold px-4 py-1.5 rounded-sm border transition-colors whitespace-nowrap ${
              !category
                ? "bg-[#e8380d] text-white border-[#e8380d]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#e8380d] hover:text-[#e8380d]"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat.toLowerCase())}`}
              className={`text-xs font-bold px-4 py-1.5 rounded-sm border transition-colors whitespace-nowrap ${
                category?.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#e8380d] text-white border-[#e8380d]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#e8380d] hover:text-[#e8380d]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {allPosts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="font-serif text-xl text-gray-400">
              {category ? `No articles in "${category}" yet.` : "No articles yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Featured hero — only on /blog (no filter) */}
            {featured && (
              <Link
                href={`/post/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 border border-gray-100 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-56 sm:h-72 lg:h-80 bg-gray-100 overflow-hidden">
                  {featured.cover_image ? (
                    <Image
                      src={featured.cover_image}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className="font-serif text-5xl text-gray-200">GP</span>
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
                  <span className="text-[11px] font-bold text-[#e8380d] uppercase tracking-widest">
                    {featured.category}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-gray-950 mt-2 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-5">
                    <span className="font-medium text-gray-600">{featured.author}</span>
                    <span className="mx-2 text-gray-200">|</span>
                    {new Date(featured.published_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    <span className="mx-2 text-gray-200">·</span>
                    {featured.read_time}
                  </p>
                </div>
              </Link>
            )}

            {/* Article grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-44 bg-gray-50 overflow-hidden rounded-sm">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-3xl text-gray-200">GP</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="pt-3 flex-1 flex flex-col">
                      <span className="text-[11px] font-bold text-[#e8380d] uppercase tracking-widest">
                        {post.category}
                      </span>
                      <h2 className="font-serif text-[16px] sm:text-[17px] font-bold text-gray-950 mt-1 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3 flex-1">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-3">
                        <span className="font-medium text-gray-500">{post.author}</span>
                        <span className="mx-1.5 text-gray-300">|</span>
                        {new Date(post.published_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}