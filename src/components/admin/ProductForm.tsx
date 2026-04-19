"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories } from "@/lib/categories";
import type { Product } from "@/lib/products-static";

interface Props {
  product?: Product; // undefined = new product
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: product?.title ?? "",
    subtitle: product?.subtitle ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    category: product?.category ?? categories[0].slug,
    featured: product?.featured ?? false,
    outOfStock: product?.outOfStock ?? false,
    inventory: product?.inventory?.toString() ?? "0",
    images: product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : [] as string[],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  // Auto-generate slug from title when creating new product
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit
        ? prev.slug
        : title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Upload failed");
        return;
      }
      const data = await res.json() as { url?: string };
      if (data.url) {
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url!] }));
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleAddUrl() {
    const url = urlRef.current?.value.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    if (urlRef.current) urlRef.current.value = "";
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      inventory: Number(form.inventory),
      images: form.images,
      image: form.images[0] ?? "",
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to save product");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleTitleChange}
            required
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          />
        </div>

        {/* Subtitle */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Subtitle
          </label>
          <input
            name="subtitle"
            type="text"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="e.g. Hand Embroidered in Tilla Craft"
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          />
        </div>

        {/* Slug */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            type="text"
            value={form.slug}
            onChange={handleChange}
            required
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens"
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] font-mono focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          />
          <p className="text-xs text-[#8C8680] mt-1">
            URL: /shop/{form.slug || "…"}
          </p>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white resize-none transition-colors"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory */}
        <div>
          <label className="block text-xs font-semibold text-[#4A4440] mb-1.5 uppercase tracking-wide">
            Inventory
          </label>
          <input
            name="inventory"
            type="number"
            min="0"
            value={form.inventory}
            onChange={handleChange}
            className="w-full border border-[#E8E3DC] px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 justify-center">
          {[
            { name: "featured", label: "Featured product" },
            { name: "outOfStock", label: "Mark as out of stock" },
          ].map((toggle) => (
            <label key={toggle.name} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name={toggle.name}
                checked={!!form[toggle.name as keyof typeof form]}
                onChange={handleChange}
                className="w-4 h-4 accent-[#B5903A]"
              />
              <span className="text-sm text-[#4A4440]">{toggle.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-semibold text-[#4A4440] mb-2 uppercase tracking-wide">
          Product Images
          {form.images.length > 0 && (
            <span className="ml-2 text-[#8C8680] normal-case font-normal">
              ({form.images.length} image{form.images.length !== 1 ? "s" : ""} · first is primary)
            </span>
          )}
        </label>

        {/* Existing images */}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((src, i) => (
              <div key={i} className="relative group">
                <div className="relative w-24 h-32 overflow-hidden bg-[#EDE8E1]">
                  <Image
                    src={src}
                    alt={`Image ${i + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#B5903A] text-white text-[9px] text-center py-0.5 tracking-wider uppercase">
                      Primary
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1C1C1C] text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload + URL add */}
        <div className="space-y-3">
          <div className="border-2 border-dashed border-[#E8E3DC] p-4 text-center">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-[#6B6560] hover:text-[#B5903A] transition-colors"
            >
              {uploading ? "Uploading…" : "Click to upload image (JPEG, PNG, WebP · max 10 MB)"}
            </label>
          </div>
          <div>
            <p className="text-[10px] text-[#8C8680] mb-1">Or add an image URL:</p>
            <div className="flex gap-2">
              <input
                ref={urlRef}
                type="text"
                placeholder="/images/products/filename.jpg"
                className="flex-1 border border-[#E8E3DC] px-3 py-2 text-xs font-mono text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white transition-colors"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="border border-[#E8E3DC] text-[#4A4440] text-xs px-4 py-2 hover:border-[#1C1C1C] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-3 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-[#E8E3DC] text-[#4A4440] text-xs tracking-widest uppercase px-6 py-3 font-medium hover:border-[#1C1C1C] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
