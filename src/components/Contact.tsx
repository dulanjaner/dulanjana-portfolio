"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  Mail,
} from "lucide-react";

type SubmitState = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitState !== "idle") {
      setSubmitState("idle");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (submitState === "sending") return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const topic = formData.topic.trim();
    const message = formData.message.trim();

    if (!name || !email || !topic || !message) {
      setSubmitState("error");
      return;
    }

    setSubmitState("sending");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/dulanjanakavinda252@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            topic,
            message,
            _subject: `Portfolio Contact: ${topic}`,
            _captcha: "false",
          }),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        result.success === false ||
        result.success === "false"
      ) {
        throw new Error("Unable to submit the message.");
      }

      setSubmitState("sent");

      setFormData({
        name: "",
        email: "",
        topic: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitState("error");
    }
  };

  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
      />

      <div className="mx-auto max-w-2xl">
        {/* Section Heading */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mb-7 text-center sm:mb-8"
        >
          <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Mail
              size={22}
              className="text-cyan-400"
              aria-hidden="true"
            />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-sm">
            Get in Touch
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Let&apos;s build something{" "}
            <span className="gradient-text">together</span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
            Have a project idea, an opportunity, or just want to
            connect? Send me a message. I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="glass rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-7 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Your Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* Topic / Purpose - Text Input */}
            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Topic / Purpose
              </label>

              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={150}
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Internship opportunity, project collaboration..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />

              <p className="mt-2 text-right text-xs text-gray-500">
                {formData.message.length}/5000 characters
              </p>
            </div>

            {/* Success Message */}
            {submitState === "sent" && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-semibold">
                    Message submitted successfully!
                  </p>

                  <p className="mt-1 text-green-400/80">
                    Thank you for reaching out. I appreciate your message.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitState === "error" && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
              >
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-semibold">
                    Unable to submit your message.
                  </p>

                  <p className="mt-1 text-red-400/80">
                    Please check your details and try again. If the
                    problem continues, contact me by email.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitState === "sending"}
              className="primary-button flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitState === "sending" ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Sending Message...
                </>
              ) : submitState === "sent" ? (
                <>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Send Another Message
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-center text-xs leading-6 text-gray-500">
              Your details will be used to respond to your message.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}