import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Déterminer l'origine correcte (jankos.cc)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = forwardedHost 
    ? `${forwardedProto}://${forwardedHost}` 
    : new URL(request.url).origin;

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
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const userId = data.user?.id;
      const isNewUser = data.user?.created_at === data.user?.updated_at;
      
      if (isNewUser && userId) {
        return NextResponse.redirect(`${origin}/auth/complete?userId=${userId}&next=${next}`);
      }
      
      // Redirection directe vers le dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('Auth callback error:', error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
