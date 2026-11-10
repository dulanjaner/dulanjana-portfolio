-- ==============================================================================
-- DULANJANA PORTFOLIO - SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- Idempotent script: Safe to rerun without data loss or duplicate errors.
--
-- Instructions:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard).
-- 2. Select your project and navigate to "SQL Editor".
-- 3. Paste this entire script into the query editor and click "Run".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. ADMIN AUTHORIZATION & SECURITY FUNCTIONS
-- ------------------------------------------------------------------------------
-- Table storing explicitly authorized administrator accounts.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current requester is an authorized administrator.
-- Returns true ONLY if the current authenticated user exists in public.admin_users.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically assign admin privileges when the designated admin email signs up.
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Strict safeguard: Only the authorized email receives admin privileges
    IF NEW.email = 'dulanjanakavinda252@gmail.com' THEN
        INSERT INTO public.admin_users (user_id, email)
        VALUES (NEW.id, NEW.email)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Policy on admin_users table
DROP POLICY IF EXISTS "Admin can view admin_users" ON public.admin_users;
CREATE POLICY "Admin can view admin_users"
    ON public.admin_users FOR SELECT
    USING (public.is_admin() OR auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. SECTION CONFIGURATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.section_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.section_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view section configs" ON public.section_configs;
CREATE POLICY "Public can view section configs"
    ON public.section_configs FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin full control on section configs" ON public.section_configs;
CREATE POLICY "Admin full control on section configs"
    ON public.section_configs FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. PROFILE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    professional_title TEXT NOT NULL,
    degree_subtitle TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    about_markdown TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile" ON public.profiles;
CREATE POLICY "Public can view profile"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin full control on profile" ON public.profiles;
CREATE POLICY "Admin full control on profile"
    ON public.profiles FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. SOCIAL LINKS & CONTACT METHODS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    hover_color_class TEXT DEFAULT 'hover:text-sky-400',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active social links" ON public.social_links;
CREATE POLICY "Public can view active social links"
    ON public.social_links FOR SELECT
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on social links" ON public.social_links;
CREATE POLICY "Admin full control on social links"
    ON public.social_links FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. EDUCATION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    duration TEXT NOT NULL,
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible education" ON public.education;
CREATE POLICY "Public can view visible education"
    ON public.education FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on education" ON public.education;
CREATE POLICY "Admin full control on education"
    ON public.education FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible experiences" ON public.experiences;
CREATE POLICY "Public can view visible experiences"
    ON public.experiences FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on experiences" ON public.experiences;
CREATE POLICY "Admin full control on experiences"
    ON public.experiences FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tech_summary TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon TEXT DEFAULT '🚀',
    cover_image_url TEXT,
    challenges TEXT[] NOT NULL DEFAULT '{}',
    architecture TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT NOT NULL,
    live_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible projects" ON public.projects;
CREATE POLICY "Public can view visible projects"
    ON public.projects FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on projects" ON public.projects;
CREATE POLICY "Admin full control on projects"
    ON public.projects FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. CERTIFICATES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle_desc TEXT NOT NULL,
    image_url TEXT NOT NULL,
    issuer TEXT,
    credential_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible certificates" ON public.certificates;
CREATE POLICY "Public can view visible certificates"
    ON public.certificates FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on certificates" ON public.certificates;
CREATE POLICY "Admin full control on certificates"
    ON public.certificates FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. SKILL CATEGORIES & SKILLS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view skill categories" ON public.skill_categories;
CREATE POLICY "Public can view skill categories"
    ON public.skill_categories FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on skill categories" ON public.skill_categories;
CREATE POLICY "Admin full control on skill categories"
    ON public.skill_categories FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view skills" ON public.skills;
CREATE POLICY "Public can view skills"
    ON public.skills FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on skills" ON public.skills;
CREATE POLICY "Admin full control on skills"
    ON public.skills FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. ACHIEVEMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    date_or_year TEXT NOT NULL,
    description TEXT,
    badge_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view achievements" ON public.achievements;
CREATE POLICY "Public can view achievements"
    ON public.achievements FOR SELECT
    USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin full control on achievements" ON public.achievements;
CREATE POLICY "Admin full control on achievements"
    ON public.achievements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. CONTACT FORM MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    inquiry TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message
DROP POLICY IF EXISTS "Anyone can insert contact message" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

-- Only authorized admin can view, update, or delete messages
DROP POLICY IF EXISTS "Admin can read contact messages" ON public.contact_messages;
CREATE POLICY "Admin can read contact messages"
    ON public.contact_messages FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update contact messages" ON public.contact_messages;
CREATE POLICY "Admin can update contact messages"
    ON public.contact_messages FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admin can delete contact messages"
    ON public.contact_messages FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. STORAGE BUCKET & STORAGE RLS POLICIES
-- ------------------------------------------------------------------------------
-- Create bucket for portfolio media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to portfolio media
DROP POLICY IF EXISTS "Public can view portfolio media" ON storage.objects;
CREATE POLICY "Public can view portfolio media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- Restrict uploads, updates and deletions strictly to the authorized administrator
DROP POLICY IF EXISTS "Admin can insert portfolio media" ON storage.objects;
CREATE POLICY "Admin can insert portfolio media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can update portfolio media" ON storage.objects;
CREATE POLICY "Admin can update portfolio media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin can delete portfolio media" ON storage.objects;
CREATE POLICY "Admin can delete portfolio media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'portfolio-media' AND public.is_admin());

-- ------------------------------------------------------------------------------
-- 14. INITIAL SEED DATA (SAFE & IDEMPOTENT INSERTIONS)
-- ------------------------------------------------------------------------------

-- SECTION CONFIGS
INSERT INTO public.section_configs (id, section_key, display_name, display_order, is_visible)
VALUES
    ('00000000-0000-0000-0000-000000000101', 'hero', 'Hero / Introduction', 1, true),
    ('00000000-0000-0000-0000-000000000102', 'about', 'About Me', 2, true),
    ('00000000-0000-0000-0000-000000000103', 'skills', 'Technical Skills', 3, true),
    ('00000000-0000-0000-0000-000000000104', 'projects', 'Featured Projects', 4, true),
    ('00000000-0000-0000-0000-000000000105', 'experience', 'Experience & Certifications', 5, true),
    ('00000000-0000-0000-0000-000000000106', 'education', 'Education', 6, true),
    ('00000000-0000-0000-0000-000000000107', 'achievements', 'Achievements & Honors', 7, true),
    ('00000000-0000-0000-0000-000000000108', 'contact', 'Contact', 8, true)
ON CONFLICT (id) DO UPDATE SET
    section_key = EXCLUDED.section_key,
    display_name = EXCLUDED.display_name,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- PROFILE
INSERT INTO public.profiles (id, full_name, first_name, last_name, professional_title, degree_subtitle, short_bio, about_markdown, avatar_url, resume_url)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'DULANJANA KUMARASINGHE',
    'DULANJANA',
    'KUMARASINGHE',
    'IT UNDERGRADUATE',
    'BSc (Hons) Information Technology',
    'I am a 3rd-year BSc (Hons) Information Technology undergraduate at General Sir John Kotelawala Defence University, with a strong interest in web and application development. I have a solid foundation in frontend development using HTML and CSS and I''m actively expanding my skills in modern web technologies and frameworks. I''m passionate about building clean, responsive and user-friendly interfaces while ensuring performance and usability.',
    'Passionate IT undergraduate specializing in modern web architecture, frontend interfaces, and scalable database systems. Constantly exploring emerging technologies and eager to contribute to impactful real-world software engineering projects.',
    '/resources/me.jpg',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    professional_title = EXCLUDED.professional_title,
    degree_subtitle = EXCLUDED.degree_subtitle,
    short_bio = EXCLUDED.short_bio,
    about_markdown = EXCLUDED.about_markdown,
    avatar_url = EXCLUDED.avatar_url;

-- SOCIAL LINKS
INSERT INTO public.social_links (id, platform, label, url, icon_name, hover_color_class, display_order, is_active)
VALUES
    ('00000000-0000-0000-0000-000000000011', 'email', 'Email', 'mailto:dulanjanakavinda252@gmail.com', 'FaEnvelope', 'hover:text-sky-400', 1, true),
    ('00000000-0000-0000-0000-000000000012', 'phone', 'Call', 'tel:+94704938856', 'FaPhone', 'hover:text-green-400', 2, true),
    ('00000000-0000-0000-0000-000000000013', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/dulanjaner', 'FaLinkedin', 'hover:text-blue-400', 3, true),
    ('00000000-0000-0000-0000-000000000014', 'github', 'GitHub', 'https://github.com/dulanjaner', 'FaGithub', 'hover:text-purple-400', 4, true),
    ('00000000-0000-0000-0000-000000000015', 'instagram', 'Instagram', 'https://www.instagram.com/dulanjaner/', 'FaInstagram', 'hover:text-pink-400', 5, true),
    ('00000000-0000-0000-0000-000000000016', 'facebook', 'Facebook', 'https://www.facebook.com/dulanjaner', 'FaFacebook', 'hover:text-blue-500', 6, true)
ON CONFLICT (id) DO UPDATE SET
    platform = EXCLUDED.platform,
    label = EXCLUDED.label,
    url = EXCLUDED.url,
    icon_name = EXCLUDED.icon_name,
    hover_color_class = EXCLUDED.hover_color_class,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- EDUCATION
INSERT INTO public.education (id, institution, degree, duration, logo_url, display_order, is_visible)
VALUES
    ('00000000-0000-0000-0000-000000000021', 'General Sir John Kotelawala Defence University', 'BSc (Hons) Information Technology', '2024 - 2028', '/resources/KDU LOGO ORIGINAL 3x2.png', 1, true),
    ('00000000-0000-0000-0000-000000000022', 'St. Thomas'' College, Matale', 'Commerce Stream', '2013 - 2022', '/resources/St_Thomas''_College_Matale_Crest.png', 2, true)
ON CONFLICT (id) DO UPDATE SET
    institution = EXCLUDED.institution,
    degree = EXCLUDED.degree,
    duration = EXCLUDED.duration,
    logo_url = EXCLUDED.logo_url,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- EXPERIENCES
INSERT INTO public.experiences (id, company_name, role_title, duration, description, logo_url, display_order, is_visible)
VALUES (
    '00000000-0000-0000-0000-000000000031',
    'Bank of Ceylon',
    'Internship Trainee',
    'June 2023 - January 2024 (7 months)',
    'Gained hands-on experience in banking operations during my internship at one of Sri Lanka''s leading financial institutions.',
    '/resources/Bank of Ceylon.png',
    1,
    true
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    role_title = EXCLUDED.role_title,
    duration = EXCLUDED.duration,
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- PROJECTS
INSERT INTO public.projects (id, title, tech_summary, short_description, full_description, icon, cover_image_url, challenges, architecture, tags, github_url, live_url, display_order, is_visible)
VALUES
    (
        '00000000-0000-0000-0000-000000000041',
        'Hotel Reservation System',
        'Java • Android • SQLite',
        'Mobile application for hotel room bookings with real-time availability and payment integration.',
        'A comprehensive native Android application designed to streamline hotel room reservations for guests and administrators. Features include real-time availability checks, room filtering, automated total cost calculation, and structured local database persistence.',
        '🏨',
        NULL,
        ARRAY[
            'Enforcing atomic database operations in SQLite to prevent concurrent double-booking conflicts.',
            'Designing custom responsive Android layouts with dynamic date pickers and image preview carousels.',
            'Optimizing memory allocation during multi-image loading to ensure smooth 60fps scrolling.'
        ],
        'Structured using native Android SDK (MVP design pattern), utilizing SQLite OpenHelper for local persistence, custom adapter views, and async tasks for non-blocking UI rendering.',
        ARRAY['Java', 'Android SDK', 'SQLite', 'Mobile App', 'UI/UX'],
        'https://github.com/DulanjanaKumarasinghe',
        '#',
        1,
        true
    ),
    (
        '00000000-0000-0000-0000-000000000042',
        'Network Lab Setup',
        'Cisco • Routing • Switching',
        'Configured and tested enterprise-level networking infrastructure with CCNA concepts.',
        'An enterprise-grade laboratory network topology designed and configured using Cisco IOS. Implements VLAN segmentation, inter-VLAN routing, multi-area OSPF dynamic routing, Access Control Lists (ACLs), and NAT translation.',
        '🛜',
        NULL,
        ARRAY[
            'Configuring inter-VLAN routing with Router-on-a-Stick while maintaining strict security policies.',
            'Diagnosing routing loop hazards and tuning Spanning Tree Protocol (STP) priority parameters across switches.',
            'Implementing dynamic NAT with ACL filtering for safe external Internet traffic translation.'
        ],
        'Hierarchical Cisco networking architecture spanning Core, Distribution, and Access layers configured in Packet Tracer & GNS3 environments.',
        ARRAY['Cisco IOS', 'CCNA', 'Subnetting', 'VLANs', 'OSPF', 'Cybersecurity'],
        'https://github.com/DulanjanaKumarasinghe',
        '#',
        2,
        true
    ),
    (
        '00000000-0000-0000-0000-000000000043',
        'Log File Archiver',
        'Java • File Handling',
        'Utility application for efficient log file management and archiving with compression.',
        'A high-performance system utility developed in Java to automatically parse, categorize, compress, and archive server log files. Reduces log storage footprints while maintaining quick keyword lookup capabilities.',
        '📁',
        NULL,
        ARRAY[
            'Streaming and parsing large system log files efficiently without exhausting memory.',
            'Integrating multi-threaded GZIP compression algorithms achieving over 70% compression efficiency.',
            'Building robust regex parsers to separate info, warning, and critical error events.'
        ],
        'Developed using Java 17, Java NIO File I/O channels, Java Concurrency thread pools for asynchronous file compression, and custom regex stream filters.',
        ARRAY['Java', 'File I/O', 'Multithreading', 'GZIP', 'Systems'],
        'https://github.com/DulanjanaKumarasinghe',
        '#',
        3,
        true
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    tech_summary = EXCLUDED.tech_summary,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    icon = EXCLUDED.icon,
    cover_image_url = EXCLUDED.cover_image_url,
    challenges = EXCLUDED.challenges,
    architecture = EXCLUDED.architecture,
    tags = EXCLUDED.tags,
    github_url = EXCLUDED.github_url,
    live_url = EXCLUDED.live_url,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- CERTIFICATES
INSERT INTO public.certificates (id, title, subtitle_desc, image_url, issuer, credential_url, display_order, is_visible)
VALUES
    ('00000000-0000-0000-0000-000000000051', 'CCNA', 'Introduction to Networks', '/resources/CCNA Introduction to Networks Certificate_page-0001.jpg', 'Cisco Networking Academy', NULL, 1, true),
    ('00000000-0000-0000-0000-000000000052', 'Cybersecurity', 'Introduction to Cybersecurity', '/resources/Introduction_to_Cybersecurity_certificate_dulanjanakavinda252-gmail-com_f29e5397-4cd8-4d43-9c32-0ec0b605ccf5_page-0001.jpg', 'Cisco Networking Academy', NULL, 2, true),
    ('00000000-0000-0000-0000-000000000053', 'Web Design', 'Web Design for Beginners', '/resources/Web_Design_for_Beginners_E-Certificate_page-0001.jpg', 'University of Moratuwa', NULL, 3, true)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle_desc = EXCLUDED.subtitle_desc,
    image_url = EXCLUDED.image_url,
    issuer = EXCLUDED.issuer,
    credential_url = EXCLUDED.credential_url,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- SKILL CATEGORIES
INSERT INTO public.skill_categories (id, name, display_order, is_visible)
VALUES
    ('00000000-0000-0000-0000-000000000061', 'Web Development', 1, true),
    ('00000000-0000-0000-0000-000000000062', 'Mobile Development', 2, true),
    ('00000000-0000-0000-0000-000000000063', 'Backend & Databases', 3, true),
    ('00000000-0000-0000-0000-000000000064', 'Networking & Security', 4, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- SKILLS
INSERT INTO public.skills (id, category_id, name, display_order, is_visible)
VALUES
    -- Web Development
    ('00000000-0000-0000-0000-000000000071', '00000000-0000-0000-0000-000000000061', 'HTML', 1, true),
    ('00000000-0000-0000-0000-000000000072', '00000000-0000-0000-0000-000000000061', 'CSS', 2, true),
    ('00000000-0000-0000-0000-000000000073', '00000000-0000-0000-0000-000000000061', 'JavaScript', 3, true),
    ('00000000-0000-0000-0000-000000000074', '00000000-0000-0000-0000-000000000061', 'React', 4, true),
    ('00000000-0000-0000-0000-000000000075', '00000000-0000-0000-0000-000000000061', 'Next.js', 5, true),
    ('00000000-0000-0000-0000-000000000076', '00000000-0000-0000-0000-000000000061', 'Responsive Design', 6, true),
    ('00000000-0000-0000-0000-000000000077', '00000000-0000-0000-0000-000000000061', 'Web Design', 7, true),
    -- Mobile Development
    ('00000000-0000-0000-0000-000000000078', '00000000-0000-0000-0000-000000000062', 'React Native', 1, true),
    ('00000000-0000-0000-0000-000000000079', '00000000-0000-0000-0000-000000000062', 'Android', 2, true),
    ('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000062', 'Mobile Applications', 3, true),
    -- Backend & Databases
    ('00000000-0000-0000-0000-000000000081', '00000000-0000-0000-0000-000000000063', 'Java', 1, true),
    ('00000000-0000-0000-0000-000000000082', '00000000-0000-0000-0000-000000000063', 'MySQL', 2, true),
    ('00000000-0000-0000-0000-000000000083', '00000000-0000-0000-0000-000000000063', 'Firebase', 3, true),
    -- Networking & Security
    ('00000000-0000-0000-0000-000000000084', '00000000-0000-0000-0000-000000000064', 'Subnetting', 1, true),
    ('00000000-0000-0000-0000-000000000085', '00000000-0000-0000-0000-000000000064', 'CCNA', 2, true),
    ('00000000-0000-0000-0000-000000000086', '00000000-0000-0000-0000-000000000064', 'Cybersecurity', 3, true),
    ('00000000-0000-0000-0000-000000000087', '00000000-0000-0000-0000-000000000064', 'System Architecture', 4, true)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;

-- ACHIEVEMENTS
INSERT INTO public.achievements (id, title, organization, date_or_year, description, badge_url, display_order, is_visible)
VALUES (
    '00000000-0000-0000-0000-000000000091',
    'Dean''s List / Academic Commendation',
    'General Sir John Kotelawala Defence University',
    '2024',
    'Recognized for academic excellence in BSc (Hons) Information Technology.',
    NULL,
    1,
    true
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    organization = EXCLUDED.organization,
    date_or_year = EXCLUDED.date_or_year,
    description = EXCLUDED.description,
    badge_url = EXCLUDED.badge_url,
    display_order = EXCLUDED.display_order,
    is_visible = EXCLUDED.is_visible;
