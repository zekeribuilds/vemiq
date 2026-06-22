/**
 * Billing Configuration
 * 
 * This file contains the billing plan configuration for Vemiq.
 * Plans are defined here as configuration rather than database records because:
 * 1. Plans are relatively static and don't change frequently
 * 2. Pricing is business logic that should be version-controlled
 * 3. Easier to A/B test different pricing strategies
 * 4. No need for complex admin UI to manage plans
 * 
 * If dynamic plan management becomes necessary in the future, this can be migrated to a database.
 */

export interface BillingPlan {
  id: 'free' | 'premium';
  name: string;
  price: number; // in Naira
  currency: 'NGN';
  interval: 'month' | 'year';
  features: string[];
  limits: {
    reportsPerMonth: number;
    aiGenerationsPerMonth: number;
    pdfExports: 'watermarked' | 'clean';
    templates: 'limited' | 'all';
    support: 'standard' | 'priority';
  };
}

export const billingPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'NGN',
    interval: 'month',
    features: [
      '1 report per month',
      'Watermarked PDF',
      'Basic AI generation',
      'Limited templates',
    ],
    limits: {
      reportsPerMonth: 1,
      aiGenerationsPerMonth: 10,
      pdfExports: 'watermarked',
      templates: 'limited',
      support: 'standard',
    },
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 5000,
    currency: 'NGN',
    interval: 'month',
    features: [
      'Unlimited reports',
      'Clean PDF export',
      'Advanced AI generation',
      'All templates',
      'Priority support',
      'Faster generation',
    ],
    limits: {
      reportsPerMonth: -1, // unlimited
      aiGenerationsPerMonth: -1, // unlimited
      pdfExports: 'clean',
      templates: 'all',
      support: 'priority',
    },
  },
];

export function getPlanById(id: string): BillingPlan | undefined {
  return billingPlans.find(plan => plan.id === id);
}

export function getPlanLimits(planId: string) {
  const plan = getPlanById(planId);
  return plan?.limits;
}
