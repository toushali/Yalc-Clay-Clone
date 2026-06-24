import Link from "next/link";
import Container from "@/components/ui/Container";

const columns = [
  {
    title: "Use cases",
    links: ["Automated inbound", "Account research", "ABM", "PLG assist", "Rep assist", "Outbound", "CRM Enrichment", "TAM Sourcing"],
  },
  {
    title: "Customers",
    links: ["OpenAI", "Vanta", "Verkada", "Sendoso", "Anthropic", "Rippling", "Mistral AI", "Case studies"],
  },
  {
    title: "Product",
    links: ["Claygent AI", "Sculptor", "Ads", "Sequencer", "Enrichment", "Audiences", "Signals", "Pricing"],
  },
  {
    title: "Resources",
    links: ["University", "Templates", "Hire GTME talent", "Partner programs", "Community", "FAQ"],
  },
  {
    title: "Company",
    links: ["Contact us", "About", "Careers", "Jobs", "Status", "Press"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1f12] text-white">
      <Container className="py-16 lg:py-20">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/50">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-[#0a1f12]">C</span>
            </div>
            <span className="text-lg font-semibold">Clay</span>
          </div>

          <div className="flex flex-col gap-1 text-sm text-white/50 md:items-center">
            <span>Born in Brooklyn</span>
            <span>©2026 Clay Labs Inc.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" aria-label="LinkedIn" className="text-white/60 hover:text-white transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z" />
              </svg>
            </Link>
            <Link href="#" aria-label="YouTube" className="text-white/60 hover:text-white transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
              </svg>
            </Link>
            <Link href="#" aria-label="X" className="text-white/60 hover:text-white transition-colors">
              <span className="text-base font-bold">𝕏</span>
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
          <Link href="#" className="hover:text-white/70 transition-colors">Privacy policy</Link>
          <Link href="#" className="hover:text-white/70 transition-colors">Terms of service</Link>
          <Link href="#" className="hover:text-white/70 transition-colors">Do not sell my data</Link>
        </div>
      </Container>
    </footer>
  );
}