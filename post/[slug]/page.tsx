import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/content/config";

interface PostPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = posts.find((p) => p.id === params.id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <Link
          href="/"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          ← Back to Posts
        </Link>
      </header>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 py-12">
        {/* Category */}
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span className="font-medium text-gray-700">{post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {post.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-700 leading-relaxed mb-6 text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}