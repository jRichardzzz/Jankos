import Stripe from 'stripe';

// Stripe côté serveur - initialisation lazy pour éviter les erreurs au build
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Alias pour compatibilité
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// Configuration des produits
export const CREDIT_PACKS = [
  { id: 'pack_30', credits: 30, price: 890, name: '30 crédits' },
  { id: 'pack_100', credits: 100, price: 1990, name: '100 crédits' },
  { id: 'pack_200', credits: 200, price: 3900, name: '200 crédits' },
  { id: 'pack_500', credits: 500, price: 9500, name: '500 crédits' },
  { id: 'pack_1000', credits: 1000, price: 17900, name: '1000 crédits' },
  { id: 'pack_2000', credits: 2000, price: 33000, name: '2000 crédits' },
] as const;

export const SUBSCRIPTION_PLANS = [
  { 
    id: 'sub_500', 
    credits: 500, 
    priceMonthly: 4900, 
    priceYearly: 50400, // 42€/mois * 12
    name: '500 crédits/mois' 
  },
  { 
    id: 'sub_1000', 
    credits: 1000, 
    priceMonthly: 9800, 
    priceYearly: 99600, // 83€/mois * 12
    name: '1000 crédits/mois' 
  },
  { 
    id: 'sub_2000', 
    credits: 2000, 
    priceMonthly: 19600, 
    priceYearly: 200400, // 167€/mois * 12
    name: '2000 crédits/mois' 
  },
  { 
    id: 'sub_5000', 
    credits: 5000, 
    priceMonthly: 49000, 
    priceYearly: 500400, // 417€/mois * 12
    name: '5000 crédits/mois' 
  },
] as const;

export type CreditPackId = typeof CREDIT_PACKS[number]['id'];
export type SubscriptionPlanId = typeof SUBSCRIPTION_PLANS[number]['id'];
