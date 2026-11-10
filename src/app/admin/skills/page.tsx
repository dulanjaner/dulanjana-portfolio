"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  LoaderCircle,
  Layers3,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Code2,
  Globe,
  Database,
  Server,
  Smartphone,
  Monitor,
  Palette,
  Braces,
  Terminal,
  Cpu,
  Cloud,
  GitBranch,
  Shield,
  Zap,
  Wrench,
  FileCode,
  Component,
  Layout,
  Laptop,
  Brain,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Skill = {
  id: string;
  category_id: string;
  name: string;
  icon_name: string;
  display_order: number;
  is_visible: boolean;
};

type Category = {
  id: string;
  name: string;
  icon_name?: string;
  display_order: number;
  is_visible: boolean;
  skills: Skill[];
};

type CategoryForm = {
  name: string;
  icon_name: string;
  is_visible: boolean;
};

type SkillForm = {
  category_id: string;
  name: string;
  icon_name: string;
  is_visible: boolean;
};

const emptyCategory: CategoryForm = {
  name: "",
  icon_name: "Layers3",
  is_visible: true,
};

const emptySkill: SkillForm = {
  category_id: "",
  name: "",
  icon_name: "Code2",
  is_visible: true,
};

const SKILL_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Code2", label: "Code", icon: Code2 },
  { name: "Globe", label: "Web / Globe", icon: Globe },
  { name: "Database", label: "Database", icon: Database },
  { name: "Server", label: "Server", icon: Server },
  { name: "Smartphone", label: "Mobile", icon: Smartphone },
  { name: "Monitor", label: "Monitor", icon: Monitor },
  { name: "Palette", label: "Design", icon: Palette },
  { name: "Braces", label: "Braces", icon: Braces },
  { name: "Terminal", label: "Terminal", icon: Terminal },
  { name: "Cpu", label: "Hardware / CPU", icon: Cpu },
  { name: "Cloud", label: "Cloud", icon: Cloud },
  { name: "GitBranch", label: "Git / Branch", icon: GitBranch },
  { name: "Shield", label: "Security", icon: Shield },
  { name: "Zap", label: "Fast / Tools", icon: Zap },
  { name: "Wrench", label: "Tools", icon: Wrench },
  { name: "FileCode", label: "File / Code", icon: FileCode },
  { name: "Component", label: "Components", icon: Component },
  { name: "Layout", label: "Layout", icon: Layout },
  { name: "Laptop", label: "Laptop", icon: Laptop },
  { name: "Brain", label: "AI / Brain", icon: Brain },
  { name: "Settings", label: "Settings", icon: Settings },
];

const SKILL_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SKILL_ICONS.map((item) => [item.name, item.icon])
) as Record<string, LucideIcon>;

function SkillIcon({ name, size = 16 }: { name?: string | null; size?: number }) {
  const Icon = (name && SKILL_ICON_MAP[name]) || Code2;
  return <Icon size={size} aria-hidden="true" />;
}

