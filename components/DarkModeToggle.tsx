"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem("portfolio-mode") : null;
    let initial: "light" | "dark" = "light";
    if (saved === "dark" || saved === "light") {
      initial = saved;
    } else if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initial = "dark";
    }
    setMode(initial);
    document.documentElement.dataset.mode = initial;
  }, []);

  function toggle() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.dataset.mode = next;
    localStorage.setItem("portfolio-mode", next);
  }

  // Hindari flicker sebelum preferensi tersimpan terbaca
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label="Ganti mode gelap/terang"
      className="w-9 h-9 flex items-center justify-center rounded-full border-3 border-ink bg-papersoft shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg transition text-sm"
      title={mode === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
    >
      {mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
