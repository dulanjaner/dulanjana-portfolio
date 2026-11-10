import type {
  Profile,
  SocialLink,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  CertificateItem,
  SkillCategory,
  AchievementItem,
  SectionConfig,
  PortfolioData,
} from "@/types/database";

export const fallbackProfile: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "DULANJANA KUMARASINGHE",
  first_name: "DULANJANA",
  last_name: "KUMARASINGHE",
  professional_title: "IT UNDERGRADUATE",
  degree_subtitle: "BSc (Hons) Information Technology",
  short_bio:
    "I am a 3rd-year BSc (Hons) Information Technology undergraduate at General Sir John Kotelawala Defence University, with a strong interest in web and application development. I have a solid foundation in frontend development using HTML and CSS and I'm actively expanding my skills in modern web technologies and frameworks. I'm passionate about building clean, responsive and user-friendly interfaces while ensuring performance and usability.",
  about_markdown:
    "Passionate IT undergraduate specializing in modern web architecture, frontend interfaces, and scalable database systems. Constantly exploring emerging technologies and eager to contribute to impactful real-world software engineering projects.",
  avatar_url: "/resources/me.jpg",
  resume_url: null,
};

export const fallbackSocialLinks: SocialLink[] = [
  {
    id: "00000000-0000-0000-0000-000000000011",
    platform: "email",
    label: "Email",
    url: "mailto:dulanjanakavinda252@gmail.com",
    icon_name: "FaEnvelope",
    hover_color_class: "hover:text-sky-400",
    display_order: 1,
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/dulanjaner",
    icon_name: "FaLinkedin",
    hover_color_class: "hover:text-blue-400",
    display_order: 2,
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    platform: "github",
    label: "GitHub",
    url: "https://github.com/dulanjaner",
    icon_name: "FaGithub",
    hover_color_class: "hover:text-purple-400",
    display_order: 3,
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000015",
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/dulanjaner/",
    icon_name: "FaInstagram",
    hover_color_class: "hover:text-pink-400",
    display_order: 4,
    is_active: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000016",
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/dulanjaner",
    icon_name: "FaFacebook",
    hover_color_class: "hover:text-blue-500",
    display_order: 5,
    is_active: true,
  },
];

export const fallbackEducation: EducationItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000021",
    institution: "General Sir John Kotelawala Defence University",
    degree: "BSc (Hons) Information Technology",
    duration: "2024 - 2028",
    logo_url: "/resources/KDU LOGO ORIGINAL 3x2.png",
    display_order: 1,
    is_visible: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    institution: "St. Thomas' College, Matale",
    degree: "Commerce Stream",
    duration: "2013 - 2022",
    logo_url: "/resources/St_Thomas'_College_Matale_Crest.png",
    display_order: 2,
    is_visible: true,
  },
];

export const fallbackExperience: ExperienceItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000031",
    company_name: "Bank of Ceylon",
    role_title: "Internship Trainee",
    duration: "June 2023 - January 2024 (7 months)",
    description:
      "Gained hands-on experience in banking operations during my internship at one of Sri Lanka's leading financial institutions.",
    logo_url: "/resources/Bank of Ceylon.png",
    display_order: 1,
    is_visible: true,
  },
];

