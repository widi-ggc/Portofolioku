import { createClient } from "@/lib/supabase/server";
import PortfolioLanding from "@/components/PortfolioLanding";
import type { Profile, Skill, Work } from "@/lib/types";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();

  const { data: works } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true });

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <PortfolioLanding
      works={(works as Work[]) || []}
      skills={(skills as Skill[]) || []}
      profile={
        (profile as Profile) || {
          id: 1,
          name: "Nama Anda",
          role: "Peran / Jabatan",
          tagline: "",
          about: "",
          email: "",
          phone: "",
          location: "",
          availability: "",
          theme: "riso",
        }
      }
    />
  );
}
