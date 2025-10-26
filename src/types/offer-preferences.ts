// User preferences for Strategic Offer Design generation
// Collected before offer generation to guide AI output

export interface OfferGenerationPreferences {
  // Strategic Priorities (user selects 3-5 from list)
  strategic_priorities: Array<
    | 'maximize_conversion_rate'
    | 'maximize_average_order_value'
    | 'maximize_lifetime_value'
    | 'build_trust_authority'
    | 'create_urgency_scarcity'
    | 'differentiate_from_competitors'
  >;

  // Core Transformation Focus
  primary_transformation: string; // What's THE main outcome buyers want to achieve?

  // Available Proof Assets (what can be referenced in offer)
  proof_assets_available: {
    testimonials: boolean;
    case_studies: boolean;
    before_after: boolean;
    certifications: boolean;
    media_mentions: boolean;
  };

  // Pricing Strategy Approach
  pricing_strategy: 'value-based' | 'premium-positioning' | 'market-competitive';

  // Comfortable Price Range (guides tier pricing)
  comfortable_price_range: {
    min: number; // Minimum price willing to charge
    max: number; // Maximum premium tier price
  };

  // Unique Intellectual Property & Assets
  proprietary_frameworks: string; // e.g., "Time Mastery System™", "3-Phase Breakthrough Method"
  unique_tools_resources: string; // e.g., "Custom assessment tool, implementation templates, workbooks"
  exclusive_access: string; // e.g., "Private Slack community, weekly group Q&A calls"

  // Guarantee Risk Tolerance
  guarantee_risk_tolerance: 'conservative' | 'moderate' | 'aggressive';

  // Offer Components to Emphasize (user selects multiple)
  emphasize_components: Array<
    | 'premium_bonuses'
    | 'payment_flexibility'
    | 'fast_action_rewards'
    | 'money_back_guarantee'
    | 'results_guarantee'
    | 'done_with_you_support'
  >;

  // Optional: Copywriting Voice Preferences
  voice_preferences?: {
    tone: 'professional' | 'conversational' | 'inspiring' | 'direct';
    avoid_words: string; // Comma-separated list of words/phrases to avoid
    must_include_concepts: string; // Key themes or concepts to emphasize
  };
}

// Complete context for offer generation combining all data sources
export interface CompleteOfferContext {
  business_context: import('./index').BusinessContext; // Original business data (18 fields)
  research_data: import('./research-stages').CompleteResearchData; // Stages 1-5 outputs
  user_preferences: OfferGenerationPreferences; // Strategic guidance from user
}
