'use client';

import { useEffect, useState } from 'react';

export default function AuthRedirectPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Récupérer le paramètre next depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || '/dashboard';

    // Attendre un court instant pour que les cookies se propagent
    const timer = setTimeout(() => {
      window.location.replace(next);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Connexion en cours...</p>
      </div>
    </div>
  );
}
