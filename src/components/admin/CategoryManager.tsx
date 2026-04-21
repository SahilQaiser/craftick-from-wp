"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category } from "@/lib/db";

interface Props {
  initialCategories: Category[];
  productCounts: Record<string, number>;
  productImages: Record<string, { src: string; title: string }[]>;
}

type FormData = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: string;
  showInNav: boolean;
};

const emptyForm: FormData = { name: "", slug: "", description: "", image: "", sortOrder: "0", showInNav: true };

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoryManager({ initialCategories, productCounts, productImages }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [adding, setAdding] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openAdd() {
    setEditingSlug(null);
    setForm(emptyForm);
    setError(null);
    setAdding(true);
  }

  function openEdit(cat: Category) {
    setAdding(false);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      sortOrder: String(cat.sortOrder),
      showInNav: cat.showInNav,
    });
    setError(null);
    setEditingSlug(cat.slug);
  }

  function cancel() {
    setAdding(false);
    setEditingSlug(null);
    setForm(emptyForm);
    setError(null);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      // auto-fill slug only when adding a new category
      ...(adding && !f.slug ? { slug: toSlug(name) } : {}),
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (adding) {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            description: form.description,
            image: form.image,
            sortOrder: Number(form.sortOrder) || 0,
            showInNav: form.showInNav,
          }),
        });
        if (!res.ok) {
          const data = await res.json() as { error?: string };
          throw new Error(data.error ?? "Failed to create");
        }
        const created = await res.json() as Category;
        setCategories((c) => [...c, created].sort((a, b) => a.sortOrder - b.sortOrder));
        setAdding(false);
        setForm(emptyForm);
      } else if (editingSlug) {
        const res = await fetch(`/api/admin/categories/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            description: form.description,
            image: form.image,
            sortOrder: Number(form.sortOrder) || 0,
            showInNav: form.showInNav,
          }),
        });
        if (!res.ok) {
          const data = await res.json() as { error?: string };
          throw new Error(data.error ?? "Failed to update");
        }
        const updated = await res.json() as Category;
        setCategories((c) =>
          c.map((cat) => (cat.slug === editingSlug ? updated : cat))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
        setEditingSlug(null);
        setForm(emptyForm);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string, name: string) {
    const count = productCounts[slug] ?? 0;
    const msg = count > 0
      ? `Delete "${name}"? It has ${count} product(s) — they will not be deleted but will no longer appear under any category in the nav.`
      : `Delete "${name}"?`;
    if (!confirm(msg)) return;

    const res = await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.slug !== slug));
      if (editingSlug === slug) cancel();
    } else {
      const data = await res.json() as { error?: string };
      alert(data.error ?? "Failed to delete");
    }
  }

  const FormPanel = (
    <div className="border border-[#E8E3DC] bg-[#FAFAF8] p-6 mb-4">
      <h3 className="text-sm font-semibold text-[#1C1C1C] mb-4">
        {adding ? "Add New Category" : `Edit "${form.name}"`}
      </h3>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 mb-4">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-[#E8E3DC] px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white"
            placeholder="e.g. Pashmina Shawls"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full border border-[#E8E3DC] px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white font-mono"
            placeholder="e.g. pashmina-shawls"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full border border-[#E8E3DC] px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white resize-none"
            placeholder="Short description shown on the shop page"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-2">
            Category Image
          </label>
          {(() => {
            const slug = editingSlug ?? "";
            const imgs = productImages[slug] ?? [];
            if (adding) {
              return (
                <p className="text-xs text-[#8C8680] italic py-2">
                  Save this category first, then add products to it — you can pick a category image from your product photos.
                </p>
              );
            }
            if (imgs.length === 0) {
              return (
                <p className="text-xs text-[#8C8680] italic py-2">
                  No products in this category yet. Add products here to pick a category image.
                </p>
              );
            }
            return (
              <div className="flex flex-wrap gap-2">
                {imgs.map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: img.src }))}
                    title={img.title}
                    className={`relative w-14 h-[72px] bg-[#EDE8E1] overflow-hidden shrink-0 transition-all ${
                      form.image === img.src
                        ? "ring-2 ring-[#B5903A] ring-offset-1"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.src} alt={img.title} fill className="object-cover object-top" sizes="56px" />
                    {form.image === img.src && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <svg className="w-4 h-4 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className="w-full border border-[#E8E3DC] px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] bg-white"
            placeholder="1"
            min="0"
          />
          <p className="text-[11px] text-[#8C8680] mt-1">Lower numbers appear first in the nav</p>
        </div>

        <div className="flex flex-col justify-center">
          <label className="block text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-3">
            Show in Nav
          </label>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, showInNav: !f.showInNav }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              form.showInNav ? "bg-[#1C1C1C]" : "bg-[#D1CBC3]"
            }`}
            role="switch"
            aria-checked={form.showInNav}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                form.showInNav ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <p className="text-[11px] text-[#8C8680] mt-1">
            {form.showInNav ? "Visible in storefront nav" : "Hidden from nav"}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-6 py-2.5 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : adding ? "Create Category" : "Save Changes"}
        </button>
        <button
          onClick={cancel}
          className="border border-[#E8E3DC] text-[#4A4440] text-xs tracking-widest uppercase px-6 py-2.5 font-medium hover:border-[#1C1C1C] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Categories</h1>
          <p className="text-sm text-[#6B6560] mt-1">{categories.length} categories</p>
        </div>
        {!adding && !editingSlug && (
          <button
            onClick={openAdd}
            className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-5 py-2.5 font-medium hover:bg-[#B5903A] transition-colors"
          >
            + Add Category
          </button>
        )}
      </div>

      {(adding || editingSlug) && FormPanel}

      <div className="bg-white border border-[#E8E3DC]">
        <div className="hidden sm:grid grid-cols-[64px_1fr_160px_60px_64px_100px_120px] gap-4 px-6 py-3 border-b border-[#E8E3DC] bg-[#FAFAF8]">
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Image</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Name / Slug</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Description</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium text-center">Order</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium text-center">In Nav</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium text-center">Products</span>
          <span className="text-[10px] tracking-widest uppercase text-[#6B6560] font-medium text-right">Actions</span>
        </div>

        {categories.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-[#8C8680]">
            No categories yet. Add one above.
          </div>
        )}

        {categories.map((cat) => (
          <div
            key={cat.slug}
            className={`grid grid-cols-1 sm:grid-cols-[64px_1fr_160px_60px_64px_100px_120px] gap-4 px-6 py-4 border-b border-[#E8E3DC] last:border-0 items-center ${
              editingSlug === cat.slug ? "bg-[#FFF9F0]" : "hover:bg-[#FAFAF8]"
            } transition-colors`}
          >
            {/* Image */}
            <div className="relative w-12 h-16 bg-[#EDE8E1] overflow-hidden shrink-0">
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover object-top" sizes="48px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C8C3BC] text-xs">—</div>
              )}
            </div>

            {/* Name / Slug */}
            <div>
              <p className="text-sm font-medium text-[#1C1C1C]">{cat.name}</p>
              <p className="text-xs font-mono text-[#8C8680] mt-0.5">{cat.slug}</p>
            </div>

            {/* Description */}
            <p className="text-xs text-[#6B6560] line-clamp-2 hidden sm:block">{cat.description || "—"}</p>

            {/* Sort order */}
            <p className="text-sm text-center text-[#4A4440] hidden sm:block">{cat.sortOrder}</p>

            {/* In Nav */}
            <div className="hidden sm:flex justify-center">
              <span className={`inline-block w-2 h-2 rounded-full ${cat.showInNav ? "bg-emerald-500" : "bg-[#D1CBC3]"}`} title={cat.showInNav ? "Shown in nav" : "Hidden from nav"} />
            </div>

            {/* Product count */}
            <p className="text-sm text-center font-medium text-[#1C1C1C] hidden sm:block">
              {productCounts[cat.slug] ?? 0}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 sm:gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="text-xs tracking-widest uppercase text-[#B5903A] hover:underline font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.slug, cat.name)}
                className="text-xs tracking-widest uppercase text-red-500 hover:underline font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8C8680] mt-4">
        Categories appear in the storefront navigation. Changes are reflected immediately after saving.
      </p>
    </div>
  );
}
