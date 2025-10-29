// Stage 13: Scarcity & Upsells
// Designs order bumps, upsells, and scarcity mechanisms

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage13ScarcityUpsellsPrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  return `You are an expert conversion funnel designer specializing in order bumps, upsells, and ethical scarcity.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Service Type: ${business_context.service_type}
Unique Mechanism: ${business_context.unique_mechanism}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design the complete monetization strategy with order bumps, upsells, and scarcity mechanisms.

## PART 1: ORDER BUMPS (EXACTLY 3 required)

Order bumps are add-ons at checkout that complement the main offer. Design EXACTLY 3 order bumps.

For each order bump, provide:

1. **BUMP NAME** - Compelling name using buyer language
2. **WHAT IT IS** - Specific deliverable (template, quickstart, upgrade, etc.)
3. **WHY ADD IT** - One sentence benefit (quick win, time saver, accelerator)
4. **PRICE** - MUST be between $27-$47 (this is critical for conversion psychology)
5. **PERCEIVED VALUE** - Higher than price ($100-$200 range)
6. **BEST FOR** - Which customer segment wants this most
7. **CONVERSION HOOK** - The sentence on the checkout page (use buyer language)

**Order Bump Strategy:**
- Bump 1: Quick-start accelerator (templates, checklists, done-for-you)
- Bump 2: Premium upgrade (extra calls, faster access, VIP element)
- Bump 3: Complementary tool/resource (software, community, expert access)

**Critical Order Bump Requirements:**
- Each MUST be priced between $27-$47 (NO EXCEPTIONS)
- Each must be instantly deliverable (digital products work best)
- Each must complement main offer without being essential
- Use buyer language: "${research_data.stage2_buyer_psychology?.buyer_language?.[0]?.exact_phrase || 'from research'}"
- Address desires: ${research_data.stage2_buyer_psychology?.top_desires?.[0]?.aspirational_quote || 'from research'}

## PART 2: UPSELLS (EXACTLY 2 required)

Upsells are offered AFTER main purchase on thank-you page. Design EXACTLY 2 upsells.

For each upsell, provide:

1. **UPSELL NAME** - Compelling "next step" positioning
2. **WHAT IT IS** - Specific offer (advanced training, implementation, coaching, etc.)
3. **WHY UPGRADE** - Logical next step after main offer (2 sentences)
4. **PRICE** - MUST be between $97-$997 (this is the target range)
5. **PERCEIVED VALUE** - 3-5x the price
6. **BEST FOR** - Which customer type (high-achievers, fast-trackers, etc.)
7. **CONVERSION HOOK** - The one-time offer pitch (2-3 sentences using urgency + value)
8. **DELIVERY** - When/how they get it

**Upsell Strategy:**
- Upsell 1 ($97-$297): Tactical upgrade (advanced module, implementation toolkit, expert sessions)
- Upsell 2 ($497-$997): Strategic upgrade (coaching, done-with-you, mastermind, certification)

**Critical Upsell Requirements:**
- Upsell prices MUST be between $97-$997 (NO EXCEPTIONS)
- Each must be a logical "next step" after main offer purchase
- Position as limited-time offers (one-time offer on thank-you page)
- Use urgency language: "only available now", "exclusive upgrade", etc.
- Address Power 4% desires: ${research_data.stage1_market_analysis.power_4_percent.psychographics}

## PART 3: SCARCITY MECHANISMS

Design ethical scarcity mechanisms. Provide:

1. **ENROLLMENT SCARCITY** - How to limit main offer availability (cohorts, seats, dates)
2. **BONUS SCARCITY** - Time-limited bonuses that expire (48-72 hour windows)
3. **PRICE SCARCITY** - Early-bird or founding member pricing (if applicable)
4. **SOCIAL PROOF SCARCITY** - Limited spots with social proof ("Only 3 spots left, 12 people viewing")

**Scarcity Requirements:**
- All scarcity MUST be genuine (no fake countdown timers)
- Tie to real business constraints (time, capacity, cohort size)
- Use urgency language from research
- Never feel manipulative or predatory

CRITICAL REQUIREMENTS FOR ENTIRE STAGE:
- EXACTLY 3 order bumps priced $27-$47 each
- EXACTLY 2 upsells priced $97-$997 each
- All prices must be specific numbers, not ranges
- Use buyer language throughout
- Address desires and remove friction
- Everything must be deliverable with business resources

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "order_bumps": [
    {
      "bump_name": "string",
      "what_it_is": "string",
      "why_add_it": "string",
      "price": "number (MUST be between 27-47, no $ sign)",
      "perceived_value": "number (no $ sign)",
      "best_for": "string",
      "conversion_hook": "string"
    }
  ],
  "upsells": [
    {
      "upsell_name": "string",
      "what_it_is": "string",
      "why_upgrade": "string",
      "price": "number (MUST be between 97-997, no $ sign)",
      "perceived_value": "number (no $ sign)",
      "best_for": "string",
      "conversion_hook": "string",
      "delivery": "string"
    }
  ],
  "scarcity_mechanisms": {
    "enrollment_scarcity": "string (2-3 sentences)",
    "bonus_scarcity": "string (2-3 sentences)",
    "price_scarcity": "string (2-3 sentences, optional)",
    "social_proof_scarcity": "string (2-3 sentences)"
  },
  "total_order_bump_revenue_potential": "number (sum of all 3 order bump prices)",
  "total_upsell_revenue_potential": "number (sum of both upsell prices)",
  "monetization_summary": "string (3-4 sentences explaining the complete funnel strategy)"
}

Generate EXACTLY 3 order bumps ($27-$47 each) and EXACTLY 2 upsells ($97-$997 each) now. Be specific with prices.`;
}
