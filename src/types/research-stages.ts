// Research Stage Output Interfaces for Multi-Stage Report Generation

export interface Stage1MarketAnalysis {
  market_growth_rate: string;
  market_size_2024: string;
  market_size_2025_projected: string;
  bleeding_neck_problem: string;
  purchasing_power: {
    average_household_income: string;
    discretionary_spending: string;
  };
  targetability: {
    platform_fit: string; // Facebook/Instagram/LinkedIn
    targeting_interests: string[];
    targeting_behaviors: string[];
    difficulty_score: number; // 1-10, 10 = easiest
  };
  power_4_percent: {
    demographics: string;
    psychographics: string;
    buying_frequency: string;
    lifetime_value: string;
    differentiation: string;
  };
  top_20_percent: {
    demographics: string;
    psychographics: string;
    characteristics: string;
  };
}

export interface BuyerLanguagePhrase {
  exact_phrase: string;
  meaning_context: string;
  emotional_tone: 'fear' | 'hope' | 'frustration' | 'pride' | 'shame' | 'desire';
  usage_frequency: 'high' | 'medium' | 'low';
  marketing_application: string;
}

export interface Fear {
  name: string;
  intensity: number; // 1-10
  quote: string;
  root_emotion: string;
  purchase_blocker: string;
  how_offer_addresses: string;
  is_surface_fear: boolean;
}

export interface Desire {
  name: string;
  intensity: number; // 1-10
  aspirational_quote: string;
  deeper_meaning: string; // freedom/validation/balance/impact/security
  timeline_expectation: string;
  willingness_to_pay: string;
  how_business_delivers: string;
}

export interface PainPoint {
  frustration: string;
  quote: string;
  root_emotion: 'fear' | 'guilt' | 'overwhelm' | 'shame' | 'anger';
  what_theyve_tried: string;
  why_it_didnt_work: string;
  how_unique_mechanism_solves: string;
}

export interface Barrier {
  barrier: string;
  type: 'internal' | 'external';
  objection_handling_script: string;
}

export interface Stage2BuyerPsychology {
  buyer_language: BuyerLanguagePhrase[]; // 10-15 phrases
  top_fears: Fear[]; // 3-5 fears
  top_desires: Desire[]; // 3-5 desires
  top_pain_points: PainPoint[]; // 5 pain points
  barriers: Barrier[]; // Internal + External
  price_justification: string;
}

export interface Competitor {
  name: string;
  price_point: string;
  positioning: string;
  strengths: string;
  weaknesses: string;
  target_audience: string;
}

export interface Stage3CompetitiveAnalysis {
  competitors: Competitor[];
  positioning_gaps: string[];
  differentiation_opportunities: string[];
  unique_value_proposition: string;
  competitive_pricing_analysis: string;
  why_business_wins: string;
}

export interface OnlineCommunity {
  platform: string;
  name: string;
  url?: string;
  member_count: string;
  engagement_level: 'high' | 'medium' | 'low';
  trust_factor: string;
  tone_and_norms: string;
  top_topics: string[];
  top_post_examples: string[]; // 3-5 examples
  advertising_opportunity: string;
}

export interface Stage4AvatarCreation {
  avatar_name: string;
  demographics: {
    age_range: string;
    household_income: string;
    geographic_location: string;
    profession_industry: string;
    family_status: string;
    education: string;
  };
  psychographics: {
    core_values: string[];
    beliefs_about_niche: string;
    daily_lifestyle: string;
    media_consumption: string[];
  };
  day_in_life: {
    morning_routine: string;
    workday_experience: string;
    evening_routine: string;
    weekend_routine: string;
    pain_point_moments: string[];
  };
  buying_triggers: {
    optimal_contact_days: string[];
    optimal_contact_times: string[];
    decision_making_windows: string;
    platform_preferences: string[];
    content_format_preferences: string[];
  };
  online_communities: OnlineCommunity[];
  top_3_hopes: string[];
  top_3_fears: string[];
  top_3_barriers: Array<{ barrier: string; solution: string }>;
  recommended_tone: string;
  price_sensitivity: 'high' | 'medium' | 'low';
  price_sensitivity_justification: string;
}

export interface PricingTier {
  tier_number: number;
  tier_name: string;
  price: string;
  deliverables: string[];
  best_for: string;
  is_recommended: boolean;
}

export interface PaymentPlan {
  name: string;
  structure: string;
  total_cost: string;
}

export interface MarketingMessage {
  type: 'pain-based' | 'desire-based' | 'curiosity';
  headline: string;
  usage: string;
}

export interface Bonus {
  name: string;
  value: string;
  addresses_desire: string;
  how_it_speeds_results: string;
}

export interface Stage5OfferDesign {
  core_offer: {
    offer_name: string;
    target_outcome: string;
    pain_points_solved: string[];
    desires_delivered: string[];
    unique_positioning: string;
  };
  pricing_tiers: PricingTier[]; // 3 tiers
  payment_plans: PaymentPlan[];
  marketing_messages: MarketingMessage[]; // 15 total (5 pain, 5 desire, 5 curiosity)
  guarantee: {
    guarantee_text: string;
    why_it_works: string;
  };
  bonuses: Bonus[]; // 3-5 bonuses
  first_campaign: {
    platform: string;
    message: string;
    offer_configuration: string;
    launch_timeline: string;
  };
}

export interface WeeklyAction {
  week: number;
  title: string;
  actions: string[];
}

export interface Stage6ReportSynthesis {
  // This is the final markdown report
  // Input: All previous stages
  // Output: Formatted Market Intelligence Report (string)
  report_markdown: string;
}

// Combined interface for complete research data
export interface CompleteResearchData {
  stage1_market_analysis: Stage1MarketAnalysis;
  stage2_buyer_psychology: Stage2BuyerPsychology;
  stage3_competitive_analysis: Stage3CompetitiveAnalysis;
  stage4_avatar_creation: Stage4AvatarCreation;
  stage5_offer_design: Stage5OfferDesign;
}
