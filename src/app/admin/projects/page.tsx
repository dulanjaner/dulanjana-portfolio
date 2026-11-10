"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    GitBranch,
    LoaderCircle,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
    FolderKanban,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Map, BrainCircuit, Code2, Network, Database, Smartphone, ShieldCheck, Cloud, Globe, Monitor, Cpu, Layers, Sparkles, GripVertical,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Project {
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

interface ProjectForm {
    title: string;
    tech_summary: string;
    short_description: string;
    full_description: string;
    icon: string;
    cover_image_url: string;
    challenges_text: string;
    architecture: string;
    tags_text: string;
    github_url: string;
    live_url: string;
    display_order: string;
    is_visible: boolean;
}

const PROJECT_ICONS = [
    { name: "Map", label: "GIS / Mapping", Icon: Map },
    { name: "BrainCircuit", label: "AI / Machine Learning", Icon: BrainCircuit },
    { name: "Code2", label: "Software / Coding", Icon: Code2 },
    { name: "Network", label: "Networking", Icon: Network },
    { name: "Database", label: "Database", Icon: Database },
    { name: "Smartphone", label: "Mobile App", Icon: Smartphone },
    { name: "ShieldCheck", label: "Security", Icon: ShieldCheck },
    { name: "Cloud", label: "Cloud Computing", Icon: Cloud },
    { name: "Globe", label: "Web / Internet", Icon: Globe },
    { name: "Monitor", label: "Desktop / UI", Icon: Monitor },
    { name: "Cpu", label: "Hardware / IoT", Icon: Cpu },
    { name: "Layers", label: "Architecture / Layers", Icon: Layers },
    { name: "Sparkles", label: "Other / Innovation", Icon: Sparkles },
];

const emptyForm: ProjectForm = {
    title: "",
    tech_summary: "",
    short_description: "",
    full_description: "",
    icon: "Code2",
    cover_image_url: "",
    challenges_text: "",
    architecture: "",
    tags_text: "",
    github_url: "",
    live_url: "",
    display_order: "0",
    is_visible: true,
};

function toForm(project: Project): ProjectForm {
    return {
        title: project.title ?? "",
        tech_summary: project.tech_summary ?? "",
        short_description: project.short_description ?? "",
        full_description: project.full_description ?? "",
        icon: project.icon ?? "Code2",
        cover_image_url: project.cover_image_url ?? "",
        challenges_text: (project.challenges ?? []).join("\n"),
        architecture: project.architecture ?? "",
        tags_text: (project.tags ?? []).join(", "),
        github_url: project.github_url ?? "",
        live_url: project.live_url ?? "",
        display_order: String(project.display_order ?? 0),
        is_visible: project.is_visible ?? true,
    };
}

function splitLines(value: string): string[] {
    return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

function splitTags(value: string): string[] {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [form, setForm] = useState<ProjectForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        if (!error) return;
        const frame = window.requestAnimationFrame(() => {
            document.getElementById("project-form-feedback")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [error]);

    const loadProjects = useCallback(async () => {
        try {
            const supabase = createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                window.location.replace("/admin/login");
                return;
            }

            const { data: admin, error: adminError } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (adminError || !admin) {
                setError(
                    "Your account is not authorized to manage projects. Please sign in with an administrator account."
                );
                return;
            }

            const { data, error: queryError } = await supabase
                .from("projects")
                .select("*")
                .order("display_order", { ascending: true });

            if (queryError) {
                throw queryError;
            }

            setProjects((data ?? []) as Project[]);
        } catch (err) {
            console.error("[Admin Projects] Load failed:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load projects. Check your Supabase connection and policies."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        async function init() {
            if (isMounted) {
                await loadProjects();
            }
        }
        void init();
        return () => {
            isMounted = false;
        };
    }, [loadProjects]);

    function openNewForm() {
        setEditingId(null);
        setForm({ ...emptyForm, display_order: String(projects.length + 1) });
        setShowForm(true);

        setError("");
        setSuccess("");
    }

    function openEditForm(project: Project) {
        setEditingId(project.id);
        setForm(toForm(project));
        setShowForm(true);

        setError("");
        setSuccess("");
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    function updateField<K extends keyof ProjectForm>(
        key: K,
        value: ProjectForm[K]
    ) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.title.trim()) {
            setError("Please enter a project title.");
            return;
        }

        if (!form.short_description.trim()) {
            setError("Please enter a short description.");
            return;
        }

        if (form.github_url.trim() && !/^https?:\/\//i.test(form.github_url.trim())) {
            setError("The GitHub URL must start with http:// or https://.");
            return;
        }

        if (form.live_url.trim() && !/^https?:\/\//i.test(form.live_url.trim())) {
            setError("The live project URL must start with http:// or https://.");
            return;
        }

        if (
            form.cover_image_url.trim() &&
            !/^\/(images|resources)\//.test(form.cover_image_url.trim()) &&
            !/^https?:\/\//i.test(form.cover_image_url.trim())
        ) {
            setError("Choose an image from the dropdown or use a valid http:// or https:// image URL.");
            return;
        }

        const order = Number(form.display_order);
        if (!Number.isInteger(order) || order < 0) {
            setError("Display Order must be a whole number greater than or equal to 0.");
            return;
        }

        setSaving(true);

        try {
            const supabase = createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                window.location.replace("/admin/login");
                return;
            }

            const { data: admin, error: adminError } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (adminError || !admin) {
                throw new Error("You are not authorized to manage projects.");
            }

            const payload = {
                title: form.title.trim(),
                tech_summary: form.tech_summary.trim(),
                short_description: form.short_description.trim(),
                full_description: form.full_description.trim(),
                icon: form.icon.trim() || "Code2",
                cover_image_url: form.cover_image_url.trim() || null,
                challenges: splitLines(form.challenges_text),
                architecture: form.architecture.trim(),
                tags: splitTags(form.tags_text),
                github_url: form.github_url.trim(),
                live_url: form.live_url.trim() || null,
                display_order: Number(form.display_order),
                is_visible: form.is_visible,
            };

            if (editingId) {
                const { error: updateError } = await supabase
                    .from("projects")
                    .update(payload)
                    .eq("id", editingId);

                if (updateError) {
                    throw updateError;
                }

                setSuccess("Project updated successfully.");
            } else {
                const { error: insertError } = await supabase
                    .from("projects")
                    .insert(payload);

                if (insertError) {
                    throw insertError;
                }

                setSuccess("Project added successfully.");
            }

            closeForm();
            await loadProjects();
        } catch (err) {
            console.error("[Admin Projects] Save failed:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save the project. Check your database permissions."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleReorder(draggedId: string, targetId: string) {
        if (draggedId === targetId || reordering) return;
        const fromIndex = projects.findIndex((project) => project.id === draggedId);
        const toIndex = projects.findIndex((project) => project.id === targetId);
        if (fromIndex < 0 || toIndex < 0) return;

        const reordered = [...projects];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        const previous = projects;
        setProjects(reordered.map((project, index) => ({ ...project, display_order: index + 1 })));
        setReordering(true);

        setError("");
        setSuccess("");

        try {
            const supabase = createClient();
            // Use temporary values first so existing order values cannot conflict with a unique constraint.
            const temporaryUpdates = await Promise.all(
                reordered.map((project, index) =>
                    supabase.from("projects").update({ display_order: 100000 + index }).eq("id", project.id)
                )
            );
            const temporaryError = temporaryUpdates.find((result) => result.error)?.error;
            if (temporaryError) throw temporaryError;

            const finalUpdates = await Promise.all(
                reordered.map((project, index) =>
                    supabase.from("projects").update({ display_order: index + 1 }).eq("id", project.id)
                )
            );
            const finalError = finalUpdates.find((result) => result.error)?.error;
            if (finalError) throw finalError;
            setSuccess("Project order updated.");
        } catch (err) {
            console.error("[Admin Projects] Reorder failed:", err);
            setProjects(previous);
            setError(err instanceof Error ? err.message : "Unable to save the new project order.");
            await loadProjects();
        } finally {
            setReordering(false);
            setDraggingId(null);
        }
    }

    async function handleDelete(project: Project) {
        const confirmed = window.confirm(
            `Delete "${project.title}" permanently? This action cannot be undone.`
        );

        if (!confirmed) return;


        setError("");
        setSuccess("");
        setDeletingId(project.id);

        try {
            const supabase = createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                window.location.replace("/admin/login");
                return;
            }

            const { data: admin, error: adminError } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (adminError || !admin) {
                throw new Error("You are not authorized to delete projects.");
            }

            const { error: deleteError } = await supabase
                .from("projects")
                .delete()
                .eq("id", project.id);

            if (deleteError) {
                throw deleteError;
            }

            setProjects((current) =>
                current.filter((item) => item.id !== project.id)
            );
            setSuccess("Project deleted successfully.");
        } catch (err) {
            console.error("[Admin Projects] Delete failed:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete the project. Check your database permissions."
            );
        } finally {
            setDeletingId(null);
        }
    }

    async function toggleVisibility(project: Project) {

        setError("");
        setSuccess("");

        try {
            const supabase = createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                window.location.replace("/admin/login");
                return;
            }

            const { data: admin, error: adminError } = await supabase
                .from("admin_users")
                .select("user_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (adminError || !admin) {
                throw new Error("You are not authorized to change project visibility.");
            }

            const nextVisibility = !project.is_visible;

            const { error: updateError } = await supabase
                .from("projects")
                .update({ is_visible: nextVisibility })
                .eq("id", project.id);

            if (updateError) {
                throw updateError;
            }

            setProjects((current) =>
                current.map((item) =>
                    item.id === project.id
                        ? { ...item, is_visible: nextVisibility }
                        : item
                )
            );

            setSuccess(
                nextVisibility
                    ? "Project is now visible."
                    : "Project is now hidden from the public portfolio."
            );
        } catch (err) {
            console.error("[Admin Projects] Visibility update failed:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update project visibility."
            );
        }
    }

    const visibleCount = projects.filter((project) => project.is_visible).length;

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/admin"
                            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
                                <FolderKanban size={24} />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Projects
                                </h1>
                                <p className="mt-1 text-sm text-slate-400">
                                    Add, edit and manage your portfolio projects.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openNewForm}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
                    >
                        <Plus size={18} />
                        Add Project
                    </button>
                </header>

                {/* Summary */}
                <section className="mb-7 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                        <p className="text-sm text-slate-400">Total Projects</p>
                        <p className="mt-2 text-3xl font-bold">{projects.length}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                        <p className="text-sm text-slate-400">Visible on Portfolio</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-400">
                            {visibleCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                        <p className="text-sm text-slate-400">Hidden Projects</p>
                        <p className="mt-2 text-3xl font-bold text-amber-400">
                            {projects.length - visibleCount}
                        </p>
                    </div>
                </section>

                {/* Feedback */}
                {error && (
                    <div
                        id="project-form-feedback"
                        role="alert"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <p className="break-words">{error}</p>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300"
                    >
                        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                {/* Project Form */}
                {showForm && (
                    <section className="mb-8 rounded-2xl border border-sky-400/20 bg-slate-900/80 p-5 sm:p-7">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingId ? "Edit Project" : "Add New Project"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Fields marked with * are required.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                aria-label="Close project form"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="project-title"
                                        className="mb-2 block text-sm font-medium text-slate-300"
                                    >
                                        Project Title *
                                    </label>
                                    <input
                                        id="project-title"
                                        required
                                        value={form.title}
                                        onChange={(event) =>
                                            updateField("title", event.target.value)
                                        }
                                        placeholder="e.g. E-commerce Microservices System"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="project-tech-summary"
                                        className="mb-2 block text-sm font-medium text-slate-300"
                                    >
                                        Technology Summary
                                    </label>
                                    <input
                                        id="project-tech-summary"
                                        value={form.tech_summary}
                                        onChange={(event) =>
                                            updateField("tech_summary", event.target.value)
                                        }
                                        placeholder="Next.js, TypeScript, Supabase"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="project-short-description"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Short Description *
                                </label>
                                <textarea
                                    id="project-short-description"
                                    required
                                    rows={2}
                                    value={form.short_description}
                                    onChange={(event) =>
                                        updateField("short_description", event.target.value)
                                    }
                                    placeholder="A short summary displayed on the project card."
                                    className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project-full-description"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Full Description
                                </label>
                                <textarea
                                    id="project-full-description"
                                    rows={4}
                                    value={form.full_description}
                                    onChange={(event) =>
                                        updateField("full_description", event.target.value)
                                    }
                                    placeholder="Explain the project, its purpose and main features."
                                    className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="project-github"
                                        className="mb-2 block text-sm font-medium text-slate-300"
                                    >
                                        GitHub URL
                                    </label>
                                    <input
                                        id="project-github"
                                        type="url"
                                        value={form.github_url}
                                        onChange={(event) =>
                                            updateField("github_url", event.target.value)
                                        }
                                        placeholder="https://github.com/username/project"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="project-live-url"
                                        className="mb-2 block text-sm font-medium text-slate-300"
                                    >
                                        Live Demo URL
                                    </label>
                                    <input
                                        id="project-live-url"
                                        type="url"
                                        value={form.live_url}
                                        onChange={(event) =>
                                            updateField("live_url", event.target.value)
                                        }
                                        placeholder="https://your-project.example"
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 block text-sm font-medium text-slate-300">Project Card Icon</p>
                                <p className="mb-4 text-xs text-slate-500">Choose an icon tile like the ones shown on your portfolio project cards.</p>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                    {PROJECT_ICONS.map(({ name, label, Icon }) => {
                                        const selected = form.icon === name;
                                        return (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => updateField("icon", name)}
                                                aria-pressed={selected}
                                                className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400/40" : "border-white/10 bg-slate-950/50 hover:border-cyan-400/40"}`}
                                            >
                                                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${selected ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-cyan-400/25 bg-slate-900 text-cyan-400"}`}>
                                                    <Icon size={24} strokeWidth={1.8} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-xs font-semibold text-slate-200">{label}</span>
                                                    <span className="mt-1 block text-[10px] text-slate-500">{name}</span>
                                                </span>
                                                {selected && <CheckCircle2 size={15} className="ml-auto shrink-0 text-cyan-300" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4">
                                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-900 text-cyan-300">
                                        {(() => {
                                            const SelectedIcon = PROJECT_ICONS.find((item) => item.name === form.icon)?.Icon ?? Code2;
                                            return <SelectedIcon size={28} strokeWidth={1.8} />;
                                        })()}
                                    </span>
                                    <span className="text-sm text-slate-300">Selected icon: <strong className="text-white">{PROJECT_ICONS.find((item) => item.name === form.icon)?.label ?? form.icon}</strong></span>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="project-tags"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Technologies / Tags
                                </label>
                                <input
                                    id="project-tags"
                                    value={form.tags_text}
                                    onChange={(event) =>
                                        updateField("tags_text", event.target.value)
                                    }
                                    placeholder="Next.js, TypeScript, PostgreSQL"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Separate each tag with a comma.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="project-challenges"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Challenges
                                </label>
                                <textarea
                                    id="project-challenges"
                                    rows={3}
                                    value={form.challenges_text}
                                    onChange={(event) =>
                                        updateField("challenges_text", event.target.value)
                                    }
                                    placeholder={"One challenge per line\nAnother challenge"}
                                    className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project-architecture"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Architecture / Implementation Details
                                </label>
                                <textarea
                                    id="project-architecture"
                                    rows={3}
                                    value={form.architecture}
                                    onChange={(event) =>
                                        updateField("architecture", event.target.value)
                                    }
                                    placeholder="Describe the architecture or implementation approach."
                                    className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-sky-400/60"
                                />
                            </div>

                            <input type="hidden" value={form.display_order} readOnly />
                            <p className="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs leading-5 text-slate-400">
                                Project order is managed by dragging project cards in the list below. Each project receives its own order automatically.
                            </p>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                                <input
                                    type="checkbox"
                                    checked={form.is_visible}
                                    onChange={(event) =>
                                        updateField("is_visible", event.target.checked)
                                    }
                                    className="h-4 w-4 accent-sky-400"
                                />
                                <span>
                                    <span className="block text-sm font-medium">
                                        Visible on public portfolio
                                    </span>
                                    <span className="mt-1 block text-xs text-slate-500">
                                        Uncheck to hide this project without deleting it.
                                    </span>
                                </span>
                            </label>

                            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                                >
                                    <X size={17} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <LoaderCircle size={18} className="animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Save Changes"
                                            : "Add Project"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Projects List */}
                <section>
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold">All Projects</h2>

                        <button
                            type="button"
                            onClick={() => {
                                setLoading(true);
                                void loadProjects();
                            }}
                            disabled={loading}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/40 hover:text-sky-400 disabled:opacity-50"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 py-16 text-slate-400">
                            <LoaderCircle size={22} className="animate-spin" />
                            Loading projects...
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 px-5 py-14 text-center">
                            <FolderKanban
                                size={38}
                                className="mx-auto mb-4 text-slate-500"
                            />
                            <h3 className="text-lg font-semibold">No projects found</h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                                There are no projects in the database yet, or your database
                                policies do not allow this account to read them.
                            </p>
                            <button
                                type="button"
                                onClick={openNewForm}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                            >
                                <Plus size={17} />
                                Add Your First Project
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 flex items-center gap-2 text-xs text-slate-500"><GripVertical size={15} /> Drag and drop project cards to change their order. Changes save automatically.</p>
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {projects.map((project) => (
                                    <article
                                        key={project.id}
                                        draggable={!reordering}
                                        onDragStart={(event) => {
                                            setDraggingId(project.id);
                                            event.dataTransfer.effectAllowed = "move";
                                            event.dataTransfer.setData("text/plain", project.id);
                                        }}
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                            event.dataTransfer.dropEffect = "move";
                                        }}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            const sourceId = event.dataTransfer.getData("text/plain") || draggingId;
                                            if (sourceId) void handleReorder(sourceId, project.id);
                                        }}
                                        onDragEnd={() => setDraggingId(null)}
                                        className={`overflow-hidden rounded-2xl border bg-slate-900/70 transition ${draggingId === project.id ? "border-cyan-400 opacity-50" : "border-white/10 hover:border-sky-400/25"} ${reordering ? "cursor-wait" : "cursor-grab active:cursor-grabbing"}`}
                                    >
                                        <div className="flex h-28 items-center justify-center border-b border-white/5 bg-gradient-to-br from-sky-400/10 to-violet-400/10">
                                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-950/70 text-cyan-300 shadow-lg shadow-cyan-950/20">
                                                {(() => {
                                                    const SelectedIcon = PROJECT_ICONS.find((item) => item.name === project.icon)?.Icon ?? FolderKanban;
                                                    return <SelectedIcon size={32} strokeWidth={1.8} />;
                                                })()}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${project.is_visible
                                                        ? "bg-emerald-400/10 text-emerald-300"
                                                        : "bg-amber-400/10 text-amber-300"
                                                        }`}
                                                >
                                                    {project.is_visible ? "Visible" : "Hidden"}
                                                </span>

                                                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                                                    Order: {project.display_order}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold">{project.title}</h3>

                                            {project.tech_summary && (
                                                <p className="mt-1 text-xs text-sky-400">
                                                    {project.tech_summary}
                                                </p>
                                            )}

                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                                                {project.short_description}
                                            </p>

                                            {project.tags?.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {project.tags.slice(0, 5).map((tag, index) => (
                                                        <span
                                                            key={`${tag}-${index}`}
                                                            className="rounded-md border border-white/10 bg-slate-950/50 px-2 py-1 text-xs text-slate-300"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(project)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/40 hover:text-sky-400"
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void toggleVisibility(project)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/40 hover:text-sky-400"
                                                >
                                                    {project.is_visible ? (
                                                        <EyeOff size={15} />
                                                    ) : (
                                                        <Eye size={15} />
                                                    )}
                                                    {project.is_visible ? "Hide" : "Show"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(project)}
                                                    disabled={deletingId === project.id}
                                                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                                                >
                                                    {deletingId === project.id ? (
                                                        <LoaderCircle size={15} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                    Delete
                                                </button>

                                                {project.github_url && (
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`Open ${project.title} GitHub repository`}
                                                        className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:text-sky-400"
                                                    >
                                                        <GitBranch size={16} />
                                                    </a>
                                                )}

                                                {project.live_url && (
                                                    <a
                                                        href={project.live_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`Open ${project.title} live demo`}
                                                        className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:text-sky-400"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <footer className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
                    Portfolio Admin · Projects Management
                </footer>
            </div>
        </main>
    );
}