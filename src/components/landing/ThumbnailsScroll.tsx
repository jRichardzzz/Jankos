"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

// Import des miniatures
import MiniaBatiment2 from "../../MiniaBatiment2.webp";
import MiniaLondres from "../../MiniaLondres.webp";
import MiniaMakeup from "../../MiniaMakeup.webp";
import MiniaTech3 from "../../MiniaTech3.webp";
import MiniaYacht from "../../MiniaYacht.webp";
import MiniaBadminton from "../../Minia Badminton.webp";
import MiniaImmo from "../../Minia Immo.webp";
import Miniaacci from "../../Miniaacci.webp";
import MiniaAgent from "../../MiniaAgent.webp";
import MiniaJetSki from "../../Minia jet ski.webp";

const thumbnails: StaticImageData[] = [
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

// On duplique les miniatures pour créer un effet infini (2x suffit avec 10 images)
const row1 = [...thumbnails, ...thumbnails];
const row2 = [...[...thumbnails].reverse(), ...[...thumbnails].reverse()];

export function ThumbnailsScroll() {
  return (
    <section className="py-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
      
      <div className="relative">
        {/* Masque de fondu sur les côtés */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        
        {/* Rangée 1 - Défile vers la droite */}
        <div className="mb-4 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -3040] }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row1.map((thumbnail, index) => (
              <div
                key={`row1-${index}`}
                className="relative flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden shadow-xl shadow-black/30 border border-white/10 group"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Rangée 2 - Défile vers la gauche */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: [-3040, 0] }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {row2.map((thumbnail, index) => (
              <div
                key={`row2-${index}`}
                className="relative flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden shadow-xl shadow-black/30 border border-white/10 group"
              >
                <Image
                  src={thumbnail}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Caption */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Générées par <span className="text-pink-400 font-medium">Alice</span> : agent créateur de miniatures haut CTR
        </p>
      </div>
    </section>
  );
}
