"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CreditsProvider, useCredits } from "@/context/CreditsContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";

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
  };
  return <>{icons[icon]}</>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { credits, isHydrated } = useCredits();
  const { user, signOut, isLoading } = useAuth();

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
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-40"
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
            {/* Lettre J luxueuse en SVG avec dégradé */}
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
            
            {/* Lueur subtile */}
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

      {/* Main content */}
      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-end px-8 py-4">
            {/* Right side - Credits & User */}
            <div className="flex items-center gap-4">
              {/* Credits */}
              <Link href="/dashboard/credits">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-amber-200 transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Crédits</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{isHydrated ? credits : '--'}</span>
                  </div>
                  {/* Add button */}
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

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
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
