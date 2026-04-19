"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Invalid credentials");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Craftick" width={100} height={60} className="h-10 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-[family-name:var(--font-heading)] text-[#1C1C1C] font-light">
            Admin Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E8E3DC] p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#B5903A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
