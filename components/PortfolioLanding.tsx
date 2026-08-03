"use client";

import { useState } from "react";
import { getEmbedUrl, mediaTag, type Profile, type Skill, type Work } from "@/lib/types";

export default function PortfolioLanding({
  works,
  skills,
  profile,
}: {
  works: Work[];
  skills: Skill[];
  profile: Profile;
}) {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [modalWork, setModalWork] = useState<Work | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  function openModal(w: Work) {
    setModalWork(w);
    setActiveImageIndex(0);
  }

  const categories = ["Semua", ...Array.from(new Set(works.map((w) => w.category)))];
  const filtered =
    activeFilter === "Semua" ? works : works.filter((w) => w.category === activeFilter);

  const skillGroups = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const firstName = profile.name.split(" ")[0];
  const restName = profile.name.split(" ").slice(1).join(" ");

  return (
    <div className="min-h-screen bg-paper text-ink relative overflow-x-hidden">
      {/* NAV */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 py-4 bg-papersoft border-b-3 border-ink">
        <div className="font-display font-black text-xl flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink border-2 border-ink" />
          {profile.name}
        </div>
        <div className="flex items-center gap-5">
          <a href="#karya" className="text-sm font-semibold hover:text-pink">Karya</a>
          <a href="#skill" className="text-sm font-semibold hover:text-pink">Keahlian</a>
          <a href="#tentang" className="text-sm font-semibold hover:text-pink">Tentang</a>
          <a href="#kontak" className="text-sm font-semibold hover:text-pink">Kontak</a>
        </div>
      </div>

      {/* HERO */}
      <div className="relative max-w-4xl mx-auto px-6 md:px-8 pt-20 pb-16">
        <div
          className="dots-bg absolute rounded-3xl"
          style={{ width: 300, height: 300, right: 0, top: 10 }}
        />
        <div
          className="absolute rounded-full bg-yellow opacity-50"
          style={{ width: 200, height: 200, right: -50, top: 60 }}
        />
        <div className="relative">
          <div className="flex gap-3 flex-wrap mb-6">
            <span className="sticker inline-block bg-yellow border-3 border-ink rounded-full px-4 py-1.5 font-mono text-xs font-bold shadow-hard">
              ✦ {profile.availability || "Terbuka untuk proyek baru"}
            </span>
            {profile.location && (
              <span className="inline-block rotate-2 bg-green text-white border-3 border-ink rounded-full px-4 py-1.5 font-mono text-xs font-bold shadow-hard">
                📍 {profile.location}
              </span>
            )}
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] mb-5">
            {firstName} <span className="text-pink">{restName}</span>
          </h1>
          <p className="text-lg text-ink/70 font-medium max-w-lg mb-7">
            {profile.role} — {profile.tagline}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#karya"
              className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-pink text-white shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg transition"
            >
              Lihat Karya ↓
            </a>
            <a
              href="#kontak"
              className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-papersoft shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg transition"
            >
              Hubungi Saya
            </a>
          </div>
        </div>
      </div>

      {/* KARYA */}
      <div id="karya" className="max-w-4xl mx-auto px-6 md:px-8 py-14">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
          <h2 className="font-display font-black text-3xl">Karya Terpilih</h2>
          <span className="bg-ink text-papersoft text-xs px-3 py-1.5 rounded-full">
            {filtered.length} ITEM
          </span>
        </div>
        <div className="flex gap-2.5 flex-wrap mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`font-bold text-xs px-4 py-2 rounded-full border-3 border-ink transition ${
                activeFilter === c ? "bg-ink text-papersoft" : "bg-papersoft text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="border-3 border-dashed border-ink rounded-3xl p-14 text-center font-mono text-sm text-ink/60 bg-papersoft">
            Belum ada karya pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => openModal(w)}
                className="card-tilt relative text-left bg-papersoft border-3 border-ink rounded-3xl shadow-hard hover:shadow-hard-lg transition overflow-visible"
              >
                <span className="absolute -top-3 right-4 z-10 rotate-6 bg-pink text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-ink">
                  {mediaTag(w)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.image_url || "https://placehold.co/600x450/17151d/ffffff?text=Tanpa+Gambar"}
                  alt={w.title}
                  className="w-full aspect-[4/3] object-cover rounded-t-[20px] border-b-3 border-ink"
                />
                <div className="p-4">
                  <div className="font-mono text-[10px] font-bold text-blue mb-1.5">
                    {w.category} · {w.year}
                  </div>
                  <h3 className="font-display font-black text-lg mb-1.5">{w.title}</h3>
                  <p className="text-sm text-ink/60 line-clamp-2">{w.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KEAHLIAN */}
      {skills.length > 0 && (
        <div id="skill" className="max-w-4xl mx-auto px-6 md:px-8 py-14">
          <h2 className="font-display font-black text-3xl mb-8">Keahlian & Software</h2>
          <div className="space-y-8">
            {Object.entries(skillGroups).map(([category, items]) => (
              <div key={category}>
                <p className="font-mono text-xs font-bold text-blue mb-3">{category.toUpperCase()}</p>
                <div className="flex flex-wrap gap-3">
                  {items.map((s, i) => (
                    <div
                      key={s.id}
                      className={`flex items-center gap-2.5 border-3 border-ink rounded-full pl-4 pr-3 py-2 bg-papersoft shadow-hard ${
                        i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : "rotate-0"
                      }`}
                    >
                      <span className="font-bold text-sm">{s.name}</span>
                      <span className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={`w-1.5 h-1.5 rounded-full ${n <= s.level ? "bg-pink" : "bg-ink/15"}`}
                          />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TENTANG */}
      <div id="tentang" className="max-w-4xl mx-auto px-6 md:px-8 py-14">
        <h2 className="font-display font-black text-3xl mb-7">Tentang</h2>
        <div className="flex gap-10 flex-wrap items-start">
          <p className="flex-1 min-w-[260px] text-base text-ink/80 font-medium">{profile.about}</p>
          <div className="w-full sm:w-64 border-3 border-ink rounded-3xl p-5 bg-papersoft shadow-hard">
            <MetaRow label="Peran" value={profile.role} />
            <MetaRow label="Lokasi" value={profile.location} />
            <MetaRow label="Email" value={profile.email} />
            <MetaRow label="Telepon" value={profile.phone} last />
          </div>
        </div>
      </div>

      {/* KONTAK */}
      <div id="kontak" className="max-w-4xl mx-auto px-6 md:px-8 py-14">
        <h2 className="font-display font-black text-3xl mb-5">Kontak</h2>
        <p className="text-base text-ink/70 mb-5">
          Tertarik bekerja sama? Kirim pesan langsung lewat email di bawah ini.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="inline-block font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-pink text-white shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg transition"
        >
          Kirim Email ke Saya
        </a>
      </div>

      <footer className="border-t-3 border-ink text-center py-10 font-mono text-xs text-ink/60 bg-papersoft">
        © {new Date().getFullYear()} {profile.name} — Dibuat dengan Next.js & Supabase.
      </footer>

      {/* MODAL */}
      {modalWork && (
        <div
          className="fixed inset-0 z-[100] bg-ink/75 flex items-center justify-center p-6"
          onClick={() => setModalWork(null)}
        >
          <div
            className="bg-papersoft border-3 border-ink rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto relative shadow-hard-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalWork(null)}
              className="absolute top-3.5 right-3.5 z-10 bg-yellow border-3 border-ink w-9 h-9 rounded-full font-bold"
            >
              ✕
            </button>
            {modalWork.video_url ? (
              <iframe
                src={getEmbedUrl(modalWork.video_url)}
                className="w-full aspect-video rounded-t-[21px]"
                allowFullScreen
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  [modalWork.image_url, ...(modalWork.gallery_urls || [])][activeImageIndex] ||
                  "https://placehold.co/800x450/17151d/ffffff?text=Tanpa+Gambar"
                }
                alt={modalWork.title}
                className="w-full max-h-[420px] object-cover rounded-t-[21px]"
              />
            )}
            {[modalWork.image_url, ...(modalWork.gallery_urls || [])].filter(Boolean).length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-7 pt-4">
                {[modalWork.image_url, ...(modalWork.gallery_urls || [])]
                  .filter(Boolean)
                  .map((url, idx) =>
                    modalWork.video_url ? (
                      <a key={idx} href={url as string} target="_blank" rel="noopener">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url as string}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border-2 border-ink flex-shrink-0"
                        />
                      </a>
                    ) : (
                      <button key={idx} onClick={() => setActiveImageIndex(idx)} type="button">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url as string}
                          alt=""
                          className={`w-16 h-16 object-cover rounded-lg border-2 flex-shrink-0 ${
                            idx === activeImageIndex ? "border-pink" : "border-ink"
                          }`}
                        />
                      </button>
                    )
                  )}
              </div>
            )}
            <div className="p-7">
              <span className="inline-block font-mono text-[11px] font-bold text-white bg-blue px-3 py-1.5 rounded-full mb-3">
                {modalWork.category} · {modalWork.year}
              </span>
              <h3 className="font-display font-black text-2xl mb-3">{modalWork.title}</h3>
              <p className="text-ink/70 text-sm mb-5">{modalWork.description}</p>
              <div className="flex gap-2.5 flex-wrap">
                {modalWork.pdf_url && (
                  <a
                    href={modalWork.pdf_url}
                    target="_blank"
                    rel="noopener"
                    className="font-bold text-xs px-5 py-2.5 rounded-full border-3 border-ink bg-papersoft shadow-hard"
                  >
                    Buka Dokumen PDF
                  </a>
                )}
                {modalWork.video_url && (
                  <a
                    href={modalWork.video_url}
                    target="_blank"
                    rel="noopener"
                    className="font-bold text-xs px-5 py-2.5 rounded-full border-3 border-ink bg-papersoft shadow-hard"
                  >
                    Tonton di Sumber Asli
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 py-2.5 text-xs ${last ? "" : "border-b-2 border-dashed border-ink/30"}`}>
      <span className="font-mono font-bold text-ink/50">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
