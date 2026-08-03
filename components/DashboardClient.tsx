"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { mediaTag, type Profile, type Skill, type Work } from "@/lib/types";

const BUCKET = "portfolio-media";

const emptyForm = {
  id: "",
  title: "",
  category: "",
  year: "",
  description: "",
  image_url: "",
  video_url: "",
  pdf_url: "",
};

const emptySkillForm = { id: "", name: "", category: "", level: 3 };

export default function DashboardClient({
  initialWorks,
  initialSkills,
  initialProfile,
}: {
  initialWorks: Work[];
  initialSkills: Skill[];
  initialProfile: Profile;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<"karya" | "skill" | "profil">("karya");
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  function flashToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function uploadFile(file: File, prefix: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleWorkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      let pdfUrl = form.pdf_url;

      if (imageFile) imageUrl = await uploadFile(imageFile, "images");
      if (pdfFile) pdfUrl = await uploadFile(pdfFile, "pdfs");

      const newGalleryUrls: string[] = [];
      for (const f of galleryFiles) {
        newGalleryUrls.push(await uploadFile(f, "gallery"));
      }
      const galleryUrls = [...existingGallery, ...newGalleryUrls];

      const payload = {
        title: form.title,
        category: form.category,
        year: form.year,
        description: form.description,
        image_url: imageUrl,
        video_url: form.video_url,
        pdf_url: pdfUrl,
        gallery_urls: galleryUrls,
      };

      if (form.id) {
        const { data, error } = await supabase
          .from("works")
          .update(payload)
          .eq("id", form.id)
          .select()
          .single();
        if (error) throw error;
        setWorks((prev) => prev.map((w) => (w.id === form.id ? (data as Work) : w)));
        flashToast("Karya diperbarui");
      } else {
        const { data, error } = await supabase.from("works").insert(payload).select().single();
        if (error) throw error;
        setWorks((prev) => [data as Work, ...prev]);
        flashToast("Karya ditambahkan");
      }

      setForm(emptyForm);
      setImageFile(null);
      setPdfFile(null);
      setGalleryFiles([]);
      setExistingGallery([]);
      setFormKey((k) => k + 1); // memaksa input file kosong lagi
    } catch (err: any) {
      flashToast("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(w: Work) {
    setForm({
      id: w.id,
      title: w.title,
      category: w.category,
      year: w.year || "",
      description: w.description || "",
      image_url: w.image_url || "",
      video_url: w.video_url || "",
      pdf_url: w.pdf_url || "",
    });
    setImageFile(null);
    setPdfFile(null);
    setGalleryFiles([]);
    setExistingGallery(w.gallery_urls || []);
    setFormKey((k) => k + 1);
    window.scrollTo(0, 0);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus karya ini?")) return;
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) {
      flashToast("Gagal menghapus: " + error.message);
      return;
    }
    setWorks((prev) => prev.filter((w) => w.id !== id));
    flashToast("Karya dihapus");
  }

  async function handleSkillSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: skillForm.name, category: skillForm.category, level: skillForm.level };
      if (skillForm.id) {
        const { data, error } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", skillForm.id)
          .select()
          .single();
        if (error) throw error;
        setSkills((prev) => prev.map((s) => (s.id === skillForm.id ? (data as Skill) : s)));
        flashToast("Skill diperbarui");
      } else {
        const { data, error } = await supabase.from("skills").insert(payload).select().single();
        if (error) throw error;
        setSkills((prev) => [...prev, data as Skill]);
        flashToast("Skill ditambahkan");
      }
      setSkillForm(emptySkillForm);
    } catch (err: any) {
      flashToast("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditSkill(s: Skill) {
    setSkillForm({ id: s.id, name: s.name, category: s.category, level: s.level });
    window.scrollTo(0, 0);
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm("Hapus skill ini?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      flashToast("Gagal menghapus: " + error.message);
      return;
    }
    setSkills((prev) => prev.filter((s) => s.id !== id));
    flashToast("Skill dihapus");
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profile").update(profile).eq("id", 1);
    setSaving(false);
    if (error) {
      flashToast("Gagal menyimpan: " + error.message);
      return;
    }
    flashToast("Profil disimpan");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 py-4 bg-papersoft border-b-3 border-ink">
        <Link href="/" className="font-display font-black text-lg">
          ← Lihat Web Publik
        </Link>
        <button
          onClick={handleLogout}
          className="font-bold text-xs px-5 py-2.5 rounded-full border-3 border-ink bg-papersoft shadow-hard"
        >
          Keluar
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <h1 className="font-display font-black text-3xl mb-7">Dashboard Admin</h1>

        <div className="flex gap-2.5 mb-7">
          <button
            onClick={() => setTab("karya")}
            className={`font-mono text-xs font-bold px-4.5 py-2.5 rounded-full border-2.5 border-ink ${
              tab === "karya" ? "bg-ink text-papersoft" : "bg-papersoft"
            }`}
          >
            Karya
          </button>
          <button
            onClick={() => setTab("skill")}
            className={`font-mono text-xs font-bold px-4.5 py-2.5 rounded-full border-2.5 border-ink ${
              tab === "skill" ? "bg-ink text-papersoft" : "bg-papersoft"
            }`}
          >
            Skill
          </button>
          <button
            onClick={() => setTab("profil")}
            className={`font-mono text-xs font-bold px-4.5 py-2.5 rounded-full border-2.5 border-ink ${
              tab === "profil" ? "bg-ink text-papersoft" : "bg-papersoft"
            }`}
          >
            Profil
          </button>
        </div>

        {tab === "karya" ? (
          <>
            <form
              onSubmit={handleWorkSubmit}
              className="mb-9 p-6 border-3 border-ink rounded-3xl bg-papersoft shadow-hard"
            >
              <h3 className="font-bold text-lg mb-4">{form.id ? "Ubah Karya" : "Tambah Karya Baru"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Judul Karya *">
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
                </Field>
                <Field label="Kategori *">
                  <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" placeholder="mis. Video, Desain Grafis" />
                </Field>
                <Field label="Tahun">
                  <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input" placeholder="2025" />
                </Field>
                <Field label="URL Video (YouTube/Vimeo/Google Drive)">
                  <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="input" placeholder="https://youtube.com/watch?v=... atau link share Google Drive" />
                </Field>
                <Field label={form.id ? "Ganti Gambar Sampul (opsional)" : "Unggah Gambar Sampul *"}>
                  <input key={`img-${formKey}`} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="input" required={!form.id && !form.image_url} />
                  {form.image_url && !imageFile && <p className="text-xs mt-1 text-ink/50">Gambar saat ini tersimpan.</p>}
                </Field>
                <Field label="Unggah Dokumen PDF (opsional)">
                  <input key={`pdf-${formKey}`} type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="input" />
                  {form.pdf_url && !pdfFile && <p className="text-xs mt-1 text-ink/50">PDF saat ini tersimpan.</p>}
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Galeri Foto Tambahan (opsional, bisa pilih beberapa sekaligus)">
                    <input
                      key={`gallery-${formKey}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                      className="input"
                    />
                    {galleryFiles.length > 0 && (
                      <p className="text-xs mt-1 text-ink/50">{galleryFiles.length} foto baru siap diunggah.</p>
                    )}
                    {existingGallery.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {existingGallery.map((url, idx) => (
                          <div key={url} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border-2 border-ink" />
                            <button
                              type="button"
                              onClick={() => setExistingGallery((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-dangerc text-white text-xs font-bold border-2 border-ink"
                              title="Hapus dari galeri"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Deskripsi">
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input min-h-[80px]" />
                  </Field>
                </div>
              </div>
              <div className="flex gap-2.5 mt-2">
                <button type="submit" disabled={saving} className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-pink text-white shadow-hard disabled:opacity-60">
                  {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Karya"}
                </button>
                {form.id && (
                  <button type="button" onClick={() => { setForm(emptyForm); setImageFile(null); setPdfFile(null); setGalleryFiles([]); setExistingGallery([]); setFormKey((k) => k + 1); }} className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-papersoft">
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="border-3 border-ink rounded-3xl overflow-hidden bg-papersoft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F0EBDF] border-b-2.5 border-ink">
                    <th className="text-left p-3.5 font-mono text-xs">Judul</th>
                    <th className="text-left p-3.5 font-mono text-xs">Kategori</th>
                    <th className="text-left p-3.5 font-mono text-xs">Media</th>
                    <th className="p-3.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {works.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-8 text-ink/50">Belum ada karya.</td>
                    </tr>
                  )}
                  {works.map((w) => (
                    <tr key={w.id} className="border-b-2 border-dashed border-ink/30 last:border-none">
                      <td className="p-3.5">{w.title}</td>
                      <td className="p-3.5">{w.category}</td>
                      <td className="p-3.5 font-mono text-xs">{mediaTag(w)}</td>
                      <td className="p-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(w)} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-ink">Ubah</button>
                          <button onClick={() => handleDelete(w.id)} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-dangerc text-dangerc">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : tab === "skill" ? (
          <>
            <form
              onSubmit={handleSkillSubmit}
              className="mb-9 p-6 border-3 border-ink rounded-3xl bg-papersoft shadow-hard max-w-xl"
            >
              <h3 className="font-bold text-lg mb-4">{skillForm.id ? "Ubah Skill" : "Tambah Skill Baru"}</h3>
              <Field label="Nama Software / Keahlian *">
                <input
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="input"
                  placeholder="mis. Adobe Premiere Pro"
                />
              </Field>
              <Field label="Kategori *">
                <input
                  required
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="input"
                  placeholder="mis. Video Editing, Desain, Tools"
                />
              </Field>
              <Field label={`Level Kemahiran: ${skillForm.level} / 5`}>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="w-full"
                />
              </Field>
              <div className="flex gap-2.5 mt-2">
                <button type="submit" disabled={saving} className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-pink text-white shadow-hard disabled:opacity-60">
                  {saving ? "Menyimpan..." : skillForm.id ? "Simpan Perubahan" : "Tambah Skill"}
                </button>
                {skillForm.id && (
                  <button type="button" onClick={() => setSkillForm(emptySkillForm)} className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-papersoft">
                    Batal
                  </button>
                )}
              </div>
            </form>

            <div className="border-3 border-ink rounded-3xl overflow-hidden bg-papersoft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F0EBDF] border-b-2.5 border-ink">
                    <th className="text-left p-3.5 font-mono text-xs">Nama</th>
                    <th className="text-left p-3.5 font-mono text-xs">Kategori</th>
                    <th className="text-left p-3.5 font-mono text-xs">Level</th>
                    <th className="p-3.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {skills.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-8 text-ink/50">Belum ada skill.</td>
                    </tr>
                  )}
                  {skills.map((s) => (
                    <tr key={s.id} className="border-b-2 border-dashed border-ink/30 last:border-none">
                      <td className="p-3.5">{s.name}</td>
                      <td className="p-3.5">{s.category}</td>
                      <td className="p-3.5 font-mono text-xs">{s.level} / 5</td>
                      <td className="p-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => startEditSkill(s)} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-ink">Ubah</button>
                          <button onClick={() => handleDeleteSkill(s.id)} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-dangerc text-dangerc">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <form onSubmit={handleProfileSubmit} className="p-6 border-3 border-ink rounded-3xl bg-papersoft shadow-hard max-w-xl">
            <Field label="Nama">
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" required />
            </Field>
            <Field label="Peran / Jabatan">
              <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="input" required />
            </Field>
            <Field label="Tagline Singkat">
              <input value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} className="input" />
            </Field>
            <Field label="Tentang Saya">
              <textarea value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} className="input min-h-[80px]" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input" />
              </Field>
              <Field label="Telepon">
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input" />
              </Field>
              <Field label="Lokasi">
                <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="input" />
              </Field>
              <Field label="Status Ketersediaan">
                <input value={profile.availability} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} className="input" />
              </Field>
            </div>
            <button type="submit" disabled={saving} className="font-bold text-sm px-6 py-3 rounded-full border-3 border-ink bg-pink text-white shadow-hard disabled:opacity-60 mt-2">
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </form>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green text-white font-mono font-bold text-xs px-5 py-3 rounded-full border-3 border-ink shadow-hard">
          {toast}
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          background: #fffdf8;
          border: 2.5px solid #161217;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-[11px] font-bold text-ink/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
