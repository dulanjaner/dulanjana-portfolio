"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let animationFrame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
    };

    const particleCount = isMobile ? 35 : 65;
    const connectionDistance = isMobile ? 95 : 125;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      createParticles();
      drawFrame();
    };

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.7,
        alpha: Math.random() * 0.45 + 0.2,
      }));
    };

    const drawFrame = () => {
      context.clearRect(0, 0, width, height);

      // Draw particles.
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Keep particles inside the canvas.
          if (particle.x < 0 || particle.x > width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(width, particle.x));
          }

          if (particle.y < 0 || particle.y > height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(height, particle.y));
          }

          // Subtle mouse interaction.
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < 110) {
            const force = (110 - distance) / 1100;

            particle.x += (dx / distance) * force * 2;
            particle.y += (dy / distance) * force * 2;
          }
        }

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = `rgba(34, 211, 238, ${particle.alpha})`;
        context.fill();
      }

      // Draw lines between nearby particles.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const first = particles[i];
          const second = particles[j];

          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity =
              (1 - distance / connectionDistance) * 0.16;

            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);

            context.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resizeCanvas();

    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}