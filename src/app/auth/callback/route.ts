import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // Assurer la compatibilité mobile
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                path: '/',
              });
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      // Rediriger vers une page qui gère l'affiliation côté client
      // On passe l'ID utilisateur pour traiter le parrainage
      const userId = data.user?.id;
      const isNewUser = data.user?.created_at === data.user?.updated_at;
      
      // Créer la réponse de redirection
      const redirectUrl = isNewUser && userId
        ? `${origin}/auth/complete?userId=${userId}&next=${next}`
        : `${origin}${next}`;
      
      const response = NextResponse.redirect(redirectUrl);
      
      // Copier les cookies de session dans la réponse
      cookieStore.getAll().forEach(cookie => {
        if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
          response.cookies.set(cookie.name, cookie.value, {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
          });
        }
      });
      
      return response;
    }
    
    console.error('Auth callback error:', error);
  }

  // Redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
