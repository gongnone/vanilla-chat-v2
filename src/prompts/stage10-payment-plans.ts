// Stage 10: Payment Plans
// Designs flexible payment options to reduce friction

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage10PaymentPlansPrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  return `You are an expert conversion optimizer specializing in payment plan design.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Duration: ${business_context.offer_duration}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design 2-3 flexible payment plan options to maximize accessibility and conversion.

For each payment plan, provide:

1. **PLAN NAME** - Compelling name (e.g., "Pay in Full", "Smart Start", "VIP Access")
2. **PAYMENT STRUCTURE** - Specific breakdown (e.g., "3 payments of $1,997", "$5,000 today")
3. **INCENTIVE** - What makes this option attractive (bonus, discount, extended access, etc.)
4. **BEST FOR** - Which avatar segment this appeals to (use research psychographics)
5. **CONVERSION PSYCHOLOGY** - Why this structure works (urgency, reciprocity, commitment, etc.)

PAYMENT PLAN STRATEGY GUIDELINES:

**Plan 1 - Pay in Full** (Recommended first option)
- Full price paid upfront
- Incentive: Bonus ($500-$1,000 value) OR small discount (5-10%)
- Psychology: Reciprocity + commitment
- Best for: Power 4% with available capital

**Plan 2 - Split Payment** (Most popular)
- 2-4 installments
- Slight premium over pay-in-full (10-15%)
- Psychology: Reduced friction + commitment sequence
- Best for: High intent but cash flow conscious

**Plan 3 - Extended/VIP** (Optional, if higher price point)
- Monthly payments OR deposit + payments
- 20-30% premium over pay-in-full
- Extra benefits (extended access, extra calls, etc.)
- Psychology: Affordability + premium positioning
- Best for: Budget-conscious but motivated

CRITICAL REQUIREMENTS:
- All plans must feel like good options (no "decoy" plans)
- Price sensitivity from research: ${research_data.stage2_buyer_psychology?.objections?.[0]?.objection || 'consider budget constraints'}
- Income level: ${research_data.stage1_market_analysis?.purchasing_power?.average_household_income || 'from research'}
- Avoid payment plans that feel predatory or high-pressure
- Incentives must be genuine value, not manufactured scarcity

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "payment_plans": [
    {
      "plan_name": "string",
      "payment_structure": "string (e.g., '$5,000 paid in full today')",
      "total_price": "number (total amount customer pays)",
      "incentive": "string (what they get for choosing this option)",
      "best_for": "string (which avatar segment)",
      "conversion_psychology": "string"
    }
  ],
  "recommended_default": "string (which plan to highlight as 'most popular')",
  "recommendation_rationale": "string (why this default based on research)"
}

Generate 2-3 compelling payment plans now.`;
}
