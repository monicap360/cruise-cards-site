"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = params.get("from") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        setError("Incorrect PIN. Try again.");
        setPin("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center px-4">
      <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-10 w-full max-w-sm text-center">
        <Image
          src="/logo.png"
          alt="Cruises from Galveston"
          width={140}
          height={56}
          className="h-12 w-auto object-contain mx-auto mb-6"
        />
        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Access</h1>
        <p className="text-white/40 text-sm mb-8">Enter your PIN to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            autoFocus
            autoComplete="current-password"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-center text-2xl font-extrabold tracking-widest text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60"
          />

          {error && (
            <div className="bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!pin || loading}
            className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed font-semibold uppercase tracking-wider py-4 rounded-full text-lg transition-all"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>

        <p className="text-xs text-white/30 mt-6">
          Cruises from Galveston · Staff Only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
