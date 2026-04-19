---
name: Craftick website project
description: Next.js site for Craftick - Kashmiri handcraft brand. Built from WP export with 19 products.
type: project
---

Craftick is a Kashmiri handcraft e-commerce website rebuilt from WordPress in Next.js 16 / Tailwind CSS 4. Deployed to Cloudflare Workers via @opennextjs/cloudflare.

**Why:** Migrating from WordPress to a modern static/serverless stack on Cloudflare.

**How to apply:** The site is largely static (SSG). Products are in `src/lib/products.ts` as hardcoded data — no CMS or database. Images are in `public/images/products/`. If more products are added, update the products array and copy images.

**Source material:**
- WordPress HTML export: `../Craftick – Handcrafted in Kashmir.html`
- WordPress SQL/uploads export: `../craftick-in-20260419-085624-g6gr3r41qlk0/`
- Design inspiration: `../home1.png` (WeaverStory — elegant fashion store)

**Structure:**
- `src/lib/products.ts` — 19 products, 3 categories (pashmina-shawls, stoles-and-scarves, sarees)
- `src/components/Header.tsx` — sticky nav with centered logo
- `src/components/Footer.tsx` — dark footer
- `src/components/ProductCard.tsx` — product grid card
- `src/app/page.tsx` — homepage with hero, categories, featured products, craft stories
- `src/app/shop/page.tsx` — shop with category filter (uses searchParams)
- `src/app/shop/[slug]/page.tsx` — product detail (SSG with generateStaticParams)
- `src/app/about/page.tsx`, `contact/page.tsx`, `privacy-policy/page.tsx`

**Design:**
- Fonts: Cormorant Garamond (headings, serif), Jost (body, sans)
- Colors: cream bg #F8F5F0, dark #1C1C1C, gold accent #B5903A
- Inspired by WeaverStory — minimal, elegant luxury fashion store
