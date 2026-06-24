"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Sparkles, Zap, Bot } from "lucide-react";
import Container from "@/components/ui/Container";

/* ===================== Reusable 3D pieces ===================== */

function GlassOrb({
  size,
  grad,
  className = "",
  delay = 0,
  dur = 6,
}: {
  size: number;
  grad: string;
  className?: string;
  delay?: number;
  dur?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: grad,
        boxShadow:
          "inset -8px -10px 22px rgba(0,0,0,0.12), inset 8px 10px 22px rgba(255,255,255,0.55), 0 30px 50px -12px rgba(80,70,180,0.35)",
      }}
    >
      <div
        className="absolute rounded-full bg-white/70 blur-[2px]"
        style={{ width: size * 0.22, height: size * 0.16, top: size * 0.16, left: size * 0.22 }}
      />
    </motion.div>
  );
}

function GlassCoin({
  size,
  grad,
  children,
}: {
  size: number;
  grad: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: grad,
        boxShadow:
          "inset -8px -10px 22px rgba(0,0,0,0.15), inset 8px 10px 22px rgba(255,255,255,0.5), 0 30px 50px -12px rgba(80,70,180,0.4)",
      }}
    >
      <div className="grid place-items-center rounded-full bg-white/20" style={{ width: size * 0.62, height: size * 0.62 }}>
        {children}
      </div>
    </div>
  );
}

/* ===================== Shared section primitives ===================== */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-indigo-600">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function DarkBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function GlassBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border border-slate-300 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white">
      {children}
    </button>
  );
}

/* ===================== Feature visuals ===================== */

