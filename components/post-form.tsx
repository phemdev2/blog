"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X, ChevronDown, ChevronUp, Calendar, FileText, Globe, EyeOff } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { Post } from "@/types/types";

interface PostFormProps {
  post?: Post;
}

type PostStatus = "published" | "draft" | "scheduled";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function calculateReadTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function wordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, "").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","it","its","this","that","are","was","were","be","been",
  "have","has","had","do","does","did","will","would","could","should","may",
  "might","not","no","so","if","as","up","out","about","into","than","then",
  "them","they","their","there","which","who","what","when","how","all","also",
  "can","just","more","one","get","use","your","you","we","our","my","i","he",
  "she","his","her","very","some","any","each","been","being","after","before",
]);

function autoGenerateTags(title: string, excerpt: string, html: string): string[] {
  const plain = html.replace(/<[^>]*>/g, " ");
  const combined = `${title} ${excerpt} ${plain}`.toLowerCase();
  const words = combined.match(/\b[a-z]{4,}\b/g) ?? [];
  const freq: Record<string, number> = {};
  for (const w of words) { if (!STOP_WORDS.has(w)) freq[w] = (freq[w] ?? 0) + 1; }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!post;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const draftKey = `post-draft-${post?.id ?? "new"}`;

  function loadDraft() {
    try {
      const saved = localStorage.getItem(draftKey);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }

  const draft = loadDraft();

  const [title, setTitle] = useState(draft?.title ?? post?.title ?? "");
  const [slug, setSlug] = useState(draft?.slug ?? post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(draft?.excerpt ?? post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(draft?.contentHtml ?? post?.content_html ?? "");
  const [author, setAuthor] = useState(draft?.author ?? post?.author ?? "");
  const [category, setCategory] = useState(draft?.category ?? post?.category ?? "");
  const [coverImage, setCoverImage] = useState<string>(draft?.coverImage ?? post?.cover_image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(draft?.coverImage ?? post?.cover_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  // Publishing
  const [postStatus, setPostStatus] = useState<PostStatus>(
    (post?.status as PostStatus) ?? "published"
  );
  const [scheduledAt, setScheduledAt] = useState<string>(
    toDatetimeLocal(post?.scheduled_at)
  );
  const [publishOpen, setPublishOpen] = useState(false);

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(draft?.metaTitle ?? post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(draft?.metaDescription ?? post?.meta_description ?? "");
  const [tagsInput, setTagsInput] = useState(draft?.tagsInput ?? (post?.tags ?? []).join(", "));
  const [seoOpen, setSeoOpen] = useState(false);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        title, slug, excerpt, contentHtml, author, category,
        coverImage, metaTitle, metaDescription, tagsInput,
      }));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch {}
  }, [draftKey, title, slug, excerpt, contentHtml, author, category, coverImage, metaTitle, metaDescription, tagsInput]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  function clearDraft() {
    try { localStorage.removeItem(draftKey); } catch {}
  }

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

  async function handleSubmit(overrideStatus?: PostStatus) {
    const plainText = contentHtml.replace(/<[^>]*>/g, "").trim();
    const finalStatus = overrideStatus ?? postStatus;

    if (!title) {
      setError("Title is required.");
      return;
    }
    if (finalStatus !== "draft" && (!slug || !plainText || !author || !category)) {
      setError("Please fill in all required fields.");
      return;
    }
    if (finalStatus === "scheduled" && !scheduledAt) {
      setError("Please set a scheduled date and time.");
      return;
    }
    if (finalStatus === "scheduled" && new Date(scheduledAt) <= new Date()) {
      setError("Scheduled time must be in the future.");
      return;
    }

    setSubmitStatus("loading");
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("You must be logged in.");
      setSubmitStatus("error");
      return;
    }

    let imageUrl = coverImage;
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile, session.user.id);
      } catch (err: any) {
        setError(`Image upload failed: ${err.message}`);
        setSubmitStatus("error");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const tags = tagsInput.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);
    const content = plainText.split(/\n+/).map((p: string) => p.trim()).filter(Boolean);

    const payload: Record<string, unknown> = {
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
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      tags,
      status: finalStatus,
      scheduled_at: finalStatus === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      ...(finalStatus === "published" && !post?.published_at
        ? { published_at: new Date().toISOString() }
        : {}),
    };

    const { error } = isEdit
      ? await supabase.from("posts").update(payload).eq("id", post.id)
      : await supabase.from("posts").insert(payload);

    if (error) {
      setError(error.message);
      setSubmitStatus("error");
    } else {
      clearDraft();
      router.push("/dashboard/posts");
      router.refresh();
    }
  }

  const categories = ["Technology", "Design", "Business", "Lifestyle", "Other"];
  const inputClass =
    "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDescription.length;

  const statusConfig = {
    published: { label: "Published", icon: Globe,     color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
    draft:     { label: "Draft",     icon: FileText,  color: "text-gray-400",  bg: "bg-gray-400/10 border-gray-400/30"  },
    scheduled: { label: "Scheduled", icon: Calendar,  color: "text-blue-400",  bg: "bg-blue-400/10 border-blue-400/30"  },
  };
  const currentStatus = statusConfig[postStatus];

  return (
    <div className="w-full max-w-2xl space-y-5">

      {/* Cover Image */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Cover Image</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-700">
            <img src={imagePreview} alt="Cover" className="w-full h-44 sm:h-48 object-cover" />
            <button onClick={removeImage} className="absolute top-2 right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-700 rounded-xl py-10 flex flex-col items-center gap-2 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors active:bg-gray-900">
            <ImagePlus className="h-7 w-7" />
            <span className="text-sm">Tap to upload cover image</span>
            <span className="text-xs text-gray-600">PNG, JPG, WEBP up to 5MB</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Title *</label>
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" className={inputClass} />
      </div>

      {/* Permalink */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Permalink</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm whitespace-nowrap">/post/</span>
          <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="post-permalink" className={inputClass} />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Excerpt</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description of the post..." rows={3} className={`${inputClass} resize-none`} />
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Content *</label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} placeholder="Write your post content here..." />
        {contentHtml && (
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-gray-500">{wordCount(contentHtml).toLocaleString()} words</span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-xs text-gray-500">{calculateReadTime(contentHtml)}</span>
            <span className="text-gray-700 text-xs">·</span>
            <span className={`text-xs font-medium ${wordCount(contentHtml) < 300 ? "text-amber-400" : wordCount(contentHtml) < 800 ? "text-blue-400" : "text-green-400"}`}>
              {wordCount(contentHtml) < 300 ? "Short" : wordCount(contentHtml) < 800 ? "Medium" : "Long read"}
            </span>
          </div>
        )}
      </div>

      {/* Author + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Author *</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="">Select...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Publishing Settings ── */}
      <div className="border border-gray-700 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setPublishOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">Publishing</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${currentStatus.bg} ${currentStatus.color}`}>
              <currentStatus.icon className="h-3 w-3" />
              {currentStatus.label}
            </span>
          </div>
          {publishOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>

        {publishOpen && (
          <div className="px-4 py-4 space-y-4 border-t border-gray-700 bg-gray-900/50">
            <div>
              <label className="block text-sm text-gray-400 mb-3">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(["published", "draft", "scheduled"] as PostStatus[]).map((s) => {
                  const cfg = statusConfig[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPostStatus(s)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors ${
                        postStatus === s ? `${cfg.bg} ${cfg.color}` : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      <cfg.icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {postStatus === "draft" && (
              <p className="text-xs text-gray-500 bg-gray-800 rounded-lg px-3 py-2">
                Saved as draft — won&apos;t appear on the public blog until published.
              </p>
            )}

            {postStatus === "scheduled" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Publish date &amp; time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className={inputClass}
                />
                <p className="text-xs text-gray-600 mt-1">Post will be marked to go live at this time.</p>
              </div>
            )}

            {isEdit && post?.status === "published" && postStatus === "published" && (
              <button
                type="button"
                onClick={() => setPostStatus("draft")}
                className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <EyeOff className="h-3.5 w-3.5" />
                Unpublish this post
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── SEO Section ── */}
      <div className="border border-gray-700 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setSeoOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">SEO Settings</span>
            {(metaTitle || metaDescription || tagsInput) && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Configured</span>
            )}
          </div>
          {seoOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>

        {seoOpen && (
          <div className="px-4 py-4 space-y-4 border-t border-gray-700 bg-gray-900/50">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Meta Title</label>
                <span className={`text-xs ${metaTitleLen > 60 ? "text-red-400" : "text-gray-500"}`}>{metaTitleLen}/60</span>
              </div>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "SEO title"} className={inputClass} />
              <p className="text-xs text-gray-600 mt-1">Keep under 60 characters.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Meta Description</label>
                <span className={`text-xs ${metaDescLen > 160 ? "text-red-400" : "text-gray-500"}`}>{metaDescLen}/160</span>
              </div>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={excerpt || "SEO description"} rows={3} className={`${inputClass} resize-none`} />
              <p className="text-xs text-gray-600 mt-1">Keep under 160 characters.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Tags / Keywords</label>
                <button
                  type="button"
                  onClick={() => setTagsInput(autoGenerateTags(title, excerpt, contentHtml).join(", "))}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ✨ Auto-generate from post
                </button>
              </div>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="nextjs, react, web development" className={inputClass} />
              <p className="text-xs text-gray-600 mt-1">Comma-separated keywords.</p>
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Search Preview</p>
              <p className="text-blue-400 text-sm font-medium truncate">{metaTitle || title || "Post Title"}</p>
              <p className="text-green-600 text-xs mt-0.5 truncate">yourdomain.com/post/{slug || "post-slug"}</p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{metaDescription || excerpt || "Your post description will appear here."}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 pb-6">
        {draftSaved && <span className="text-xs text-green-400 sm:mr-auto">✓ Draft saved</span>}

        {postStatus !== "draft" && (
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={submitStatus === "loading"}
            className="w-full sm:w-auto border border-gray-700 text-gray-300 px-5 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
        )}

        <button
          onClick={() => handleSubmit()}
          disabled={submitStatus === "loading" || uploading}
          className="w-full sm:w-auto bg-white text-gray-950 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 active:scale-95"
        >
          {uploading ? "Uploading image..." :
           submitStatus === "loading" ? "Saving..." :
           postStatus === "draft" ? "Save Draft" :
           postStatus === "scheduled" ? "Schedule Post" :
           isEdit ? "Update Post" : "Publish Post"}
        </button>

        <button onClick={() => router.back()} className="w-full sm:w-auto text-center text-gray-400 hover:text-white text-sm transition-colors py-3 sm:py-0">
          Cancel
        </button>
      </div>
    </div>
  );
}