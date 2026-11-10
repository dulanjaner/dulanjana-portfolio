"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  Code2,
  Lightbulb,
  Target,
  ArrowUpRight,
} from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Development",
    description:
      "Building responsive websites and practical software solutions.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solving",
    description:
      "Exploring new ideas and finding effective solutions to technical challenges.",
  },
  {
    icon: Target,
    title: "Continuous Learning",
    description:
      "Strengthening technical skills and exploring modern technologies through learning and practical projects.",
  },
];

export default function About() {
  const reduceMotion = useReducedMotion();

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
      y: reduceMotion ? 0 : 18,
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
      id="about"
      className="relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-8 text-center sm:mb-9"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3.5 py-1.5 text-xs font-medium text-cyan-300 sm:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Get to know me
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-3 max-w-2xl text-left text-sm leading-7 text-slate-400 sm:text-center sm:text-base"
          >
            I&apos;m an Information Technology undergraduate at General Sir
            John Kotelawala Defence University, passionate about technology,
            software development and creating useful digital experiences.
            I enjoy learning new technologies, solving problems and turning
            ideas into practical applications.
          </motion.p>
        </motion.div>

        {/* Main content */}
        <div className="grid items-stretch gap-5 lg:grid-cols-5 lg:gap-6">
          {/* Education card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="lg:col-span-2"
          >
            <motion.div
              variants={itemVariants}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="glass group relative h-full overflow-hidden rounded-3xl p-5 sm:p-6 lg:p-7"
            >
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-colors duration-300 group-hover:bg-cyan-400/20"
              />

              <div className="relative">
                <div className="icon-box mb-5">
                  <GraduationCap aria-hidden="true" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">
                  My Education
                </p>

                <h3 className="mt-3 text-xl font-semibold leading-relaxed text-white sm:text-2xl">
                  General Sir John Kotelawala Defence University
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                  Faculty of Computing
                </p>

                <div className="my-5 h-px bg-gradient-to-r from-cyan-400/40 via-white/10 to-transparent" />

                <p className="font-medium leading-7 text-slate-200">
                  BSc (Hons) in Information Technology
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Building a strong foundation in computing, software
                  engineering and modern information technologies.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Personal highlights */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="flex flex-col gap-4 lg:col-span-3"
          >
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  className="glass group flex items-start gap-4 rounded-2xl p-4 sm:items-center sm:gap-5 sm:p-5"
                >
                  <div className="icon-box !h-11 !w-11 !rounded-xl sm:!h-12 sm:!w-12">
                    <Icon aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-lg">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-400 sm:leading-7">
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    className="mt-1 shrink-0 text-slate-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300 sm:mt-0"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}