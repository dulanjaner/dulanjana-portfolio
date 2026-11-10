"use client";

import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, GraduationCap } from "lucide-react";
import Image from "next/image";

const contacts = [
  {
    icon: FaEnvelope,
    label: "Email",
    href: "mailto:dulanjanakavinda252@gmail.com",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dulanjaner",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/dulanjaner",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/dulanjaner/",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/dulanjaner",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="hero-section relative isolate flex min-h-[90vh] lg:min-h-screen scroll-mt-24 items-center justify-center overflow-hidden px-5 pb-12 pt-24 sm:px-8 lg:px-10"
    >
      {/* Background effects */}
      <div aria-hidden="true" className="hero-orb hero-orb-one" />
      <div aria-hidden="true" className="hero-orb hero-orb-two" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] lg:gap-12"
      >
        {/* Profile card */}
        <motion.aside
          variants={itemVariants}
          whileHover={reduceMotion ? undefined : { y: -5 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-full max-w-sm lg:mx-0"
        >
          <div className="glass profile-card rounded-[1.75rem] p-3 sm:p-3.5">
            <div className="relative h-[290px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900/70 sm:h-[350px]">
              <Image
                src="/resources/me.jpg"
                alt="Portrait of Dulanjana Kumarasinghe"
                fill
                className="profile-image object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 380px"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/75 via-transparent to-white/5" />

              <div className="absolute left-3.5 top-3.5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/55 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Open to opportunities
              </div>
            </div>

            <div className="px-2 pb-2 pt-4 text-center">
              <p className="text-lg font-extrabold tracking-tight sm:text-xl">
                DULANJANA KUMARASINGHE
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                IT Undergraduate
              </p>

              {/* Social links */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {contacts.map((contact, index) => {
                  const Icon = contact.icon;
                  const external = contact.href.startsWith("http");

                  return (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      aria-label={contact.label}
                      title={contact.label}
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, scale: 0.75 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.55 + index * 0.07,
                        duration: 0.25,
                      }}
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.08, y: -2 }
                      }
                      whileTap={
                        reduceMotion ? undefined : { scale: 0.94 }
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300 transition-colors duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/15"
                    >
                      <Icon size={15} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Contact button */}
              <motion.a
                href="#contact"
                whileHover={reduceMotion ? undefined : { scale: 1.025 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="primary-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              >
                Let&apos;s connect
              </motion.a>
            </div>
          </div>
        </motion.aside>

        {/* Introduction */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col items-start gap-4 text-left lg:py-4"
        >
          {/* Welcome badge with icon */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5"
          >
            <div className="icon-box !h-9 !w-9 shrink-0 !rounded-lg">
              <Code2 size={18} aria-hidden="true" />
            </div>

            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.08)]">
              Welcome
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mb-1 text-xs font-medium tracking-[0.25em] text-slate-400 sm:text-sm">
              HELLO, I&apos;M
            </p>

            <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
              DULANJANA
            </h1>

            <h2 className="gradient-text mt-1 text-3xl font-black leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
              KUMARASINGHE
            </h2>

            {/* Degree with matching icon */}
            <div className="mt-3.5 flex items-center gap-2.5">
              <div className="icon-box !h-9 !w-9 shrink-0 !rounded-lg">
                <GraduationCap size={18} aria-hidden="true" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">
                BSc (Hons) Information Technology
              </p>
            </div>
          </motion.div>

          {/* Introduction paragraph */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl text-left text-sm leading-7 text-slate-300 sm:text-base sm:leading-7"
          >
            I&apos;m an Information Technology undergraduate at General Sir John
            Kotelawala Defence University, interested in building useful,
            accessible and responsive digital experiences. I enjoy working
            across web and application development while continuing to strengthen
            my skills in modern technologies, usability and software engineering.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex w-full flex-col gap-2.5 pt-1 sm:w-auto sm:flex-row"
          >
            <motion.a
              href="#projects"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="primary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              Explore my projects
            </motion.a>

            <motion.a
              href="#about"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="secondary-button inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-100"
            >
              More about me
            </motion.a>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            className="mt-2 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-400 sm:text-sm"
          >
            <span>
              <strong className="mr-1.5 text-cyan-300">01</strong>
              Curious builder
            </span>

            <span>
              <strong className="mr-1.5 text-cyan-300">02</strong>
              Continuous learner
            </span>

            <span>
              <strong className="mr-1.5 text-cyan-300">03</strong>
              User-focused
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}