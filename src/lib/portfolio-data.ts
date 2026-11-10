import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import {
  fallbackPortfolioData,
  fallbackProfile,
  fallbackSocialLinks,
  fallbackEducation,
  fallbackExperience,
  fallbackProjects,
  fallbackCertificates,
  fallbackSkillCategories,
  fallbackAchievements,
  fallbackSections,
} from "./fallback-data";
import type { PortfolioData } from "@/types/database";

/**
 * Fetches portfolio content from Supabase with safe fallback.
 *
 * Safeguard #7 Adherence:
 * Does NOT silently hide database errors. Any failed Supabase query is logged
 * with full details in the console, and development diagnostics are attached.
 */
export async function getPortfolioData(): Promise<PortfolioData & { errorDetails?: string[] }> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[PortfolioData] Supabase is not configured in .env.local. Serving static fallback data."
      );
    }
    return {
      ...fallbackPortfolioData,
      source: "fallback",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    console.error("[PortfolioData] Failed to initialize Supabase server client.");
    return {
      ...fallbackPortfolioData,
      source: "fallback",
      errorDetails: ["Failed to initialize Supabase server client"],
    };
  }

  const errors: string[] = [];

  try {
    const [
      profileRes,
      socialRes,
      educationRes,
      experienceRes,
      projectsRes,
      certificatesRes,
      skillsRes,
      achievementsRes,
      sectionsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*").limit(1).maybeSingle(),
      supabase.from("social_links").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("education").select("*").eq("is_visible", true).order("display_order", { ascending: true }),
      supabase.from("experiences").select("*").eq("is_visible", true).order("display_order", { ascending: true }),
      supabase.from("projects").select("*").eq("is_visible", true).order("display_order", { ascending: true }),
      supabase.from("certificates").select("*").eq("is_visible", true).order("display_order", { ascending: true }),
      supabase
        .from("skill_categories")
        .select("*, skills(*)")
        .eq("is_visible", true)
        .order("display_order", { ascending: true }),
      supabase.from("achievements").select("*").eq("is_visible", true).order("display_order", { ascending: true }),
      supabase.from("section_configs").select("*").order("display_order", { ascending: true }),
    ]);

    if (profileRes.error) {
      console.error("[PortfolioData] Error fetching 'profiles':", profileRes.error.message);
      errors.push(`profiles: ${profileRes.error.message}`);
    }
    if (socialRes.error) {
      console.error("[PortfolioData] Error fetching 'social_links':", socialRes.error.message);
      errors.push(`social_links: ${socialRes.error.message}`);
    }
    if (educationRes.error) {
      console.error("[PortfolioData] Error fetching 'education':", educationRes.error.message);
      errors.push(`education: ${educationRes.error.message}`);
    }
    if (experienceRes.error) {
      console.error("[PortfolioData] Error fetching 'experiences':", experienceRes.error.message);
      errors.push(`experiences: ${experienceRes.error.message}`);
    }
    if (projectsRes.error) {
      console.error("[PortfolioData] Error fetching 'projects':", projectsRes.error.message);
      errors.push(`projects: ${projectsRes.error.message}`);
    }
    if (certificatesRes.error) {
      console.error("[PortfolioData] Error fetching 'certificates':", certificatesRes.error.message);
      errors.push(`certificates: ${certificatesRes.error.message}`);
    }
    if (skillsRes.error) {
      console.error("[PortfolioData] Error fetching 'skill_categories':", skillsRes.error.message);
      errors.push(`skills: ${skillsRes.error.message}`);
    }
    if (achievementsRes.error) {
      console.error("[PortfolioData] Error fetching 'achievements':", achievementsRes.error.message);
      errors.push(`achievements: ${achievementsRes.error.message}`);
    }
    if (sectionsRes.error) {
      console.error("[PortfolioData] Error fetching 'section_configs':", sectionsRes.error.message);
      errors.push(`sections: ${sectionsRes.error.message}`);
    }

    const hasCriticalError = errors.length > 0;

    return {
      profile: profileRes.data || fallbackProfile,
      socialLinks: socialRes.data && socialRes.data.length > 0 ? socialRes.data : fallbackSocialLinks,
      education: educationRes.data && educationRes.data.length > 0 ? educationRes.data : fallbackEducation,
      experience: experienceRes.data && experienceRes.data.length > 0 ? experienceRes.data : fallbackExperience,
      projects: projectsRes.data && projectsRes.data.length > 0 ? projectsRes.data : fallbackProjects,
      certificates:
        certificatesRes.data && certificatesRes.data.length > 0 ? certificatesRes.data : fallbackCertificates,
      skills: skillsRes.data && skillsRes.data.length > 0 ? skillsRes.data : fallbackSkillCategories,
      achievements:
        achievementsRes.data && achievementsRes.data.length > 0 ? achievementsRes.data : fallbackAchievements,
      sections: sectionsRes.data && sectionsRes.data.length > 0 ? sectionsRes.data : fallbackSections,
      source: hasCriticalError ? "fallback" : "supabase",
      errorDetails: errors.length > 0 ? errors : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[PortfolioData] Unexpected error during Supabase query execution:", errorMsg);
    return {
      ...fallbackPortfolioData,
      source: "fallback",
      errorDetails: [errorMsg],
    };
  }
}
