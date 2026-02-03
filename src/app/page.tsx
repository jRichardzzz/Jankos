import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ThumbnailsScroll } from "@/components/landing/ThumbnailsScroll";
import { AgentsSection } from "@/components/landing/AgentsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { FAQSection } from "@/components/landing/FAQSection";

export default function Home() {
  return (
    <main className="relative min-h-screen" suppressHydrationWarning>
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Défilement de miniatures */}
      <ThumbnailsScroll />
      
      {/* Section des 3 Agents IA */}
      <AgentsSection />
      
      {/* Section Tarifs */}
      <PricingSection />
      
      {/* Section Comparaison Jankos vs Freelances */}
      <ComparisonSection />
      
      {/* Section FAQ */}
      <FAQSection />
      
      {/* Footer minimal */}
      <footer className="py-8 border-t border-white/[0.06]">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Jankos.cc. Tous droits réservés.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <a href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="/cgv" className="hover:text-white transition-colors">CGV</a>
            <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="mailto:contact@jankos.cc" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
