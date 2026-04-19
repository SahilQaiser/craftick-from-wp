import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Admin — Craftick",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F5F4F2]" style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1C1C1C] text-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors">
            ← Craftick
          </Link>
          <p className="mt-2 text-base font-semibold tracking-wide">Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "⊞" },
            { href: "/admin/products", label: "Products", icon: "⊡" },
            { href: "/admin/products/new", label: "Add Product", icon: "+" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-base w-4 text-center shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
