"use client";

import { motion } from "framer-motion";

/* ---------- Visual 1: DATA — magnifying glass over a tray of orbs ---------- */
export function DataVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* tray */}
      <div
        className="absolute bottom-[22%] w-56 h-10 rounded-full"
        style={{
          background: "linear-gradient(135deg,#cbd5e1,#94a3b8 60%,#64748b)",
          boxShadow: "inset -4px -4px 10px rgba(0,0,0,0.2), 0 20px 30px rgba(0,0,0,0.15)",
        }}
      />
      {/* orbs in tray */}
      {[
        { c: "#ff8aa8,#e64072", x: -70, d: 0 },
        { c: "#fbbf24,#b45309", x: -30, d: 0.4 },
        { c: "#7dd3fc,#0284c7", x: 12, d: 0.8 },
        { c: "#bef264,#4d7c0f", x: 54, d: 1.2 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: o.d }}
          className="clay-orb absolute bottom-[28%] w-12 h-12 rounded-full"
          style={{
            left: `calc(50% + ${o.x}px)`,
            background: `radial-gradient(circle at 30% 30%,${o.c})`,
          }}
        />
      ))}
      {/* big magnifying glass */}
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="clay-orb absolute top-[12%] left-[30%] w-40 h-40"
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="lens" cx="40%" cy="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="60%" stopColor="rgba(186,230,253,0.45)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.35)" />
            </radialGradient>
          </defs>
          <circle cx="64" cy="64" r="48" fill="url(#lens)" stroke="#0ea5e9" strokeWidth="12" />
          <circle cx="48" cy="46" r="12" fill="rgba(255,255,255,0.7)" />
          <rect x="98" y="98" width="56" height="18" rx="9" fill="#854d0e" transform="rotate(45 98 98)" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ---------- Visual 2: AGENTS — little clay robot ---------- */
export function AgentVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="clay-orb relative"
      >
        {/* antenna */}
        <div className="absolute left-1/2 -top-8 -translate-x-1/2 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-4 rounded-full"
            style={{ background: "radial-gradient(circle at 30% 30%,#fed7aa,#fb923c 60%,#c2410c)" }}
          />
          <div className="w-1.5 h-7 bg-slate-400" />
        </div>
        {/* head */}
        <div
          className="w-44 h-36 rounded-[2rem] relative flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#e2e8f0,#cbd5e1 55%,#94a3b8)",
            boxShadow: "inset -8px -8px 18px rgba(0,0,0,0.18), inset 8px 8px 18px rgba(255,255,255,0.5), 0 25px 40px rgba(0,0,0,0.18)",
          }}
        >
          {/* face screen */}
          <div className="w-32 h-24 rounded-2xl bg-slate-800 flex items-center justify-center gap-4">
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1] }}
              className="w-5 h-5 rounded-full bg-sky-400"
              style={{ boxShadow: "0 0 12px #38bdf8" }}
            />
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1], delay: 0.02 }}
              className="w-5 h-5 rounded-full bg-rose-400"
              style={{ boxShadow: "0 0 12px #fb7185" }}
            />
          </div>
          {/* side ears */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-10 rounded-l-lg bg-slate-400" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-10 rounded-r-lg bg-slate-400" />
        </div>
      </motion.div>
    </div>
  );
}