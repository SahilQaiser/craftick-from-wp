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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Accent Bar */}
      <div className="h-[5px] bg-[#800020] w-full" />

      {/* Main Header Content */}
      <div className="bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E8E3DC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-24">
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
                    strokeWidth={1.2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-between">
              {/* Left Nav */}
              <nav className="flex items-center gap-10 lg:gap-14 flex-1 justify-end pr-16 lg:pr-24">
                {navLinks.slice(0, 2).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11px] tracking-[0.25em] uppercase text-[#1C1C1C] hover:text-[#B5903A] transition-colors font-[family-name:var(--font-body)] font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Centered Logo */}
              <Link href="/" className="shrink-0 relative z-10">
                <Image
                  src="/logo.png"
                  alt="Craftick — Handcrafted in Kashmir"
                  width={160}
                  height={100}
                  className="h-14 md:h-16 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Right Nav */}
              <nav className="flex items-center gap-10 lg:gap-14 flex-1 pl-16 lg:pl-24">
                {navLinks.slice(2, 4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11px] tracking-[0.25em] uppercase text-[#1C1C1C] hover:text-[#B5903A] transition-colors font-[family-name:var(--font-body)] font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Icons - visible on all screens */}
            <div className="flex items-center gap-2 md:gap-5 min-w-[80px] md:min-w-[120px] justify-end">
              <Link
                href="/shop"
                aria-label="Search"
                className="p-2 text-[#1C1C1C] hover:text-[#B5903A] transition-colors"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
              <Link
                href="/contact"
                aria-label="Contact"
                className="p-2 text-[#1C1C1C] hover:text-[#B5903A] transition-colors"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E3DC] bg-[#F8F5F0] animate-in slide-in-from-top duration-300">
          <nav className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.2em] uppercase text-[#1C1C1C] hover:text-[#B5903A] transition-colors font-medium border-b border-[#E8E3DC]/50 pb-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.2em] uppercase text-[#B5903A] transition-colors font-medium pb-2"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

