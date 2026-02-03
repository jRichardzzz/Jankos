"use client";

import Image, { StaticImageData } from "next/image";

// Import des miniatures
import MiniaBatiment2 from "../../MiniaBatiment2.webp";
import MiniaLondres from "../../MiniaLondres.webp";
import MiniaMakeup from "../../MiniaMakeup.webp";
import MiniaTech3 from "../../MiniaTech3.webp";
import MiniaYacht from "../../MiniaYacht.webp";
import MiniaBadminton from "../../Minia Badminton.webp";

// Sur mobile on charge moins d'images pour la performance
const thumbnailsMobile: StaticImageData[] = [
  MiniaBatiment2,
  MiniaLondres,
  MiniaMakeup,
  MiniaTech3,
  MiniaYacht,
  MiniaBadminton,
];

// Sur desktop on peut en avoir plus
import MiniaImmo from "../../Minia Immo.webp";
import Miniaacci from "../../Miniaacci.webp";
import MiniaAgent from "../../MiniaAgent.webp";
import MiniaJetSki from "../../Minia jet ski.webp";

const thumbnailsDesktop: StaticImageData[] = [
  MiniaBatiment2,
  MiniaLondres,
  MiniaMakeup,
  MiniaTech3,
  MiniaYacht,
  MiniaBadminton,
  MiniaImmo,
  Miniaacci,
  MiniaAgent,
  MiniaJetSki,
];

export function ThumbnailsScroll() {
  return (
    <section className="-mt-[5.5rem] sm:mt-0 pb-4 sm:py-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
      
      <div className="relative">
        {/* Masque de fondu sur les côtés */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        
        {/* Rangée 1 - Animation CSS pure (beaucoup plus performant que Framer Motion) */}
        <div className="mb-3 sm:mb-4 overflow-hidden">
          {/* Version Mobile - sans doublons */}
          <div className="flex sm:hidden gap-3 animate-scroll-left">
            {thumbnailsMobile.map((thumbnail, index) => (
              <div
                key={`row1-mobile-${index}`}
                className="relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden shadow-lg shadow-black/30 border border-white/10"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="144px"
                  loading="eager"
                  quality={60}
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
          {/* Version Desktop */}
          <div className="hidden sm:flex gap-4 animate-scroll-left-desktop">
            {[...thumbnailsDesktop, ...thumbnailsDesktop].map((thumbnail, index) => (
              <div
                key={`row1-desktop-${index}`}
                className="relative flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-white/10"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="288px"
                  loading={index < 10 ? "eager" : "lazy"}
                  quality={75}
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 - Animation CSS inverse */}
        <div className="overflow-hidden">
          {/* Version Mobile - sans doublons */}
          <div className="flex sm:hidden gap-3 animate-scroll-right">
            {[...thumbnailsMobile].reverse().map((thumbnail, index) => (
              <div
                key={`row2-mobile-${index}`}
                className="relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden shadow-lg shadow-black/30 border border-white/10"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="144px"
                  loading="lazy"
                  quality={60}
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
          {/* Version Desktop */}
          <div className="hidden sm:flex gap-4 animate-scroll-right-desktop">
            {[...thumbnailsDesktop].reverse().concat([...thumbnailsDesktop].reverse()).map((thumbnail, index) => (
              <div
                key={`row2-desktop-${index}`}
                className="relative flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden shadow-lg shadow-black/30 border border-white/10"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="288px"
                  loading="lazy"
                  quality={75}
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 px-4">
          Générées par <span className="text-pink-400 font-medium">Alice</span> : agent créateur de miniatures haut CTR
        </p>
      </div>
    </section>
  );
}
