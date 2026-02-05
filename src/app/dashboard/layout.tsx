"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditsProvider, useCredits } from "@/context/CreditsContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

const sidebarLinks = [
  { href: "/dashboard", label: "Accueil", icon: "home" },
  { href: "/dashboard/realisations", label: "Réalisations", icon: "folder" },
  { href: "/dashboard/historique", label: "Historique", icon: "history" },
];

const accountLinks = [
  { href: "/dashboard/profil", label: "Profil", icon: "user" },
  { href: "/dashboard/affiliation", label: "Affiliation", icon: "gift" },
  { href: "/dashboard/parametres", label: "Paramètres", icon: "settings" },
];

// Mobile bottom nav links (simplified)
const mobileNavLinks = [
  { href: "/dashboard", label: "Accueil", icon: "home" },
  { href: "/dashboard/realisations", label: "Projets", icon: "folder" },
  { href: "/dashboard/credits", label: "Crédits", icon: "credits" },
  { href: "/dashboard/affiliation", label: "Affi", icon: "gift" },
  { href: "/dashboard/profil", label: "Profil", icon: "user" },
];

function SidebarIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    folder: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    history: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    globe: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    gift: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    credits: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    menu: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    close: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };
  return <>{icons[icon]}</>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { credits, isHydrated } = useCredits();
  const { user, signOut, isLoading } = useAuth();
  const [affiliateEarnings, setAffiliateEarnings] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  // Fetch affiliate earnings
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
      } else {
        setAffiliateEarnings(0);
      }
    };

    fetchAffiliateEarnings();
  }, [user, supabase]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    if (user.user_metadata?.full_name || user.user_metadata?.name) {
      const names = name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name[0]?.toUpperCase() || '?';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 flex-col items-center py-6 z-40"
      >
        {/* Logo - Lien vers l'accueil */}
        <Link href="/">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 rounded-xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center mb-8 cursor-pointer shadow-lg shadow-black/50 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
            title="Retour à l'accueil"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 z-10" fill="none">
              <defs>
                <linearGradient id="dashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <path 
                d="M7 5H15M15 5V15C15 17.7614 12.7614 20 10 20V20C8.34315 20 7 18.6569 7 17V16" 
                stroke="url(#dashLogoGrad)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/5 opacity-50" />
          </motion.div>
        </Link>

        {/* Navigation principale */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Menu</span>
          {sidebarLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${isActive 
                      ? "bg-amber-100 text-amber-600 shadow-md" 
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }
                  `}
                  title={link.label}
                >
                  <SidebarIcon icon={link.icon} />
                </Link>
              </motion.div>
            );
          })}

          <div className="w-8 h-px bg-gray-200 my-4" />

          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Compte</span>
          {accountLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${isActive 
                      ? "bg-amber-100 text-amber-600 shadow-md" 
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    }
                  `}
                  title={link.label}
                >
                  <SidebarIcon icon={link.icon} />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bouton retour accueil */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 mb-2"
            title="Retour au site"
          >
            <SidebarIcon icon="globe" />
          </motion.div>
        </Link>

        {/* Déconnexion */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={signOut}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          title="Déconnexion"
        >
          <SidebarIcon icon="logout" />
        </motion.button>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                        <path 
                          d="M7 5H15M15 5V15C15 17.7614 12.7614 20 10 20V20C8.34315 20 7 18.6569 7 17V16" 
                          stroke="#f59e0b" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-lg">Jankos</span>
                  </Link>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900"
                  >
                    <SidebarIcon icon="close" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                      <img 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {getUserInitials()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Link href="/dashboard/credits" onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <p className="text-xs text-amber-600 font-medium">Crédits</p>
                      <p className="text-2xl font-bold text-amber-600">{isHydrated ? credits : '--'}</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/affiliation" onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <p className="text-xs text-green-600 font-medium">Gains Affi</p>
                      <p className="text-2xl font-bold text-green-600">
                        {affiliateEarnings !== null ? `${affiliateEarnings.toFixed(0)}€` : '--'}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
                  {sidebarLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-amber-100 text-amber-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <SidebarIcon icon={link.icon} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="h-px bg-gray-200 my-4" />
                  
                  <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-2">Compte</p>
                  {accountLinks.map(link => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-amber-100 text-amber-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <SidebarIcon icon={link.icon} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom actions */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <Link 
                    href="/"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <SidebarIcon icon="globe" />
                    <span className="font-medium">Retour au site</span>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <SidebarIcon icon="logout" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 md:ml-20 pb-20 md:pb-0">
        {/* Header - Desktop */}
        <header className="hidden md:block sticky top-0 z-30 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-end px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Affiliate Earnings */}
              <Link href="/dashboard/affiliation">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Gains affiliation</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">
                      {affiliateEarnings !== null ? `${affiliateEarnings.toFixed(2)}€` : '--'}
                    </span>
                  </div>
                </motion.div>
              </Link>

              {/* Credits */}
              <Link href="/dashboard/credits">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-amber-200 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Crédits</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{isHydrated ? credits : '--'}</span>
                  </div>
                  <div className="ml-2 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </motion.div>
              </Link>

              {/* User avatar */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow duration-300"
                title={user?.email || 'Utilisateur'}
              >
                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <img 
                    src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {getUserInitials()}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </header>

        {/* Header - Mobile */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Menu button only */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600"
            >
              <SidebarIcon icon="menu" />
            </button>

            {/* Credits & Avatar */}
            <div className="flex items-center gap-2">
              <Link href="/dashboard/credits">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-xl">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{isHydrated ? credits : '--'}</span>
                </div>
              </Link>

              <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <img 
                    src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {mobileNavLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive 
                    ? 'text-amber-600' 
                    : 'text-gray-400'
                }`}
              >
                <SidebarIcon icon={link.icon} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreditsProvider>
      <ProjectsProvider>
        <HistoryProvider>
          <DashboardContent>{children}</DashboardContent>
        </HistoryProvider>
      </ProjectsProvider>
    </CreditsProvider>
  );
}
