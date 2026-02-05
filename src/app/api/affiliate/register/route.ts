import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client Supabase admin - initialisation lazy
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables are not set');
    }
    supabaseAdminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseAdminInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, affiliateCode } = await req.json();

    if (!userId || !affiliateCode) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Vérifier que le code d'affiliation existe
    const { data: affiliate, error: affiliateError } = await getSupabaseAdmin()
      .from('affiliate_codes')
      .select('user_id, code')
      .eq('code', affiliateCode.toUpperCase())
      .single();

    if (affiliateError || !affiliate) {
      return NextResponse.json({ error: 'Invalid affiliate code' }, { status: 400 });
    }

    // Vérifier que l'utilisateur ne se parraine pas lui-même
    if (affiliate.user_id === userId) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 });
    }

    // Vérifier que l'utilisateur n'est pas déjà parrainé
    const { data: existingReferral } = await getSupabaseAdmin()
      .from('referrals')
      .select('id')
      .eq('referred_id', userId)
      .single();

    if (existingReferral) {
      return NextResponse.json({ error: 'Already referred' }, { status: 400 });
    }

    // Créer le parrainage
    const { error: referralError } = await getSupabaseAdmin()
      .from('referrals')
      .insert({
        referrer_id: affiliate.user_id,
        referred_id: userId,
        affiliate_code: affiliate.code,
        status: 'active',
      });

    if (referralError) {
      console.error('Error creating referral:', referralError);
      return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
    }

    // Incrémenter le compteur de filleuls
    const { data: currentCode } = await getSupabaseAdmin()
      .from('affiliate_codes')
      .select('total_referrals')
      .eq('code', affiliate.code)
      .single();

    await getSupabaseAdmin()
      .from('affiliate_codes')
      .update({
        total_referrals: (currentCode?.total_referrals || 0) + 1,
      })
      .eq('code', affiliate.code);

    console.log(`New referral: ${userId} referred by ${affiliate.user_id}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Affiliate register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
