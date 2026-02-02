'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/context/CreditsContext';
import { useProjects } from '@/context/ProjectsContext';
import { User, Zap, FolderOpen, TrendingUp } from 'lucide-react';

export default function ProfilPage() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const { projects } = useProjects();

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalImages = projects.reduce((acc, p) => acc + p.images.length, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500">Aperçu de votre activité sur Jankos.cc</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative flex items-center gap-6">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-xl">
              {user?.user_metadata?.full_name?.[0] || user?.user_metadata?.name?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
          )}
          
          <div>
            <h2 className="text-3xl font-bold mb-1">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Utilisateur'}
            </h2>
            <p className="text-white/80">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur">
                Créateur YouTube
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{credits}</p>
              <p className="text-sm text-gray-500">Crédits disponibles</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
              <p className="text-sm text-gray-500">Projets réalisés</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalImages}</p>
              <p className="text-sm text-gray-500">Miniatures générées</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-500" />
          Actions rapides
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/dashboard/alice"
            className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="font-medium text-gray-900">Créer une miniature</p>
              <p className="text-sm text-gray-500">Avec Alice</p>
            </div>
          </a>
          
          <a
            href="/dashboard/realisations"
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Mes réalisations</p>
              <p className="text-sm text-gray-500">Voir tout</p>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
