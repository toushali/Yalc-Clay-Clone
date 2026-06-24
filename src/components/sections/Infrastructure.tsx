"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

const proofs = [
  { name: "Pendo", blurb: "reps hit 200% of quota using agents for research, messaging, and pre-call prep." },
  { name: "Hex", blurb: "reps got a +50% lift in close-rate by contacting leads the same day they show intent." },
  { name: "Terrapinn", blurb: "generates +19% more revenue per rep and cut acquisition cost by 90%." },
];

export default function Infrastructure() {
  return (
    <section className="relative overflow-hidden bg-[#0f4d2c] py-24 lg:py-32">
      {/* soft glow */}
      <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-[#7bbf4d]/20 blur-3xl" />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4f25a]">
              GTM Infrastructure
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
              Build systems that make reps more productive
            </h2>
            <p className="mt-5 max-w-xl text-base md:text-lg text-white/70 leading-relaxed">
              Reps can self-serve the best prospecting data. Chat to get full account
              context in natural language. Build centralized workflows for any rep to run.
            </p>

            <ul className="mt-7 space-y-3">
              {proofs.map((p) => (
                <li key={p.name} className="text-sm text-white/80 leading-snug">
                  <span className="font-semibold text-white">{p.name}</span> {p.blurb}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              
                <a href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Visual — clay staircase / building blocks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square w-full max-w-md mx-auto"
          >
            {/* ascending blocks (productivity going up) */}
            {[
              { h: 90, x: "8%", c: "#fdba74,#f97316,#c2410c", d: 0 },
              { h: 140, x: "32%", c: "#bef264,#84cc16,#4d7c0f", d: 0.3 },
              { h: 200, x: "56%", c: "#7dd3fc,#38bdf8,#0284c7", d: 0.6 },
            ].map((b, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: b.d }}
                className="clay-orb absolute bottom-[18%] w-24 rounded-2xl"
                style={{
                  left: b.x,
                  height: b.h,
                  background: `linear-gradient(135deg,${b.c})`,
                  boxShadow:
                    "inset -6px -6px 14px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.3), 0 20px 35px rgba(0,0,0,0.2)",
                }}
              >
                <div className="absolute top-3 left-4 h-4 w-7 rounded-full bg-white/40 blur-sm" />
              </motion.div>
            ))}

            {/* rolling ball on top */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="clay-orb absolute right-[12%] top-[8%] w-14 h-14 rounded-full"
              style={{ background: "radial-gradient(circle at 30% 30%,#ffd4dc,#ff8aa8 55%,#e64072)" }}
            >
              <div className="absolute top-2 left-3 h-2.5 w-4 rounded-full bg-white/40 blur-sm" />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}