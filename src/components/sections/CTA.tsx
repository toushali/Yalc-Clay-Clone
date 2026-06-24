"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

export default function CTA() {
  return (
    <section className="relative overflow-hidden hero-sky py-24 lg:py-32">
      {/* hills */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none">
        <svg viewBox="0 0 1440 400" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaHillA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7cbf4a" />
              <stop offset="100%" stopColor="#4f9128" />
            </linearGradient>
            <linearGradient id="ctaHillB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5fa336" />
              <stop offset="100%" stopColor="#3a7320" />
            </linearGradient>
          </defs>
          <path d="M0,140 C360,60 720,180 1080,120 C1260,90 1380,140 1440,120 L1440,400 L0,400 Z" fill="url(#ctaHillA)" />
          <path d="M0,240 C360,180 720,280 1080,220 C1260,190 1380,240 1440,220 L1440,400 L0,400 Z" fill="url(#ctaHillB)" />
        </svg>
      </div>

      {/* floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="clay-orb absolute left-[12%] top-[18%] w-20 h-20 rounded-full"
        style={{ background: "radial-gradient(circle at 30% 30%,#ffb88a,#ff7a3d 55%,#d94f12)" }}
      />
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="clay-orb absolute right-[14%] top-[24%] w-16 h-16 rounded-full"
        style={{ background: "radial-gradient(circle at 30% 30%,#d4c4ff,#9d7cf2 55%,#6b46c1)" }}
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="clay-orb absolute right-[28%] top-[12%] w-12 h-12 rounded-full"
        style={{ background: "radial-gradient(circle at 30% 30%,#bef264,#84cc16 55%,#4d7c0f)" }}
      />

      <Container className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[0.95]"
        >
          Turn your growth ideas into reality today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 text-lg text-foreground/70"
        >
          Start for free today. No credit card required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          
            <a href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
          >
            Start building for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          
            <a href="#"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-white/90 transition-colors shadow-lg"
          >
            Get a demo
          </a>
        </motion.div>
      </Container>
    </section>
  );
}