"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const certificates = [
    {
        title: "CCNA",
        description: "Introduction to Networks",
        image:
            "/resources/CCNA Introduction to Networks Certificate_page-0001.jpg",
    },
    {
        title: "Cybersecurity",
        description: "Introduction to Cybersecurity",
        image:
            "/resources/cybersecurity-certificate.jpg",
    },
    {
        title: "Web Design",
        description: "Web Design for Beginners",
        image:
            "/resources/Web_Design_for_Beginners_E-Certificate_page-0001.jpg",
    },
];

export default function CertificatesPage() {
    const [selectedCertificate, setSelectedCertificate] =
        useState<(typeof certificates)[number] | null>(null);

    useEffect(() => {
        if (!selectedCertificate) return;

        const previousOverflow = document.body.style.overflow;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedCertificate(null);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [selectedCertificate]);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#030b22] px-6 pb-24 pt-32 text-white">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href="/#certificates"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-sky-400 transition hover:text-sky-300"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Home
                    </Link>

                    {/* Page heading */}
                    <header className="mb-12">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
                            Achievements & Learning
                        </p>

                        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                            My Certificates
                        </h1>

                        <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
                            Explore my certifications and completed learning achievements.
                            Select a certificate to view it in a larger format.
                        </p>
                    </header>

                    {/* Certificate gallery */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {certificates.map((certificate, index) => (
                            <motion.button
                                key={certificate.title}
                                type="button"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: index * 0.1 }}
                                whileHover={{ y: -6 }}
                                onClick={() => setSelectedCertificate(certificate)}
                                aria-label={`View ${certificate.title} certificate`}
                                className="glass group rounded-2xl border border-white/10 p-4 text-left transition hover:border-sky-400/40"
                            >
                                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
                                    <Image
                                        src={certificate.image}
                                        alt={`${certificate.title} certificate`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <div className="mt-5 flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold transition group-hover:text-sky-300">
                                            {certificate.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-400">
                                            {certificate.description}
                                        </p>
                                    </div>

                                    <span
                                        className="mt-1 text-sky-400"
                                        aria-hidden="true"
                                    >
                                        ↗
                                    </span>
                                </div>

                                <p className="mt-4 text-xs font-medium text-sky-400">
                                    Click to enlarge
                                </p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Return to homepage */}
                    <div className="mt-14 flex justify-center">
                        <Link
                            href="/#certificates"
                            className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 px-6 py-3 font-medium text-sky-300 transition hover:bg-sky-400/10"
                        >
                            <span aria-hidden="true">←</span>
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </main>

            {/* Full-size certificate preview */}
            <AnimatePresence>
                {selectedCertificate && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCertificate(null)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${selectedCertificate.title} certificate preview`}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-2xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
                                <div>
                                    <h2 className="font-semibold">
                                        {selectedCertificate.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {selectedCertificate.description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedCertificate(null)}
                                    className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
                                >
                                    Close ✕
                                </button>
                            </div>

                            <div className="relative h-[65vh] min-h-[250px] w-full sm:h-[75vh]">
                                <Image
                                    src={selectedCertificate.image}
                                    alt={`${selectedCertificate.title} certificate`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain p-4"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}