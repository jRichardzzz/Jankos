"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import RomanImage from "@/Roman-removebg.png";

const features = [
  "Analyse des mots-clés les plus recherchés",
  "10 concepts de vidéos SEO par génération",
  "3 types de titres optimisés par concept",
  "Volume de recherche estimé",
  "Stratégie de contenu complète",
  "Export JSON pour intégration",
];

export default function RomanPage() {
  return (
    <div className="min-h-screen bg-[hsl(224,71%,4%)] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(224,71%,4%)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-500 font-bold">J</span>
            </div>
            <span className="font-bold text-white">JANKOS<span className="text-amber-500">.cc</span></span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge Premium */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-500/20 via-emerald-500/10 to-teal-500/20 border border-teal-500/30 backdrop-blur-sm mb-6 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold">Keyword Alchemist</span>
                  <span className="text-teal-300/70 text-xs">20 crédits par génération</span>
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Rencontrez </span>
                <span className="bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">Roman</span>
              </h1>

              {/* Description */}
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Roman est votre expert en SEO YouTube. Il analyse les mots-clés les plus 
                recherchés dans votre niche et génère des idées de vidéos optimisées pour 
                le référencement. Dominez les résultats de recherche avec des titres qui rankent.
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/dashboard/roman"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-500/25"
              >
                Commencer avec Roman
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Agent Image - Mobile */}
              <div className="lg:hidden mt-12 flex justify-center">
                <div className="relative w-64 h-80">
                  <Image
                    src={RomanImage}
                    alt="Roman"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Video Container with Rotating Glow */}
              <div className="relative p-[3px] rounded-2xl">
                {/* Rotating Glow Border */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <motion.div
                    className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
                    style={{
                      background: `conic-gradient(
                        from 0deg,
                        transparent 0deg,
                        transparent 60deg,
                        rgba(20, 184, 166, 0.5) 120deg,
                        rgba(251, 146, 60, 0.8) 180deg,
                        rgba(20, 184, 166, 0.5) 240deg,
                        transparent 300deg,
                        transparent 360deg
                      )`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Inner Container */}
                <div className="relative bg-neutral-900 rounded-2xl overflow-hidden">
                  {/* Video Autoplay */}
                  <video
                    className="aspect-video w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/roman-demo.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Agent Image - Desktop (floating) */}
              <div className="hidden lg:block absolute -bottom-10 -left-20 w-48 h-60 z-10">
                <Image
                  src={RomanImage}
                  alt="Roman"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