function DataVisualV2() {
  return (
    <div className="relative h-full w-full">
      <GlassOrb size={90} grad="radial-gradient(circle at 35% 30%,#c7d2fe,#6366f1 60%,#4338ca)" className="left-[10%] top-[18%]" />
      <GlassOrb size={60} grad="radial-gradient(circle at 35% 30%,#fbcfe8,#ec4899 60%,#be185d)" className="right-[18%] top-[12%]" delay={0.5} dur={5} />
      <GlassOrb size={48} grad="radial-gradient(circle at 35% 30%,#fde68a,#f59e0b 60%,#b45309)" className="right-[34%] top-[52%]" delay={0.9} dur={4.5} />
      <GlassOrb size={70} grad="radial-gradient(circle at 35% 30%,#bae6fd,#0ea5e9 60%,#0369a1)" className="left-[34%] top-[52%]" delay={0.3} dur={6.5} />
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[36%] grid h-24 w-24 place-items-center rounded-[1.6rem]"
        style={{
          background: "linear-gradient(135deg,#86efac,#22c55e 55%,#15803d)",
          boxShadow: "inset -6px -8px 18px rgba(0,0,0,0.15), inset 6px 8px 18px rgba(255,255,255,0.5), 0 25px 45px -10px rgba(34,197,94,0.5)",
        }}
      >
        <Zap className="h-10 w-10 text-white" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}

function AgentVisualV2() {
  return (
    <div className="relative grid h-full w-full place-items-center">
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlassCoin size={150} grad="linear-gradient(135deg,#ddd6fe,#8b5cf6 55%,#6d28d9)">
          <Bot className="h-16 w-16 text-white" strokeWidth={2} />
        </GlassCoin>
      </motion.div>
      <GlassOrb size={40} grad="radial-gradient(circle at 35% 30%,#fbcfe8,#ec4899 60%,#be185d)" className="right-[20%] top-[18%]" delay={0.4} dur={5} />
      <GlassOrb size={32} grad="radial-gradient(circle at 35% 30%,#bae6fd,#0ea5e9 60%,#0369a1)" className="left-[22%] top-[60%]" delay={0.8} dur={4.5} />
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
    visual: <DataVisualV2 />,
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
    visual: <AgentVisualV2 />,
    reverse: true,
  },
];

/* ===================== Page ===================== */

export default function DesignV2Light() {
  return (
    <main
      className="min-h-screen font-sans text-slate-900"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 70% 0%, #e9e3ff 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 0% 30%, #ffe4f0 0%, transparent 55%), linear-gradient(160deg,#f5f3ff 0%,#faf5ff 50%,#fef6fb 100%)"
      }}
    >
      {/* NAV */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <Container>
          <nav className="flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-6 py-3 backdrop-blur-xl shadow-[0_8px_30px_rgba(80,70,180,0.08)]">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">C</div>
              <span className="text-lg font-semibold tracking-tight">Clay</span>
            </div>
            <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
              {["Platform", "Solutions", "Resources", "Pricing"].map((l) => (
                <li key={l} className="cursor-pointer transition-colors hover:text-slate-900">{l}</li>
              ))}
            </ul>
            <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]">
              View Demo
            </button>
          </nav>
        </Container>
      </header>

      {/* HERO */}
      <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#6366f1 1px,transparent 1px),linear-gradient(to bottom,#6366f1 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
          }}
        />
      <section className="relative overflow-hidden pb-12 pt-16 lg:pt-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-2 h-[420px] lg:order-1"
            >
              <motion.div
                animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[30%] top-[6%] grid h-28 w-28 place-items-center rounded-[2rem]"
                style={{
                  background: "linear-gradient(135deg,#86efac,#22c55e 55%,#15803d)",
                  boxShadow: "inset -6px -8px 18px rgba(0,0,0,0.15), inset 6px 8px 18px rgba(255,255,255,0.5), 0 25px 45px -10px rgba(34,197,94,0.5)",
                }}
              >
                <ArrowUpRight className="h-12 w-12 text-white" strokeWidth={2.5} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute left-[14%] top-[42%]"
              >
                <GlassCoin size={128} grad="linear-gradient(135deg,#a7f3d0,#10b981 55%,#047857)">
                  <Check className="h-10 w-10 text-white" strokeWidth={3} />
                </GlassCoin>
              </motion.div>
              <GlassOrb size={96} grad="radial-gradient(circle at 35% 30%,#c7d2fe,#6366f1 60%,#4338ca)" className="right-[18%] top-[18%]" delay={0.3} />
              <GlassOrb size={64} grad="radial-gradient(circle at 35% 30%,#fbcfe8,#ec4899 60%,#be185d)" className="right-[8%] top-[50%]" delay={0.8} dur={5} />
              <GlassOrb size={44} grad="radial-gradient(circle at 35% 30%,#fde68a,#f59e0b 60%,#b45309)" className="right-[34%] top-[8%]" delay={1.1} dur={4.5} />
              <GlassOrb size={36} grad="radial-gradient(circle at 35% 30%,#bae6fd,#0ea5e9 60%,#0369a1)" className="left-[44%] top-[68%]" delay={0.2} dur={5.5} />
            </motion.div>

            <div className="order-1 lg:order-2">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                <Eyebrow>Launching today: Audiences in Clay</Eyebrow>
              </motion.div>
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Build systems to{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">grow revenue</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-slate-600">
                Infrastructure to get any data, run agentic workflows, and launch GTM plays.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <DarkBtn>Start free trial</DarkBtn>
                <GlassBtn>Get a demo</GlassBtn>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* LOGO GRID */}
      <section className="pb-20">
        <Container>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-slate-400"
          >
            Trusted by 500,000+ leading GTM teams
          </motion.p>

          {/* Infinite marquee */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-4">
              {[...logos, ...logos].map((logo, i) => (
                <div
                  key={`${logo.slug}-${i}`}
                  className="flex h-20 w-44 shrink-0 items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl transition-all hover:bg-white hover:shadow-[0_8px_30px_rgba(80,70,180,0.12)]"
                >
                  <img
                    src={`https://cdn.simpleicons.org/${logo.slug}/64748b`}
                    alt={logo.name}
                    className="h-6 w-6 opacity-70 transition-opacity"
                    loading="lazy"
                  />
                  <span className="text-sm font-semibold text-slate-600">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-16 lg:py-24">
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
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{f.eyebrow}</span>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">{f.title}</h3>
                  <p className="mt-5 max-w-xl text-lg text-slate-600">{f.desc}</p>
                  <ul className="mt-7 space-y-3">
                    {f.proofs.map(([n, b]) => (
                      <li key={n} className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{n}</span> {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <DarkBtn>Start free trial</DarkBtn>
                    <GlassBtn>{f.cta}</GlassBtn>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl"
                >
                  {f.visual}
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-indigo-500 to-violet-600 p-10 lg:p-16">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div className="text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">GTM Infrastructure</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                  Build systems that make reps more productive
                </h2>
                <p className="mt-5 max-w-md text-lg text-indigo-100">
                  Reps self-serve the best prospecting data. Chat to get full account context. Build centralized workflows for any rep to run.
                </p>
                <div className="mt-8">
                  <button className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-transform hover:scale-[1.03]">
                    Start free trial
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["Pendo", "200%", "of quota"], ["Hex", "+50%", "close-rate"], ["Terrapinn", "+19%", "revenue/rep"]].map(([n, s, l]) => (
                  <div key={n} className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-xl">
                    <div className="text-2xl font-bold text-white">{s}</div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-indigo-100">{l}</div>
                    <div className="mt-2 text-xs font-semibold text-white">{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <GlassOrb size={80} grad="radial-gradient(circle at 35% 30%,#c7d2fe,#6366f1 60%,#4338ca)" className="left-[12%] top-[20%]" />
        <GlassOrb size={56} grad="radial-gradient(circle at 35% 30%,#fbcfe8,#ec4899 60%,#be185d)" className="right-[14%] top-[24%]" delay={0.6} dur={5} />
        <GlassOrb size={44} grad="radial-gradient(circle at 35% 30%,#fde68a,#f59e0b 60%,#b45309)" className="right-[28%] top-[12%]" delay={1} dur={4.5} />
        <Container className="relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
          >
            Turn your growth ideas into{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">reality today</span>
          </motion.h2>
          <p className="mt-5 text-lg text-slate-600">Start for free today. No credit card required.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DarkBtn>Start building for free</DarkBtn>
            <GlassBtn>Get a demo</GlassBtn>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/60 bg-white/40 py-14 backdrop-blur-xl">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              ["Product", ["Claygent", "Sculptor", "Ads", "Pricing"]],
              ["Use cases", ["Inbound", "ABM", "Outbound", "CRM"]],
              ["Resources", ["University", "Templates", "Community", "FAQ"]],
              ["Company", ["About", "Careers", "Contact", "Press"]],
            ].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h4>
                <ul className="space-y-2.5">
                  {(links as string[]).map((l) => (
                    <li key={l}><a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-900">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row">
            <span className="font-semibold text-slate-700">Clay — Light</span>
            <span>©2026 Clay Labs Inc. · Born in Brooklyn</span>
          </div>
        </Container>
      </footer>
    </main>
  );
}