function CategoryIcon({ name, size = 20 }: { name?: string | null; size?: number }) {
  const Icon = (name && SKILL_ICON_MAP[name]) || Layers3;
  return <Icon size={size} aria-hidden="true" />;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryForm, setCategoryForm] =
    useState<CategoryForm>(emptyCategory);

  const [skillForm, setSkillForm] =
    useState<SkillForm>(emptySkill);

  const [editingCategory, setEditingCategory] =
    useState<string | null>(null);

  const [editingSkill, setEditingSkill] =
    useState<string | null>(null);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!error) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("skills-feedback")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [error]);

  // Load categories and skills from Supabase.

  // Load categories and skills from Supabase.
  const load = useCallback(async () => {
    try {
      const supabase = await authorizedClient();

      const { data, error: queryError } = await supabase
        .from("skill_categories")
        .select("*, skills(*)")
        .order("display_order", { ascending: true });

      if (queryError) throw queryError;

      const normalized: Category[] = (data ?? [])
        .map((category) => ({
          ...category,
          skills: [...((category.skills ?? []) as Skill[])].sort(
            (a, b) => a.display_order - b.display_order
          ),
        }))
        .sort(
          (a, b) => a.display_order - b.display_order
        ) as Category[];

      setCategories(normalized);
    } catch (err) {
      console.error("[Admin Skills] Load failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load skills."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    let isMounted = true;
    async function init() {
      if (isMounted) {
        await load();
      }
    }
    void init();
    return () => {
      isMounted = false;
    };
  }, [load]);

  // Verify that the signed-in user is an authorized admin.
  async function authorizedClient() {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.replace("/admin/login");
      throw new Error("Please sign in again.");
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError) throw adminError;

    if (!admin) {
      throw new Error(
        "You are not authorized to manage skills."
      );
    }

    return supabase;
  }

  // Add or edit a category.
  async function saveCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = categoryForm.name.trim();

    if (!name) {
      setError("Enter a category name.");
      return;
    }

    setSaving(true);

    try {
      const supabase = await authorizedClient();

      const existingCategory = categories.find(
        (category) => category.id === editingCategory
      );

      const nextOrder =
        categories.length > 0
          ? Math.max(
            ...categories.map(
              (category) => category.display_order
            )
          ) + 1
          : 1;

      const payload = {
        name,
        icon_name: categoryForm.icon_name || "Layers3",
        is_visible: categoryForm.is_visible,
        display_order:
          existingCategory?.display_order ?? nextOrder,
      };

      if (editingCategory) {
        const { data, error: updateError } = await supabase
          .from("skill_categories")
          .update(payload)
          .eq("id", editingCategory)
          .select("id")
          .maybeSingle();

        if (updateError) throw updateError;

        if (!data) {
          throw new Error(
            "Category was not updated. Check the category ID and Supabase UPDATE permissions."
          );
        }

        setSuccess("Category updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("skill_categories")
          .insert(payload);

        if (insertError) throw insertError;

        setSuccess("Category added successfully.");
      }

      setCategoryForm(emptyCategory);
      setEditingCategory(null);
      setCategoryOpen(false);

      await load();
    } catch (err) {
      console.error("[Admin Skills] Save category failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  // Add or edit a skill.
  async function saveSkill(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = skillForm.name.trim();

    if (!skillForm.category_id) {
      setError("Choose a category for this skill.");
      return;
    }

    if (!name) {
      setError("Enter a skill name.");
      return;
    }

    setSaving(true);

    try {
      const supabase = await authorizedClient();

      const targetCategory = categories.find(
        (category) =>
          category.id === skillForm.category_id
      );

      if (!targetCategory) {
        throw new Error("Selected category was not found.");
      }

      const existingSkill = editingSkill
        ? categories
          .flatMap((category) => category.skills)
          .find((skill) => skill.id === editingSkill)
        : undefined;

      const categoryChanged =
        existingSkill &&
        existingSkill.category_id !== skillForm.category_id;

      const nextOrder =
        targetCategory.skills.length > 0
          ? Math.max(
            ...targetCategory.skills.map(
              (skill) => skill.display_order
            )
          ) + 1
          : 1;

      const payload = {
        category_id: skillForm.category_id,
        name,
        icon_name: skillForm.icon_name || "Code2",
        is_visible: skillForm.is_visible,
        display_order:
          existingSkill && !categoryChanged
            ? existingSkill.display_order
            : nextOrder,
      };

      if (editingSkill) {
        const { data, error: updateError } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", editingSkill)
          .select("id")
          .maybeSingle();

        if (updateError) throw updateError;

        if (!data) {
          throw new Error(
            "Skill was not updated. Check the skill ID and Supabase UPDATE permissions."
          );
        }

        setSuccess("Skill updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("skills")
          .insert(payload);

        if (insertError) throw insertError;

        setSuccess("Skill added successfully.");
      }

      setSkillForm({
        ...emptySkill,
        category_id: skillForm.category_id,
      });

      setEditingSkill(null);
      setSkillOpen(false);

      await load();
    } catch (err) {
      console.error("[Admin Skills] Save skill failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a category.
  async function removeCategory(category: Category) {
    const confirmed = window.confirm(
      `Delete "${category.name}" and its associated skills? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const supabase = await authorizedClient();

      // Delete child skills first to avoid foreign-key errors.
      const { error: skillsError } = await supabase
        .from("skills")
        .delete()
        .eq("category_id", category.id);

      if (skillsError) throw skillsError;

      const { error: categoryError } = await supabase
        .from("skill_categories")
        .delete()
        .eq("id", category.id);

      if (categoryError) throw categoryError;

      setSuccess("Category and associated skills deleted.");

      await load();
    } catch (err) {
      console.error("[Admin Skills] Delete category failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete category."
      );
    }
  }

  // Delete a skill.
  async function removeSkill(skill: Skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const supabase = await authorizedClient();

      const { error: deleteError } = await supabase
        .from("skills")
        .delete()
        .eq("id", skill.id);

      if (deleteError) throw deleteError;

      setSuccess("Skill deleted successfully.");

      await load();
    } catch (err) {
      console.error("[Admin Skills] Delete skill failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete skill."
      );
    }
  }

  // Show or hide a category.
  async function toggleCategory(category: Category) {
    setError("");
    setSuccess("");

    try {
      const supabase = await authorizedClient();

      const { data, error: updateError } = await supabase
        .from("skill_categories")
        .update({
          is_visible: !category.is_visible,
        })
        .eq("id", category.id)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Category visibility was not updated.");
      }

      setSuccess(
        category.is_visible
          ? "Category hidden from the public portfolio."
          : "Category is now visible."
      );

      await load();
    } catch (err) {
      console.error("[Admin Skills] Category visibility error:", err);

      setError(
        err instanceof Error
          ? err.message
          : JSON.stringify(err)
      );
    }
  }

  // Show or hide a skill.
  async function toggleSkill(skill: Skill) {
    setError("");
    setSuccess("");

    try {
      const supabase = await authorizedClient();

      const { data, error: updateError } = await supabase
        .from("skills")
        .update({
          is_visible: !skill.is_visible,
        })
        .eq("id", skill.id)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Skill visibility was not updated.");
      }

      setSuccess(
        skill.is_visible
          ? "Skill hidden from the public portfolio."
          : "Skill is now visible."
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update skill visibility."
      );
    }
  }

  const totalSkills = categories.reduce(
    (total, category) => total + category.skills.length,
    0
  );

  const visibleSkills = categories.reduce(
    (total, category) =>
      total +
      category.skills.filter(
        (skill) =>
          skill.is_visible && category.is_visible
      ).length,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Layers3 size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Skills
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Manage categories and skills shown on your portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setCategoryForm(emptyCategory);
                setEditingCategory(null);
                setCategoryOpen(true);
                setSkillOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-semibold transition hover:border-cyan-400/40"
            >
              <Plus size={17} />
              Add Category
            </button>

            <button
              type="button"
              disabled={!categories.length}
              onClick={() => {
                setError("");
                setSuccess("");
                setSkillForm({
                  ...emptySkill,
                  category_id: categories[0]?.id ?? "",
                });
                setEditingSkill(null);
                setSkillOpen(true);
                setCategoryOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
            >
              <Plus size={17} />
              Add Skill
            </button>
          </div>
        </header>

        {/* Summary cards */}
        <section className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Categories</p>
            <p className="mt-2 text-3xl font-bold">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Total Skills</p>
            <p className="mt-2 text-3xl font-bold">
              {totalSkills}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Visible Skills</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">
              {visibleSkills}
            </p>
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div
            id="skills-feedback"
            role="alert"
            className="mb-6 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
          >
            <AlertCircle size={19} className="shrink-0" />
            <p className="break-words">{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300"
          >
            <CheckCircle2 size={19} className="shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Add/Edit forms */}
        {(categoryOpen || skillOpen) && (
          <section className="mb-8 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {categoryOpen
                  ? editingCategory
                    ? "Edit Category"
                    : "Add Category"
                  : editingSkill
                    ? "Edit Skill"
                    : "Add Skill"}
              </h2>

              <button
                type="button"
                aria-label="Close form"
                onClick={() => {
                  setCategoryOpen(false);
                  setSkillOpen(false);
                  setEditingCategory(null);
                  setEditingSkill(null);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category form */}
            {categoryOpen && (
              <form
                onSubmit={saveCategory}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Category name *
                  </label>

                  <input
                    id="category-name"
                    autoFocus
                    required
                    maxLength={80}
                    value={categoryForm.name}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Web Development"
                    className={inputClass}
                  />
                </div>

                {/* Category icon picker with live preview */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Category icon
                  </label>

                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                      <CategoryIcon name={categoryForm.icon_name} size={24} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {SKILL_ICONS.find((item) => item.name === categoryForm.icon_name)?.label ?? "Layers"}
                      </p>
                      <p className="text-xs text-slate-500">Category icon preview</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {SKILL_ICONS.map((item) => {
                      const Icon = item.icon;
                      const selected = categoryForm.icon_name === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          title={item.label}
                          aria-label={item.label}
                          aria-pressed={selected}
                          onClick={() =>
                            setCategoryForm((current) => ({
                              ...current,
                              icon_name: item.name,
                            }))
                          }
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition ${selected
                            ? "border-cyan-300 bg-cyan-300/10 text-cyan-300"
                            : "border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/25 hover:text-white"
                            }`}
                        >
                          <Icon size={21} />
                          <span className="max-w-full truncate text-[10px]">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={categoryForm.is_visible}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        is_visible: event.target.checked,
                      }))
                    }
                    className="accent-cyan-300"
                  />
                  Visible on public portfolio
                </label>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryOpen(false);
                      setEditingCategory(null);
                    }}
                    className="rounded-xl border border-white/10 px-4 py-3"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
                  >
                    {saving ? (
                      <LoaderCircle
                        className="animate-spin"
                        size={17}
                      />
                    ) : (
                      <Save size={17} />
                    )}
                    {editingCategory
                      ? "Update Category"
                      : "Save Category"}
                  </button>
                </div>
              </form>
            )}

            {/* Skill form */}
            {skillOpen && (
              <form
                onSubmit={saveSkill}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="skill-category"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Category *
                  </label>

                  <select
                    id="skill-category"
                    required
                    value={skillForm.category_id}
                    onChange={(event) =>
                      setSkillForm((current) => ({
                        ...current,
                        category_id: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="skill-name"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Skill name *
                  </label>

                  <input
                    id="skill-name"
                    autoFocus
                    required
                    maxLength={80}
                    value={skillForm.name}
                    onChange={(event) =>
                      setSkillForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. TypeScript"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="skill-icon"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Skill icon
                  </label>

                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                      <SkillIcon name={skillForm.icon_name} size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {SKILL_ICONS.find((item) => item.name === skillForm.icon_name)?.label ?? "Code"}
                      </p>
                      <p className="text-xs text-slate-500">Preview</p>
                    </div>
                  </div>

                  <select
                    id="skill-icon"
                    value={skillForm.icon_name}
                    onChange={(event) =>
                      setSkillForm((current) => ({
                        ...current,
                        icon_name: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    {SKILL_ICONS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={skillForm.is_visible}
                    onChange={(event) =>
                      setSkillForm((current) => ({
                        ...current,
                        is_visible: event.target.checked,
                      }))
                    }
                    className="accent-cyan-300"
                  />
                  Visible on public portfolio
                </label>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSkillOpen(false);
                      setEditingSkill(null);
                    }}
                    className="rounded-xl border border-white/10 px-4 py-3"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
                  >
                    {saving ? (
                      <LoaderCircle
                        className="animate-spin"
                        size={17}
                      />
                    ) : (
                      <Save size={17} />
                    )}
                    {editingSkill
                      ? "Update Skill"
                      : "Save Skill"}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* Categories list */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All Skill Categories
          </h2>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            disabled={loading}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 py-16 text-slate-400">
            <LoaderCircle
              size={22}
              className="animate-spin"
            />
            Loading skills...
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 px-5 py-14 text-center">
            <Layers3
              size={38}
              className="mx-auto mb-4 text-slate-500"
            />

            <h3 className="text-lg font-semibold">
              No skill categories yet
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Create a category first, then add skills to it.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {categories.map((category) => (
              <article
                key={category.id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6"
              >
                {/* Category header and actions */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon
                      name={category.icon_name}
                      size={20}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {category.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${category.is_visible
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                            }`}
                        >
                          {category.is_visible
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {category.skills.length} skills · order{" "}
                        {category.display_order}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setEditingCategory(category.id);
                        setCategoryForm({
                          name: category.name,
                          icon_name: category.icon_name || "Layers3",
                          is_visible: category.is_visible,
                        });
                        setCategoryOpen(true);
                        setSkillOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:border-cyan-400/40"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void toggleCategory(category)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:border-cyan-400/40"
                    >
                      {category.is_visible ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {category.is_visible ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void removeCategory(category)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setSkillForm({
                          ...emptySkill,
                          category_id: category.id,
                        });
                        setEditingSkill(null);
                        setSkillOpen(true);
                        setCategoryOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                    >
                      <Plus size={14} />
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Skills list */}
                {category.skills.length === 0 ? (
                  <p className="py-5 text-sm text-slate-500">
                    No skills in this category yet.
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2 pt-4">
                    {category.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${skill.is_visible &&
                          category.is_visible
                          ? "border-white/10 bg-white/[0.035] text-slate-200"
                          : "border-amber-400/15 bg-amber-400/[0.04] text-slate-500"
                          }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <SkillIcon name={skill.icon_name} size={15} />
                          {skill.name}
                        </span>

                        <button
                          type="button"
                          title={
                            skill.is_visible
                              ? "Hide skill"
                              : "Show skill"
                          }
                          aria-label={`${skill.is_visible ? "Hide" : "Show"
                            } ${skill.name}`}
                          onClick={() =>
                            void toggleSkill(skill)
                          }
                          className="text-slate-500 transition hover:text-cyan-300"
                        >
                          {skill.is_visible ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>

                        <button
                          type="button"
                          title="Edit skill"
                          aria-label={`Edit ${skill.name}`}
                          onClick={() => {
                            setError("");
                            setSuccess("");
                            setEditingSkill(skill.id);
                            setSkillForm({
                              category_id: skill.category_id,
                              name: skill.name,
                              icon_name: skill.icon_name || "Code2",
                              is_visible: skill.is_visible,
                            });
                            setSkillOpen(true);
                            setCategoryOpen(false);
                          }}
                          className="text-slate-500 transition hover:text-cyan-300"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          title="Delete skill"
                          aria-label={`Delete ${skill.name}`}
                          onClick={() =>
                            void removeSkill(skill)
                          }
                          className="text-slate-500 transition hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}

        <footer className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
          Portfolio Admin · Skills Management
        </footer>
      </div>
    </main>
  );
}