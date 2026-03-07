"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Post } from "@/types/types";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
        >
          {/* Cover Image — 16:9 standard */}
          <Link href={`/post/${post.slug}`}>
           <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
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

          <div className="p-6">
            {/* Category */}
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {post.category}
            </span>

            {/* Title */}
            <h2 className="text-xl font-bold mt-2 mb-2 text-gray-900">
              <Link
                href={`/post/${post.slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{post.author}</span>
              <span>
                {new Date(post.published_at).toLocaleDateString()} • {post.read_time}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Eye className="h-3.5 w-3.5" />
                {post.views ?? 0} views
              </span>
              <Link
                href={`/post/${post.slug}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}