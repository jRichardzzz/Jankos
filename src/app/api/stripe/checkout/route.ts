import { NextRequest, NextResponse } from 'next/server';
import { getStripe, CREDIT_PACKS, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, packId, planId, isAnnual } = body;

    const origin = req.headers.get('origin') || 'https://jankos.cc';

    if (type === 'pack') {
      // Achat unique de crédits
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (!pack) {
        return NextResponse.json({ error: 'Pack invalide' }, { status: 400 });
      }

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          type: 'pack',
          packId: pack.id,
          credits: pack.credits.toString(),
        },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: pack.name,
                description: `${pack.credits} crédits pour Jankos.cc`,
              },
              unit_amount: pack.price,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/dashboard/credits?success=true&credits=${pack.credits}`,
        cancel_url: `${origin}/dashboard/credits?canceled=true`,
      });

      return NextResponse.json({ url: session.url });

    } else if (type === 'subscription') {
      // Abonnement
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
      }

      // Pour annuel: on facture le prix annuel total une fois par an
      // Pour mensuel: on facture le prix mensuel chaque mois
      const interval = isAnnual ? 'year' : 'month';
      const unitAmount = isAnnual ? plan.priceYearly : plan.priceMonthly;

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          type: 'subscription',
          planId: plan.id,
          credits: plan.credits.toString(),
          interval,
        },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: plan.name,
                description: `Abonnement ${plan.credits} crédits/mois pour Jankos.cc (${isAnnual ? 'annuel' : 'mensuel'})`,
              },
              unit_amount: unitAmount,
              recurring: {
                interval,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/dashboard/credits?success=true&subscription=true`,
        cancel_url: `${origin}/dashboard/credits?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Type invalide' }, { status: 400 });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}
