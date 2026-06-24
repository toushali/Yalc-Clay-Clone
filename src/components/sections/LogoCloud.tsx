"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";

/* ---------- Wordmark logos (styled text stand-ins) ---------- */
const Logos: Record<string, React.ReactNode> = {
  vanta: <span className="text-xl font-bold text-[#6649ff]">Vanta</span>,
  perplexity: <span className="text-lg font-semibold text-[#20808d] tracking-tight">✻ perplexity</span>,
  notion: (
    <span className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
      <span className="flex h-6 w-6 items-center justify-center rounded border border-foreground/20 text-sm">N</span>
      Notion
    </span>
  ),
  google: (
    <span className="text-2xl font-medium tracking-tight">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  ),
  hubspot: <span className="text-lg font-semibold text-[#ff7a59]">HubSpot</span>,
  anthropic: <span className="text-xl font-semibold tracking-tight text-foreground">ANTHROP\C</span>,
  rippling: <span className="text-lg font-bold text-foreground">))) Rippling</span>,
  canva: (
    <span className="text-xl font-semibold italic bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
      Canva
    </span>
  ),
  okta: <span className="text-lg font-bold text-foreground tracking-tight">◎ okta</span>,
  verkada: <span className="text-lg font-bold text-foreground tracking-tight">◆ Verkada</span>,
  uber: <span className="text-xl font-bold text-foreground">Uber</span>,
  elevenlabs: <span className="text-base font-bold text-foreground">II ElevenLabs</span>,
};

/* ---------- Card shell ---------- */
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex items-center justify-center rounded-2xl border border-foreground/[0.08] bg-white p-5 transition-shadow hover:shadow-md ${className}`}
    >
      <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-foreground/25 transition-colors group-hover:text-foreground/60" />
      {children}
    </div>
  );
}

function StatCard({ stat, label, logo }: { stat: string; label: string; logo?: keyof typeof Logos }) {
  return (
    <Card className="flex-col gap-1 text-center">
      {logo && <div className="mb-1">{Logos[logo]}</div>}
      <span className="text-3xl font-semibold tracking-tight text-foreground">{stat}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-tight">
        {label}
      </span>
    </Card>
  );
}

export default function LogoCloud() {
  return (
    <section className="relative bg-[#0f4d2c] py-16 lg:py-24">
      <Container>
        <div className="rounded-[2rem] bg-[#f7f3ec] px-4 py-12 lg:px-10 lg:py-16">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-center text-2xl md:text-3xl font-medium tracking-tight text-foreground"
          >
            Trusted by more than 500,000+ leading GTM teams of all sizes. Inspired by our{" "}
            <span className="font-bold">customers</span>. Built with <span className="font-bold">love</span>.
          </motion.h2>

          {/* Masked grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
          >
            {/* Row 1 */}
            <Item><Card>{Logos.uber}</Card></Item>
            <Item><Card>{Logos.vanta}</Card></Item>
            <Item><Card>{Logos.perplexity}</Card></Item>
            <Item><Card>{Logos.notion}</Card></Item>
            <Item className="lg:col-span-2">
              <Card className="!justify-between gap-4 text-left">
                <div className="shrink-0">{Logos.google}</div>
                <p className="text-xs leading-snug text-foreground/70">
                  “In our first AI Hackathon week, we unlocked data across YouTube, Ads, Cloud, and CapitalG into powerful AI workflows.”
                </p>
              </Card>
            </Item>

            {/* Row 2 */}
            <Item><Card>{Logos.hubspot}</Card></Item>
            <Item><StatCard stat="80%+" label="Enrichment coverage" /></Item>

            {/* Anthropic tall card */}
            <Item className="lg:col-span-2 lg:row-span-2">
              <Card className="!flex-col !items-start gap-3 text-left">
                <div>{Logos.anthropic}</div>
                <div className="mt-1">
                  <p className="text-sm font-semibold text-foreground">All inbound</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Qualified and scored with Clay
                  </p>
                </div>
                <p className="mt-auto text-xs leading-snug text-foreground/70">
                  “Clay 3x’d our enrichment rate and unlocked AI-powered GTM workflows that were infeasible before.”
                </p>
              </Card>
            </Item>

            <Item className="lg:col-span-2">
              <Card className="!justify-between gap-4">
                <div className="shrink-0">{Logos.rippling}</div>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-foreground">2x</span>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Demos from cold email
                  </p>
                </div>
              </Card>
            </Item>

            {/* Row 3 */}
            <Item><StatCard stat="40%" label="Outbound pipeline" /></Item>
            <Item><Card>{Logos.canva}</Card></Item>
            <Item><Card>{Logos.okta}</Card></Item>
            <Item>
              <Card className="!justify-between gap-3">
                <div className="shrink-0">{Logos.verkada}</div>
                <div className="text-right">
                  <span className="text-xl font-semibold text-foreground">3x</span>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Reply rate
                  </p>
                </div>
              </Card>
            </Item>

            {/* Row 4 — extra */}
            <Item className="lg:col-span-2">
              <Card className="!justify-between gap-3">
                <div className="shrink-0">{Logos.elevenlabs}</div>
                <div className="text-right">
                  <span className="text-xl font-semibold text-foreground">+50%</span>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    SQLs
                  </p>
                </div>
              </Card>
            </Item>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* Stagger item wrapper */
function Item({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}