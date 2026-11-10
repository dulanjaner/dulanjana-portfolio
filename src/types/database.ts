export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  professional_title: string;
  degree_subtitle: string;
  short_bio: string;
  about_markdown: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon_name: string;
  hover_color_class: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string | null;
  duration: string;
  logo_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface ExperienceItem {
  id: string;
  company_name: string;
  role_title: string;
  duration: string;
  description: string;
  logo_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tech_summary: string;
  short_description: string;
  full_description: string;
  icon: string;
  cover_image_url: string | null;
  challenges: string[];
  architecture: string;
  tags: string[];
  github_url: string;
  live_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  subtitle_desc: string;
  image_url: string;
  issuer?: string | null;
  credential_url?: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  display_order: number;
  is_visible: boolean;
  skills?: SkillItem[];
}

export interface SkillItem {
  id: string;
  category_id: string;
  name: string;
  display_order: number;
  is_visible: boolean;
  icon_name?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date_or_year: string;
  description?: string | null;
  badge_url?: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface SectionConfig {
  id: string;
  section_key: string;
  display_name: string;
  display_order: number;
  is_visible: boolean;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  inquiry: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface PortfolioData {
  profile: Profile;
  socialLinks: SocialLink[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  skills: SkillCategory[];
  achievements: AchievementItem[];
  sections: SectionConfig[];
  source: "supabase" | "fallback";
}
