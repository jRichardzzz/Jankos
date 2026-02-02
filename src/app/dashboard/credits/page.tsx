'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Zap, Check, CreditCard } from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';

const creditPacks = [
  { credits: 3, price: 8.90, popular: false },
  { credits: 10, price: 19.90, popular: false },
  { credits: 20, price: 39, popular: false },
  { credits: 50, price: 95, popular: true },
  { credits: 100, price: 179, popular: false },
  { credits: 200, price: 330, popular: false },
];

const subscriptionPlans = [
  { credits: 50, price: 49, priceAnnual: 42 },
  { credits: 100, price: 98, priceAnnual: 83 },
  { credits: 200, price: 196, priceAnnual: 167 },
  { credits: 500, price: 490, priceAnnual: 417 },
];

export default function CreditsPage() {
  const { credits } = useCredits();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number>(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeTab, setActiveTab] = useState<'packs' | 'subscription'>('packs');

  const handlePurchase = () => {
    // TODO: Intégrer Stripe ici
    alert('Stripe sera intégré prochainement !');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Acheter des crédits</h1>
          <p className="text-gray-500">Rechargez votre compte pour continuer à utiliser les agents</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
          <Zap className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-xs text-amber-600 font-medium">Solde actuel</p>
            <p className="text-lg font-bold text-amber-700">{credits} crédits</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('packs')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'packs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Packs (unique)
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'subscription'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Abonnement
        </button>
      </div>

      {activeTab === 'packs' ? (
        <>
          {/* Credit Packs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {creditPacks.map((pack, index) => (
              <motion.button
                key={pack.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPack(index)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedPack === index
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    Populaire
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Zap className={`w-5 h-5 ${selectedPack === index ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-2xl font-bold text-gray-900">{pack.credits}</span>
                  <span className="text-gray-500">crédits</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{pack.price.toLocaleString('fr-FR')}€</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {(pack.price / pack.credits).toFixed(2)}€ / crédit
                </p>
                {selectedPack === index && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Purchase Button for Packs */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePurchase}
            disabled={selectedPack === null}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              selectedPack !== null
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            {selectedPack !== null
              ? `Acheter ${creditPacks[selectedPack].credits} crédits pour ${creditPacks[selectedPack].price.toLocaleString('fr-FR')}€`
              : 'Sélectionnez un pack'}
          </motion.button>
        </>
      ) : (
        <>
          {/* Annual/Monthly Toggle */}
          <div className="flex flex-col items-center mb-8">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-3">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isAnnual
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annuel
              </button>
            </div>
            {isAnnual && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Économisez 15%
              </span>
            )}
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {subscriptionPlans.map((plan, index) => (
              <motion.button
                key={plan.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSub(index)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedSub === index
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {index === 0 && (
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    Populaire
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Zap className={`w-5 h-5 ${selectedSub === index ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-xl font-bold text-gray-900">{plan.credits}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">crédits / mois</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">
                    {isAnnual ? plan.priceAnnual : plan.price}€
                  </span>
                  <span className="text-gray-400 text-sm">/ mois</span>
                </div>
                {isAnnual && (
                  <p className="text-xs text-gray-400 mt-1 line-through">{plan.price}€</p>
                )}
                {selectedSub === index && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Purchase Button for Subscription */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePurchase}
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
          >
            <CreditCard className="w-5 h-5" />
            S&apos;abonner pour {isAnnual ? subscriptionPlans[selectedSub].priceAnnual : subscriptionPlans[selectedSub].price}€/mois
          </motion.button>

          {isAnnual && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Facturé {(subscriptionPlans[selectedSub].priceAnnual * 12).toLocaleString('fr-FR')}€ par an
            </p>
          )}
        </>
      )}

      {/* Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Comment ça marche ?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Packs :</strong> Achat unique, crédits valables à vie</li>
          <li>• <strong>Abonnement :</strong> Crédits renouvelés chaque mois automatiquement</li>
          <li>• <strong>1 crédit</strong> = 1 miniature ou 1 recherche d&apos;idées</li>
          <li>• <strong>2 crédits</strong> = 1 stratégie SEO avec Roman</li>
        </ul>
      </div>
    </div>
  );
}
