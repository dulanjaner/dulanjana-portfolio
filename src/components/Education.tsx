"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, School, CalendarDays } from "lucide-react";

const educationItems = [
  {
    title: "General Sir John Kotelawala Defence University",
    qualification: "BSc (Hons) Information Technology",
    period: "2024 - 2028",
    image: "/resources/KDU LOGO ORIGINAL 3x2.png",
    imageAlt: "KDU logo",
    current: true,
    icon: GraduationCap,
  },
  {
    title: "St. Thomas' College, Matale",
    qualification: "Commerce Stream",
    period: "2013 - 2022",
    image: "/resources/St_Thomas'_College_Matale_Crest.png",
    imageAlt: "St. Thomas' College crest",
    current: false,
    icon: School,
  },
];

export default function Education() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="education"
      className="relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 h-80 w-80 rounded-full bg-cyan-400/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          viewport={{ once: true, amount: 0.15 }}
          className="mb-7 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            My Journey
          </span>

          <h2 className="mt-2.5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            Education <span className="gradient-text">&amp; Learning</span>
          </h2>

          <p className="mt-2.5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            My academic journey and the foundation behind my interest in
            technology and information systems.
          </p>
        </motion.div>

        {/* Education timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-cyan-400/60 via-sky-400/30 to-transparent sm:left-6"
          />

          <div className="space-y-5 sm:space-y-6">
            {educationItems.map((item, index) => {
              const ItemIcon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: -14, y: 8 }
                  }
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : index * 0.1,
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  className="relative pl-12 sm:pl-14"
                >
                  {/* Timeline icon */}
                  <div className="absolute left-0 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-slate-950 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)] sm:h-12 sm:w-12">
                    <ItemIcon
                      size={21}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Education card */}
                  <motion.article
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ duration: 0.2 }}
                    className={`glass group relative w-full overflow-hidden rounded-2xl border p-5 transition-colors duration-300 sm:p-6 lg:p-7 ${item.current
                      ? "border-cyan-400/25 hover:border-cyan-400/45"
                      : "border-white/10 hover:border-white/20"
                      }`}
                  >
                    {item.current && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl transition-colors duration-300 group-hover:bg-cyan-400/10"
                      />
                    )}

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                      {/* Institution details */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {item.current ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.08] px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.12)]">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                              </span>
                              University
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 text-xs font-medium text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Secondary Education
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold leading-snug text-white sm:text-lg lg:text-xl">
                          {item.title}
                        </h3>

                        <p className="mt-2.5 text-sm font-semibold leading-6 text-cyan-300 sm:text-base">
                          {item.qualification}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-cyan-400"
                            aria-hidden="true"
                          />
                          <span>{item.period}</span>
                        </div>
                      </div>

                      {/* Institution logo badge */}
                      <div className="relative flex h-16 w-16 shrink-0 self-start items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-2.5 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/[0.06] group-hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:h-[4.75rem] sm:w-[4.75rem] sm:p-3">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/10 via-transparent to-white/5 opacity-50"
                        />
                        <div className="relative h-full w-full">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            sizes="76px"
                            className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}