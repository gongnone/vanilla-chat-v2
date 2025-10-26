// TEST FILE - Validation of offer-preferences.ts
// This file should be deleted after validation

import type { OfferGenerationPreferences, CompleteOfferContext } from './offer-preferences';

// Test 1: Create a valid OfferGenerationPreferences object
const testPreferences: OfferGenerationPreferences = {
  strategic_priorities: [
    'maximize_conversion_rate',
    'build_trust_authority',
    'differentiate_from_competitors'
  ],
  primary_transformation: 'Achieve work-life balance without sacrificing career growth',
  proof_assets_available: {
    testimonials: true,
    case_studies: true,
    before_after: false,
    certifications: true,
    media_mentions: false,
  },
  pricing_strategy: 'value-based',
  comfortable_price_range: {
    min: 5000,
    max: 25000,
  },
  proprietary_frameworks: 'Time Mastery System™, 3-Phase Breakthrough Method',
  unique_tools_resources: 'Custom time audit tool, implementation templates, accountability workbook',
  exclusive_access: 'Private Slack community, bi-weekly group coaching calls',
  guarantee_risk_tolerance: 'moderate',
  emphasize_components: [
    'results_guarantee',
    'premium_bonuses',
    'done_with_you_support'
  ],
  voice_preferences: {
    tone: 'professional',
    avoid_words: 'hack, guru, crushing it',
    must_include_concepts: 'sustainable growth, evidence-based, proven framework',
  },
};

// Test 2: Verify optional voice_preferences works
const testPreferencesNoVoice: OfferGenerationPreferences = {
  strategic_priorities: ['maximize_conversion_rate'],
  primary_transformation: 'Test transformation',
  proof_assets_available: {
    testimonials: false,
    case_studies: false,
    before_after: false,
    certifications: false,
    media_mentions: false,
  },
  pricing_strategy: 'premium-positioning',
  comfortable_price_range: { min: 1000, max: 10000 },
  proprietary_frameworks: 'Test Framework',
  unique_tools_resources: 'Test tools',
  exclusive_access: 'Test access',
  guarantee_risk_tolerance: 'conservative',
  emphasize_components: ['premium_bonuses'],
  // voice_preferences is optional - should compile without it
};

// Test 3: Verify all pricing strategies compile
const strategies: Array<OfferGenerationPreferences['pricing_strategy']> = [
  'value-based',
  'premium-positioning',
  'market-competitive'
];

// Test 4: Verify all guarantee risk levels compile
const riskLevels: Array<OfferGenerationPreferences['guarantee_risk_tolerance']> = [
  'conservative',
  'moderate',
  'aggressive'
];

// Test 5: Verify all tone options compile
const tones: Array<NonNullable<OfferGenerationPreferences['voice_preferences']>['tone']> = [
  'professional',
  'conversational',
  'inspiring',
  'direct'
];

console.log('✅ All type validations passed');
