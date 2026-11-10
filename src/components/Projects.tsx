"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Sparkles, Layers, AlertCircle, Code2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { ProjectItem } from "@/types/database";

function toDisplayProject(row: ProjectItem) {
  return {
    id: row.id,
    title: row.title,
    tech: row.tech_summary || "",
    description: row.short_description || "",
    icon: row.icon || "💻",
    fullDescription: row.full_description || row.short_description || "",
    challenges: Array.isArray(row.challenges) ? row.challenges : [],
    architecture: row.architecture || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    githubUrl: row.github_url || "",
    liveUrl: row.live_url || undefined,
  };
}

export default function Projects({ preview = false }: { preview?: boolean }) {
  const [projects, setProjects] = useState<ReturnType<typeof toDisplayProject>[]>([]);
  const [selectedProject, setSelectedProject] = useState<ReturnType<typeof toDisplayProject> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProjects() {
      setLoading(true);
      setLoadError(null);
      const supabase = createClient();
      if (!supabase) {
        const message = "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
        console.error(`[Public Projects] ${message}`);
        if (active) { setLoadError(message); setLoading(false); }
        return;
      }
      const { data, error } = await supabase
        .from("projects")
        .select("id,title,tech_summary,short_description,full_description,icon,cover_image_url,challenges,architecture,tags,github_url,live_url,display_order,is_visible,created_at,updated_at")
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      if (error) {
        console.error("[Public Projects] Failed to load projects from Supabase:", error);
        if (active) { setLoadError("Projects could not be loaded right now. Please try refreshing the page."); setLoading(false); }
        return;
      }
      if (active) {
        setProjects((data ?? []).map((row) => toDisplayProject(row as ProjectItem)));
        setLoading(false);
      }
    }
    void loadProjects();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  const visibleProjects = preview ? projects.slice(0, 3) : projects;
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="projects" className="py-24 w-full max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-400 font-semibold mb-2">Selected Works</p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold leading-tight">Featured Projects</motion.h2>
        </div>
        <p className="text-gray-400 text-sm max-w-md">Explore projects, technologies, technical challenges, architecture, and source code.</p>
      </div>

      {loading && <p className="py-12 text-center text-gray-400" role="status">Loading projects…</p>}
      {!loading && loadError && <div role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{loadError}</div>}
      {!loading && !loadError && projects.length === 0 && <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">No public projects have been added yet.</div>}

      {!loading && !loadError && visibleProjects.length > 0 && (
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <motion.button type="button" key={project.id} variants={cardVariants} whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(56, 189, 248, 0.2)" }} onClick={() => setSelectedProject(project)} className="glass p-6 rounded-2xl transition-all duration-300 group cursor-pointer border border-white/10 relative overflow-hidden flex flex-col justify-between text-left">
              <div>
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 relative group-hover:border-sky-400/40 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="text-xs uppercase tracking-[0.22em] text-sky-300 font-semibold">Project</p><p className="mt-1 text-sm text-gray-400 font-medium">{project.tech}</p></div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">{project.icon}</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg group-hover:text-sky-300 transition-colors">{project.title}</h3>
                <p className="text-gray-300 mt-3 text-sm line-clamp-3 leading-relaxed">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{project.tags.slice(0, 4).map((tag) => <span key={tag} className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-gray-300 text-xs">{tag}</span>)}</div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400"><span className="flex items-center gap-1.5 text-sky-400 font-medium"><Sparkles className="w-3.5 h-3.5" /> Explore Project</span><span className="group-hover:text-white">Details ↗</span></div>
            </motion.button>
          ))}
        </motion.div>
      )}
      {preview && projects.length > 3 && <div className="mt-8 text-center"><a href="/projects" className="inline-flex items-center gap-2 rounded-xl border border-sky-400/30 px-5 py-3 text-sky-300 hover:bg-sky-400/10 transition-colors">View All Projects <ExternalLink className="w-4 h-4" /></a></div>}

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-2xl glass border border-white/20 rounded-3xl p-6 sm:p-8 z-50 shadow-2xl bg-[#080e24]/95 text-white max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedProject(null)} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gray-300 hover:text-white" aria-label="Close project details"><X className="w-5 h-5" /></button>
              <div className="flex items-start gap-4 mb-6"><div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shrink-0">{selectedProject.icon}</div><div><p className="text-xs uppercase tracking-widest text-sky-400 font-semibold">Project Case Study</p><h3 className="text-2xl font-extrabold text-white mt-1">{selectedProject.title}</h3><p className="text-sm text-gray-400 mt-0.5">{selectedProject.tech}</p></div></div>
              <div className="flex flex-wrap gap-2 mb-6">{selectedProject.tags.map((tag) => <span key={tag} className="px-3 py-1 bg-sky-500/10 border border-sky-400/20 text-sky-300 rounded-full text-xs font-medium">{tag}</span>)}</div>
              <div className="space-y-6 text-sm text-gray-300"><div><h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-2"><Code2 className="w-4 h-4 text-sky-400" /> Overview & Purpose</h4><p className="leading-relaxed text-gray-200 bg-white/5 p-4 rounded-xl border border-white/5">{selectedProject.fullDescription}</p></div>
                {selectedProject.challenges.length > 0 && <div><h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-400" /> Key Technical Challenges</h4><ul className="grid gap-2 bg-white/5 p-4 rounded-xl border border-white/5">{selectedProject.challenges.map((challenge, index) => <li key={`${index}-${challenge}`} className="flex items-start gap-2.5 text-gray-300"><span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-2 shrink-0" /><span className="leading-relaxed">{challenge}</span></li>)}</ul></div>}
                {selectedProject.architecture && <div><h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> System Architecture & Tools</h4><p className="leading-relaxed text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">{selectedProject.architecture}</p></div>}</div>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-end">{selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/10"><FaGithub className="w-4 h-4" /> View Source Code</a>}{selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-sky-500/25"><ExternalLink className="w-4 h-4" /> Live Demo / Preview</a>}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
