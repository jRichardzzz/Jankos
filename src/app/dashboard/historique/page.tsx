"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useHistory } from "@/context/HistoryContext";
import { Clock, Trash2, Sparkles, AlertCircle } from "lucide-react";

// Import des images des agents
import AliceImage from "@/Alice-removebg.png";
import DouglasImage from "@/Douglas-removebg.png";
import RomanImage from "@/Roman-removebg.png";

import { StaticImageData } from "next/image";

const agentImages: Record<string, StaticImageData> = {
  'Alice': AliceImage,
  'Douglas': DouglasImage,
  'Roman': RomanImage,
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "À l\u0027instant";
  } else if (minutes < 60) {
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (hours < 24) {
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (days === 1) {
    return `Hier à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (days < 7) {
    return `Il y a ${days} jours`;
  } else {
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
}

export default function HistoriquePage() {
  const { history, clearHistory } = useHistory();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
          <p className="text-gray-500 mt-1">Toutes vos activités et transactions</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Effacer l&apos;historique
          </button>
        )}
      </motion.div>

      {/* Historique list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        {history.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {history.map((item, index) => {
              const isError = item.action.toLowerCase().includes('échoué');
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Agent avatar ou icône */}
                  <div className="flex-shrink-0">
                    {item.agent && agentImages[item.agent] ? (
                      <div className="relative w-10 h-12 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={agentImages[item.agent]}
                          alt={item.agent}
                          fill
                          className="object-contain object-bottom"
                        />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isError 
                          ? 'bg-red-100' 
                          : 'bg-gradient-to-br from-amber-400 to-orange-500'
                      }`}>
                        {isError ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isError ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.action}
                      </span>
                      {item.agent && (
                        <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                          {item.agent}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>

                  {/* Credits */}
                  <div className="flex-shrink-0 text-right">
                    <span className={`font-semibold ${
                      item.credits > 0 
                        ? "text-emerald-600" 
                        : isError 
                          ? "text-red-500" 
                          : "text-gray-600"
                    }`}>
                      {item.credits > 0 ? "+" : ""}{item.credits} crédit{Math.abs(item.credits) > 1 ? "s" : ""}
                    </span>
                    <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                  </div>

                  {/* Link to project */}
                  {item.projectId && !isError && (
                    <Link
                      href="/dashboard/realisations"
                      className="flex-shrink-0 p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Voir le projet"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun historique</h3>
            <p className="text-gray-500 mb-6">Votre activité apparaîtra ici après vos premières générations</p>
            <Link
              href="/dashboard/alice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              Créer ma première miniature
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Stats summary */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {history.filter(h => h.action.includes('créée')).length}
            </p>
            <p className="text-sm text-gray-500">Miniatures créées</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {Math.abs(history.reduce((sum, h) => sum + (h.credits < 0 ? h.credits : 0), 0))}
            </p>
            <p className="text-sm text-gray-500">Crédits utilisés</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {history.length}
            </p>
            <p className="text-sm text-gray-500">Actions totales</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
