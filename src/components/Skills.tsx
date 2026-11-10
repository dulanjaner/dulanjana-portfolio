
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Database,
  ShieldCheck,
  Layers3,
  Globe,
  Server,
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
import type { SkillCategory, SkillItem } from "@/types/database";

type CategoryWithIcon = SkillCategory & {
  icon_name?: string;
  skills: SkillWithIcon[];
};

type SkillWithIcon = SkillItem & {
  icon_name?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Database,
  ShieldCheck,
  Layers3,
  Globe,
  Server,
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
};

function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Code2;
  return ICON_MAP[iconName] ?? Code2;
}

export default function Skills() {
  const reduceMotion = useReducedMotion();

  const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSkills() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("skill_categories")
          .select("*, skills(*)")
          .eq("is_visible", true)
          .order("display_order", { ascending: true });

        if (error) throw error;

        if (!active) return;

        const result = ((data ?? []) as unknown as CategoryWithIcon[])
          .map((category) => ({
            ...category,
            skills: (category.skills ?? [])
              .filter((skill) => skill.is_visible)
              .sort(
                (a, b) => a.display_order - b.display_order
              ),
          }))
          .filter((category) => category.skills.length > 0)
          .sort(
            (a, b) => a.display_order - b.display_order
          );

        setCategories(result);
        setLoadError(false);
      } catch (error) {
        console.error("[Home Skills] Failed to load:", error);

        if (active) {
          setCategories([]);
          setLoadError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSkills();

    return () => {
      active = false;
    };
  }, []);

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="mb-7 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            What I work with
          </span>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            My <span className="gradient-text">Skills</span>
          </h2>

          <p className="mt-2.5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Technologies and tools I work with and continue to develop
            through learning and practical projects.
          </p>
        </motion.div>

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Loading skills...
          </p>
        ) : loadError ? (
          <p className="py-10 text-center text-sm text-red-300">
            Unable to load skills. Please try again later.
          </p>
        ) : categories.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Skills will be added soon.
          </p>
        ) : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {categories.map((item, index) => {
              const CategoryIcon = getIcon(item.icon_name);

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: reduceMotion ? 0 : -14,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : index * 0.07,
                    ease: "easeOut",
                  }}
                  className="grid gap-3 py-4 sm:grid-cols-[205px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300">
                      <CategoryIcon size={20} aria-hidden="true" />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                      {item.name}
                    </h3>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => {
                      const SkillIcon = getIcon(skill.icon_name);

                      return (
                        <li
                          key={skill.id}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 sm:px-3.5 sm:py-2 sm:text-sm"
                        >
                          <SkillIcon
                            size={14}
                            className="shrink-0 text-cyan-300"
                            aria-hidden="true"
                          />
                          {skill.name}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-14 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-8 text-center">
          <h2 className="text-xl font-semibold">
            Always Learning, Always Improving
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            I continue to develop my technical knowledge through university
            projects, practical assignments, and independent learning.
          </p>
        </div>
      </div>
    </section>
  );
}
