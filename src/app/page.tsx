"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";
import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <div id="top" />

      <ScrollIndicator />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects preview />
        <Experience />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
