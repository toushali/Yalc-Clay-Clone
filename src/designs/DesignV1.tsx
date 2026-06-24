import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import LogoCloud from "@/components/sections/LogoCloud";
import Features from "@/components/sections/Features";
import Infrastructure from "@/components/sections/Infrastructure";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function DesignV1() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <Infrastructure />
      <CTA />
      <Footer />
    </main>
  );
}