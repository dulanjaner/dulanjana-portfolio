"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BriefcaseBusiness,
  Award,
  ExternalLink,
  X,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const certificates = [
  {
    title: "CCNA",
    desc: "Introduction to Networks",
    image:
      "/resources/CCNA Introduction to Networks Certificate_page-0001.jpg",
  },
  {
    title: "Cybersecurity",
    desc: "Introduction to Cybersecurity",
    image:
      "/resources/cybersecurity-certificate.jpg",
  },
  {
    title: "Web Design",
    desc: "Web Design for Beginners",
    image:
      "/resources/Web_Design_for_Beginners_E-Certificate_page-0001.jpg",
  },
];

export default function Experience() {
  const [selectedCertificate, setSelectedCertificate] =
    useState<(typeof certificates)[number] | null>(null);

  const reduceMotion = useReducedMotion();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="mb-7 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            My Journey
          </span>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Experience &amp;{" "}
            <span className="gradient-text">Certifications</span>
          </h2>

          <p className="mt-2.5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            My professional experience and technical learning achievements.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="space-y-8 sm:space-y-10"
        >
          {/* Work Experience */}
          <motion.div variants={itemVariants}>
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="icon-box !h-9 !w-9 !rounded-xl">
                <BriefcaseBusiness size={18} aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Work Experience
              </h3>
            </div>

            <motion.article
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className="glass group relative overflow-hidden rounded-3xl border border-white/10 p-5 transition-colors duration-300 hover:border-cyan-400/30 sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/[0.05] blur-3xl transition-colors duration-300 group-hover:bg-cyan-400/10"
              />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <div className="relative flex h-14 w-14 shrink-0 self-start items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-2 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/[0.06] group-hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:h-16 sm:w-16 sm:p-2.5">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/10 via-transparent to-white/5 opacity-50"
                  />
                  <div className="relative h-full w-full">
                    <Image
                      src="/resources/Bank of Ceylon.png"
                      alt="Bank of Ceylon logo"
                      fill
                      sizes="64px"
                      className="object-contain drop-shadow-[0_0_1px_rgba(255,255,255,0.85)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white sm:text-2xl">
                        Bank of Ceylon
                      </h4>

                      <p className="mt-1.5 font-medium text-cyan-300">
                        Internship Trainee
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-200 sm:text-sm">
                      June 2023 – January 2024
                    </span>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                    Gained hands-on experience in banking operations during
                    my internship at one of Sri Lanka&apos;s leading financial
                    institutions.
                  </p>
                </div>
              </div>
            </motion.article>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={itemVariants} id="certificates" className="scroll-mt-24">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <div className="icon-box !h-9 !w-9 !rounded-xl">
                    <Award size={18} aria-hidden="true" />
                  </div>

                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    Certifications
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Technical courses and professional learning achievements.
                </p>
              </div>

              <Link
                href="/certificates"
                className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/5 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-colors duration-300 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                View All Certificates
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Certificate cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {certificates.map((cert) => (
                <motion.button
                  key={cert.title}
                  type="button"
                  variants={itemVariants}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  onClick={() => setSelectedCertificate(cert)}
                  aria-label={`View ${cert.title} certificate`}
                  className="glass group w-full cursor-pointer rounded-2xl border border-white/10 p-3.5 text-left transition-colors duration-300 hover:border-cyan-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="relative flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
                    <Image
                      src={cert.image}
                      alt={`${cert.title} certificate preview`}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent px-3 pb-2.5 pt-7">
                      <span className="text-xs font-medium text-slate-200">
                        Certificate preview
                      </span>

                      <ExternalLink
                        size={15}
                        aria-hidden="true"
                        className="text-cyan-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5">
                    <div className="icon-box !h-9 !w-9 !rounded-lg">
                      <GraduationCap aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white transition-colors group-hover:text-cyan-200">
                        {cert.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {cert.desc}
                      </p>

                      <p className="mt-2 text-xs font-medium text-cyan-300">
                        Click to enlarge
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Certificate preview modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedCertificate.title} certificate preview`}
              initial={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.97,
                y: reduceMotion ? 0 : 12,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.97,
                y: reduceMotion ? 0 : 12,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0b1020] shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="icon-box !h-10 !w-10 !rounded-xl">
                    <Award aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {selectedCertificate.title}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-400">
                      {selectedCertificate.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Close certificate preview"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="relative h-[65vh] min-h-[250px] w-full sm:h-[75vh]">
                <Image
                  src={selectedCertificate.image}
                  alt={`${selectedCertificate.title} certificate`}
                  fill
                  sizes="100vw"
                  className="object-contain p-3 sm:p-5"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}