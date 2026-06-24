"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Bot, Database } from "lucide-react";
import Container from "@/components/ui/Container";

/* ===================== 3D pieces ===================== */

function IsoStack({ size = 280 }: { size?: number }) {
  const slab = size * 0.52;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {/* ground glow */}
      <div
        className="absolute rounded-full bg-violet-500/30 blur-3xl"
        style={{ width: size * 0.9, height: size * 0.5, bottom: size * 0.05 }}
      />

      {/* orbiting ring (flat, behind) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-violet-400/20"
        style={{ width: size * 0.92, height: size * 0.92 }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute h-3 w-3 rounded-full bg-fuchsia-400"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(${size * 0.46}px) translate(-50%,-50%)`,
              boxShadow: "0 0 12px #e879f9",
            }}
          />
        ))}
      </motion.div>

      {/* the 3D stack */}
      <div style={{ perspective: 1200 }}>
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", transform: "rotateX(60deg)" }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative"
          >
            {/* stacked slabs floating at different Z heights */}
            {[
              { z: -40, c: "#4c1d95", o: 0.5, s: 1.1 },
              { z: 0, c: "#5b21b6", o: 0.7, s: 1.0 },
              { z: 40, c: "#7c3aed", o: 0.85, s: 0.9 },
              { z: 84, c: "#a78bfa", o: 1, s: 0.75 },
            ].map((sl, i) => (
              <motion.div
                key={i}
                animate={{ rotateZ: [0, -360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-2xl"
                style={{
                  width: slab * sl.s,
                  height: slab * sl.s,
                  left: -(slab * sl.s) / 2,
                  top: -(slab * sl.s) / 2,
                  transform: `translateZ(${sl.z}px)`,
                  background: `linear-gradient(135deg, ${sl.c}, ${sl.c}dd)`,
                  border: "1px solid rgba(196,181,253,0.5)",
                  boxShadow: `0 0 40px rgba(139,92,246,${sl.o * 0.4})`,
                  opacity: sl.o,
                }}
              >
                {/* grid texture on each slab */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right,#c4b5fd 1px,transparent 1px),linear-gradient(to bottom,#c4b5fd 1px,transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </motion.div>
            ))}

            {/* glowing core */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full"
              style={{
                width: size * 0.22,
                height: size * 0.22,
                left: -(size * 0.22) / 2,
                top: -(size * 0.22) / 2,
                transform: "translateZ(120px)",
                background: "radial-gradient(circle,#f5d0fe,#a855f7)",
                boxShadow: "0 0 60px 16px rgba(192,132,252,0.8)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

     {/* floating data shards (flat, in front) */}
      {[
        { pos: { top: "12%", left: "8%" }, d: 0, c: "#22d3ee" },
        { pos: { top: "20%", right: "6%" }, d: 0.6, c: "#e879f9" },
        { pos: { bottom: "18%", left: "12%" }, d: 1.1, c: "#a78bfa" },
        { pos: { bottom: "24%", right: "10%" }, d: 0.3, c: "#818cf8" },
      ].map((s, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -16, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: s.d }}
          className="absolute h-4 w-4 rounded-sm"
          style={{ ...s.pos, background: s.c, boxShadow: `0 0 14px ${s.c}` }}
        />
      ))}
    </div>
  );
}

function NeonCard({ icon, glow }: { icon: React.ReactNode; glow: string }) {
  const ring = glow.replace(/[\d.]+\)$/, "1)");
  return (
    <div className="relative grid place-items-center">
      {/* rotating dashed orbit */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute h-64 w-64 rounded-full border border-dashed"
        style={{ borderColor: ring.replace("1)", "0.3)") }}
      >
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: ring, boxShadow: `0 0 12px ${ring}` }} />
      </motion.div>

      {/* counter-rotating inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute h-48 w-48 rounded-full border"
        style={{ borderColor: ring.replace("1)", "0.2)") }}
      >
        <div className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full" style={{ background: ring, boxShadow: `0 0 10px ${ring}` }} />
      </motion.div>

      {/* pulsing glow halo */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-40 w-40 rounded-3xl blur-2xl"
        style={{ background: glow }}
      />

      {/* main floating card */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative grid h-40 w-40 place-items-center rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-xl"
        style={{ boxShadow: `0 0 60px ${glow}, inset 0 0 30px ${glow.replace(/[\d.]+\)$/, "0.15)")}` }}
      >
        {/* inner grid texture */}
        <div
          className="absolute inset-0 rounded-3xl opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative grid h-20 w-20 place-items-center rounded-2xl"
          style={{ background: glow.replace(/[\d.]+\)$/, "0.25)") }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* floating mini nodes around card */}
      {[
        { pos: { top: "6%", left: "10%" }, d: 0 },
        { pos: { top: "14%", right: "8%" }, d: 0.5 },
        { pos: { bottom: "10%", left: "14%" }, d: 1 },
        { pos: { bottom: "16%", right: "12%" }, d: 0.3 },
      ].map((n, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: n.d }}
          className="absolute h-2.5 w-2.5 rounded-full"
          style={{ ...n.pos, background: ring, boxShadow: `0 0 10px ${ring}` }}
        />
      ))}
    </div>
  );
}

/* ===================== Data ===================== */

const logos = [
  { name: "OpenAI", slug: "openai" },
  { name: "Notion", slug: "notion" },
  { name: "Vercel", slug: "vercel" },
  { name: "Linear", slug: "linear" },
  { name: "Ramp", slug: "ramp" },
  { name: "Intercom", slug: "intercom" },
  { name: "Canva", slug: "canva" },
  { name: "Vanta", slug: "vanta" },
  { name: "Okta", slug: "okta" },
  { name: "Rippling", slug: "rippling" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Stripe", slug: "stripe" },
];

const features = [
  {
    eyebrow: "Data",
    title: "Get data from the most complete marketplace",
    desc: "One contract to buy data from 200+ vendors. Create intent signals from anything on the internet. Bring 1st and 3rd party data together.",
    proofs: [
      ["Anthropic", "3x'd their enrichment rate."],
      ["Intercom", "grew pipeline 140% researching accounts."],
      ["Mistral", "cut TAM mapping from 2 months to 10 days."],
    ],
    cta: "Explore data marketplace",
    icon: <Database className="h-9 w-9 text-violet-200" strokeWidth={2} />,
    glow: "rgba(139,92,246,0.4)",
    reverse: false,
  },
  {
    eyebrow: "Agents",
    title: "Create agents who mimic your best reps",
    desc: "Mine the web for custom data points to research and qualify accounts. Monitor accounts for reasons to engage. Prep reps with the detail they need.",
    proofs: [
      ["OpenAI", "automated pre-call prep with 90-day research."],
      ["Canva", "saved 4 hrs/rep/week on sourcing."],
      ["Vanta", "cut follow-up from 3 days to under 1."],
    ],
    cta: "Explore agents",
    icon: <Bot className="h-9 w-9 text-fuchsia-200" strokeWidth={2} />,
    glow: "rgba(217,70,239,0.4)",
    reverse: true,
  },
];

/* ===================== Shared bits ===================== */

function GradBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.4)] transition-transform hover:scale-[1.03]">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function GhostBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition-colors hover:bg-white/10">
      {children}
    </button>
  );
}

