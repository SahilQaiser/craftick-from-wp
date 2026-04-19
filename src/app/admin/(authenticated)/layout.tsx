import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Craftick",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen md:flex bg-[#F5F4F2]"
      style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
    >
      <AdminSidebar />
      {/* pt-14 on mobile accounts for the fixed hamburger button */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}
