"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "#agents", label: "Youtube Agent IA" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Client Supabase mémorisé pour éviter les recréations
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Récupérer les crédits si connecté
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();
          if (profile) {
            setCredits(profile.credits);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setCredits(profile.credits);
        }
      } else {
        setCredits(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2 
        }}
        className={`
          fixed top-0 left-0 right-0 z-50
          px-4 sm:px-6
          transition-all duration-500
          ${isScrolled ? "pt-3" : "pt-5"}
        `}
      >
        <nav
          className={`
            relative
            flex items-center justify-between
            w-full max-w-6xl mx-auto
            transition-all duration-500
            ${isScrolled ? "scale-[0.98]" : "scale-100"}
          `}
        >
          {/* Logo Jankos.cc - Gauche */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              {/* Icône logo avec J luxueux - Plus gros sur mobile */}
              <div className="relative w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/50 group-hover:border-amber-500/50 transition-all duration-300 overflow-hidden">
                {/* Lettre J luxueuse en SVG avec dégradé */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 z-10" fill="none">
                  <defs>
                    <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M7 5H15M15 5V15C15 17.7614 12.7614 20 10 20V20C8.34315 20 7 18.6569 7 17V16" 
                    stroke="url(#navLogoGradient)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                
                {/* Lueur subtile */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/5 opacity-50" />
              </div>
              
              {/* Texte avec dégradé - Visible sur mobile aussi */}
              <div className="flex items-baseline gap-0">
                <span className="text-lg sm:text-[22px] font-extrabold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                  JANKOS
                </span>
                <span className="text-lg sm:text-[22px] font-extrabold bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  .cc
                </span>
              </div>
            </Link>
          </div>

          {/* Menu centré - Desktop uniquement */}
          <div
            className="
              hidden md:flex
              absolute left-1/2 -translate-x-1/2
              items-center gap-1
              px-4 py-2
              rounded-full
              border border-white/10
              bg-black/70
              backdrop-blur-2xl
              shadow-lg shadow-black/30
            "
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="
                    px-4 py-2
                    text-sm font-medium
                    text-gray-400
                    hover:text-white
                    transition-colors duration-300
                    rounded-full
                    hover:bg-white/5
                  "
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Espace vide pour centrer le menu sur desktop */}
          <div className="hidden md:block w-10" />

          {/* Boutons auth - Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="
              hidden md:flex
              items-center gap-1
              px-2 py-2
              rounded-full
              border border-white/10
              bg-black/70
              backdrop-blur-2xl
              shadow-lg shadow-black/30
            "
          >
            {!loading && user ? (
              // Utilisateur connecté
              <div className="flex items-center gap-2">
                {/* Crédits */}
                <Link
                  href="/dashboard/credits"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-amber-400">{credits ?? '--'}</span>
                </Link>
                
                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className="
                    flex items-center gap-2
                    px-3 py-1.5
                    text-sm font-medium
                    text-white
                    rounded-full
                    bg-gradient-to-r from-amber-500 to-orange-500
                    hover:from-amber-600 hover:to-orange-600
                    transition-all duration-300
                  "
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.email?.[0].toUpperCase() || 'U'
                    )}
                  </div>
                  Dashboard
                </Link>
              </div>
            ) : (
              // Non connecté
              <>
                <Link
                  href="/login"
                  className="
                    px-3 py-1.5
                    text-sm font-medium
                    text-gray-400
                    hover:text-white
                    transition-colors duration-300
                    rounded-full
                    hover:bg-white/5
                  "
                >
                  Connexion
                </Link>

                <Link
                  href="/signup"
                  className="
                    relative group
                    px-3 py-1.5
                    text-sm font-semibold
                    text-white
                    rounded-full
                    overflow-hidden
                    transition-all duration-300
                  "
                >
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500
                      bg-[length:200%_100%]
                      group-hover:bg-[position:100%_0]
                      transition-all duration-500
                    "
                  />
                  <div
                    className="
                      absolute inset-0
                      rounded-full
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                    style={{
                      boxShadow: "0 0 20px 2px rgba(139, 92, 246, 0.4)",
                    }}
                  />
                  <span className="relative z-10">Inscription</span>
                </Link>
              </>
            )}
          </motion.div>

          {/* Menu burger - Mobile uniquement (à droite) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="
              md:hidden
              flex items-center justify-center
              w-11 h-11
              rounded-full
              border border-white/10
              bg-black/70
              backdrop-blur-2xl
              shadow-lg shadow-black/30
            "
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Menu mobile - Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="
                absolute top-0 left-0 bottom-0
                w-72
                bg-neutral-900
                border-r border-white/10
                p-6 pt-20
              "
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      px-4 py-3
                      text-lg font-medium
                      text-gray-300
                      hover:text-white
                      hover:bg-white/5
                      rounded-xl
                      transition-colors
                    "
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-white/10 my-4" />
                
                {!loading && user ? (
                  <>
                    {/* Crédits - Mobile */}
                    <Link
                      href="/dashboard/credits"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        flex items-center justify-between
                        px-4 py-3
                        bg-amber-500/10 border border-amber-500/30
                        rounded-xl
                      "
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Crédits</span>
                      </div>
                      <span className="text-lg font-bold text-amber-400">{credits ?? '--'}</span>
                    </Link>
                    
                    {/* Dashboard - Mobile */}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        flex items-center gap-3
                        px-4 py-3
                        text-lg font-semibold
                        text-white
                        bg-gradient-to-r from-amber-500 to-orange-500
                        rounded-xl
                      "
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden">
                        {user.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.email?.[0].toUpperCase() || 'U'
                        )}
                      </div>
                      Mon Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        px-4 py-3
                        text-lg font-medium
                        text-gray-300
                        hover:text-white
                        hover:bg-white/5
                        rounded-xl
                        transition-colors
                      "
                    >
                      Connexion
                    </Link>
                    
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="
                        px-4 py-3
                        text-lg font-semibold
                        text-white
                        bg-gradient-to-r from-amber-500 to-orange-500
                        rounded-xl
                        text-center
                      "
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
