// src/components/BlogPost.tsx
import { Post } from "@/types/types";

interface BlogPostProps {
  post: Post;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="prose max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        {post.author} • {post.date} • {post.readTime}
      </p>

      {post.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </article>
  );
}