export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  created_at?: string;
};

export type Work = {
  id: string;
  title: string;
  category: string;
  year: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  pdf_url: string | null;
  gallery_urls: string[];
  created_at?: string;
};

export const THEME_OPTIONS = [
  { id: "riso", label: "Riso Cerah — Pink, Biru, Kuning" },
  { id: "ocean", label: "Ocean Kalem — Teal & Biru Laut" },
  { id: "sunset", label: "Sunset Hangat — Koral, Ungu, Emas" },
  { id: "forest", label: "Forest Earthy — Hijau & Coklat" },
  { id: "mono", label: "Monokrom Minimalis — Hitam & Abu" },
] as const;

export type Profile = {
  id: number;
  name: string;
  role: string;
  tagline: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  theme: string;
};

export function getEmbedUrl(url: string | null): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    if (u.hostname.includes("drive.google.com")) {
      // format link berbagi Google Drive: /file/d/FILE_ID/view
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch {
    // biarkan url apa adanya kalau gagal diparse
  }
  return url;
}

export function mediaTag(work: Work): string {
  if (work.video_url) return "VIDEO";
  if (work.pdf_url) return "PDF";
  return "FOTO";
}
