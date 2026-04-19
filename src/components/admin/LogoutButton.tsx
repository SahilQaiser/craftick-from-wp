"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2.5 rounded text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
    >
      <span className="text-base w-4 text-center">⏏</span>
      Logout
    </button>
  );
}
