"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import type { Post } from "@/types/types";

interface PostFormProps {
  post?: Post;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function calculateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

type Alignment = "left" | "center" | "right" | "justify";

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!post;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content?.join("\n\n") ?? "");
  const [alignment, setAlignment] = useState<Alignment>("left");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [coverImage, setCoverImage] = useState<string>(post?.cover_image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post?.cover_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    setSlug(slugify(val));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview("");
    setCoverImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(file: File, userId: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!title || !slug || !content || !author || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    setStatus("loading");
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in to publish a post.");
      setStatus("error");
      return;
    }

    let imageUrl = coverImage;

    // Upload image if a new one was selected
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile, session.user.id);
      } catch (err: any) {
        setError(`Image upload failed: ${err.message}`);
        setStatus("error");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload = {
      title,
      slug,
      excerpt,
      content: content.split("\n\n").map((p) => p.trim()).filter(Boolean),
      content_html: `<div style="text-align:${alignment}">${content.split("\n\n").map((p) => `<p>${p.trim()}</p>`).join("")}</div>`,
      author,
      category,
      read_time: calculateReadTime(content),
      user_id: session.user.id,
      cover_image: imageUrl || null,
    };

    const { error } = isEdit
      ? await supabase.from("posts").update(payload).eq("id", post.id)
      : await supabase.from("posts").insert(payload);

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      router.push("/dashboard/posts");
      router.refresh();
    }
  }

  const categories = ["Technology", "Design", "Business", "Lifestyle", "Other"];

  const alignments: { value: Alignment; icon: React.ReactNode }[] = [
    { value: "left", icon: <AlignLeft className="h-4 w-4" /> },
    { value: "center", icon: <AlignCenter className="h-4 w-4" /> },
    { value: "right", icon: <AlignRight className="h-4 w-4" /> },
    { value: "justify", icon: <AlignJustify className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-2xl space-y-6">

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-700">
            <img src={imagePreview} alt="Cover" className="w-full h-48 object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-900 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-700 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-sm">Click to upload cover image</span>
            <span className="text-xs text-gray-600">PNG, JPG, WEBP up to 5MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          id="cover-image"
          name="cover-image"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm text-gray-400 mb-1">Title *</label>
        <input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Permalink */}
      <div>
        <label htmlFor="slug" className="block text-sm text-gray-400 mb-1">Permalink</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">/post/</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="post-permalink"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm text-gray-400 mb-1">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description of the post..."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Content + Alignment */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="content" className="block text-sm text-gray-400">
            Content * <span className="text-gray-600">(separate paragraphs with a blank line)</span>
          </label>
          {/* Alignment toolbar */}
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
            {alignments.map(({ value, icon }) => (
              <button
                key={value}
                onClick={() => setAlignment(value)}
                className={`p-1.5 rounded transition-colors ${
                  alignment === value
                    ? "bg-white text-gray-950"
                    : "text-gray-400 hover:text-white"
                }`}
                title={`Align ${value}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          rows={12}
          style={{ textAlign: alignment }}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {content && (
          <p className="text-xs text-gray-500 mt-1">
            Estimated read time: {calculateReadTime(content)}
          </p>
        )}
      </div>

      {/* Author + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="author" className="block text-sm text-gray-400 mb-1">Author *</label>
          <input
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm text-gray-400 mb-1">Category *</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || uploading}
          className="bg-white text-gray-950 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading image..." : status === "loading" ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}