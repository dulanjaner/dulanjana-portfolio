import Link from "next/link";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    UserRound,
    FolderKanban,
    GraduationCap,
    BriefcaseBusiness,
    Code2,
    Award,
    Trophy,
    Settings2,
    MessageSquare,
    ExternalLink,
    LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const dashboardItems = [
    {
        title: "Profile",
        description: "Manage your name, professional title, bio and profile image.",
        href: "/admin/profile",
        icon: UserRound,
    },
    {
        title: "Projects",
        description: "Add, edit and manage your portfolio projects.",
        href: "/admin/projects",
        icon: FolderKanban,
    },
    {
        title: "Skills",
        description: "Manage skill categories and individual skills.",
        href: "/admin/skills",
        icon: Code2,
    },
    {
        title: "Education",
        description: "Manage your educational qualifications.",
        href: "/admin/education",
        icon: GraduationCap,
    },
    {
        title: "Experience",
        description: "Manage your professional and project experience.",
        href: "/admin/experience",
        icon: BriefcaseBusiness,
    },
    {
        title: "Certificates",
        description: "Manage certificates and credential links.",
        href: "/admin/certificates",
        icon: Award,
    },
    {
        title: "Achievements",
        description: "Manage awards and other achievements.",
        href: "/admin/achievements",
        icon: Trophy,
    },
    {
        title: "Social Links",
        description: "Manage your social media profiles and links.",
        href: "/admin/social-links",
        icon: ExternalLink,
    },
    {
        title: "Contact Messages",
        description: "View and manage messages submitted through your portfolio.",
        href: "/admin/messages",
        icon: MessageSquare,
    },
    {
        title: "Section Settings",
        description: "Manage portfolio section visibility and display order.",
        href: "/admin/sections",
        icon: Settings2,
    },
];

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    if (!supabase) {
        redirect("/admin/login?error=supabase_not_configured");
    }

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/admin/login");
    }

    // Only an account listed in admin_users can access the dashboard.
    const { data: adminRecord, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError || !adminRecord) {
        redirect("/admin/login?error=unauthorized");
    }

    async function signOut() {
        "use server";

        const serverSupabase = await createClient();

        if (serverSupabase) {
            await serverSupabase.auth.signOut();
        }

        redirect("/admin/login");
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <header className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                            <LayoutDashboard size={18} />
                            Portfolio Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Manage your portfolio content from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:border-sky-400/40 hover:text-sky-400"
                        >
                            View Portfolio
                            <ExternalLink size={16} />
                        </Link>

                        <form action={signOut}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/20"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </header>

                {/* Welcome */}
                <section className="mb-8 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-400/10 to-violet-400/10 p-6 sm:p-8">
                    <p className="text-sm font-medium text-sky-400">
                        AUTHENTICATED ADMINISTRATOR
                    </p>

                    <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                        Welcome to your portfolio manager
                    </h2>

                    <p className="mt-3 break-all text-sm text-slate-400">
                        Signed in as {user.email ?? "Authorized administrator"}
                    </p>
                </section>

                {/* Management Cards */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Content Management</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Choose a category to manage your portfolio content.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {dashboardItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-900"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-400 transition group-hover:border-sky-400/40 group-hover:bg-sky-400/15">
                                        <Icon size={23} />
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-semibold">{item.title}</h3>

                                        <ExternalLink
                                            size={16}
                                            className="shrink-0 text-slate-500 transition group-hover:text-sky-400"
                                        />
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {item.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <footer className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
                    Portfolio Admin Dashboard
                </footer>
            </div>
        </main>
    );
}