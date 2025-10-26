// Type definitions for Strategic Offer Design stages (Stages 7-13)

// Stage 7: Offer Rationale
export interface OfferRationaleOption {
  big_promise: string;
  unique_mechanism_name: string;
  mechanism_explanation: string;
  who_its_for: string;
  why_now: string;
  proof_strategy: string;
  differentiation: string[];
  strategic_angle: string;
}

export interface Stage7OfferRationale {
  option_1: OfferRationaleOption;
  option_2: OfferRationaleOption;
  option_3: OfferRationaleOption;
  recommended_option: 'option_1' | 'option_2' | 'option_3';
  recommendation_rationale: string;
}

// Stage 8: Value Stack
export interface ValueStackComponent {
  component_name: string;
  what_it_is: string;
  what_it_does: string;
  desire_addressed: string;
  delivery_format: string;
  perceived_value: number;
}

export interface Stage8ValueStack {
  core_components: ValueStackComponent[];
  total_perceived_value: number;
  value_stack_summary: string;
}

// Stage 9: Pricing Framework
export interface PriceAnchoringStrategy {
  reference_points: string[];
  framing_technique: string;
}

export interface PaymentStructure {
  primary_option: string;
  alternative_options: string[];
}

export interface PriceSensitivityMitigation {
  top_objection: string;
  response_strategy: string;
}

export interface Stage9PricingFramework {
  recommended_price: number;
  pricing_rationale: string;
  value_to_price_ratio: string;
  price_anchoring_strategy: PriceAnchoringStrategy;
  payment_structure: PaymentStructure;
  price_sensitivity_mitigation: PriceSensitivityMitigation;
  competitive_positioning: string;
}

// Stage 10: Payment Plans
export interface PaymentPlan {
  plan_name: string;
  payment_structure: string;
  total_price: number;
  incentive: string;
  best_for: string;
  conversion_psychology: string;
}

export interface Stage10PaymentPlans {
  payment_plans: PaymentPlan[];
  recommended_default: string;
  recommendation_rationale: string;
}

// Stage 11: Premium Bonuses
export interface PremiumBonus {
  bonus_name: string;
  what_it_is: string;
  what_it_does: string;
  desire_pain_addressed: string;
  delivery_timing: string;
  perceived_value: number;
  why_its_valuable: string;
}

export interface Stage11PremiumBonuses {
  bonuses: PremiumBonus[];
  total_bonus_value: number;
  strategic_bonus_summary: string;
}

// Stage 12: Power Guarantee
export interface GuaranteeOption {
  guarantee_name: string;
  guarantee_terms: string;
  whats_covered: string;
  trigger_conditions: string;
  refund_remedy_terms: string;
  psychological_impact: string;
  risk_level: 'low' | 'moderate' | 'high';
}

export interface Stage12PowerGuarantee {
  guarantee_options: GuaranteeOption[];
  recommended_guarantee: '1' | '2' | '3';
  recommendation_rationale: string;
}

// Stage 13: Scarcity & Upsells
export interface OrderBump {
  bump_name: string;
  what_it_is: string;
  why_add_it: string;
  price: number; // MUST be between 27-47
  perceived_value: number;
  best_for: string;
  conversion_hook: string;
}

export interface Upsell {
  upsell_name: string;
  what_it_is: string;
  why_upgrade: string;
  price: number; // MUST be between 97-997
  perceived_value: number;
  best_for: string;
  conversion_hook: string;
  delivery: string;
}

export interface ScarcityMechanisms {
  enrollment_scarcity: string;
  bonus_scarcity: string;
  price_scarcity?: string;
  social_proof_scarcity: string;
}

export interface Stage13ScarcityUpsells {
  order_bumps: OrderBump[]; // MUST be exactly 3
  upsells: Upsell[]; // MUST be exactly 2
  scarcity_mechanisms: ScarcityMechanisms;
  total_order_bump_revenue_potential: number;
  total_upsell_revenue_potential: number;
  monetization_summary: string;
}

// Complete Offer Data (all 7 stages)
export interface CompleteOfferData {
  stage7_offer_rationale: Stage7OfferRationale;
  stage8_value_stack: Stage8ValueStack;
  stage9_pricing_framework: Stage9PricingFramework;
  stage10_payment_plans: Stage10PaymentPlans;
  stage11_premium_bonuses: Stage11PremiumBonuses;
  stage12_power_guarantee: Stage12PowerGuarantee;
  stage13_scarcity_upsells: Stage13ScarcityUpsells;
}
