"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { label: "Pashmina Shawls", href: "/shop?category=pashmina-shawls" },
  { label: "Stoles & Scarves", href: "/shop?category=stoles-and-scarves" },
  { label: "Sarees", href: "/shop?category=sarees" },
  { label: "All Products", href: "/shop" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0]/95 backdrop-blur-sm border-b border-[#E8E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#1C1C1C]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Nav left */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-[family-name:var(--font-body)] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="Craftick — Handcrafted in Kashmir"
              width={120}
              height={72}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav right */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.slice(2, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-[family-name:var(--font-body)] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/shop"
              aria-label="Search"
              className="p-1.5 text-[#4A4440] hover:text-[#B5903A] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
            <Link
              href="/contact"
              aria-label="Contact"
              className="p-1.5 text-[#4A4440] hover:text-[#B5903A] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E3DC] bg-[#F8F5F0]">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium py-1"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
