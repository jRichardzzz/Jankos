"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCredits } from "@/context/CreditsContext";
import { useHistory } from "@/context/HistoryContext";
import { Zap, Search, Target, TrendingUp, ChevronDown, ChevronUp, ExternalLink, Sparkles, AlertCircle, ArrowLeft, Settings2 } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

import DouglasImage from "@/Douglas-removebg.png";

// Types
interface ViralConcept {
  titre_viral: string;
  tendance_source: string;
  adaptation_niche: string;
  saturation_check: string;
  score_vitalite: number;
  raison_potentiel: string;
  statut: "VALIDÉ" | "REJETÉ";
}

interface GroundingChunk {
  web?: {
    title?: string;
    uri?: string;
  };
}

const CREDITS_COST = 1;

export default function DouglasPage() {
  const { credits, deductCredits, isHydrated } = useCredits();
  const { addHistoryItem } = useHistory();

  // Form state
  const [niche, setNiche] = useState("");
  const [channelName, setChannelName] = useState("");
  const [audience, setAudience] = useState("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<ViralConcept[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // UI state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRequestGenerate = () => {
    if (!niche.trim() || !audience.trim()) {
      setError("La niche et l&apos;audience sont requises");
      return;
    }

    if (credits < CREDITS_COST) {
      setError(`Crédits insuffisants. Vous avez ${credits} crédit(s), il en faut ${CREDITS_COST}.`);
      return;
    }

    setError(null);
    setShowConfirmModal(true);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowForm(false);
    setError(null);
    setConcepts([]);
    setGroundingChunks([]);

    // Débiter les crédits immédiatement
    const success = await deductCredits(CREDITS_COST);
    if (!success) {
      setError("Erreur lors de la déduction des crédits.");
      setIsGenerating(false);
      setShowForm(true);
      return;
    }

    try {
      const response = await fetch("/api/generate-viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, channelName, audience }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      setConcepts(data.concepts);
      setGroundingChunks(data.groundingChunks || []);

      // Ajouter à l&apos;historique
      addHistoryItem({
        action: "Idées virales générées",
        description: `10 concepts pour "${niche}" - Audience: ${audience}`,
        agent: "Douglas",
        credits: -CREDITS_COST,
      });

    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la génération.";
      setError(errorMessage);
      setShowForm(true);
      
      addHistoryItem({
        action: "Génération échouée",
        description: `Erreur: ${errorMessage}`,
        agent: "Douglas",
        credits: -CREDITS_COST,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewGeneration = () => {
    setConcepts([]);
    setGroundingChunks([]);
    setShowForm(true);
    setNiche("");
    setChannelName("");
    setAudience("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30";
    if (score >= 50) return "text-amber-400 border-amber-500/30";
    return "text-red-400 border-red-500/30";
  };

  // Has results - show full page results
  const hasResults = concepts.length > 0 && !isGenerating;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleGenerate}
        title="Lancer l'analyse de marché"
        description={`Douglas va analyser les tendances virales des 7 derniers jours et générer 10 concepts adaptés à votre niche "${niche}" pour l'audience "${audience}".`}
        credits={CREDITS_COST}
        agentName="Douglas - Viral Market Fit"
        agentColor="from-violet-600 to-indigo-600"
        confirmText="Lancer l'analyse"
      />

      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour aux agents</span>
      </Link>

      {/* Header - Always visible but compact when results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mb-6 ${hasResults ? 'pb-4 border-b border-gray-200' : 'mb-8'}`}
      >
        <div className={`flex items-center ${hasResults ? 'justify-between' : 'flex-col justify-center text-center'}`}>
          <div className={`flex items-center gap-4 ${!hasResults ? 'flex-col' : ''}`}>
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 ${hasResults ? 'w-12 h-14' : 'w-20 h-24'}`}>
              <Image
                src={DouglasImage}
                alt="Douglas"
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className={!hasResults ? 'text-center' : ''}>
              <h1 className={`font-bold text-gray-900 ${hasResults ? 'text-xl' : 'text-3xl'}`}>
                Douglas - Viral Market Fit
              </h1>
              {!hasResults && (
                <p className="text-gray-500 mt-2">Trouvez des idées de vidéos virales basées sur les tendances actuelles</p>
              )}
            </div>
          </div>

          {hasResults && (
            <button
              onClick={handleNewGeneration}
              className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Nouvelle analyse
            </button>
          )}
        </div>

        {/* Credits info */}
        {!hasResults && (
          <div className="flex flex-col items-center gap-2 text-sm mt-4">
            <span className="flex items-center gap-1 text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              {CREDITS_COST} crédit par génération
            </span>
            <span className="text-gray-500">
              Solde: <span className="font-semibold text-gray-900">{isHydrated ? credits : '--'} crédits</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* Form Section - Show when no results or loading */}
        {showForm && !hasResults && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl mx-auto"
          >
            {/* Input Section */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 text-violet-600 font-semibold">
                  <Target className="w-5 h-5" />
                  <h2>Définir votre cible</h2>
                </div>

                <div className="space-y-4">
                  {/* Niche */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niche *
                    </label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: SaaS, Crossfit, Jardinage..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Channel Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la chaîne
                    </label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="Ex: TechMaster"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audience cible *
                    </label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Ex: Solopreneurs, Débutants..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleRequestGenerate}
                    disabled={isGenerating || !niche.trim() || !audience.trim()}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="w-5 h-5" />
                    Lancer l&apos;analyse
                  </button>

                  {/* Features */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Search className="w-3 h-3 text-violet-500" />
                      Google Search (7 derniers jours)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3 text-violet-500" />
                      Vérification virale
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Target className="w-3 h-3 text-violet-500" />
                      10 concepts générés
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <p className="text-gray-400 text-xs text-center mt-6">
                  La génération peut prendre jusqu&apos;à 3 minutes selon la complexité.
                </p>
              </div>
            </div>

          </motion.div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-violet-600 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-4 bg-violet-600 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute inset-8 bg-violet-500 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Analyse du marché en cours...</h3>
            <p className="text-gray-500 text-center max-w-md">
              Douglas scanne les tendances virales des 7 derniers jours, adapte les concepts à votre niche et calcule les scores de vitalité.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-violet-600">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              Niche: {niche} • Audience: {audience}
            </div>
          </motion.div>
        )}

        {/* Results - Full Page */}
        {hasResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Compact form toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top 10 Concepts d&apos;Arbitrage</h2>
                <p className="text-sm text-gray-500">
                  Pour <span className="text-violet-600 font-medium">{audience}</span> dans <span className="text-violet-600 font-medium">{niche}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {concepts.length} CONCEPTS
                </span>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <Settings2 className="w-4 h-4" />
                  {showForm ? "Masquer" : "Modifier"}
                </button>
              </div>
            </div>

            {/* Collapsible Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="Niche"
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-500 outline-none text-sm"
                      />
                      <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="Audience"
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-500 outline-none text-sm"
                      />
                      <button
                        onClick={handleRequestGenerate}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm"
                      >
                        Relancer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grounding Sources */}
            {groundingChunks.length > 0 && (
              <div className="mb-6 bg-violet-50 border border-violet-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Tendances détectées (données live)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groundingChunks.map((chunk, i) => {
                    const title = chunk.web?.title || `Source ${i + 1}`;
                    const uri = chunk.web?.uri;
                    if (!uri) return null;
                    return (
                      <a
                        key={i}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-white hover:bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full transition-colors flex items-center border border-violet-200 hover:border-violet-400"
                      >
                        <span className="truncate max-w-[150px]">{title}</span>
                        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {concepts.map((concept, idx) => {
                const isExpanded = expandedCards.has(idx);
                const isValid = concept.statut === "VALIDÉ";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-lg transition-all ${!isValid && "opacity-70"}`}
                  >
                    {/* Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs text-gray-400 font-medium">Concept #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getScoreColor(concept.score_vitalite)}`}>
                            {concept.score_vitalite}/100
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${isValid ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                            {concept.statut}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">
                        &quot;{concept.titre_viral}&quot;
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 mb-1">Source de tendance</p>
                        <p className="text-sm text-gray-700">{concept.tendance_source}</p>
                      </div>

                      <button
                        onClick={() => toggleCard(idx)}
                        className="w-full flex items-center justify-between text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <span>{isExpanded ? "Masquer les détails" : "Voir l'analyse stratégique"}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3"
                        >
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Adaptation niche</p>
                            <p className="text-sm text-gray-700">{concept.adaptation_niche}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Psychologie & Vitalité</p>
                            <p className="text-sm text-gray-700">{concept.raison_potentiel}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Vérification saturation</p>
                            <p className="text-sm text-violet-600 italic border-l-2 border-violet-400 pl-2">
                              {concept.saturation_check}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
