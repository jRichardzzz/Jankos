"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: StaticImageData;
  color?: string; // couleur de l'agent
}

interface AnimatedTooltipProps {
  items: TooltipItem[];
}

// Couleurs par agent
const agentColors: Record<number, { border: string; glow: string; text: string }> = {
  1: { // Alice - Rose
    border: "rgba(236, 72, 153, 0.6)",
    glow: "rgba(236, 72, 153, 0.4)",
    text: "text-pink-400",
  },
  2: { // Douglas - Violet
    border: "rgba(139, 92, 246, 0.6)",
    glow: "rgba(139, 92, 246, 0.4)",
    text: "text-violet-400",
  },
  3: { // Roman - Teal
    border: "rgba(20, 184, 166, 0.6)",
    glow: "rgba(20, 184, 166, 0.4)",
    text: "text-teal-400",
  },
};

// Composant pour un avatar individuel avec son onde lumineuse
function AvatarCard({ 
  item, 
  hoveredIndex, 
  setHoveredIndex 
}: { 
  item: TooltipItem; 
  hoveredIndex: number | null; 
  setHoveredIndex: (id: number | null) => void;
}) {
  const colors = agentColors[item.id] || agentColors[1];
  const isHovered = hoveredIndex === item.id;
  
  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setHoveredIndex(item.id)}
      onMouseLeave={() => setHoveredIndex(null)}
      whileHover={{ scale: 1.08, zIndex: 30 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute bottom-full left-0 right-0 -mb-4 z-50 flex justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center rounded-xl bg-black/90 backdrop-blur-sm border border-white/10 shadow-xl px-4 py-2 whitespace-nowrap">
            <div className="font-bold text-white text-sm">{item.name}</div>
            <div className={`text-xs ${colors.text}`}>{item.designation}</div>
          </div>
        </motion.div>
      )}

      {/* Conteneur avec bordure colorée - Cercle */}
      <div 
        className="relative p-[2px] sm:p-[3px] rounded-full transition-all duration-300"
        style={{
          background: isHovered 
            ? `linear-gradient(135deg, ${colors.border}, transparent, ${colors.border})`
            : `linear-gradient(135deg, ${colors.border}40, transparent, ${colors.border}40)`,
          boxShadow: isHovered ? `0 0 25px ${colors.glow}` : 'none',
        }}
      >
        {/* Fond noir */}
        <div className="absolute inset-[2px] sm:inset-[3px] bg-neutral-900 rounded-full" />
        
        {/* Avatar - 90px sur mobile, 112px sur desktop */}
        <div className="relative w-[90px] h-[90px] sm:w-28 sm:h-28 rounded-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover object-top scale-125"
          />
        </div>
      </div>
      
      {/* Petit indicateur de couleur en bas */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.border }}
      />
    </motion.div>
  );
}

export function AnimatedTooltip({ items }: AnimatedTooltipProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex gap-2 sm:gap-3">
      {items.map((item) => (
        <AvatarCard
          key={item.id}
          item={item}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
    </div>
  );
}
