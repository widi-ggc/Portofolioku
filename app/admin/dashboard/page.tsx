import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import type { Profile, Skill, Work } from "@/lib/types";

export const revalidate = 0;

export default async function DashboardPage() {
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
    <DashboardClient
      initialWorks={(works as Work[]) || []}
      initialSkills={(skills as Skill[]) || []}
      initialProfile={
        (profile as Profile) || {
          id: 1,
          name: "",
          role: "",
          tagline: "",
          about: "",
          email: "",
          phone: "",
          location: "",
          availability: "",
        }
      }
    />
  );
}
