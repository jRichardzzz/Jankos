"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const pricingPlans = [
  {
    name: "À la carte",
    description: "Commencez petit avec un achat unique, évoluez selon vos besoins. Rechargez vos crédits à tout moment.\n\n1 miniature = 10 crédits",
    creditOptions: [
      { credits: 30, price: 8.90 },
      { credits: 100, price: 19.90 },
      { credits: 200, price: 39 },
      { credits: 500, price: 95 },
      { credits: 1000, price: 179 },
      { credits: 2000, price: 330 },
      { credits: 5000, price: 750 },
      { credits: 10000, price: 1390 },
      { credits: 20000, price: 2590 },
      { credits: 50000, price: 5900 },
    ],
    buttonText: "Acheter",
    features: [],
    popular: false,
    icon: "💳",
  },
  {
    name: "Lite",
    subtitle: "150 crédits par mois",
    subtitleMiniatures: "15 miniatures",
    price: 19,
    priceAnnual: 16,
    buttonText: "Commencer",
    features: [
      { category: "Agents IA", items: ["Génération de miniatures", "Recherche d'idées", "Stratégie SEO"] },
    ],
    popular: false,
    icon: "🚀",
  },
  {
    name: "Pro",
    showDynamicCredits: true,
    isMonthly: true,
    creditOptions: [
      { credits: 500, price: 49, priceAnnual: 42 },
      { credits: 1000, price: 98, priceAnnual: 83 },
      { credits: 2000, price: 196, priceAnnual: 167 },
      { credits: 5000, price: 490, priceAnnual: 417 },
    ],
    buttonText: "Commencer",
    features: [
      { category: "Agents IA", items: ["Génération de miniatures", "Recherche d'idées", "Stratégie SEO"] },
      { category: "Avantages", items: ["Génération privée", "2 sièges"] },
    ],
    tooltips: {
      "Génération privée": "Vos miniatures restent confidentielles et ne sont jamais utilisées à des fins marketing ou promotionnelles.",
      "2 sièges": "Vous pouvez ajouter un autre membre de votre équipe à votre compte.",
    },
    popular: true,
    icon: "⚡",
  },
  {
    name: "Volume+",
    showDynamicCredits: true,
    isMonthly: true,
    creditOptions: [
      { credits: 10000, price: 990 },
      { credits: 20000, price: 1790 },
      { credits: 50000, price: 3990 },
      { credits: 100000, price: 6900 },
      { credits: 250000, price: 14900 },
      { credits: 500000, price: 24900 },
      { credits: 1000000, price: 39000 },
    ],
    buttonText: "Commencer",
    features: [
      { category: "Agents IA", items: ["Génération de miniatures", "Recherche d'idées", "Stratégie SEO"] },
      { category: "Avantages", items: ["Génération privée", "5 sièges"] },
    ],
    tooltips: {
      "Génération privée": "Vos miniatures restent confidentielles et ne sont jamais utilisées à des fins marketing ou promotionnelles.",
      "5 sièges": "Vous pouvez ajouter quatre autres membres de votre équipe à votre compte.",
    },
    popular: false,
    icon: "🏢",
  },
];