export const fallbackProjects: ProjectItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000041",
    title: "Hotel Reservation System",
    tech_summary: "Java • Android • SQLite",
    short_description:
      "Mobile application for hotel room bookings with real-time availability and payment integration.",
    icon: "🏨",
    cover_image_url: null,
    full_description:
      "A comprehensive native Android application designed to streamline hotel room reservations for guests and administrators. Features include real-time availability checks, room filtering, automated total cost calculation, and structured local database persistence.",
    challenges: [
      "Enforcing atomic database operations in SQLite to prevent concurrent double-booking conflicts.",
      "Designing custom responsive Android layouts with dynamic date pickers and image preview carousels.",
      "Optimizing memory allocation during multi-image loading to ensure smooth 60fps scrolling.",
    ],
    architecture:
      "Structured using native Android SDK (MVP design pattern), utilizing SQLite OpenHelper for local persistence, custom adapter views, and async tasks for non-blocking UI rendering.",
    tags: ["Java", "Android SDK", "SQLite", "Mobile App", "UI/UX"],
    github_url: "https://github.com/DulanjanaKumarasinghe",
    live_url: "#",
    display_order: 1,
    is_visible: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000042",
    title: "Network Lab Setup",
    tech_summary: "Cisco • Routing • Switching",
    short_description:
      "Configured and tested enterprise-level networking infrastructure with CCNA concepts.",
    icon: "🛜",
    cover_image_url: null,
    full_description:
      "An enterprise-grade laboratory network topology designed and configured using Cisco IOS. Implements VLAN segmentation, inter-VLAN routing, multi-area OSPF dynamic routing, Access Control Lists (ACLs), and NAT translation.",
    challenges: [
      "Configuring inter-VLAN routing with Router-on-a-Stick while maintaining strict security policies.",
      "Diagnosing routing loop hazards and tuning Spanning Tree Protocol (STP) priority parameters across switches.",
      "Implementing dynamic NAT with ACL filtering for safe external Internet traffic translation.",
    ],
    architecture:
      "Hierarchical Cisco networking architecture spanning Core, Distribution, and Access layers configured in Packet Tracer & GNS3 environments.",
    tags: ["Cisco IOS", "CCNA", "Subnetting", "VLANs", "OSPF", "Cybersecurity"],
    github_url: "https://github.com/DulanjanaKumarasinghe",
    live_url: "#",
    display_order: 2,
    is_visible: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000043",
    title: "Log File Archiver",
    tech_summary: "Java • File Handling",
    short_description:
      "Utility application for efficient log file management and archiving with compression.",
    icon: "📁",
    cover_image_url: null,
    full_description:
      "A high-performance system utility developed in Java to automatically parse, categorize, compress, and archive server log files. Reduces log storage footprints while maintaining quick keyword lookup capabilities.",
    challenges: [
      "Streaming and parsing large system log files efficiently without exhausting memory.",
      "Integrating multi-threaded GZIP compression algorithms achieving over 70% compression efficiency.",
      "Building robust regex parsers to separate info, warning, and critical error events.",
    ],
    architecture:
      "Developed using Java 17, Java NIO File I/O channels, Java Concurrency thread pools for asynchronous file compression, and custom regex stream filters.",
    tags: ["Java", "File I/O", "Multithreading", "GZIP", "Systems"],
    github_url: "https://github.com/DulanjanaKumarasinghe",
    live_url: "#",
    display_order: 3,
    is_visible: true,
  },
];

export const fallbackCertificates: CertificateItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000051",
    title: "CCNA",
    subtitle_desc: "Introduction to Networks",
    image_url: "/resources/CCNA Introduction to Networks Certificate_page-0001.jpg",
    issuer: "Cisco Networking Academy",
    credential_url: null,
    display_order: 1,
    is_visible: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000052",
    title: "Cybersecurity",
    subtitle_desc: "Introduction to Cybersecurity",
    image_url:
      "/resources/cybersecurity-certificate.jpg",
    issuer: "Cisco Networking Academy",
    credential_url: null,
    display_order: 2,
    is_visible: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000053",
    title: "Web Design",
    subtitle_desc: "Web Design for Beginners",
    image_url: "/resources/Web_Design_for_Beginners_E-Certificate_page-0001.jpg",
    issuer: "University of Moratuwa",
    credential_url: null,
    display_order: 3,
    is_visible: true,
  },
];

