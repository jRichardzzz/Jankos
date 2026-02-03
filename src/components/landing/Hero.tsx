"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

// Import des images des agents
import AliceImage from "@/Alice-removebg.png";
import DouglasImage from "@/Douglas-removebg.png";
import RomanImage from "@/Roman-removebg.png";

// Données des agents pour le tooltip
const agents = [
  {
    id: 1,
    name: "Alice",
    designation: "Générateur de Miniatures",
    image: AliceImage,
  },
  {
    id: 2,
    name: "Douglas",
    designation: "Viral Market Fit",
    image: DouglasImage,
  },
  {
    id: 3,
    name: "Roman",
    designation: "Keyword Alchemist",
    image: RomanImage,
  },
];

/**
 * Hero Section avec quadrillage en arrière-plan
 * Optimisé pour mobile : pas d'animation du grid sur mobile (trop lourd)
 */

// Composant pour le quadrillage - statique sur mobile, animé sur desktop
function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Version Mobile - Grid STATIQUE (pas d'animation = performance) */}
      <svg
        className="absolute inset-0 w-full h-full sm:hidden"
        style={{ opacity: 0.08 }}
      >
        <defs>
          <pattern
            id="hero-grid-mobile"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <line x1="60" y1="0" x2="60" y2="60" stroke="white" strokeWidth="1" />
            <line x1="0" y1="60" x2="60" y2="60" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid-mobile)" />
      </svg>

      {/* Version Desktop - Grid animé avec CSS (plus performant que Framer Motion) */}
      <div className="hidden sm:block absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-grid-move">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="hero-grid-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <line x1="80" y1="0" x2="80" y2="80" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
              <line x1="0" y1="80" x2="80" y2="80" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>
      </div>

      {/* Masque dégradé pour fade vers les bords */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, hsl(224 71% 4%) 80%)`,
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-8">
      
      {/* Quadrillage animé en arrière-plan */}
      <AnimatedGridBackground />

      {/* Orbes lumineuses - MASQUÉES sur mobile (trop lourd avec blur) */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {/* Orbe ambre/orange */}
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[400px] opacity-25"
          style={{
            background: "radial-gradient(ellipse, hsl(38 92% 50% / 0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Orbe cyan */}
        <div 
          className="absolute top-1/3 right-1/4 w-[500px] h-[400px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, hsl(200 95% 60% / 0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container-custom flex flex-col items-center text-center max-w-4xl">
        
        {/* 3 avatars avec tooltip animé - collé au header sur mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center mb-6 sm:mb-4 -mt-28 sm:mt-0"
        >
          <AnimatedTooltip items={agents} />
        </motion.div>

        {/* Titre Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="
            text-[1.75rem] sm:text-5xl md:text-6xl lg:text-7xl
            font-bold tracking-tight
            leading-[1.2] sm:leading-[1.15]
            mb-4 sm:mb-6
            px-4 sm:px-0
            text-center
          "
        >
          {/* Mobile : 3 lignes bien découpées */}
          <span className="sm:hidden">
            <span className="block text-white">Des agents</span>
            <span className="block text-white">créatifs surpuissants</span>
            <span className="block mt-1 text-gradient">pour dominer YouTube.</span>
          </span>
          {/* Desktop : 2 lignes */}
          <span className="hidden sm:block">
            <span className="block text-white">Des agents créatifs surpuissants</span>
            <span className="block mt-2 text-gradient">pour dominer YouTube.</span>
          </span>
          {/* Ligne ondulée style "Viral recipe" avec glow */}
          <span className="block mx-auto mt-3 sm:mt-4 w-56 sm:w-72">
            <svg viewBox="0 0 200 20" className="w-full h-auto overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M0,10 C20,4 30,16 50,10 C70,4 80,16 100,10 C120,4 130,16 150,10 C170,4 180,16 200,10"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="
            text-lg sm:text-xl
            text-gray-400
            max-w-2xl
            leading-relaxed
            mb-10
          "
        >
          Générez des miniatures haut CTR, découvrez des idées virales 
          et optimisez votre SEO avec des mots-clés stratégiques.
          <span className="block mt-2 text-white font-medium">Tout en un seul outil.</span>
        </motion.p>

        {/* CTA Buttons - Côte à côte sur mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-row items-center gap-3 sm:gap-4"
        >
          {/* Bouton Principal */}
          <Link
            href="/signup"
            className="
              relative group
              px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold
              text-white
              rounded-xl
              overflow-hidden
              transition-all duration-300
              hover:scale-[1.02]
            "
          >
            {/* Fond gradient */}
            <div className="
              absolute inset-0
              bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500
              bg-[length:200%_100%]
              group-hover:bg-[position:100%_0]
              transition-all duration-500
            " />
            
            {/* Glow */}
            <div 
              className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
              style={{
                boxShadow: "0 0 30px 5px rgba(139, 92, 246, 0.3)",
              }}
            />
            
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              Commencer
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>

          {/* Bouton Secondaire */}
          <Link
            href="#agents"
            className="
              px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium
              text-gray-300 hover:text-white
              rounded-xl
              border border-white/10 hover:border-white/20
              bg-white/5 hover:bg-white/10
              transition-all duration-300
              flex items-center gap-1.5 sm:gap-2
            "
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="hidden sm:inline">Voir les agents</span>
            <span className="sm:hidden">Agents</span>
          </Link>
        </motion.div>

        {/* Stats - Compact sur mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-3 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-12 text-sm"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-3xl font-bold text-white">287+</span>
            <span className="text-gray-500 text-[10px] sm:text-sm">Créateurs actifs</span>
          </div>
          <div className="w-px h-8 sm:h-12 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-3xl font-bold text-white">1,200+</span>
            <span className="text-gray-500 text-[10px] sm:text-sm">Miniatures générées</span>
          </div>
          <div className="w-px h-8 sm:h-12 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-3xl font-bold text-gradient">x2</span>
            <span className="text-gray-500 text-[10px] sm:text-sm">CTR moyen</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
