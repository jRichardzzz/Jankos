"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  credits: number;
  agentName: string;
  agentColor: string; // Tailwind gradient class like "from-pink-500 to-rose-500"
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  credits,
  agentName,
  agentColor,
  confirmText = "Confirmer",
  cancelText = "Annuler"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${agentColor} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{title}</h3>
                      <p className="text-white/80 text-sm">{agentName}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">{description}</p>

                {/* Credit cost highlight */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-700">Coût de cette action</p>
                      <p className="text-2xl font-bold text-amber-900">
                        {credits} crédit{credits > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500">
                    Ne fermez pas cette page pendant la génération. Vos crédits seront débités immédiatement.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r ${agentColor} text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                  >
                    <Zap className="w-4 h-4" />
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
