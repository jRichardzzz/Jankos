import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const userId = data.user?.id;
      const isNewUser = data.user?.created_at === data.user?.updated_at;
      
      // Rediriger vers la page de succès qui forcera un reload après délai
      const finalDestination = isNewUser && userId
        ? `/auth/complete?userId=${userId}&next=${next}`
        : next;
      
      return NextResponse.redirect(`${origin}/auth/success?next=${encodeURIComponent(finalDestination)}`);
    }
    
    console.error('Auth callback error:', error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
