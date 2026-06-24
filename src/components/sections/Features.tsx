"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { DataVisual, AgentVisual } from "./FeatureVisuals";

type CustomerProof = { name: string; blurb: string };

type FeatureBlock = {
  eyebrow: string;
  title: string;
  description: string;
  proofs: CustomerProof[];
  primaryCta: string;
  secondaryCta: string;
  visual: React.ReactNode;
  visualBg: string;
  reverse?: boolean;
};

const blocks: FeatureBlock[] = [
  {
    eyebrow: "Data",
    title: "Get data from the most complete data marketplace",
    description:
      "One contract to buy data from 200+ data and AI vendors in Clay's marketplace. Create intent signals from anything on the internet. Bring 1st and 3rd party data together.",
    proofs: [
      { name: "Anthropic", blurb: "3x'd their enrichment rate with Clay's data marketplace." },
      { name: "Intercom", blurb: "grew outbound pipeline 140% by continuously researching target accounts." },
      { name: "Mistral", blurb: "cut TAM mapping time from 2 months to 10 days." },
    ],
    primaryCta: "Start free trial",
    secondaryCta: "Explore data marketplace",
    visual: <DataVisual />,
    visualBg: "linear-gradient(160deg,#fde8d4,#fbcfa4)",
  },
  {
    eyebrow: "Agents",
    title: "Create agents who mimic your best reps",
    description:
      "Mine the web for custom data points to research and qualify accounts. Constantly monitor accounts for reasons to engage. Prep reps with the detail they need to tailor every touchpoint.",
    proofs: [
      { name: "OpenAI", blurb: "fully automated pre-call prep by researching bios and 90-day changes." },
      { name: "Canva", blurb: "saved 4 hrs/rep/week automating contact sourcing." },
      { name: "Vanta", blurb: "cut follow-up time from 3 days to under 1 with agents." },
    ],
    primaryCta: "Start free trial",
    secondaryCta: "Explore agents",
    visual: <AgentVisual />,
    visualBg: "linear-gradient(160deg,#d6ecff,#a9d4f5)",
    reverse: true,
  },
];

function FeatureRow({ block }: { block: FeatureBlock }) {
  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        block.reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-brand">
          {block.eyebrow}
        </span>
        <h3 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
          {block.title}
        </h3>
        <p className="mt-5 text-base md:text-lg text-muted leading-relaxed max-w-xl">
          {block.description}
        </p>

        {/* Proofs */}
        <ul className="mt-7 space-y-3">
          {block.proofs.map((p) => (
            <li key={p.name} className="text-sm text-foreground/80 leading-snug">
              <span className="font-semibold text-foreground">{p.name}</span> {p.blurb}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          
           <a href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            {block.primaryCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          
           <a href="#"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            {block.secondaryCta}
          </a>
        </div>
      </motion.div>

      {/* Visual side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
        style={{ background: block.visualBg }}
      >
        {block.visual}
      </motion.div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <Container>
        <div className="space-y-24 lg:space-y-40">
          {blocks.map((block) => (
            <FeatureRow key={block.eyebrow} block={block} />
          ))}
        </div>
      </Container>
    </section>
  );
}