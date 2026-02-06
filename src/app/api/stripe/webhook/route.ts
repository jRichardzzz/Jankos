import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Client Supabase avec service role pour les webhooks - initialisation lazy
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
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;
        const credits = parseInt(session.metadata?.credits || '0', 10);

        if (!userId) {
          console.error('No userId in metadata');
          break;
        }

        if (type === 'pack') {
          // Ajouter les crédits pour un achat unique
          const { data: profile, error: fetchError } = await getSupabaseAdmin()
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (fetchError) {
            console.error('Error fetching profile:', fetchError);
            break;
          }

          const newCredits = (profile?.credits || 0) + credits;

          const { error: updateError } = await getSupabaseAdmin()
            .from('profiles')
            .update({ 
              credits: newCredits,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating credits:', updateError);
          } else {
            console.log(`Added ${credits} credits to user ${userId}. New total: ${newCredits}`);
          }

          // Enregistrer la transaction
          const { data: transaction } = await getSupabaseAdmin().from('transactions').insert({
            user_id: userId,
            type: 'purchase',
            amount: credits,
            description: `Achat de ${credits} crédits`,
            stripe_session_id: session.id,
          }).select().single();

          // Vérifier si l'utilisateur a été parrainé pour les commissions
          const { data: referral } = await getSupabaseAdmin()
            .from('referrals')
            .select('referrer_id, affiliate_code')
            .eq('referred_id', userId)
            .eq('status', 'active')
            .single();

          if (referral) {
            // Calculer la commission (30%)
            const amountPaid = session.amount_total ? session.amount_total / 100 : 0; // en euros
            const commissionRate = 0.30;
            const commissionAmount = amountPaid * commissionRate;

            // Enregistrer la commission
            await getSupabaseAdmin().from('affiliate_earnings').insert({
              affiliate_id: referral.referrer_id,
              referred_id: userId,
              transaction_id: transaction?.id,
              amount: commissionAmount,
              original_amount: amountPaid,
              status: 'pending',
            });

            // Mettre à jour les stats de l'affilié
            await getSupabaseAdmin()
              .from('affiliate_codes')
              .update({
                total_earnings: getSupabaseAdmin().rpc('increment_earnings', { 
                  code_param: referral.affiliate_code, 
                  amount_param: commissionAmount 
                })
              })
              .eq('code', referral.affiliate_code);

            // Fallback si RPC n'existe pas: incrémenter manuellement
            const { data: affiliateCode } = await getSupabaseAdmin()
              .from('affiliate_codes')
              .select('total_earnings')
              .eq('code', referral.affiliate_code)
              .single();

            if (affiliateCode) {
              await getSupabaseAdmin()
                .from('affiliate_codes')
                .update({
                  total_earnings: (affiliateCode.total_earnings || 0) + commissionAmount
                })
                .eq('code', referral.affiliate_code);
            }

            console.log(`Commission of ${commissionAmount}€ credited to affiliate ${referral.referrer_id}`);
          }

        } else if (type === 'subscription') {
          const planId = session.metadata?.planId || '';
          
          // Mettre à jour le profil avec l'abonnement
          const { error: updateError } = await getSupabaseAdmin()
            .from('profiles')
            .update({ 
              subscription_status: 'active',
              subscription_credits: credits,
              subscription_plan: planId,
              stripe_customer_id: session.customer as string,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating subscription:', updateError);
          }

          // Ajouter les premiers crédits de l'abonnement
          const { data: profile } = await getSupabaseAdmin()
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          const newCredits = (profile?.credits || 0) + credits;

          await getSupabaseAdmin()
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', userId);

          console.log(`Subscription activated for user ${userId} with ${credits} credits/month`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Renouvellement d'abonnement
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.billing_reason === 'subscription_cycle') {
          const customerId = invoice.customer as string;
          
          // Trouver l'utilisateur par customer_id
          const { data: profile } = await getSupabaseAdmin()
            .from('profiles')
            .select('id, credits, subscription_credits')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile && profile.subscription_credits) {
            const newCredits = (profile.credits || 0) + profile.subscription_credits;

            await getSupabaseAdmin()
              .from('profiles')
              .update({ 
                credits: newCredits,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id);

            console.log(`Renewed ${profile.subscription_credits} credits for user ${profile.id}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Annulation d'abonnement
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await getSupabaseAdmin()
          .from('profiles')
          .update({ 
            subscription_status: 'canceled',
            subscription_credits: 0,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId);

        console.log(`Subscription canceled for customer ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Note: Dans l'App Router de Next.js, le body n'est pas automatiquement parsé,
// donc pas besoin de configuration supplémentaire pour les webhooks Stripe.
