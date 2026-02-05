import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Rediriger vers une page qui gère l'affiliation côté client
      // On passe l'ID utilisateur pour traiter le parrainage
      const userId = data.user?.id;
      const isNewUser = data.user?.created_at === data.user?.updated_at;
      
      if (isNewUser && userId) {
        // Nouvel utilisateur, rediriger vers le handler d'affiliation
        return NextResponse.redirect(`${origin}/auth/complete?userId=${userId}&next=${next}`);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