/* ===================== Page ===================== */

export default function DesignV3Dark() {
  return (
    <main
      className="min-h-screen font-sans text-white"
      style={{ background: "linear-gradient(150deg,#0a0a18 0%,#1a0f3d 50%,#2d1b5e 100%)" }}
    >
      {/* glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -left-20 top-1/2 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-50 px-4 py-4">
        <Container>
          <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 text-sm font-bold text-white">C</div>
              <span className="text-lg font-semibold tracking-tight">Clay</span>
            </div>
            <ul className="hidden items-center gap-8 text-sm font-medium text-white/60 lg:flex">
              {["Platform", "Solutions", "Pricing", "Customers"].map((l) => (
                <li key={l} className="cursor-pointer transition-colors hover:text-white">{l}</li>
              ))}
            </ul>
            <button className="rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-semibold shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-transform hover:scale-[1.03]">
              Sign Up
            </button>
          </nav>
        </Container>
      </header>

      {/* HERO */}
      <section className="relative z-10 pb-16 pt-16 lg:pt-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300"
              >
                ✦ Launching today: Audiences in Clay
              </motion.span>
              <h1 className="text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                {["Build systems", "to grow", "revenue"].map((line, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {i === 2 ? (
                      <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{line}</span>
                    ) : line}
                  </motion.span>
                ))}
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/60">
                Infrastructure to get any data, run agentic workflows, and launch GTM plays.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <GradBtn>Start free trial</GradBtn>
                <button className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                  Learn how to start
                </button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <IsoStack />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* LOGO MARQUEE */}
      <section className="relative z-10 pb-16">
        <Container>
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Trusted by 500,000+ leading GTM teams
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-4">
              {[...logos, ...logos].map((logo, i) => (
                <div
                  key={`${logo.slug}-${i}`}
                  className="flex h-20 w-44 shrink-0 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:border-violet-400/40 hover:bg-white/[0.06]"
                >
                  <img
                    src={`https://cdn.simpleicons.org/${logo.slug}/a78bfa`}
                    alt={logo.name}
                    className="h-6 w-6 opacity-80"
                    loading="lazy"
                  />
                  <span className="text-sm font-semibold text-white/70">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-16 lg:py-24">
        <Container>
          <div className="space-y-24 lg:space-y-36">
            {features.map((f) => (
              <div key={f.eyebrow} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${f.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-violet-400">{f.eyebrow}</span>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">{f.title}</h3>
                  <p className="mt-5 max-w-xl text-lg text-white/60">{f.desc}</p>
                  <ul className="mt-7 space-y-3">
                    {f.proofs.map(([n, b]) => (
                      <li key={n} className="text-sm text-white/70">
                        <span className="font-semibold text-white">{n}</span> {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <GradBtn>Start free trial</GradBtn>
                    <GhostBtn>{f.cta}</GhostBtn>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
                >
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${f.glow}, transparent 70%)` }} />
                  <NeonCard icon={f.icon} glow={f.glow} />
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="relative z-10 py-20 lg:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-violet-600/30 to-indigo-900/30 p-10 backdrop-blur-xl lg:p-16">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-violet-300">GTM Infrastructure</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                  Build systems that make reps more productive
                </h2>
                <p className="mt-5 max-w-md text-lg text-white/60">
                  Reps self-serve the best prospecting data. Chat to get full account context. Build centralized workflows for any rep to run.
                </p>
                <div className="mt-8"><GradBtn>Start free trial</GradBtn></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["Pendo", "200%", "of quota"], ["Hex", "+50%", "close-rate"], ["Terrapinn", "+19%", "revenue/rep"]].map(([n, s, l]) => (
                  <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
                    <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent">{s}</div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/40">{l}</div>
                    <div className="mt-2 text-xs font-semibold text-white/80">{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 lg:py-32">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10 flex justify-center"
          >
            <IsoStack size={180} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
          >
            Turn your growth ideas into{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">reality today</span>
          </motion.h2>
          <p className="mt-5 text-lg text-white/60">Start for free today. No credit card required.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GradBtn>Start building for free</GradBtn>
            <GhostBtn>Get a demo</GhostBtn>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-14">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              ["Product", ["Claygent", "Sculptor", "Ads", "Pricing"]],
              ["Use cases", ["Inbound", "ABM", "Outbound", "CRM"]],
              ["Resources", ["University", "Templates", "Community", "FAQ"]],
              ["Company", ["About", "Careers", "Contact", "Press"]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">{title}</h4>
                <ul className="space-y-2.5">
                  {(links as string[]).map((l) => (
                    <li key={l}><a href="#" className="text-sm text-white/50 transition-colors hover:text-white">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
            <span className="font-semibold text-white/70">Clay — Dark</span>
            <span>©2026 Clay Labs Inc. · Born in Brooklyn</span>
          </div>
        </Container>
      </footer>
    </main>
  );
}