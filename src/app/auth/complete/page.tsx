'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function AuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const next = searchParams.get('next') || '/dashboard';

  useEffect(() => {
    async function completeRegistration() {
      // Vérifier s'il y a un code d'affiliation stocké
      const affiliateCode = localStorage.getItem('affiliate_code');

      if (affiliateCode && userId) {
        try {
          await fetch('/api/affiliate/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              affiliateCode,
            }),
          });
          // Nettoyer le localStorage
          localStorage.removeItem('affiliate_code');
        } catch (e) {
          console.error('Failed to register affiliate:', e);
        }
      }

      // Rediriger vers la destination finale
      router.push(next);
    }

    completeRegistration();
  }, [userId, next, router]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
        <p className="text-neutral-400">Finalisation de votre inscription...</p>
      </div>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <AuthCompleteContent />
    </Suspense>
  );
}
