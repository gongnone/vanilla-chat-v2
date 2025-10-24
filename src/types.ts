// Business Context Types for Market Research Generator

export interface BusinessContext {
  // Step 1: Business Foundation
  business_name: string;
  current_offer_description: string;
  niche: string;
  specialization_keywords: string;
  business_stage: 'startup' | 'growth' | 'scaling';
  revenue_range: '<10k' | '10k-50k' | '50k-100k' | '100k-500k' | '500k+';
  preferred_market_category: 'health' | 'wealth' | 'relationships';

  // Step 2: Target Market Context
  target_market_hypothesis: string;
  target_demographics: string;
  target_psychographics: string;
  current_customers_description?: string;
  biggest_customer_pain_point: string;

  // Step 3: Offer Context
  service_type: 'coaching' | 'consulting' | 'product' | 'hybrid';
  delivery_format: '1:1' | 'group' | 'self-study' | 'hybrid';
  price_point_current: string;
  desired_price_point?: string;
  offer_duration: string;
  unique_mechanism: string;
  competitors_offers?: string;
}
