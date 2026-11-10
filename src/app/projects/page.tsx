"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";

export default function AllProjectsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <div className="pt-20">
                <Projects />
            </div>
            <Footer />
        </main>
    );
}
