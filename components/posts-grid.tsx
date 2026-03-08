"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { Post } from "@/types/types";

interface PostsGridProps {
  posts: Post[];
}

function CategoryLabel({ category }: { category: string }) {
  return (
    <span className="text-[11px] font-bold text-[#e8380d] uppercase tracking-widest">
      {category}
    </span>
  );
}

function AuthorDate({ author, date }: { author: string; date: string }) {
  return (
    <p className="text-xs text-gray-500 mt-1.5">
      <span className="font-medium text-gray-600">{author}</span>
      <span className="mx-1.5 text-gray-300">|</span>
      {new Date(date).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })}
    </p>
  );
}

function HeroCard({ post }: { post: Post }) {
  return (
    <a href={`/post/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-sm">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title}
            className="w-full h-56 sm:h-72 lg:h-80 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 sm:h-72 lg:h-80 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-5xl font-serif">GP</span>
          </div>
        )}
      </div>
      <div className="pt-3">
        <CategoryLabel category={post.category} />
        <h2 className="font-serif text-2xl sm:text-[28px] font-bold text-gray-950 mt-1.5 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2 hidden sm:block">
            {post.excerpt}
          </p>
        )}
        <AuthorDate author={post.author} date={post.published_at} />
      </div>
    </a>
  );
}

function SidebarCard({ post }: { post: Post }) {
  return (
    <a href={`/post/${post.slug}`} className="group flex gap-3 items-start">
      <div className="flex-shrink-0 w-24 h-16 sm:w-28 sm:h-[72px] overflow-hidden rounded-sm bg-gray-100">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <CategoryLabel category={post.category} />
        <h3 className="font-serif text-sm sm:text-[15px] font-bold text-gray-900 mt-0.5 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3">
          {post.title}
        </h3>
        <AuthorDate author={post.author} date={post.published_at} />
      </div>
    </a>
  );
}

function HorizontalCard({ post }: { post: Post }) {
  return (
    <a href={`/post/${post.slug}`} className="group flex flex-col">
      <div className="overflow-hidden rounded-sm bg-gray-100">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title}
            className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100" />
        )}
      </div>
      <div className="pt-2.5">
        <CategoryLabel category={post.category} />
        <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mt-1 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-3">
          {post.title}
        </h3>
        <AuthorDate author={post.author} date={post.published_at} />
      </div>
    </a>
  );
}

function ListCard({ post }: { post: Post }) {
  return (
    <a href={`/post/${post.slug}`} className="group flex gap-4 items-start py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-20 h-14 overflow-hidden rounded-sm bg-gray-100">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <CategoryLabel category={post.category} />
        <h3 className="font-serif text-sm font-bold text-gray-900 mt-0.5 leading-snug group-hover:text-[#e8380d] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <AuthorDate author={post.author} date={post.published_at} />
      </div>
    </a>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-5 bg-[#e8380d] rounded-full flex-shrink-0" />
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

const CATEGORIES = ["Technology", "Design", "Business", "Lifestyle", "Other"];

export function PostsGrid({ posts }: PostsGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    return posts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, posts]);

  const hero    = posts[0];
  const sidebar = posts.slice(1, 4);
  const rest    = posts.slice(4);

  return (
    <div className="space-y-12">

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#e8380d] bg-white"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Search results */}
      {filtered !== null ? (
        <div>
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-semibold">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-sm py-12 text-center font-serif">No articles found.</p>
          ) : (
            <div>{filtered.map((p) => <ListCard key={p.id} post={p} />)}</div>
          )}
        </div>
      ) : (
        <>
          {/* Hero + Sidebar */}
          {posts.length > 0 && (
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {hero && (
                  <div className="lg:col-span-7 lg:border-r lg:border-gray-100 lg:pr-10">
                    <HeroCard post={hero} />
                  </div>
                )}
                {sidebar.length > 0 && (
                  <div className="lg:col-span-5 flex flex-col gap-0 divide-y divide-gray-100">
                    {sidebar.map((post) => (
                      <div key={post.id} className="py-5 first:pt-0 last:pb-0">
                        <SidebarCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {rest.length > 0 && <hr className="border-gray-100" />}

          {/* Category sections */}
          {CATEGORIES.map((cat) => {
            const catPosts = rest.filter((p) => p.category === cat);
            if (catPosts.length === 0) return null;
            return (
              <section key={cat}>
                <SectionHeader title={cat} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {catPosts.slice(0, 3).map((p) => <HorizontalCard key={p.id} post={p} />)}
                </div>
                {catPosts.length > 3 && (
                  <div className="mt-6">
                    <a href={`/blog?category=${cat}`} className="text-sm font-bold text-[#e8380d] hover:underline">
                      More {cat} →
                    </a>
                  </div>
                )}
              </section>
            );
          })}

          {posts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 font-serif text-xl">No articles yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}