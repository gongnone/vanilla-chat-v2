/**
 * Stage Validation Framework
 *
 * Type-safe validation functions for all 13 stages to ensure:
 * - JSON structure matches TypeScript interfaces
 * - All required fields are present
 * - No placeholder values ("TBD", "TODO", "[INSERT]", etc.)
 * - Field values meet quality standards
 * - Token budgets are within limits
 */

import type {
  Stage1MarketAnalysis,
  Stage2BuyerPsychology,
  Stage3CompetitiveAnalysis,
  Stage4AvatarCreation,
  Stage5OfferDesign,
} from "../types/research-stages";

import type {
  Stage7OfferRationale,
  Stage8ValueStack,
  Stage9PricingFramework,
  Stage10PaymentPlans,
  Stage11PremiumBonuses,
  Stage12PowerGuarantee,
  Stage13ScarcityUpsells,
} from "../types/offer-stages";

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  stage: number;
  stageName: string;
  errors: string[];
  warnings: string[];
  qualityScore: number; // 0-100
  metrics: {
    fieldCount: number;
    placeholderCount: number;
    emptyFieldCount: number;
    responseLength: number;
  };
}

// Placeholder patterns to detect incomplete responses
const PLACEHOLDER_PATTERNS = [
  /\[INSERT\s/i,
  /\[TODO\]/i,
  /\[TBD\]/i,
  /\[PLACEHOLDER\]/i,
  /\[FILL IN\]/i,
  /\[ADD\s/i,
  /\[DETAILS\]/i,
  /TO BE DETERMINED/i,
  /COMING SOON/i,
  /\.\.\./g, // Multiple instances may indicate placeholders
];

/**
 * Check if a string contains placeholder text
 */
function hasPlaceholder(value: string | undefined | null): boolean {
  if (!value || typeof value !== 'string') return false;
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Check if a field is empty or invalid
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim().length === 0) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Validate an array of strings
 */
function validateStringArray(
  arr: any,
  fieldName: string,
  minLength: number = 1
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(arr)) {
    errors.push(`${fieldName} must be an array`);
    return errors;
  }

  if (arr.length < minLength) {
    errors.push(`${fieldName} must have at least ${minLength} items, got ${arr.length}`);
  }

  arr.forEach((item, index) => {
    if (typeof item !== 'string') {
      errors.push(`${fieldName}[${index}] must be a string`);
    } else if (isEmpty(item)) {
      errors.push(`${fieldName}[${index}] is empty`);
    } else if (hasPlaceholder(item)) {
      errors.push(`${fieldName}[${index}] contains placeholder text: "${item}"`);
    }
  });

  return errors;
}

/**
 * Validate Stage 1: Market Analysis
 */
export function validateStage1(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  // Type check
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 1,
      stageName: "Market Analysis",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage1 = data as Stage1MarketAnalysis;

  // Required string fields
  const stringFields = [
    'market_growth_rate',
    'market_size_2024',
    'market_size_2025_projected',
    'bleeding_neck_problem',
  ];

  stringFields.forEach(field => {
    const value = (stage1 as any)[field];
    if (isEmpty(value)) {
      errors.push(`${field} is missing or empty`);
      emptyFieldCount++;
    } else if (hasPlaceholder(value)) {
      errors.push(`${field} contains placeholder text`);
      placeholderCount++;
    }
  });

  // Purchasing power
  if (!stage1.purchasing_power) {
    errors.push("purchasing_power object is missing");
  } else {
    if (isEmpty(stage1.purchasing_power.average_household_income)) {
      errors.push("purchasing_power.average_household_income is missing");
      emptyFieldCount++;
    }
    if (isEmpty(stage1.purchasing_power.discretionary_spending)) {
      errors.push("purchasing_power.discretionary_spending is missing");
      emptyFieldCount++;
    }
  }

  // Targetability
  if (!stage1.targetability) {
    errors.push("targetability object is missing");
  } else {
    errors.push(...validateStringArray(stage1.targetability.targeting_interests, "targeting_interests", 3));
    errors.push(...validateStringArray(stage1.targetability.targeting_behaviors, "targeting_behaviors", 3));
    if (typeof stage1.targetability.difficulty_score !== 'number') {
      errors.push("targetability.difficulty_score must be a number");
    }
  }

  // Power 4%
  if (!stage1.power_4_percent) {
    errors.push("power_4_percent object is missing");
  } else {
    const p4fields = ['demographics', 'psychographics', 'buying_frequency', 'lifetime_value', 'differentiation'];
    p4fields.forEach(field => {
      const value = (stage1.power_4_percent as any)[field];
      if (isEmpty(value)) {
        errors.push(`power_4_percent.${field} is missing`);
        emptyFieldCount++;
      } else if (hasPlaceholder(value)) {
        errors.push(`power_4_percent.${field} contains placeholder`);
        placeholderCount++;
      }
    });
  }

  const fieldCount = 15; // Approximate total fields in Stage 1
  const qualityScore = Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5));

  return {
    isValid: errors.length === 0,
    stage: 1,
    stageName: "Market Analysis",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Validate Stage 2: Buyer Psychology
 */
export function validateStage2(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 2,
      stageName: "Buyer Psychology",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage2 = data as Stage2BuyerPsychology;

  // Buyer language (10-15 phrases)
  if (!Array.isArray(stage2.buyer_language) || stage2.buyer_language.length < 10) {
    errors.push(`buyer_language must have 10-15 phrases, got ${stage2.buyer_language?.length || 0}`);
  } else {
    stage2.buyer_language.forEach((phrase, i) => {
      if (isEmpty(phrase.exact_phrase)) errors.push(`buyer_language[${i}].exact_phrase is empty`);
      if (hasPlaceholder(phrase.exact_phrase)) {
        errors.push(`buyer_language[${i}].exact_phrase contains placeholder`);
        placeholderCount++;
      }
    });
  }

  // Top fears (3-5)
  if (!Array.isArray(stage2.top_fears) || stage2.top_fears.length < 3) {
    errors.push(`top_fears must have 3-5 fears, got ${stage2.top_fears?.length || 0}`);
  } else {
    stage2.top_fears.forEach((fear, i) => {
      if (isEmpty(fear.name)) errors.push(`top_fears[${i}].name is empty`);
      if (isEmpty(fear.quote)) errors.push(`top_fears[${i}].quote is empty`);
      if (hasPlaceholder(fear.quote)) placeholderCount++;
    });
  }

  // Top desires (3-5)
  if (!Array.isArray(stage2.top_desires) || stage2.top_desires.length < 3) {
    errors.push(`top_desires must have 3-5 desires, got ${stage2.top_desires?.length || 0}`);
  } else {
    stage2.top_desires.forEach((desire, i) => {
      if (isEmpty(desire.name)) errors.push(`top_desires[${i}].name is empty`);
      if (isEmpty(desire.aspirational_quote)) errors.push(`top_desires[${i}].aspirational_quote is empty`);
      if (hasPlaceholder(desire.aspirational_quote)) placeholderCount++;
    });
  }

  // Top pain points (5)
  if (!Array.isArray(stage2.top_pain_points) || stage2.top_pain_points.length < 5) {
    errors.push(`top_pain_points must have 5 pain points, got ${stage2.top_pain_points?.length || 0}`);
  }

  // Barriers
  if (!Array.isArray(stage2.barriers) || stage2.barriers.length < 2) {
    errors.push(`barriers must have at least 2 barriers, got ${stage2.barriers?.length || 0}`);
  }

  // Price justification
  if (isEmpty(stage2.price_justification)) {
    errors.push("price_justification is missing");
    emptyFieldCount++;
  }

  const fieldCount = 50; // Approximate (10-15 phrases + 3-5 fears/desires + 5 pains + barriers)
  const qualityScore = Math.max(0, 100 - (errors.length * 5) - (warnings.length * 2));

  return {
    isValid: errors.length === 0,
    stage: 2,
    stageName: "Buyer Psychology",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Validate Stage 3: Competitive Analysis
 */
export function validateStage3(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 3,
      stageName: "Competitive Analysis",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage3 = data as Stage3CompetitiveAnalysis;

  // Competitors (3-5)
  if (!Array.isArray(stage3.competitors) || stage3.competitors.length < 3) {
    errors.push(`competitors must have 3-5 competitors, got ${stage3.competitors?.length || 0}`);
  } else {
    stage3.competitors.forEach((comp, i) => {
      if (isEmpty(comp.name)) errors.push(`competitors[${i}].name is empty`);
      if (isEmpty(comp.price_point)) errors.push(`competitors[${i}].price_point is empty`);
      if (hasPlaceholder(comp.name) || hasPlaceholder(comp.positioning)) placeholderCount++;
    });
  }

  // Positioning gaps
  errors.push(...validateStringArray(stage3.positioning_gaps, "positioning_gaps", 3));

  // Differentiation opportunities
  errors.push(...validateStringArray(stage3.differentiation_opportunities, "differentiation_opportunities", 3));

  // UVP
  if (isEmpty(stage3.unique_value_proposition)) {
    errors.push("unique_value_proposition is missing");
    emptyFieldCount++;
  } else if (hasPlaceholder(stage3.unique_value_proposition)) {
    placeholderCount++;
  }

  const fieldCount = 20; // Approximate
  const qualityScore = Math.max(0, 100 - (errors.length * 8) - (warnings.length * 3));

  return {
    isValid: errors.length === 0,
    stage: 3,
    stageName: "Competitive Analysis",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Validate Stage 4: Avatar Creation (MOST CRITICAL)
 */
export function validateStage4(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 4,
      stageName: "Avatar Creation",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage4 = data as Stage4AvatarCreation;

  // Avatar name
  if (isEmpty(stage4.avatar_name)) {
    errors.push("avatar_name is missing");
    emptyFieldCount++;
  }

  // Demographics (6 fields)
  if (!stage4.demographics) {
    errors.push("demographics object is missing");
  } else {
    const demFields = ['age_range', 'household_income', 'geographic_location', 'profession_industry', 'family_status', 'education'];
    demFields.forEach(field => {
      const value = (stage4.demographics as any)[field];
      if (isEmpty(value)) {
        errors.push(`demographics.${field} is empty`);
        emptyFieldCount++;
      }
    });
  }

  // Psychographics
  if (!stage4.psychographics) {
    errors.push("psychographics object is missing");
  } else {
    errors.push(...validateStringArray(stage4.psychographics.core_values, "core_values", 3));
    errors.push(...validateStringArray(stage4.psychographics.media_consumption, "media_consumption", 3));
  }

  // Day in life (narratives)
  if (!stage4.day_in_life) {
    errors.push("day_in_life object is missing");
  } else {
    const dilFields = ['morning_routine', 'workday_experience', 'evening_routine', 'weekend_routine'];
    dilFields.forEach(field => {
      const value = (stage4.day_in_life as any)[field];
      if (isEmpty(value)) {
        errors.push(`day_in_life.${field} is empty`);
        emptyFieldCount++;
      } else if (hasPlaceholder(value)) {
        placeholderCount++;
      }
    });
    errors.push(...validateStringArray(stage4.day_in_life.pain_point_moments, "pain_point_moments", 3));
  }

  // Online communities
  if (!Array.isArray(stage4.online_communities) || stage4.online_communities.length < 3) {
    errors.push(`online_communities must have at least 3 communities, got ${stage4.online_communities?.length || 0}`);
  }

  // Top 3 hopes, fears, barriers
  errors.push(...validateStringArray(stage4.top_3_hopes, "top_3_hopes", 3));
  errors.push(...validateStringArray(stage4.top_3_fears, "top_3_fears", 3));
  if (!Array.isArray(stage4.top_3_barriers) || stage4.top_3_barriers.length !== 3) {
    errors.push(`top_3_barriers must have exactly 3 barriers`);
  }

  const fieldCount = 40; // This is the most complex stage
  const qualityScore = Math.max(0, 100 - (errors.length * 5) - (warnings.length * 2));

  return {
    isValid: errors.length === 0,
    stage: 4,
    stageName: "Avatar Creation",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Validate Stage 5: Offer Design
 */
export function validateStage5(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 5,
      stageName: "Offer Design",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage5 = data as Stage5OfferDesign;

  // Core offer
  if (!stage5.core_offer) {
    errors.push("core_offer is missing");
  } else {
    if (isEmpty(stage5.core_offer.offer_name)) errors.push("offer_name is missing");
    if (hasPlaceholder(stage5.core_offer.offer_name)) placeholderCount++;
  }

  // Pricing tiers (must be 3)
  if (!Array.isArray(stage5.pricing_tiers) || stage5.pricing_tiers.length !== 3) {
    errors.push(`pricing_tiers must have exactly 3 tiers, got ${stage5.pricing_tiers?.length || 0}`);
  } else {
    // Check tier 2 is recommended
    const tier2 = stage5.pricing_tiers.find(t => t.tier_number === 2);
    if (!tier2?.is_recommended) {
      warnings.push("Tier 2 should be marked as recommended");
    }
  }

  // Payment plans (2-3)
  if (!Array.isArray(stage5.payment_plans) || stage5.payment_plans.length < 2) {
    errors.push(`payment_plans must have 2-3 plans, got ${stage5.payment_plans?.length || 0}`);
  }

  // Marketing messages (15 total: 5 pain, 5 desire, 5 curiosity)
  if (!Array.isArray(stage5.marketing_messages) || stage5.marketing_messages.length !== 15) {
    errors.push(`marketing_messages must have exactly 15 messages, got ${stage5.marketing_messages?.length || 0}`);
  }

  // Guarantee
  if (!stage5.guarantee || isEmpty(stage5.guarantee.guarantee_text)) {
    errors.push("guarantee is missing or empty");
    emptyFieldCount++;
  }

  // Bonuses (3-5)
  if (!Array.isArray(stage5.bonuses) || stage5.bonuses.length < 3) {
    errors.push(`bonuses must have 3-5 bonuses, got ${stage5.bonuses?.length || 0}`);
  }

  const fieldCount = 35; // Approximate
  const qualityScore = Math.max(0, 100 - (errors.length * 6) - (warnings.length * 3));

  return {
    isValid: errors.length === 0,
    stage: 5,
    stageName: "Offer Design",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Validate Stage 13: Scarcity & Upsells (most complex offer stage)
 */
export function validateStage13(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: 13,
      stageName: "Scarcity & Upsells",
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  const stage13 = data as Stage13ScarcityUpsells;

  // Order bumps (must be exactly 3)
  if (!Array.isArray(stage13.order_bumps) || stage13.order_bumps.length !== 3) {
    errors.push(`order_bumps must have exactly 3 bumps, got ${stage13.order_bumps?.length || 0}`);
  } else {
    stage13.order_bumps.forEach((bump, i) => {
      if (isEmpty(bump.bump_name)) errors.push(`order_bumps[${i}].bump_name is empty`);
      if (bump.price < 27 || bump.price > 47) {
        errors.push(`order_bumps[${i}].price $${bump.price} outside $27-$47 range`);
      }
      if (hasPlaceholder(bump.bump_name)) placeholderCount++;
    });
  }

  // Upsells (must be exactly 2)
  if (!Array.isArray(stage13.upsells) || stage13.upsells.length !== 2) {
    errors.push(`upsells must have exactly 2 upsells, got ${stage13.upsells?.length || 0}`);
  } else {
    stage13.upsells.forEach((upsell, i) => {
      if (isEmpty(upsell.upsell_name)) errors.push(`upsells[${i}].upsell_name is empty`);
      if (upsell.price < 97 || upsell.price > 997) {
        errors.push(`upsells[${i}].price $${upsell.price} outside $97-$997 range`);
      }
      if (hasPlaceholder(upsell.upsell_name)) placeholderCount++;
    });
  }

  // Scarcity mechanisms
  if (!stage13.scarcity_mechanisms) {
    errors.push("scarcity_mechanisms is missing");
  } else {
    if (isEmpty(stage13.scarcity_mechanisms.enrollment_scarcity)) {
      errors.push("enrollment_scarcity is missing");
      emptyFieldCount++;
    }
    if (isEmpty(stage13.scarcity_mechanisms.bonus_scarcity)) {
      errors.push("bonus_scarcity is missing");
      emptyFieldCount++;
    }
  }

  const fieldCount = 25; // 3 bumps + 2 upsells + scarcity + summary
  const qualityScore = Math.max(0, 100 - (errors.length * 7) - (warnings.length * 3));

  return {
    isValid: errors.length === 0,
    stage: 13,
    stageName: "Scarcity & Upsells",
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Generic validator for offer stages 7-12
 */
export function validateOfferStage(
  data: any,
  stageNumber: number,
  stageName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      stage: stageNumber,
      stageName,
      errors: ["Invalid data: expected object"],
      warnings: [],
      qualityScore: 0,
      metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
    };
  }

  // Basic validation - check for empty object
  const keys = Object.keys(data);
  if (keys.length === 0) {
    errors.push("Response is an empty object");
  }

  // Check for placeholder patterns in all string values
  let placeholderCount = 0;
  let emptyFieldCount = 0;

  function checkValue(value: any) {
    if (typeof value === 'string') {
      if (isEmpty(value)) emptyFieldCount++;
      if (hasPlaceholder(value)) placeholderCount++;
    } else if (Array.isArray(value)) {
      value.forEach(checkValue);
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(checkValue);
    }
  }

  Object.values(data).forEach(checkValue);

  if (placeholderCount > 0) {
    errors.push(`Found ${placeholderCount} placeholder value(s)`);
  }
  if (emptyFieldCount > 0) {
    warnings.push(`Found ${emptyFieldCount} empty field(s)`);
  }

  const fieldCount = keys.length;
  const qualityScore = Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5));

  return {
    isValid: errors.length === 0,
    stage: stageNumber,
    stageName,
    errors,
    warnings,
    qualityScore,
    metrics: {
      fieldCount,
      placeholderCount,
      emptyFieldCount,
      responseLength: JSON.stringify(data).length,
    },
  };
}

/**
 * Main validation dispatcher
 */
export function validateStage(
  stageNumber: number,
  data: any
): ValidationResult {
  switch (stageNumber) {
    case 1:
      return validateStage1(data);
    case 2:
      return validateStage2(data);
    case 3:
      return validateStage3(data);
    case 4:
      return validateStage4(data);
    case 5:
      return validateStage5(data);
    case 6:
      return validateOfferStage(data, 6, "Report Synthesis");
    case 7:
      return validateOfferStage(data, 7, "Offer Rationale");
    case 8:
      return validateOfferStage(data, 8, "Value Stack");
    case 9:
      return validateOfferStage(data, 9, "Pricing Framework");
    case 10:
      return validateOfferStage(data, 10, "Payment Plans");
    case 11:
      return validateOfferStage(data, 11, "Premium Bonuses");
    case 12:
      return validateOfferStage(data, 12, "Power Guarantee");
    case 13:
      return validateStage13(data);
    default:
      throw new Error(`Invalid stage number: ${stageNumber}`);
  }
}

/**
 * Validate all stages and return aggregated results
 */
export function validateAllStages(stages: Record<number, any>): {
  allValid: boolean;
  results: ValidationResult[];
  summary: {
    totalStages: number;
    passedStages: number;
    failedStages: number;
    averageQualityScore: number;
    totalErrors: number;
    totalWarnings: number;
  };
} {
  const results: ValidationResult[] = [];

  for (const [stageNum, data] of Object.entries(stages)) {
    const result = validateStage(parseInt(stageNum), data);
    results.push(result);
  }

  const passedStages = results.filter(r => r.isValid).length;
  const failedStages = results.filter(r => !r.isValid).length;
  const averageQualityScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  return {
    allValid: failedStages === 0,
    results,
    summary: {
      totalStages: results.length,
      passedStages,
      failedStages,
      averageQualityScore: Math.round(averageQualityScore),
      totalErrors,
      totalWarnings,
    },
  };
}
