'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Zap, Check, CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';

const creditPacks = [
  { id: 'pack_30', credits: 30, price: 8.90, popular: false },
  { id: 'pack_100', credits: 100, price: 19.90, popular: false },
  { id: 'pack_200', credits: 200, price: 39, popular: false },
  { id: 'pack_500', credits: 500, price: 95, popular: true },
  { id: 'pack_1000', credits: 1000, price: 179, popular: false },
  { id: 'pack_2000', credits: 2000, price: 330, popular: false },
];

const subscriptionPlans = [
  { id: 'sub_500', credits: 500, price: 49, priceAnnual: 42 },
  { id: 'sub_1000', credits: 1000, price: 98, priceAnnual: 83 },
  { id: 'sub_2000', credits: 2000, price: 196, priceAnnual: 167 },
  { id: 'sub_5000', credits: 5000, price: 490, priceAnnual: 417 },
];

export default function CreditsPage() {
  const { credits, refreshCredits } = useCredits();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number>(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeTab, setActiveTab] = useState<'packs' | 'subscription'>('packs');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const searchParams = useSearchParams();

  // Gérer les retours de Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const creditsAdded = searchParams.get('credits');

    if (success === 'true') {
      setMessage({ 
        type: 'success', 
        text: creditsAdded 
          ? `Paiement réussi ! ${creditsAdded} crédits ont été ajoutés à votre compte.`
          : 'Abonnement activé avec succès !'
      });
      refreshCredits();
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/dashboard/credits');
    } else if (canceled === 'true') {
      setMessage({ type: 'error', text: 'Paiement annulé.' });
      window.history.replaceState({}, '', '/dashboard/credits');
    }
  }, [searchParams, refreshCredits]);

  const handlePurchase = async () => {
    if (activeTab === 'packs' && selectedPack === null) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          activeTab === 'packs'
            ? { type: 'pack', packId: creditPacks[selectedPack!].id }
            : { type: 'subscription', planId: subscriptionPlans[selectedSub].id, isAnnual }
        ),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: 'error', text: data.error || 'Une erreur est survenue' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex-1 min-w-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 mb-2 md:mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Retour</span>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Acheter des crédits</h1>
          <p className="text-xs md:text-sm text-gray-500 truncate">Rechargez votre compte pour continuer à utiliser les agents</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-amber-50 rounded-lg md:rounded-xl border border-amber-200 flex-shrink-0">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
          <div>
            <p className="text-[10px] md:text-xs text-amber-600 font-medium">Solde actuel</p>
            <p className="text-sm md:text-lg font-bold text-amber-700">{credits} crédits</p>
          </div>
        </div>
      </div>

      {/* Message de succès/erreur */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 p-1 bg-gray-100 rounded-lg md:rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('packs')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-sm md:text-base font-medium transition-all ${
            activeTab === 'packs'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Packs (unique)
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg text-sm md:text-base font-medium transition-all ${
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
            {creditPacks.map((pack, index) => (
              <motion.button
                key={pack.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPack(index)}
                className={`relative p-3 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all text-left ${
                  selectedPack === index
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2 left-2 md:left-4 px-1.5 md:px-2 py-0.5 bg-amber-500 text-white text-[10px] md:text-xs font-bold rounded-full">
                    Populaire
                  </span>
                )}
                <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                  <Zap className={`w-4 h-4 md:w-5 md:h-5 ${selectedPack === index ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-lg md:text-2xl font-bold text-gray-900">{pack.credits}</span>
                  <span className="text-xs md:text-base text-gray-500">crédits</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-3xl font-black text-gray-900">{pack.price.toLocaleString('fr-FR')}€</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 md:mt-1">
                  {(pack.price / pack.credits).toFixed(2)}€ / crédit
                </p>
                {selectedPack === index && (
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 w-5 h-5 md:w-6 md:h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Purchase Button for Packs */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={handlePurchase}
            disabled={selectedPack === null || isLoading}
            className={`w-full py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-all ${
              selectedPack !== null && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                <span className="hidden md:inline">Redirection vers Stripe...</span>
                <span className="md:hidden">Chargement...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                {selectedPack !== null
                  ? <><span className="hidden md:inline">Acheter {creditPacks[selectedPack].credits} crédits pour {creditPacks[selectedPack].price.toLocaleString('fr-FR')}€</span><span className="md:hidden">{creditPacks[selectedPack].credits} crédits - {creditPacks[selectedPack].price.toLocaleString('fr-FR')}€</span></>
                  : 'Sélectionnez un pack'}
              </>
            )}
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
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={handlePurchase}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirection vers Stripe...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                S&apos;abonner pour {isAnnual ? subscriptionPlans[selectedSub].priceAnnual : subscriptionPlans[selectedSub].price}€/mois
              </>
            )}
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
          <li>• <strong>10 crédits</strong> = 1 miniature ou 1 recherche d&apos;idées</li>
          <li>• <strong>20 crédits</strong> = 1 stratégie SEO avec Roman</li>
        </ul>
      </div>
    </div>
  );
}
