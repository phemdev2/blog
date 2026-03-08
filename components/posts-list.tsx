"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DeletePostButton } from "@/components/delete-post-button";
import { Search, ArrowUpDown, Globe, FileText, Calendar } from "lucide-react";
import type { Post } from "@/types/types";

type SortKey = "date_desc" | "date_asc" | "views_desc" | "views_asc";


function StatusBadge({ status }: { status: string | null }) {
  if (!status || status === "published") return (
    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full whitespace-nowrap">
      <Globe className="h-3 w-3" /> Published
    </span>
  );
  if (status === "draft") return (
    <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full whitespace-nowrap">
      <FileText className="h-3 w-3" /> Draft
    </span>
  );
  if (status === "scheduled") return (
    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full whitespace-nowrap">
      <Calendar className="h-3 w-3" /> Scheduled
    </span>
  );
  return null;
}

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date_desc");

  const filtered = useMemo(() => {
    let result = [...posts];

    // Live search by title
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Sort
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
      case "views_asc":
        result.sort((a, b) => (a.views ?? 0) - (b.views ?? 0));
        break;
    }

    return result;
  }, [posts, query, sort]);

  return (
    <div className="space-y-4">
      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600"
          />
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full sm:w-auto bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="views_desc">Most views</option>
            <option value="views_asc">Least views</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      {query && (
        <p className="text-xs text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* ── Mobile card list ── */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{post.title}</p>
                <div className="mt-1"><StatusBadge status={post.status} /></div>
              </div>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {post.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
              <span>·</span>
              <span>{post.views ?? 0} views</span>
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-gray-800">
              <Link
                href={`/dashboard/posts/${post.id}/edit`}
                className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <div className="flex-1 flex justify-center">
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            {query ? `No posts matching "${query}"` : "No posts yet."}{" "}
            {!query && (
              <Link href="/dashboard/posts/new" className="text-blue-500 hover:underline">
                Create one
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Author</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Views</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-900/60 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{post.title}</span>
                    <StatusBadge status={post.status} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{post.author}</td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(post.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-400">{post.views ?? 0}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {query ? `No posts matching "${query}"` : "No posts yet."}{" "}
                  {!query && (
                    <Link href="/dashboard/posts/new" className="text-blue-500 hover:underline">
                      Create one
                    </Link>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}