"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCredits } from "@/context/CreditsContext";
import { useHistory } from "@/context/HistoryContext";
import { Zap, Search, Target, Sparkles, AlertCircle, Youtube, BookOpen, Feather, Copy, Check, BarChart3, ArrowLeft, Settings2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ConfirmModal from "@/components/ui/ConfirmModal";

import RomanImage from "@/Roman-removebg.png";

// Types
interface GeneratedTitles {
  educatif: string;
  curiosite: string;
  storytelling: string;
}

interface VideoConcept {
  mot_cle_origine: string;
  volume_mensuel: number;
  intention_detectee: string;
  titres_generes: GeneratedTitles;
  potentiel_viral: string;
}

const CREDITS_COST = 2;

const SUGGESTED_NICHES = [
  "Badminton",
  "Cryptomonnaie",
  "Cuisine Végane",
  "Développement Personnel",
  "Jardinage Urbain",
  "IA & Tech"
];

export default function RomanPage() {
  const { credits, deductCredits, isHydrated } = useCredits();
  const { addHistoryItem } = useHistory();

  // Form state
  const [niche, setNiche] = useState("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<VideoConcept[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // UI state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showChart, setShowChart] = useState(true);

  const handleRequestGenerate = () => {
    if (!niche.trim()) {
      setError("La niche est requise");
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

    // Débiter les crédits immédiatement
    const success = await deductCredits(CREDITS_COST);
    if (!success) {
      setError("Erreur lors de la déduction des crédits.");
      setIsGenerating(false);
      setShowForm(true);
      return;
    }

    try {
      const response = await fetch("/api/generate-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      setConcepts(data.concepts);

      // Ajouter à l&apos;historique
      addHistoryItem({
        action: "Stratégie SEO générée",
        description: `10 mots-clés pour "${niche}"`,
        agent: "Roman",
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
        agent: "Roman",
        credits: -CREDITS_COST,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewGeneration = () => {
    setConcepts([]);
    setShowForm(true);
    setNiche("");
  };

  const getViralColor = (potential: string) => {
    switch (potential) {
      case 'ÉLEVÉ': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: '#10b981' };
      case 'MOYEN': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: '#f59e0b' };
      default: return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', bar: '#64748b' };
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllAsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(concepts, null, 2));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Prepare chart data
  const chartData = concepts.map(c => ({
    name: c.mot_cle_origine.replace(/"/g, ''),
    volume: c.volume_mensuel,
    viral: c.potentiel_viral
  }));

  const hasResults = concepts.length > 0 && !isGenerating;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleGenerate}
        title="Générer la stratégie SEO"
        description={`Roman va analyser les mots-clés les plus recherchés pour la niche "${niche}" et générer 10 concepts de vidéos avec 3 types de titres chacun.`}
        credits={CREDITS_COST}
        agentName="Roman - Keyword Alchemist"
        agentColor="from-teal-600 to-emerald-600"
        confirmText="Générer la stratégie"
      />

      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Retour aux agents</span>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mb-6 ${hasResults ? 'pb-4 border-b border-gray-200' : 'mb-8'}`}
      >
        <div className={`flex items-center ${hasResults ? 'justify-between' : 'flex-col justify-center text-center'}`}>
          <div className={`flex items-center gap-4 ${!hasResults ? 'flex-col' : ''}`}>
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 ${hasResults ? 'w-12 h-14' : 'w-20 h-24'}`}>
              <Image
                src={RomanImage}
                alt="Roman"
                fill
                className="object-contain object-bottom"
              />
            </div>
            <div className={!hasResults ? 'text-center' : ''}>
              <h1 className={`font-bold text-gray-900 ${hasResults ? 'text-xl' : 'text-3xl'}`}>
                Roman - Keyword Alchemist
              </h1>
              {!hasResults && (
                <p className="text-gray-500 mt-2">Stratégie SEO & Idées de vidéos basées sur les mots-clés</p>
              )}
            </div>
          </div>

          {hasResults && (
            <button
              onClick={handleNewGeneration}
              className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Nouvelle stratégie
            </button>
          )}
        </div>

        {/* Credits info */}
        {!hasResults && (
          <div className="flex flex-col items-center gap-2 text-sm mt-4">
            <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              {CREDITS_COST} crédits par génération
            </span>
            <span className="text-gray-500">
              Solde: <span className="font-semibold text-gray-900">{isHydrated ? credits : '--'} crédits</span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* Form Section */}
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
                <div className="flex items-center gap-2 mb-6 text-teal-600 font-semibold">
                  <Target className="w-5 h-5" />
                  <h2>Définir votre cible</h2>
                </div>

                <div className="space-y-4">
                  {/* Niche */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niche / Thématique
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRequestGenerate()}
                        placeholder="Ex: Crossfit, Python, Cuisine..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        disabled={isGenerating}
                      />
                    </div>
                  </div>

                  {/* Suggested Niches */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Niches populaires :</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_NICHES.map(n => (
                        <button
                          key={n}
                          onClick={() => setNiche(n)}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-teal-100 border border-gray-200 hover:border-teal-300 text-gray-600 hover:text-teal-700 transition-colors"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleRequestGenerate}
                      disabled={isGenerating || !niche.trim()}
                      className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25"
                    >
                      <Sparkles className="w-5 h-5" />
                      Générer la stratégie
                    </button>
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
              <div className="absolute inset-0 bg-teal-600 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-4 bg-teal-600 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute inset-8 bg-teal-500 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Génération de la stratégie...</h3>
            <p className="text-gray-500 text-center max-w-md">
              Roman analyse les mots-clés les plus recherchés et génère des titres optimisés pour votre niche.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-teal-600">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              Niche: {niche}
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
            {/* Header with controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Youtube className="w-6 h-6 text-red-500" />
                  Stratégie virale pour : <span className="text-teal-600 capitalize">{niche}</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {concepts.length} Concepts
                </span>
                <button
                  onClick={copyAllAsJson}
                  className="text-xs text-gray-500 hover:text-teal-600 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-gray-100 rounded"
                >
                  {copiedIndex === -1 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  JSON
                </button>
                <button
                  onClick={() => setShowChart(!showChart)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${showChart ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Graphique
                </button>
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
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="Niche"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 outline-none text-sm"
                      />
                      <button
                        onClick={handleRequestGenerate}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
                      >
                        Relancer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Volume Chart */}
            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-teal-500" />
                      Analyse des volumes de recherche
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                          <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#9ca3af"
                            width={100}
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                          />
                          <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={20}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getViralColor(entry.viral).bar} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Grid - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {concepts.map((concept, idx) => {
                const viralStyle = getViralColor(concept.potentiel_viral);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-lg transition-all group"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                          <Youtube className="w-5 h-5 text-red-500" />
                          {concept.mot_cle_origine.replace(/"/g, '')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Intent: <span className="text-gray-700 italic">{concept.intention_detectee}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${viralStyle.text} ${viralStyle.bg} ${viralStyle.border}`}>
                          VIRAL: {concept.potentiel_viral}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          Vol: {concept.volume_mensuel.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                      {/* Educatif */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors group/card">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                            <BookOpen className="w-3 h-3" /> Éducatif
                          </div>
                          <button
                            onClick={() => copyToClipboard(concept.titres_generes.educatif, idx * 3)}
                            className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                          >
                            {copiedIndex === idx * 3 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">{concept.titres_generes.educatif}</p>
                      </div>

                      {/* Curiosité */}
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors group/card">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3" /> Curiosité
                          </div>
                          <button
                            onClick={() => copyToClipboard(concept.titres_generes.curiosite, idx * 3 + 1)}
                            className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                          >
                            {copiedIndex === idx * 3 + 1 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">{concept.titres_generes.curiosite}</p>
                      </div>

                      {/* Storytelling */}
                      <div className="bg-pink-50 p-3 rounded-lg border border-pink-100 hover:border-pink-300 transition-colors group/card">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-pink-600 text-xs font-bold uppercase tracking-wider">
                            <Feather className="w-3 h-3" /> Storytelling
                          </div>
                          <button
                            onClick={() => copyToClipboard(concept.titres_generes.storytelling, idx * 3 + 2)}
                            className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                          >
                            {copiedIndex === idx * 3 + 2 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">{concept.titres_generes.storytelling}</p>
                      </div>
                    </div>
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
