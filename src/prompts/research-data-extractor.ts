import type { CompleteResearchData } from "../types/research-stages";

/**
 * Extract essential research data in condensed format
 *
 * CRITICAL: Avoid JSON.stringify() which bloats prompts 5-10x
 * Instead: Extract only essential values inline
 *
 * Target: <3,000 characters (~850 tokens)
 * This leaves ~5,000-6,000 tokens for prompt instructions
 * and 2,500 tokens for AI output within 24K context window
 */
export function extractEssentialResearchData(research: CompleteResearchData): string {
  const {
    stage1_market_analysis: s1,
    stage2_buyer_psychology: s2,
    stage3_competitive_analysis: s3,
    stage4_avatar_creation: s4,
    stage5_offer_design: s5,
  } = research;

  // Extract top 2 fears (most critical for guarantee)
  const topFears = s2.top_fears?.slice(0, 2).map((f, i) =>
    `${i+1}. "${(f.quote || '').substring(0, 50)}..." (${f.intensity || 0}/10)`
  ).join('\n') || 'No fears data';

  // Extract top 2 desires (most critical for bonuses)
  const topDesires = s2.top_desires?.slice(0, 2).map((d, i) =>
    `${i+1}. "${(d.aspirational_quote || '').substring(0, 50)}..."`
  ).join('\n') || 'No desires data';

  // Extract buyer language (first 3 phrases - most impactful)
  const buyerLanguage = s2.buyer_language?.slice(0, 3).map(p => `"${p.exact_phrase || ''}"`).join(', ') || 'No buyer language';

  // Extract top 2 pain points
  const topPainPoints = s2.top_pain_points?.slice(0, 2).map((p, i) =>
    `${i+1}. "${(p.quote || '').substring(0, 45)}..."`
  ).join('\n') || 'No pain points data';

  // Extract first community only
  const community = s4.online_communities?.[0];
  const communityStr = community ? `${community.platform} (${community.member_count})` : 'N/A';

  // Extract recommended tier only
  const recommendedTier = s5.pricing_tiers?.find(t => t.is_recommended) || s5.pricing_tiers?.[1];
  const tierStr = `${recommendedTier?.tier_name || 'N/A'}: ${recommendedTier?.price || 'N/A'}`;

  return `
MARKET CONTEXT
Growth Rate: ${s1.market_growth_rate || 'N/A'}
Market Size: ${s1.market_size_2024 || 'N/A'} (projected 2025: ${s1.market_size_2025_projected || 'N/A'})
Bleeding Neck Problem: ${s1.bleeding_neck_problem || 'N/A'}

POWER 4%
Demographics: ${s1.power_4_percent?.demographics || 'N/A'}
LTV: ${s1.power_4_percent?.lifetime_value || 'N/A'}
Income: ${s1.purchasing_power?.average_household_income || 'N/A'}

TOP FEARS (for guarantee design)
${topFears}

TOP DESIRES (for bonus design)
${topDesires}

BUYER LANGUAGE (for all copy)
${buyerLanguage}

TOP PAIN POINTS
${topPainPoints}

PRICE JUSTIFICATION
${s2.price_justification || 'N/A'}

COMPETITIVE LANDSCAPE
UVP: ${s3.unique_value_proposition || 'N/A'}
Pricing Analysis: ${s3.competitive_pricing_analysis || 'N/A'}
Top Gap: ${s3.positioning_gaps?.[0] || 'N/A'}
Why We Win: ${s3.why_business_wins || 'N/A'}

AVATAR
${s4.avatar_name || 'N/A'} (${s4.demographics?.age_range || 'N/A'}, ${s4.demographics?.household_income || 'N/A'})
Price Sensitivity: ${s4.price_sensitivity || 'N/A'} - ${(s4.price_sensitivity_justification || '').substring(0, 60)}
Contact: ${s4.buying_triggers?.optimal_contact_days?.[0] || 'N/A'} ${s4.buying_triggers?.optimal_contact_times?.[0] || 'N/A'}
Platform: ${s4.buying_triggers?.platform_preferences?.[0] || 'N/A'}
Community: ${communityStr}

EXISTING OFFER
${s5.core_offer?.offer_name || 'N/A'} - ${tierStr}
Outcome: ${(s5.core_offer?.target_outcome || '').substring(0, 80)}
Guarantee Type: ${(s5.guarantee?.why_it_works || '').substring(0, 60)}...
`.trim();
}

/**
 * Calculate approximate token count for a string
 * Rule of thumb: 1 token ≈ 3.5 characters for condensed text
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 3.5);
}

/**
 * Validate extracted data stays within target token budget
 * Target: <850 tokens (<3,000 characters)
 */
export function validateExtractionSize(extractedData: string): {
  valid: boolean;
  characterCount: number;
  estimatedTokens: number;
  message: string;
} {
  const characterCount = extractedData.length;
  const estimatedTokens = estimateTokenCount(extractedData);
  const TARGET_TOKENS = 850;

  const valid = estimatedTokens <= TARGET_TOKENS;
  const message = valid
    ? `✅ Extraction within budget: ${estimatedTokens}/${TARGET_TOKENS} tokens`
    : `⚠️ Extraction exceeds budget: ${estimatedTokens}/${TARGET_TOKENS} tokens - reduce content`;

  return {
    valid,
    characterCount,
    estimatedTokens,
    message,
  };
}
