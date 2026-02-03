"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque action consomme un certain nombre de crédits : générer une miniature (10 crédits), trouver des idées virales avec Douglas (10 crédits), générer une stratégie SEO avec Roman (20 crédits). Les crédits des abonnements se rechargent chaque mois. Les crédits achetés en Pay-as-you-go n'expirent jamais."
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vous conserverez l'accès jusqu'à la fin de votre période de facturation en cours, et vos crédits restants resteront utilisables."
  },
  {
    question: "Quelle est la qualité des miniatures générées ?",
    answer: "Nos agents IA génèrent des miniatures en 2K, parfait pour YouTube. Chaque miniature est générée en environ 1 minute et conçue pour maximiser votre taux de clic (CTR) en suivant les meilleures pratiques des créateurs à succès."
  },
  {
    question: "Comment fonctionne la stratégie SEO de Roman ?",
    answer: "Roman, notre agent Keyword Alchemist, analyse les mots-clés les plus recherchés dans votre niche et génère des stratégies SEO complètes avec des titres optimisés pour le référencement YouTube."
  },
  {
    question: "Combien de temps faut-il pour générer du contenu ?",
    answer: "La génération d'une miniature prend environ 3 minutes. La recherche d'idées virales avec Douglas est quasi instantanée. La génération d'une stratégie SEO avec Roman prend environ 30 secondes."
  },
  {
    question: "Puis-je utiliser le contenu généré commercialement ?",
    answer: "Oui, tout le contenu généré avec Jankos.cc vous appartient à 100%. Vous pouvez l'utiliser librement sur votre chaîne YouTube, pour des sponsorisations, ou tout autre usage commercial sans restriction."
  },
  {
    question: "Y a-t-il une limite au nombre de projets ?",
    answer: "Non, il n'y a aucune limite au nombre de projets ou de chaînes YouTube. La seule limite est le nombre de crédits disponibles dans votre compte. Vous pouvez gérer autant de chaînes que vous le souhaitez."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Notre équipe support est disponible par email à support@jankos.cc et répond sous 24h en semaine. Les utilisateurs Pro et Volume+ bénéficient d'un support prioritaire avec des temps de réponse garantis sous 4h."
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-gray-800 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-white group-hover:text-amber-400 transition-colors pr-8">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors"
        >
          <svg 
            className={`w-4 h-4 transition-colors ${isOpen ? "text-amber-400" : "text-gray-400 group-hover:text-amber-400"}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed pr-16">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="pt-0 pb-12 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4"
          >
            FAQ
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour démarrer avec Jankos.cc
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/30 rounded-3xl border border-gray-800 p-2 sm:p-4">
            <div className="bg-neutral-900/80 rounded-2xl px-6 sm:px-8">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Vous avez d&apos;autres questions ?
          </p>
          <a 
            href="mailto:support@jankos.cc" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700 hover:border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactez-nous
          </a>
        </motion.div>
      </div>
    </section>
  );
}
