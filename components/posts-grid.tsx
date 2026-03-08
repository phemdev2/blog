"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Search, ArrowUpDown, X } from "lucide-react";
import { selectAdsForContext } from "@/lib/ad-utils";
import { AdBanner } from "@/components/ad-banner";
import type { Post } from "@/types/types";
import type { Ad } from "@/lib/supabase/ad-types";

type SortKey = "date_desc" | "date_asc" | "views_desc";

interface PostsGridProps {
  posts: Post[];
  ads: Ad[];
}

export function PostsGrid({ posts, ads }: PostsGridProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("date_desc");

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts]
  );

  const filtered = useMemo(() => {
    let result = [...posts];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    switch (sort) {
      case "date_desc":
        result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
      case "date_asc":
        result.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
        break;
      case "views_desc":
        result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
    }

    return result;
  }, [posts, query, activeCategory, sort]);

  const postsByCategory = useMemo(() => {
    if (query || activeCategory) return null; // flat view when searching/filtering
    return categories.reduce<Record<string, Post[]>>((acc, cat) => {
      acc[cat] = filtered.filter((p) => p.category === cat);
      return acc;
    }, {});
  }, [categories, filtered, query, activeCategory]);

  const isSearching = !!query || !!activeCategory;

  return (
    <div>
      {/* ── Category nav + search bar ── */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
        {/* Search + Sort row */}
        <div className="flex items-center gap-2 pt-3 pb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="date_desc">Latest</option>
              <option value="date_asc">Oldest</option>
              <option value="views_desc">Most viewed</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              !activeCategory
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
              }`}
            >
              {cat}
              <span className="ml-1 font-normal opacity-60">
                ({posts.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Search result count ── */}
      {isSearching && (
        <p className="text-sm text-gray-500 mb-6">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          {query && <> matching &ldquo;{query}&rdquo;</>}
          {activeCategory && <> in <span className="font-medium text-gray-700">{activeCategory}</span></>}
        </p>
      )}

      {/* ── Flat search/filter results ── */}
      {isSearching && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium mb-2">No articles found</p>
              <button
                onClick={() => { setQuery(""); setActiveCategory(null); }}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Default category sections ── */}
      {!isSearching && postsByCategory && (
        <div id="all" className="space-y-16">
          {categories.map((category) => {
            const categoryAds = selectAdsForContext(ads, category);
            const categoryPosts = postsByCategory[category] ?? [];

            return (
              <section key={category} id={category.toLowerCase()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {categoryPosts.length} posts
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    View all →
                  </button>
                </div>

                <AdBanner ads={categoryAds} />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white group">
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
              <span className="text-xs text-gray-400 uppercase tracking-widest">{post.category}</span>
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
  );
}