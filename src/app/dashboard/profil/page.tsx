'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/context/CreditsContext';
import { useProjects } from '@/context/ProjectsContext';
import { createClient } from '@/lib/supabase/client';
import { User, Zap, FolderOpen, TrendingUp, Gift } from 'lucide-react';

export default function ProfilPage() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const { projects } = useProjects();
  const [affiliateEarnings, setAffiliateEarnings] = useState<number>(0);
  const supabase = createClient();

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalImages = projects.reduce((acc, p) => acc + p.images.length, 0);

  useEffect(() => {
    const fetchAffiliateEarnings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('affiliate_codes')
        .select('total_earnings')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setAffiliateEarnings(data.total_earnings || 0);
      }
    };
    fetchAffiliateEarnings();
  }, [user, supabase]);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/credits">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm hover:border-amber-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{credits}</p>
                <p className="text-xs md:text-sm text-gray-500">Crédits</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/affiliation">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm hover:border-green-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{affiliateEarnings.toFixed(0)}€</p>
                <p className="text-xs md:text-sm text-gray-500">Gains Affi</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{completedProjects}</p>
              <p className="text-xs md:text-sm text-gray-500">Projets</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalImages}</p>
              <p className="text-xs md:text-sm text-gray-500">Miniatures</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Agents IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm"
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
          Mes Agents IA
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/dashboard/alice"
            className="flex items-center gap-3 p-3 md:p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm">A</div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Alice</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Miniatures YouTube</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/douglas"
            className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">D</div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Douglas</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Idées virales</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/roman"
            className="flex items-center gap-3 p-3 md:p-4 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-sm">R</div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Roman</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Stratégie SEO</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
