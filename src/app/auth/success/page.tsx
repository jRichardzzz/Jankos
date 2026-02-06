'use client';

import { useEffect } from 'react';

export default function AuthSuccessPage() {
  useEffect(() => {
    // Attendre 1.5 secondes puis forcer le reload vers la destination
    const timer = setTimeout(() => {
      // Récupérer la destination depuis l'URL
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next') || '/dashboard';
      
      // Force un hard reload pour que les cookies soient bien lus
      window.location.replace(next);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-white text-2xl font-bold mb-2">Connexion réussie !</h1>
        <p className="text-gray-400">Redirection en cours...</p>
      </div>
    </div>
  );
}
