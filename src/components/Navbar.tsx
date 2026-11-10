"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", id: "top" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = id === "top" ? "/" : `/#${id}`; return;
    }

    const section = document.getElementById(id);

    if (!section) {
      window.location.href = id === "top" ? "/" : `/#${id}`;
      return;
    }

    setMobileMenuOpen(false);
    setActiveSection(id);

    // Keep the URL in sync without triggering a second scroll.
    window.history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);

    // Use the CSS navbar offset as the single source of truth.
    const navbarOffset = Number.parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--navbar-offset")
    ) || 100;

    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - navbarOffset),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    });

  };

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 60;

        if (atBottom) {
          setActiveSection("contact");
          return;
        }

        const navbarOffset = Number.parseFloat(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--navbar-offset")
        ) || 100;

        const activationLine = navbarOffset + 20;
        let currentSection = "top";

        for (const item of navItems) {
          const section = document.getElementById(item.id);

          if (
            section &&
            section.getBoundingClientRect().top <= activationLine
          ) {
            currentSection = item.id;
          }
        }

        setActiveSection(currentSection);
      });
    };

    const handleResize = () => {
      updateActiveSection();

      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={() => navigateToSection("top")}
          className="shrink-0 text-left text-xs font-extrabold tracking-tight text-white sm:text-sm"
        >
          DULANJANA{" "}
          <span className="text-sky-400">KUMARASINGHE</span>
        </button>

        <div className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-xl px-3 py-1.5 text-xs font-medium transition-colors duration-200 sm:text-sm ${isActive
                  ? "bg-sky-400/10 text-sky-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-200 ${isActive
                    ? "w-8 opacity-100"
                    : "w-0 opacity-0"
                    }`}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="rounded-xl border border-white/10 p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="liquid-glass mx-auto mt-2 max-w-5xl rounded-2xl p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${activeSection === item.id
                  ? "bg-sky-400/10 text-sky-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>

  );
}