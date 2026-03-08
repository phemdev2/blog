"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { Post } from "@/types/types";

interface PostFormProps {
  post?: Post;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function calculateReadTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!post;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(post?.content_html ?? "");
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
    const plainText = contentHtml.replace(/<[^>]*>/g, "").trim();
    if (!title || !slug || !plainText || !author || !category) {
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

    const content = plainText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      content_html: contentHtml,
      author,
      category,
      read_time: calculateReadTime(contentHtml),
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
  const inputClass =
    "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="w-full max-w-2xl space-y-5">

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Cover Image</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-700">
            <img src={imagePreview} alt="Cover" className="w-full h-44 sm:h-48 object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-700 rounded-xl py-10 flex flex-col items-center gap-2 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors active:bg-gray-900"
          >
            <ImagePlus className="h-7 w-7" />
            <span className="text-sm">Tap to upload cover image</span>
            <span className="text-xs text-gray-600">PNG, JPG, WEBP up to 5MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Title *</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className={inputClass}
        />
      </div>

      {/* Permalink */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Permalink</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm whitespace-nowrap">/post/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="post-permalink"
            className={inputClass}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description of the post..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Content *</label>
        <RichTextEditor
          value={contentHtml}
          onChange={setContentHtml}
          placeholder="Write your post content here..."
        />
        {contentHtml && (
          <p className="text-xs text-gray-500 mt-1">
            Estimated read time: {calculateReadTime(contentHtml)}
          </p>
        )}
      </div>

      {/* Author + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Author *</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="John Doe"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 pb-6">
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || uploading}
          className="w-full sm:w-auto bg-white text-gray-950 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 active:scale-95"
        >
          {uploading
            ? "Uploading image..."
            : status === "loading"
            ? "Saving..."
            : isEdit
            ? "Update Post"
            : "Publish Post"}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto text-center text-gray-400 hover:text-white text-sm transition-colors py-3 sm:py-0"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}