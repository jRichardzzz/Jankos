"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// Import des images des agents
import AliceImage from "@/Alice-removebg.png";
import DouglasImage from "@/Douglas-removebg.png";
import RomanImage from "@/Roman-removebg.png";

const agents = [
  {
    id: "alice",
    name: "Alice",
    role: "Générateur de Miniatures",
    description: "Créez des miniatures YouTube captivantes qui boostent votre taux de clic. Alice génère des designs professionnels en quelques secondes.",
    image: AliceImage,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
  },
  {
    id: "douglas",
    name: "Douglas",
    role: "Viral Market Fit",
    description: "Trouvez des idées de vidéos virales basées sur les tendances actuelles. Douglas analyse le marché et génère des concepts adaptés à votre niche.",
    image: DouglasImage,
    color: "from-violet-500 to-indigo-500",
    bgColor: "bg-gradient-to-br from-violet-400 to-indigo-500",
  },
  {
    id: "roman",
    name: "Roman",
    role: "Keyword Alchemist",
    description: "Stratégie SEO & idées de vidéos basées sur les mots-clés. Roman analyse les recherches et génère des titres optimisés pour le référencement.",
    image: RomanImage,
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-teal-400 to-emerald-500",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Get user first name
  const firstName = () => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return user.email?.split('@')[0] || '';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, <span className="text-amber-600">{firstName()}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Que voulez-vous créer aujourd&apos;hui ?</p>
      </motion.div>


      {/* Agents section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos agents IA</h2>
      </motion.div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
          >
            <Link
              href={`/dashboard/${agent.id}`}
              className="
                group
                block
                relative
                overflow-hidden
                rounded-3xl
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-2xl
              "
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 ${agent.bgColor}`} />
              
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/10" />

              {/* Content */}
              <div className="relative flex flex-col h-full p-6">
                {/* Header with name and role */}
                <div className="z-10 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Agent IA</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
                  <p className="text-white/90 font-semibold text-sm">{agent.role}</p>
                </div>

                {/* Description */}
                <p className="text-white/75 text-sm leading-relaxed z-10 line-clamp-3">
                  {agent.description}
                </p>

                {/* Agent image */}
                <div className="relative h-52 mt-auto -mb-6 -mx-2">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white text-xs font-medium">Disponible</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
