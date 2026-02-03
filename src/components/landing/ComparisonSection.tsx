"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, Zap, Eye, DollarSign, Timer, HelpCircle } from "lucide-react";

const jankosFeatures = [
  {
    icon: DollarSign,
    title: "10x moins cher",
    description: "Une miniature pour seulement 10 crédits (~3€) au lieu de 20-50€ chez un freelance. Économisez sur chaque création sans compromis sur la qualité.",
  },
  {
    icon: Zap,
    title: "Livraison en 1 minute",
    description: "Notre agent Alice s'occupe de vos miniatures en 1 à 3 minutes. Plus besoin d'attendre 48h ou plus. Votre miniature est prête quasi instantanément.",
  },
  {
    icon: Eye,
    title: "Contrôle total",
    description: "Modifiez les paramètres, régénérez autant de fois que vous voulez. Vous gardez le contrôle à 100% sur le résultat final.",
  },
];

const freelanceProblems = [
  {
    icon: DollarSign,
    title: "Minimum 20€ par miniature",
    description: "Les freelances facturent entre 20€ et 50€ par miniature. Sans compter les frais supplémentaires pour les retouches et modifications.",
  },
  {
    icon: Timer,
    title: "48h minimum de délai",
    description: "Comptez au moins 2 jours ouvrés pour recevoir votre miniature. Et si vous voulez des modifications ? Rajoutez encore 24-48h.",
  },
  {
    icon: HelpCircle,
    title: "Résultat incertain",
    description: "Vous ne savez jamais vraiment ce que vous allez recevoir. Le style peut ne pas correspondre, et les allers-retours sont épuisants.",
  },
];

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />
      
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Pourquoi </span>
            <span className="text-gradient">Jankos.cc</span>
            <span className="text-white"> ?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Vous hésitez encore ? Voici ce qui nous distingue des freelances traditionnels.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Jankos Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Header Card */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-3xl p-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <defs>
                      <linearGradient id="compLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M7 5H15M15 5V15C15 17.7614 12.7614 20 10 20V20C8.34315 20 7 18.6569 7 17V16" 
                      stroke="url(#compLogoGrad)" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Jankos.cc</h3>
                  <p className="text-amber-400 text-sm font-medium">La solution intelligente</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                    RECOMMANDÉ
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {jankosFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{feature.title}</h4>
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-amber-500/10 rounded-xl p-4 text-center border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">~2€</div>
                <div className="text-xs text-gray-400">par miniature</div>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-4 text-center border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">&lt;1min</div>
                <div className="text-xs text-gray-400">de génération</div>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-4 text-center border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">24/7</div>
                <div className="text-xs text-gray-400">disponible</div>
              </div>
            </div>
          </motion.div>

          {/* Freelances Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Header Card */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-3xl p-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center border border-gray-700">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Les Freelances</h3>
                  <p className="text-gray-500 text-sm font-medium">La méthode traditionnelle</p>
                </div>
              </div>
            </div>

            {/* Problems */}
            <div className="space-y-4">
              {freelanceProblems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 opacity-70"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <problem.icon className="w-5 h-5 text-red-400/70" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-300">{problem.title}</h4>
                        <X className="w-5 h-5 text-red-400/70" />
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.05] opacity-60">
                <div className="text-2xl font-bold text-gray-400">20-50€</div>
                <div className="text-xs text-gray-500">par miniature</div>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.05] opacity-60">
                <div className="text-2xl font-bold text-gray-400">48h+</div>
                <div className="text-xs text-gray-500">de délai</div>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.05] opacity-60">
                <div className="text-2xl font-bold text-gray-400">$$</div>
                <div className="text-xs text-gray-500">par retouche</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Rejoignez les <span className="text-amber-400 font-semibold">287+ créateurs</span> qui ont fait le bon choix.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
