"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import type { SkillCategory, SkillItem } from "@/types/database";

const fallbackCategories: SkillCategory[] = [
    {
        id: "fallback-programming",
        name: "Programming Languages",
        display_order: 1,
        is_visible: true,
        skills: [
            { id: "java", category_id: "fallback-programming", name: "Java", display_order: 1, is_visible: true },
            { id: "javascript", category_id: "fallback-programming", name: "JavaScript", display_order: 2, is_visible: true },
            { id: "typescript", category_id: "fallback-programming", name: "TypeScript", display_order: 3, is_visible: true },
            { id: "python", category_id: "fallback-programming", name: "Python", display_order: 4, is_visible: true },
        ],
    },
];

export default function SkillsPage() {
    const [categories, setCategories] =
        useState<SkillCategory[]>(fallbackCategories);
    const [loading, setLoading] = useState(true);

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

                const result = (data ?? [])
                    .map((category) => ({
                        ...category,
                        skills: ((category.skills ?? []) as SkillItem[])
                            .filter((skill) => skill.is_visible)
                            .sort((a, b) => a.display_order - b.display_order),
                    }))
                    .filter((category) => category.skills.length > 0)
                    .sort((a, b) => a.display_order - b.display_order);

                setCategories(
                    result.length > 0 ? (result as SkillCategory[]) : fallbackCategories
                );
            } catch (error) {
                console.error("Failed to load skills:", error);
                if (active) setCategories(fallbackCategories);
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadSkills();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#030b22] px-6 pb-24 pt-32 text-white">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href="/#skills"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-sky-400 transition hover:text-sky-300"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Home
                    </Link>

                    <header className="mb-12">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                            Technical Expertise
                        </p>

                        <h1 className="text-3xl font-bold sm:text-4xl">
                            My <span className="gradient-text">Skills</span>
                        </h1>

                        <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
                            Explore the technologies, programming languages, databases, and
                            tools I develop my skills in through university projects and
                            practical experience.
                        </p>
                    </header>

                    {loading ? (
                        <p className="py-12 text-center text-gray-400">
                            Loading skills...
                        </p>
                    ) : categories.length === 0 ? (
                        <p className="py-12 text-center text-gray-400">
                            Skills will be added soon.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category, index) => (
                                <motion.section
                                    key={category.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: index * 0.06 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.07]"
                                >
                                    <h2 className="mb-5 text-lg font-semibold text-sky-300">
                                        {category.name}
                                    </h2>

                                    <div className="flex flex-wrap gap-2">
                                        {(category.skills ?? []).map((skill) => (<span
                                            key={skill.id}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:border-sky-400/40 hover:text-white"
                                        >
                                            {skill.name}
                                        </span>
                                        ))}
                                    </div>
                                </motion.section>
                            ))}
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
            </main>

            <Footer />
        </>
    );
}