export function PricingSection() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [selectedCredits, setSelectedCredits] = useState<{ [key: string]: number }>({
    "À la carte": 0,
    "Pro": 0,
    "Volume+": 0,
  });
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (planName: string) => {
    setIsLoading(planName);
    
    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Rediriger vers la page de connexion
      router.push('/login?redirect=/dashboard/credits');
      return;
    }
    
    // Rediriger vers la page de crédits du dashboard
    router.push('/dashboard/credits');
    setIsLoading(null);
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 relative overflow-hidden" suppressHydrationWarning>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4"
          >
            Tarifs
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Simple et transparent
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Évoluez à tout moment.
          </p>
        </motion.div>

        {/* Toggle Mensuel / Annuel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center justify-center mb-12 gap-3"
        >
          <div className="inline-flex items-center bg-gray-800 rounded-full p-1 border border-gray-700">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!isAnnual ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Mensuel
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isAnnual ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Annuel
            </button>
          </div>
          {isAnnual && (
            <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
              Économisez 15% avec l&apos;abonnement annuel
            </span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`
                relative group
                bg-gradient-to-b from-white to-gray-50
                rounded-3xl p-6
                shadow-2xl shadow-black/20
                border border-gray-100
                ${plan.popular ? "ring-2 ring-amber-400 scale-[1.02]" : ""}
              `}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.popular ? "bg-amber-400/5" : "bg-gray-100/50"}`} />
              
              {/* Badge populaire */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <motion.span 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap"
                  >
                    ⭐ Le plus populaire
                  </motion.span>
                </div>
              )}

              <div className="relative z-10">
                {/* Icon & Plan name */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{plan.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                {/* Dynamic credits display for Pro */}
                {plan.showDynamicCredits && plan.creditOptions && (
                  <div className="mb-5">
                    <p className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {plan.creditOptions[selectedCredits[plan.name] || 0].credits.toLocaleString("fr-FR")} crédits par mois
                    </p>
                    <p className="text-sm text-amber-600 font-medium mt-1">
                      ({Math.floor(plan.creditOptions[selectedCredits[plan.name] || 0].credits / 10).toLocaleString("fr-FR")} miniatures)
                    </p>
                  </div>
                )}

                {/* Subtitle */}
                {plan.subtitle && (
                  <div className="mb-5">
                    <p className={`flex items-center gap-2 ${plan.priceAnnual ? "text-base font-semibold text-gray-700" : "text-sm text-gray-500"}`}>
                      {plan.priceAnnual && (
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                      {plan.subtitle}
                    </p>
                    {plan.subtitleMiniatures && (
                      <p className="text-sm text-amber-600 font-medium mt-1">({plan.subtitleMiniatures})</p>
                    )}
                  </div>
                )}

                {/* Credit selector */}
                {plan.creditOptions && (
                  <div className="mb-5">
                    {!plan.showDynamicCredits && (
                      <label className="text-xs text-gray-500 mb-2 block font-medium uppercase tracking-wide">Quantité</label>
                    )}
                    <div className="relative">
                      <select
                        value={selectedCredits[plan.name] || 0}
                        onChange={(e) => setSelectedCredits({ ...selectedCredits, [plan.name]: parseInt(e.target.value) })}
                        className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-10 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all cursor-pointer hover:border-gray-300"
                      >
                        {plan.creditOptions.map((option, i) => (
                          <option key={i} value={i}>
                            {plan.showDynamicCredits 
                              ? `${option.credits.toLocaleString("fr-FR")} crédits` 
                              : `${option.credits.toLocaleString("fr-FR")} crédits${plan.isMonthly ? " / mois" : ""}`
                            }
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {!plan.showDynamicCredits && (
                      <p className="text-sm text-amber-600 font-medium mt-2">
                        ({Math.floor(plan.creditOptions[selectedCredits[plan.name] || 0].credits / 10).toLocaleString("fr-FR")} miniatures{plan.isMonthly ? " / mois" : ""})
                      </p>
                    )}
                  </div>
                )}

                {/* Prix */}
                <div className="mb-5">
                  {plan.creditOptions ? (
                    <div className="flex flex-col">
                      {(() => {
                        const selectedOption = plan.creditOptions[selectedCredits[plan.name] || 0];
                        const hasAnnualPrice = 'priceAnnual' in selectedOption;
                        const displayPrice = hasAnnualPrice && isAnnual ? selectedOption.priceAnnual : selectedOption.price;
                        return (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black text-gray-900">
                                {displayPrice?.toLocaleString("fr-FR")}€
                              </span>
                              {plan.isMonthly && (
                                <span className="text-gray-400 font-medium">/ mois</span>
                              )}
                            </div>
                            {hasAnnualPrice && isAnnual && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-400 line-through">{selectedOption.price}€</span>
                                <span className="text-xs text-green-500 font-medium">Économisez {((selectedOption.price - selectedOption.priceAnnual!) * 12).toLocaleString("fr-FR")}€/an</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-gray-900">
                          {isAnnual ? plan.priceAnnual : plan.price}€
                        </span>
                        <span className="text-gray-400 font-medium">/ mois</span>
                      </div>
                      {isAnnual && plan.priceAnnual && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-400 line-through">{plan.price}€</span>
                          <span className="text-xs text-green-500 font-medium">Économisez {(plan.price! - plan.priceAnnual) * 12}€/an</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bouton */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(plan.name)}
                  disabled={isLoading === plan.name}
                  className={`
                    w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide
                    transition-all duration-300 mb-5 disabled:opacity-50
                    ${plan.popular 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50" 
                      : "bg-gray-900 text-white hover:bg-gray-800"
                    }
                  `}
                >
                  {isLoading === plan.name ? "Chargement..." : plan.buttonText}
                </motion.button>

                {/* Prix annuel */}
                {plan.priceAnnual && isAnnual && (
                  <div className="text-center text-sm text-gray-500 mb-5 py-2 bg-green-50 rounded-lg border border-green-100">
                    💰 <span className="font-medium text-green-600">{plan.priceAnnual * 12}€</span> facturé annuellement
                  </div>
                )}

                {/* Description pour Pay-as-you-go */}
                {plan.description && (
                  <div className="pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{plan.description}</p>
                  </div>
                )}

                {/* Features */}
                {plan.features.length > 0 && (
                  <div className="pt-5 border-t border-gray-100 space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                          {feature.category}
                        </h4>
                        <ul className="space-y-2">
                          {feature.items.map((item, j) => {
                            const tooltipKey = `${plan.name}-${item}`;
                            const tooltips = plan.tooltips as Record<string, string> | undefined;
                            const tooltipText = tooltips?.[item];
                            return (
                              <li key={j} className="text-sm text-gray-600 flex items-start gap-2 relative">
                                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="flex items-center gap-1.5">
                                  {item}
                                  {tooltipText && (
                                    <button
                                      onClick={() => setActiveTooltip(activeTooltip === tooltipKey ? null : tooltipKey)}
                                      className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-xs flex items-center justify-center transition-colors"
                                    >
                                      ?
                                    </button>
                                  )}
                                </span>
                                <AnimatePresence>
                                  {tooltipText && activeTooltip === tooltipKey && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      className="absolute left-0 top-full mt-1 z-50 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg max-w-[200px]"
                                    >
                                      {tooltipText}
                                      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note en bas */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-12"
        >
          Besoin de plus de 100 000 crédits ? <a href="#" className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2">Contactez-nous</a> pour un tarif personnalisé.
        </motion.p>
      </div>
    </section>
  );
}
