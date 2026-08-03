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
  created_at?: string;
};

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
