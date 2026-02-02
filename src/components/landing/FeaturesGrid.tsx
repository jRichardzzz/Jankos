"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * FeaturesGrid - Bento Grid Style Jankos.cc
 * 
 * Structure :
 * - Grille asymétrique avec cartes de tailles variées
 * - Chaque carte : fond sombre semi-transparent, bordure fine
 * - Effet hover : bordure devient plus lumineuse
 * - Contenu : icône, titre, description
 */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, className = "", delay = 0 }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        group relative
        p-6 sm:p-8
        rounded-2xl
        bg-white/[0.02]
        border border-white/[0.06]
        transition-all duration-500
        hover:bg-white/[0.04]
        hover:border-accent-primary/30
        overflow-hidden
        ${className}
      `}
    >
      {/* Glow effect au hover */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-tertiary/5
        pointer-events-none
      " />

      {/* Bordure gradient au hover */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        rounded-2xl
        pointer-events-none
      ">
        <div className="absolute inset-0 rounded-2xl border-gradient" />
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {/* Icône */}
        <div className="
          mb-5
          w-12 h-12
          rounded-xl
          bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/10
          border border-accent-primary/20
          flex items-center justify-center
          text-accent-primary
          group-hover:scale-110
          transition-transform duration-300
        ">
          {icon}
        </div>

        {/* Titre */}
        <h3 className="
          text-lg sm:text-xl font-semibold
          text-foreground
          mb-3
        ">
          {title}
        </h3>

        {/* Description */}
        <p className="
          text-sm sm:text-base
          text-foreground-muted
          leading-relaxed
        ">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// Icônes SVG simples
const icons = {
  lightning: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  cube: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  sparkles: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  globe: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
};

const features = [
  {
    icon: icons.lightning,
    title: "Lightning Fast",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  },
  {
    icon: icons.sparkles,
    title: "AI Powered",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  },
  {
    icon: icons.shield,
    title: "Enterprise Security",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
  },
  {
    icon: icons.cube,
    title: "Modular Design",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
  },
  {
    icon: icons.chart,
    title: "Advanced Analytics",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: icons.globe,
    title: "Global Scale",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative py-24 sm:py-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, hsl(200 95% 60% / 0.15) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="
            inline-block
            px-4 py-1.5 mb-4
            text-xs font-medium uppercase tracking-wider
            text-accent-primary
            bg-accent-primary/10
            rounded-full
          ">
            Features
          </span>
          <h2 className="
            text-3xl sm:text-4xl md:text-5xl
            font-bold tracking-tight
            mb-4
          ">
            <span className="text-foreground">Everything you need to </span>
            <span className="text-gradient">succeed</span>
          </h2>
          <p className="
            text-foreground-muted
            text-lg
            max-w-2xl mx-auto
          ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Carte 1 - Grande (span 2 colonnes sur lg) */}
          <FeatureCard
            icon={features[0].icon}
            title={features[0].title}
            description={features[0].description}
            className="lg:col-span-2"
            delay={0.1}
          />

          {/* Carte 2 - Standard */}
          <FeatureCard
            icon={features[1].icon}
            title={features[1].title}
            description={features[1].description}
            delay={0.2}
          />

          {/* Carte 3 - Standard */}
          <FeatureCard
            icon={features[2].icon}
            title={features[2].title}
            description={features[2].description}
            delay={0.3}
          />

          {/* Carte 4 - Grande (span 2 colonnes sur lg) */}
          <FeatureCard
            icon={features[3].icon}
            title={features[3].title}
            description={features[3].description}
            className="lg:col-span-2"
            delay={0.4}
          />

          {/* Carte 5 - Standard avec accent */}
          <FeatureCard
            icon={features[4].icon}
            title={features[4].title}
            description={features[4].description}
            delay={0.5}
          />

          {/* Carte 6 - Grande (span 2 colonnes sur md+) */}
          <FeatureCard
            icon={features[5].icon}
            title={features[5].title}
            description={features[5].description}
            className="md:col-span-2 lg:col-span-2"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
}