export const fallbackSkillCategories: SkillCategory[] = [
  {
    id: "00000000-0000-0000-0000-000000000061",
    name: "Web Development",
    display_order: 1,
    is_visible: true,
    skills: [
      { id: "00000000-0000-0000-0000-000000000071", category_id: "00000000-0000-0000-0000-000000000061", name: "HTML", display_order: 1, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000072", category_id: "00000000-0000-0000-0000-000000000061", name: "CSS", display_order: 2, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000073", category_id: "00000000-0000-0000-0000-000000000061", name: "JavaScript", display_order: 3, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000074", category_id: "00000000-0000-0000-0000-000000000061", name: "React", display_order: 4, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000075", category_id: "00000000-0000-0000-0000-000000000061", name: "Next.js", display_order: 5, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000076", category_id: "00000000-0000-0000-0000-000000000061", name: "Responsive Design", display_order: 6, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000077", category_id: "00000000-0000-0000-0000-000000000061", name: "Web Design", display_order: 7, is_visible: true },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000062",
    name: "Mobile Development",
    display_order: 2,
    is_visible: true,
    skills: [
      { id: "00000000-0000-0000-0000-000000000078", category_id: "00000000-0000-0000-0000-000000000062", name: "React Native", display_order: 1, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000079", category_id: "00000000-0000-0000-0000-000000000062", name: "Android", display_order: 2, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000080", category_id: "00000000-0000-0000-0000-000000000062", name: "Mobile Applications", display_order: 3, is_visible: true },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000063",
    name: "Backend & Databases",
    display_order: 3,
    is_visible: true,
    skills: [
      { id: "00000000-0000-0000-0000-000000000081", category_id: "00000000-0000-0000-0000-000000000063", name: "Java", display_order: 1, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000082", category_id: "00000000-0000-0000-0000-000000000063", name: "MySQL", display_order: 2, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000083", category_id: "00000000-0000-0000-0000-000000000063", name: "Firebase", display_order: 3, is_visible: true },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000064",
    name: "Networking & Security",
    display_order: 4,
    is_visible: true,
    skills: [
      { id: "00000000-0000-0000-0000-000000000084", category_id: "00000000-0000-0000-0000-000000000064", name: "Subnetting", display_order: 1, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000085", category_id: "00000000-0000-0000-0000-000000000064", name: "CCNA", display_order: 2, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000086", category_id: "00000000-0000-0000-0000-000000000064", name: "Cybersecurity", display_order: 3, is_visible: true },
      { id: "00000000-0000-0000-0000-000000000087", category_id: "00000000-0000-0000-0000-000000000064", name: "System Architecture", display_order: 4, is_visible: true },
    ],
  },
];

export const fallbackAchievements: AchievementItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000091",
    title: "Dean's List / Academic Commendation",
    organization: "General Sir John Kotelawala Defence University",
    date_or_year: "2024",
    description: "Recognized for academic excellence in BSc (Hons) Information Technology.",
    badge_url: null,
    display_order: 1,
    is_visible: true,
  },
];

export const fallbackSections: SectionConfig[] = [
  { id: "00000000-0000-0000-0000-000000000101", section_key: "hero", display_name: "Hero / Introduction", display_order: 1, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000102", section_key: "about", display_name: "About Me", display_order: 2, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000103", section_key: "skills", display_name: "Technical Skills", display_order: 3, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000104", section_key: "projects", display_name: "Featured Projects", display_order: 4, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000105", section_key: "experience", display_name: "Experience & Certifications", display_order: 5, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000106", section_key: "education", display_name: "Education", display_order: 6, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000107", section_key: "achievements", display_name: "Achievements & Honors", display_order: 7, is_visible: true },
  { id: "00000000-0000-0000-0000-000000000108", section_key: "contact", display_name: "Contact", display_order: 8, is_visible: true },
];

export const fallbackPortfolioData: PortfolioData = {
  profile: fallbackProfile,
  socialLinks: fallbackSocialLinks,
  education: fallbackEducation,
  experience: fallbackExperience,
  projects: fallbackProjects,
  certificates: fallbackCertificates,
  skills: fallbackSkillCategories,
  achievements: fallbackAchievements,
  sections: fallbackSections,
  source: "fallback",
};
