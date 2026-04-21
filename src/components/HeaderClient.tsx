"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Category } from "@/lib/db";

const DEFAULT_ANNOUNCEMENT = "Free Shipping on Orders Above ₹5,000 · Guaranteed Authenticity";

type NavItem = {
  label: string;
  href: string;
  dropdown?: {
    links: { label: string; href: string }[];
    images: { src: string; alt: string; href: string }[];
  };
};

function buildNavItems(categories: Category[]): NavItem[] {
  const sorted = [...categories]
    .filter((c) => c.showInNav)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const categoryItems: NavItem[] = sorted.map((cat) => ({
    label: cat.name,
    href: `/shop?category=${cat.slug}`,
    dropdown: {
      links: [{ label: `All ${cat.name}`, href: `/shop?category=${cat.slug}` }],
      images: cat.image
        ? [{ src: cat.image, alt: cat.name, href: `/shop?category=${cat.slug}` }]
        : [],
    },
  }));

  return [
    ...categoryItems,
    { label: "All Products", href: "/shop" },
    { label: "Track Order", href: "/track" },
    { label: "About", href: "/about" },
  ];
}

export default function HeaderClient({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    fetch("/api/config/public")
      .then((res) => res.json() as Promise<{ announcement?: string }>)
      .then(({ announcement: text }) => {
        if (text !== undefined) setAnnouncement(text);
      })
      .catch(() => {});
  }, []);

  const navItems = buildNavItems(categories);
  const activeItem = navItems.find((i) => i.label === activeDropdown);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Announcement Bar ── */}
      {announcementVisible && announcement && (
        <div className="relative flex items-center justify-center px-4 py-2 bg-[#EDE8DF] overflow-hidden">
          <p className="animate-marquee-bounce text-[10px] tracking-[0.22em] uppercase font-medium text-center font-[family-name:var(--font-body)] text-[#4A4440]">
            <span className="text-[#B5903A] mr-1.5">✦</span>
            {announcement}
            <span className="text-[#B5903A] ml-1.5">✦</span>
          </p>
          <button
            onClick={() => setAnnouncementVisible(false)}
            aria-label="Dismiss announcement"
            className="absolute right-4 text-[#8C8680] hover:text-[#1C1C1C] transition-colors text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Logo Row ── */}
      <div className="bg-white border-b border-[#E8E3DC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative flex items-center justify-center h-16 md:h-20">

            {/* Mobile hamburger */}
            <button
              className="md:hidden absolute left-0 p-2 text-[#1C1C1C]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Centered Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Craftick — Handcrafted in Kashmir"
                width={160}
                height={100}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Right icons */}
            <div className="absolute right-0 flex items-center gap-1 md:gap-2">
              <Link href="/shop" aria-label="Search" className="p-2 text-[#1C1C1C] hover:text-[#B5903A] transition-colors">
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/contact" aria-label="Contact" className="hidden md:block p-2 text-[#1C1C1C] hover:text-[#B5903A] transition-colors">
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
              <Link href="/cart" aria-label="Cart" className="relative p-2 text-[#1C1C1C] hover:text-[#B5903A] transition-colors">
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-[#B5903A] text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1 font-[family-name:var(--font-body)]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Row + Mega Dropdown (desktop only) ── */}
      <div
        className="hidden md:block bg-white border-b border-[#E8E3DC] relative"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <ul className="flex items-center justify-center gap-7 lg:gap-10 h-11">
            {navItems.map((item) => (
              <li
                key={item.label}
                onMouseEnter={() => setActiveDropdown(item.dropdown ? item.label : null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase font-medium font-[family-name:var(--font-body)] transition-colors whitespace-nowrap ${
                    activeDropdown === item.label
                      ? "text-[#B5903A]"
                      : "text-[#1C1C1C] hover:text-[#B5903A]"
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mega dropdown panel */}
        {activeItem?.dropdown && activeItem.dropdown.links.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-b border-[#E8E3DC] shadow-md z-50"
            onMouseEnter={() => setActiveDropdown(activeItem.label)}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 flex gap-16">
              {/* Links */}
              <div className="min-w-[200px]">
                <ul className="flex flex-col gap-4">
                  {activeItem.dropdown.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setActiveDropdown(null)}
                        className="text-sm font-[family-name:var(--font-body)] text-[#1C1C1C] hover:text-[#B5903A] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Images */}
              {activeItem.dropdown.images.length > 0 && (
                <div className="flex gap-4">
                  {activeItem.dropdown.images.map((img) => (
                    <Link
                      key={img.src}
                      href={img.href}
                      onClick={() => setActiveDropdown(null)}
                      className="group relative overflow-hidden aspect-[3/4] w-[180px] shrink-0 bg-[#EDE8E1]"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        quality={60}
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="180px"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E3DC] bg-white animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto">
          <nav className="px-6 py-4 flex flex-col">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-[#E8E3DC]/60">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between py-4 text-sm tracking-[0.18em] uppercase text-[#1C1C1C] font-medium font-[family-name:var(--font-body)]"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pb-4 pl-3 flex flex-col gap-3">
                        {item.dropdown.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-sm text-[#6B6560] hover:text-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex py-4 text-sm tracking-[0.18em] uppercase text-[#1C1C1C] hover:text-[#B5903A] transition-colors font-medium font-[family-name:var(--font-body)]"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex pt-4 text-sm tracking-[0.18em] uppercase text-[#B5903A] font-medium font-[family-name:var(--font-body)]"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}

    </header>
  );
}
