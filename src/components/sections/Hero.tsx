"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

const headlineWords = ["Build", "systems", "to", "grow", "revenue"];

// Pine tree positions on the hills (left%, bottom px, scale, opacity)
const trees = [
  { left: "6%", bottom: 150, s: 0.7, o: 0.9 },
  { left: "14%", bottom: 175, s: 0.5, o: 0.7 },
  { left: "22%", bottom: 200, s: 0.85, o: 1 },
  { left: "78%", bottom: 195, s: 0.8, o: 1 },
  { left: "86%", bottom: 170, s: 0.55, o: 0.8 },
  { left: "93%", bottom: 150, s: 0.65, o: 0.85 },
  { left: "70%", bottom: 215, s: 0.45, o: 0.6 },
];

function Tree({ s }: { s: number }) {
  return (
    <svg width={60 * s} height={90 * s} viewBox="0 0 60 90">
      <ellipse cx="30" cy="85" rx="14" ry="4" fill="rgba(0,0,0,0.12)" />
      <rect x="26" y="62" width="8" height="20" rx="2" fill="#5b4636" />
      <path d="M30 8 L48 42 L12 42 Z" fill="#4a8a3a" />
      <path d="M30 24 L52 60 L8 60 Z" fill="#3f7d31" />
      <path d="M30 4 L42 30 L18 30 Z" fill="#56994a" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen hero-sky overflow-hidden flex flex-col">
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="cloud absolute top-24 left-[8%] w-72 h-20"
        />
        <motion.div
          animate={{ x: [0, -70, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="cloud absolute top-32 right-[12%] w-96 h-24"
        />
        <motion.div
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="cloud absolute top-44 left-[45%] w-80 h-16"
        />
      </div>

      {/* Hills */}
      <div className="absolute bottom-0 left-0 right-0 h-[62%] pointer-events-none">
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hillA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7cbf4a" />
              <stop offset="100%" stopColor="#4f9128" />
            </linearGradient>
            <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5fa336" />
              <stop offset="100%" stopColor="#3a7320" />
            </linearGradient>
          </defs>
          <path d="M0,90 C300,20 600,130 900,70 C1140,28 1320,110 1440,60 L1440,400 L0,400 Z" fill="url(#hillA)" />
          <path d="M0,190 C360,120 700,230 1040,170 C1240,135 1360,200 1440,170 L1440,400 L0,400 Z" fill="url(#hillB)" />
        </svg>
      </div>

      {/* Trees */}
      <div className="absolute inset-0 pointer-events-none">
        {trees.map((t, i) => (
          <div key={i} className="absolute" style={{ left: t.left, bottom: t.bottom, opacity: t.o }}>
            <Tree s={t.s} />
          </div>
        ))}
      </div>

      {/* Dark grass gradient for text contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-[52%] pointer-events-none bg-gradient-to-t from-[#1f5214]/90 via-[#2f6b1f]/40 to-transparent" />

      {/* ===== CLAYMATION MACHINE (clustered, upper-middle) ===== */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[560px] max-w-[80vw] h-[280px] scale-90"
        >
          {/* Funnel bowl with colorful shapes — top center */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="clay-orb absolute left-[26%] top-0 w-36 h-28"
          >
            <svg viewBox="0 0 140 110" className="w-full h-full drop-shadow-xl">
              {/* shapes in bowl */}
              <circle cx="50" cy="22" r="11" fill="#ef4444" />
              <rect x="64" y="10" width="20" height="20" rx="3" fill="#3b82f6" transform="rotate(15 74 20)" />
              <polygon points="92,30 104,8 116,30" fill="#a855f7" />
              <circle cx="78" cy="30" r="9" fill="#f59e0b" />
              {/* bowl */}
              <path d="M28 34 L112 34 L88 64 L52 64 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <ellipse cx="70" cy="34" rx="42" ry="7" fill="#e2e8f0" />
              {/* stem */}
              <rect x="66" y="64" width="8" height="30" fill="#94a3b8" />
            </svg>
          </motion.div>

          {/* Blue curly tube with dropping balls — center */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="clay-orb absolute left-[44%] top-[24%] w-24 h-44"
          >
            <div
              className="w-full h-full rounded-[36px] relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#7dd3fc 0%,#38bdf8 50%,#0284c7 100%)",
                boxShadow: "inset -8px -8px 18px rgba(0,0,0,0.15), inset 8px 8px 18px rgba(255,255,255,0.35)",
              }}
            >
              <div className="absolute top-4 left-3 w-2.5 h-28 bg-white/30 rounded-full blur-sm" />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-7 h-7 rounded-full animate-ball-drop"
                style={{ background: "radial-gradient(circle at 35% 30%,#fef3c7,#fbbf24 55%,#b45309)" }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 rounded-full animate-ball-drop"
                style={{ background: "radial-gradient(circle at 35% 30%,#fecaca,#ef4444 55%,#991b1b)", animationDelay: "1.5s" }}
              />
            </div>
          </motion.div>

          {/* Orange bar-chart blocks — right */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="clay-orb absolute right-[2%] top-[34%] flex items-end gap-1.5"
          >
            {[44, 64, 88].map((h, i) => (
              <div
                key={i}
                className="w-9 rounded-t-lg"
                style={{
                  height: h,
                  background: "linear-gradient(135deg,#fdba74,#f97316 60%,#c2410c)",
                  boxShadow: "inset -3px -3px 8px rgba(0,0,0,0.15), 0 12px 20px rgba(0,0,0,0.12)",
                }}
              />
            ))}
          </motion.div>

          {/* Green seesaw plank — below center */}
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="clay-orb absolute left-[28%] top-[62%] w-48 h-6 origin-center"
            style={{
              background: "linear-gradient(135deg,#bef264,#84cc16 60%,#4d7c0f)",
              borderRadius: 12,
              boxShadow: "inset -3px -3px 8px rgba(0,0,0,0.12), 0 10px 18px rgba(0,0,0,0.1)",
            }}
          >
            <div className="absolute -top-4 left-2 w-7 h-7 rounded-full"
              style={{ background: "radial-gradient(circle at 35% 30%,#fed7aa,#fb923c 60%,#c2410c)" }} />
          </motion.div>
          {/* Seesaw fulcrum */}
          <div className="absolute left-[48%] top-[70%] w-0 h-0 border-l-[14px] border-r-[14px] border-b-[22px] border-l-transparent border-r-transparent border-b-[#475569]" />

          {/* Magnifying glass — center-low */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="clay-orb absolute left-[14%] top-[44%] w-20 h-20"
          >
            <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
              <circle cx="32" cy="32" r="22" fill="rgba(186,230,253,0.5)" stroke="#0ea5e9" strokeWidth="6" />
              <circle cx="26" cy="26" r="7" fill="rgba(255,255,255,0.6)" />
              <rect x="48" y="48" width="28" height="10" rx="5" fill="#854d0e" transform="rotate(45 48 48)" />
            </svg>
          </motion.div>

          {/* Yellow magnet — left */}
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            className="clay-orb absolute left-[2%] top-[20%] w-16 h-16"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <defs>
                <linearGradient id="mag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
              <path d="M25 20 Q25 72 50 72 Q75 72 75 20 L63 20 Q63 60 50 60 Q37 60 37 20 Z"
                fill="url(#mag)" stroke="#854d0e" strokeWidth="3" />
              <rect x="25" y="14" width="12" height="10" fill="#dc2626" />
              <rect x="63" y="14" width="12" height="10" fill="#2563eb" />
            </svg>
          </motion.div>

          {/* Pink orb — upper right */}
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="clay-orb absolute right-[20%] top-[4%] w-16 h-16 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 30%,#ffd4dc,#ff8aa8 55%,#e64072)" }}
          >
            <div className="absolute top-2 left-3 w-4 h-2.5 bg-white/40 rounded-full blur-sm" />
          </motion.div>

          {/* Small floating balls */}
          <motion.div
            animate={{ y: [0, -22, 0], x: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="clay-orb absolute right-[36%] top-[12%] w-9 h-9 rounded-full"
            style={{ background: "radial-gradient(circle at 30% 30%,#d4c4ff,#9d7cf2 55%,#6b46c1)" }}
          />

          {/* Sparkles */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute right-[14%] top-0 text-brand"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l3 9h9l-7.5 5.5L19 24l-7-5.5L5 24l2.5-9.5L0 9h9z" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
            className="absolute left-[24%] top-[40%] text-yellow-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l3 9h9l-7.5 5.5L19 24l-7-5.5L5 24l2.5-9.5L0 9h9z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== TEXT OVERLAY (bottom) ===== */}
      <Container className="relative z-10 pb-8 lg:pb-12">
        {/* Eyebrow */}
        <motion.a
          href="#"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#e8f95b] hover:text-white transition-colors mb-5"
        >
          Launching today: Audiences in Clay
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.a>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Headline */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[0.9]">
            {headlineWords.slice(0, 3).map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-[0.22em]"
              >
                {w}
              </motion.span>
            ))}
            <br />
            {headlineWords.slice(3).map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-[0.22em]"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          {/* Subtext + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="lg:max-w-xs lg:pb-3"
          >
            <p className="text-white/90 text-base md:text-lg leading-snug mb-5">
              Infrastructure to get any data, run agentic workflows, and launch GTM plays.
            </p>
            <div className="flex flex-row gap-3">
              
               <a href="#"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-foreground px-6 py-3 text-sm font-semibold whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
              
                <a href="#"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#d4f25a] text-foreground px-6 py-3 text-sm font-semibold whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
              >
                Get a demo
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}