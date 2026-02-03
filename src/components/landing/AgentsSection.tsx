"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

// Import des images des agents (version fond transparent)
import AliceImage from "@/Alice-removebg.png";
import DouglasImage from "@/Douglas-removebg.png";
import RomanImage from "@/Roman-removebg.png";

/**
 * Section des 3 Agents IA
 * Style inspiré de l'exemple avec cartes sombres et images d'agents
 */

interface AgentCardProps {
  image: StaticImageData;
  category: string;
  name: string;
  description: string;
  href: string;
  color: string;
  glowColor: string;
  delay?: number;
}

function AgentCard({ image, category, name, description, href, color, glowColor, delay = 0 }: AgentCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        group
        relative
        flex flex-col
        rounded-2xl sm:rounded-3xl
        bg-white/[0.05]
        backdrop-blur-xl
        border border-white/[0.1]
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        overflow-hidden
        transition-all duration-500
        hover:border-${color}-500/50
        hover:bg-white/[0.08]
      `}
      style={{
        boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
      }}
      whileHover={{
        boxShadow: glowColor,
      }}
    >
      {/* Gradient top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
      
      {/* Zone Image - Plus petite sur mobile */}
      <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Contenu texte */}
      <div className="flex flex-col flex-1 p-4 sm:p-6">
        {/* Catégorie avec couleur */}
        <span className={`text-xs sm:text-sm font-medium mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {category}
        </span>
        
        {/* Nom de l'agent */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{name}</h3>
        
        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-2 sm:line-clamp-3">
          {description}
        </p>

        {/* Bouton avec couleur */}
        <Link
          href={href}
          className={`
            mt-4 sm:mt-6
            flex items-center justify-center gap-2
            w-full py-2.5 sm:py-3.5
            rounded-xl
            bg-gradient-to-r ${color}
            text-white text-xs sm:text-sm font-semibold
            transition-all duration-300
            opacity-90 hover:opacity-100
            hover:scale-[1.02]
            group/btn
          `}
        >
          Découvrir {name}
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

// Données des 3 agents
const agents = [
  {
    image: AliceImage,
    category: "Générateur de Miniatures",
    name: "Alice",
    description: "Génère des miniatures YouTube à haut CTR en quelques secondes. Alice crée des visuels professionnels qui captent l'attention et maximisent vos clics.",
    href: "/agents/alice",
    color: "from-pink-500 to-rose-500",
    glowColor: "0 8px 40px rgba(236, 72, 153, 0.3)",
  },
  {
    image: DouglasImage,
    category: "Viral Market Fit",
    name: "Douglas",
    description: "Trouvez des idées de vidéos virales basées sur les tendances actuelles. Douglas analyse le marché et génère des concepts adaptés à votre niche et votre audience.",
    href: "/agents/douglas",
    color: "from-violet-500 to-indigo-500",
    glowColor: "0 8px 40px rgba(139, 92, 246, 0.3)",
  },
  {
    image: RomanImage,
    category: "Keyword Alchemist",
    name: "Roman",
    description: "Stratégie SEO et idées de vidéos basées sur les mots-clés. Roman analyse les recherches et génère des titres optimisés pour le référencement YouTube.",
    href: "/agents/roman",
    color: "from-teal-500 to-emerald-500",
    glowColor: "0 8px 40px rgba(20, 184, 166, 0.3)",
  },
];

export function AgentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="agents" ref={sectionRef} className="relative py-12 sm:py-16 scroll-mt-20">
      <div className="container-custom">
        {/* Header de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Rencontrez vos </span>
            <span className="text-gradient">agents IA</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Alice pour vos miniatures, Douglas pour vos idées virales, et Roman pour votre stratégie SEO.
          </p>
        </motion.div>

        {/* Grille des 3 agents - 2 colonnes sur mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-2 sm:px-0">
          {agents.map((agent, index) => (
            <AgentCard
              key={agent.name}
              {...agent}
              delay={0.1 + index * 0.15}
            />
          ))}
          
          {/* Lou - 4ème agent uniquement sur mobile (à venir) */}
          <div
            className="
              lg:hidden
              relative
              flex flex-col
              rounded-2xl sm:rounded-3xl
              bg-white/[0.03]
              border border-white/[0.08]
              overflow-hidden
            "
          >
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
            
            {/* Badge "Bientôt" */}
            <div className="absolute top-2 right-2 z-20">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20">
                Bientôt
              </span>
            </div>
            
            {/* Zone Image placeholder */}
            <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>

            {/* Contenu texte */}
            <div className="flex flex-col flex-1 p-4 sm:p-6">
              <span className="text-xs sm:text-sm font-medium mb-1 bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Rédactrice de Scripts
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white/70 mb-2 sm:mb-3">Lou</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-2 sm:line-clamp-3">
                Rédige des scripts YouTube viraux et captivants pour vos vidéos.
              </p>

              {/* Bouton désactivé */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 w-full py-2.5 sm:py-3.5 rounded-xl bg-white/5 text-white/40 text-xs sm:text-sm font-semibold cursor-not-allowed">
                Bientôt disponible
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
