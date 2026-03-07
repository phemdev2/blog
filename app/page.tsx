import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Newsletter } from "@/components/newsletter";
import { AdBanner } from "@/components/ad-banner";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { selectAdsForContext } from "@/lib/ad-utils";
import type { Post } from "@/types/types";
import type { Ad } from "@/lib/supabase/ad-types";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: posts }, { data: ads }] = await Promise.all([
    supabase.from("posts").select("*").order("published_at", { ascending: false }).returns<Post[]>(),
    supabase.from("ads").select("*").eq("active", true).returns<Ad[]>(),
  ]);

  const allPosts = posts ?? [];
  const allAds = ads ?? [];
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));
  const postsByCategory = categories.reduce<Record<string, Post[]>>((acc, cat) => {
    acc[cat] = allPosts.filter((p) => p.category === cat);
    return acc;
  }, {});

  // Top-level ads (global)
  const topAds = selectAdsForContext(allAds);

  return (
    <Layout>
      {/* Category Nav Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          <a href="#all" className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-900 text-white">
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
            >
              {cat}
              <span className="ml-1 text-gray-400 font-normal">({postsByCategory[cat].length})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Top Ad Banner */}
      <AdBanner ads={topAds} />

      {/* Category Sections */}
      <div id="all" className="space-y-16">
        {categories.map((category) => {
          const categoryAds = selectAdsForContext(allAds, category);

          return (
            <section key={category} id={category.toLowerCase()}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {postsByCategory[category].length} posts
                  </span>
                </div>
                <a href={`/blog?category=${category.toLowerCase()}`} className="text-sm text-blue-600 hover:underline font-medium">
                  View all →
                </a>
              </div>

              {/* Category Ad Banner */}
              <AdBanner ads={categoryAds} />

              {/* Posts Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {postsByCategory[category].map((post) => (
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
                            <span className="text-xs text-gray-400 uppercase tracking-widest">{category}</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                        <Link href={`/post/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
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
            </section>
          );
        })}
      </div>

      <div className="mt-16">
        <Newsletter />
      </div>
    </Layout>
  );
}