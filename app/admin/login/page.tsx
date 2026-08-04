"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau kata sandi salah.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="max-w-sm w-full border-card border-ink rounded-card p-9 bg-papersoft shadow-hard-lg">
        <h1 className="font-display font-black text-2xl mb-2">Masuk Admin</h1>
        <p className="font-mono text-xs text-ink/60 mb-6">
          Masuk pakai akun admin yang sudah dibuat di Supabase.
        </p>
        {error && <p className="text-dangerc text-xs font-mono font-bold mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-mono text-[11px] font-bold text-ink/60 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-ink rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="mb-5">
            <label className="block font-mono text-[11px] font-bold text-ink/60 mb-1.5">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-ink rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm px-6 py-3 rounded-full border-card border-ink bg-pink text-white shadow-hard disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
