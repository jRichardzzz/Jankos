"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";

import AliceImage from "@/Alice-removebg.png";

// Import des miniatures
import MiniaBatiment2 from "@/MiniaBatiment2.webp";
import MiniaLondres from "@/MiniaLondres.webp";
import MiniaMakeup from "@/MiniaMakeup.webp";
import MiniaTech3 from "@/MiniaTech3.webp";
import MiniaYacht from "@/MiniaYacht.webp";
import MiniaBadminton from "@/Minia Badminton.webp";
import MiniaImmo from "@/Minia Immo.webp";
import Miniaacci from "@/Miniaacci.webp";
import MiniaAgent from "@/MiniaAgent.webp";
import MiniaJetSki from "@/Minia jet ski.webp";

const portfolioImages: { src: StaticImageData; title: string }[] = [
  { src: MiniaBatiment2, title: "Immobilier & Construction" },
  { src: MiniaLondres, title: "Voyage & Lifestyle" },
  { src: MiniaMakeup, title: "Beauté & Mode" },
  { src: MiniaTech3, title: "Tech & Innovation" },
  { src: MiniaYacht, title: "Luxe & Premium" },
  { src: MiniaBadminton, title: "Sport & Fitness" },
  { src: MiniaImmo, title: "Business & Finance" },
  { src: Miniaacci, title: "Actualités & News" },
  { src: MiniaAgent, title: "IA & Technologie" },
  { src: MiniaJetSki, title: "Sport Nautique" },
];

const features = [
  "Génération de miniatures en haute qualité",
  "Styles variés : réaliste, cartoon, cinématique...",
  "Personnalisation des acteurs et objets",
  "Jusqu'à 3 miniatures par génération",
  "Téléchargement HD instantané",
  "Sauvegarde dans vos réalisations pendant 15 jours",
];

export default function AlicePage() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolioImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
  };

  return (
    <div className="min-h-screen bg-[hsl(224,71%,4%)] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(224,71%,4%)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-500 font-bold">J</span>
            </div>
            <span className="font-bold text-white text-sm sm:text-base">JANKOS<span className="text-amber-500">.cc</span></span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Retour à l&apos;accueil</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            
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
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 via-rose-500/10 to-pink-500/20 border border-pink-500/30 backdrop-blur-sm mb-6 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold">Générateur de Miniatures</span>
                  <span className="text-pink-300/70 text-xs">10 crédits par génération</span>
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <span className="text-white">Rencontrez </span>
                <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">Alice</span>
              </h1>

              {/* Description */}
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Alice est votre experte en création de miniatures YouTube. Elle génère des visuels 
                professionnels qui captent l&apos;attention et boostent votre taux de clic. 
                Décrivez simplement ce que vous voulez, et Alice s&apos;occupe du reste.
              </p>

              {/* VIDEO - Mobile Only (juste après la description) */}
              <div className="lg:hidden mb-8">
                <div className="relative rounded-2xl overflow-hidden border border-pink-500/20">
                  <video
                    className="aspect-video w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/alice-demo.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-pink-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard/alice"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-pink-500/25"
                >
                  Commencer avec Alice
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  onClick={() => setShowPortfolio(true)}
                  className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Voir ses travaux en détails
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Right Column - Video (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
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
                        rgba(236, 72, 153, 0.5) 120deg,
                        rgba(251, 146, 60, 0.8) 180deg,
                        rgba(236, 72, 153, 0.5) 240deg,
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
                    <source src="/alice-demo.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Agent Image - Desktop (floating) */}
              <div className="absolute -bottom-10 -left-20 w-48 h-60 z-10">
                <Image
                  src={AliceImage}
                  alt="Alice"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
      {/* Portfolio Modal */}
      <AnimatePresence>
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowPortfolio(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPortfolio(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={portfolioImages[currentIndex].src}
                      alt={portfolioImages[currentIndex].title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Title & Counter */}
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {portfolioImages[currentIndex].title}
                </h3>
                <p className="text-gray-400">
                  {currentIndex + 1} / {portfolioImages.length}
                </p>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-4">
                {portfolioImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-8 bg-pink-500"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
