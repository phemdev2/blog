"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { X, ImagePlus, ExternalLink, Eye, Pencil } from "lucide-react";
import type { Ad } from "@/lib/supabase/ad-types";

interface AdsDashboardProps {
  initialAds: Ad[];
  categories: string[];
}

function AdForm({
  categories,
  initial,
  onSave,
  onCancel,
}: {
  categories: string[];
  initial?: Ad;
  onSave: (ad: Ad) => void;
  onCancel?: () => void;
}) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? "");
  const [targetUrl, setTargetUrl] = useState(initial?.target_url ?? "");
  const [category, setCategory] = useState(initial?.category ?? "all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initial;

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!targetUrl) { setError("Please provide a target URL."); return; }
    if (!isEdit && !imageFile) { setError("Please upload an image."); return; }

    setUploading(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Not authenticated."); setUploading(false); return; }

    let imageUrl = initial?.image_url ?? "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("ads").upload(path, imageFile);
      if (uploadError) { setError(uploadError.message); setUploading(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("ads").getPublicUrl(path);
      imageUrl = publicUrl;
    }

    const payload = { image_url: imageUrl, target_url: targetUrl, category };

    if (isEdit) {
      const { data, error: updateError } = await supabase
        .from("ads").update(payload).eq("id", initial.id).select().single();
      if (updateError) { setError(updateError.message); setUploading(false); return; }
      onSave(data);
    } else {
      const { data, error: insertError } = await supabase
        .from("ads").insert(payload).select().single();
      if (insertError) { setError(insertError.message); setUploading(false); return; }
      onSave(data);
    }

    setUploading(false);
  }

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-700 aspect-4/1">
          <Image src={imagePreview} alt="Ad preview" fill className="object-cover" />
          <button
            onClick={() => { setImageFile(null); setImagePreview(""); }}
            className="absolute top-2 right-2 bg-gray-900 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-700 rounded-lg py-6 flex flex-col items-center gap-2 text-gray-500 hover:border-gray-500 transition-colors"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs">Upload ad image (4:1 ratio recommended)</span>
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

      {/* Target URL */}
      <div>
        <label htmlFor="target-url" className="block text-xs text-gray-400 mb-1">Target URL *</label>
        <input
          id="target-url"
          name="target-url"
          type="url"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="ad-category" className="block text-xs text-gray-400 mb-1">Show in Category</label>
        <select
          id="ad-category"
          name="ad-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c.toLowerCase()}>{c}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-white text-gray-950 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {uploading ? "Saving..." : isEdit ? "Update Ad" : "Add Ad"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export function AdsDashboard({ initialAds, categories }: AdsDashboardProps) {
  const supabase = createClient();
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleToggle(ad: Ad) {
    const { data } = await supabase
      .from("ads").update({ active: !ad.active }).eq("id", ad.id).select().single();
    if (data) setAds((prev) => prev.map((a) => a.id === ad.id ? data : a));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ad?")) return;
    await supabase.from("ads").delete().eq("id", id);
    setAds((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Ads Manager</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ New Ad"}
        </button>
      </div>

      {/* Add New Ad Form */}
      {showAddForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10 max-w-lg">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Add New Ad</h2>
          <AdForm
            categories={categories}
            onSave={(ad) => {
              setAds((prev) => [ad, ...prev]);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Ads Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Ad</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Clicks</span>
              </th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No ads yet.</td>
              </tr>
            )}
            {ads.map((ad) => (
              <>
                <tr key={ad.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-8 rounded overflow-hidden bg-gray-800 shrink-0">
                        <Image src={ad.image_url} alt="Ad" fill className="object-cover" />
                      </div>
                      <a
                        href={ad.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs truncate max-w-[120px]"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        {(() => { try { return new URL(ad.target_url).hostname; } catch { return ad.target_url; } })()}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full capitalize">
                      {ad.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{ad.clicks}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${ad.active ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                      {ad.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingId(editingId === ad.id ? null : ad.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggle(ad)}
                        className="text-yellow-400 hover:text-yellow-300 text-xs transition-colors"
                      >
                        {ad.active ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Inline Edit Form */}
                {editingId === ad.id && (
                  <tr key={`edit-${ad.id}`} className="border-b border-gray-800 bg-gray-900">
                    <td colSpan={5} className="px-6 py-6">
                      <div className="max-w-lg">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">Edit Ad</h3>
                        <AdForm
                          categories={categories}
                          initial={ad}
                          onSave={(updated) => {
                            setAds((prev) => prev.map((a) => a.id === updated.id ? updated : a));
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}