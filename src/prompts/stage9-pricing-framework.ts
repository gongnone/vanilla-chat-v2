// Stage 9: Pricing Framework
// Determines optimal pricing based on value, LTV, and market positioning

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage9PricingFrameworkPrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  const priceRangeText = `$${user_preferences.comfortable_price_range.min.toLocaleString()} - $${user_preferences.comfortable_price_range.max.toLocaleString()}`;

  return `You are an expert pricing strategist specializing in value-based pricing for premium offers.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Current Price: ${business_context.price_point_current}
${business_context.desired_price_point ? `Desired Price: ${business_context.desired_price_point}` : ''}
Duration: ${business_context.offer_duration}

USER'S PRICING PREFERENCES
Strategy: ${user_preferences.pricing_strategy}
Comfortable Range: ${priceRangeText}

PRIMARY TRANSFORMATION VALUE
${user_preferences.primary_transformation}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design the optimal pricing framework based on value, market positioning, and Power 4% LTV.

You must provide:

1. **RECOMMENDED PRICE** - Single price point within user's comfortable range
2. **PRICING RATIONALE** - Why this price (3-4 sentences) considering:
   - Power 4% LTV: ${research_data.stage1_market_analysis.power_4_percent.lifetime_value}
   - Value stack total perceived value (should be from Stage 8)
   - Pricing strategy: ${user_preferences.pricing_strategy}
   - Price sensitivity from research

3. **VALUE-TO-PRICE RATIO** - Calculate: (Total Perceived Value / Recommended Price)
   - Target: 5:1 to 10:1 ratio for premium offers

4. **PRICE ANCHORING STRATEGY** - How to present the price to maximize perceived value
   - Reference points (LTV, alternative solutions, cost of problem)
   - Framing technique

5. **PAYMENT STRUCTURE** - Recommend structure:
   - One-time payment
   - Split payments (e.g., 2 x $X, 3 x $X)
   - Payment + financing option

6. **PRICE SENSITIVITY MITIGATION** - Address top objections:
   - Top fear related to investment: ${research_data.stage2_buyer_psychology.top_fears[0]?.fear || 'from research'}
   - Budget concerns from avatar

7. **COMPETITIVE POSITIONING** - How this price positions against:
   - ${research_data.stage3_competitive_analysis?.competitors?.[0]?.name || 'Competitor A'}: ${research_data.stage3_competitive_analysis?.competitors?.[0]?.pricing_model || 'pricing not specified'}
   - Market average

CRITICAL REQUIREMENTS:
- Price MUST be within range: ${priceRangeText}
- Price should be 1-3% of Power 4% LTV (${research_data.stage1_market_analysis.power_4_percent.lifetime_value})
- Justify based on transformation value, not just features
- Consider income level: ${research_data.stage1_market_analysis.purchasing_power.average_household_income}
- Respect pricing strategy: ${user_preferences.pricing_strategy}

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "recommended_price": "number (just the number, no $ sign)",
  "pricing_rationale": "string (3-4 sentences)",
  "value_to_price_ratio": "string (e.g., '8:1' or '10:1')",
  "price_anchoring_strategy": {
    "reference_points": ["string", "string", "string"],
    "framing_technique": "string"
  },
  "payment_structure": {
    "primary_option": "string (e.g., 'One-time payment of $X')",
    "alternative_options": ["string", "string"]
  },
  "price_sensitivity_mitigation": {
    "top_objection": "string",
    "response_strategy": "string"
  },
  "competitive_positioning": "string (2 sentences comparing to market)"
}

Generate a strategic, justified pricing framework now.`;
}
