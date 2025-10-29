// Stage 7: Offer Rationale
// Determines the core positioning and big promise of the strategic offer

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage7OfferRationalePrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  // Build strategic priorities context
  const prioritiesText = user_preferences.strategic_priorities
    .map(p => p.replace(/_/g, ' '))
    .join(', ');

  // Build proof assets context
  const proofAssets = Object.entries(user_preferences.proof_assets_available)
    .filter(([_, available]) => available)
    .map(([asset, _]) => asset.replace(/_/g, ' '))
    .join(', ');

  return `You are an expert offer designer specializing in high-converting strategic offers.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Current Offer: ${business_context.current_offer_description}
Service Type: ${business_context.service_type}
Delivery: ${business_context.delivery_format}
Current Price: ${business_context.price_point_current}
Duration: ${business_context.offer_duration}
Unique Mechanism: ${business_context.unique_mechanism}

USER'S STRATEGIC PRIORITIES
${prioritiesText}

PRIMARY TRANSFORMATION USER WANTS TO PROMISE
${user_preferences.primary_transformation}

AVAILABLE PROOF ASSETS
${proofAssets || 'None specified'}

${user_preferences.voice_preferences ? `
VOICE PREFERENCES
Tone: ${user_preferences.voice_preferences.tone}
${user_preferences.voice_preferences.avoid_words ? `Avoid: ${user_preferences.voice_preferences.avoid_words}` : ''}
${user_preferences.voice_preferences.must_include_concepts ? `Must Include: ${user_preferences.voice_preferences.must_include_concepts}` : ''}
` : ''}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design the core offer rationale that will guide all subsequent offer components.

You must create 3 DISTINCT OFFER RATIONALE OPTIONS. Each option should take a different strategic angle while staying true to the research and user preferences.

For each option, provide:

1. **BIG PROMISE** - The ultimate outcome/transformation (use buyer language from research)
2. **UNIQUE MECHANISM NAME** - Compelling name for the proprietary process (if user provided one, enhance it; otherwise create one)
3. **MECHANISM EXPLANATION** - How it works in 2-3 sentences (must address top fear #1)
4. **WHO IT'S FOR** - Describe the Power 4% avatar (use exact demographics from research)
5. **WHY NOW** - Urgency factor tied to market growth or avatar's life stage
6. **PROOF STRATEGY** - How available proof assets will be used to build credibility
7. **DIFFERENTIATION** - 3 specific ways this differs from competitors (reference competitive gaps from research)
8. **STRATEGIC ANGLE** - Which of the user's priorities this option emphasizes most

CRITICAL REQUIREMENTS:
- Use EXACT buyer language from research (phrases like "${research_data.stage2_buyer_psychology?.buyer_language?.[0]?.exact_phrase || 'from research'}")
- Address TOP FEAR: "${research_data.stage2_buyer_psychology?.top_fears?.[0]?.fear || 'from research'}"
- Target POWER 4%: ${research_data.stage1_market_analysis?.power_4_percent?.demographics || 'from research'}
- Price anchor to LTV: ${research_data.stage1_market_analysis?.power_4_percent?.lifetime_value || 'from research'}
- Each option must feel distinctly different in positioning

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "option_1": {
    "big_promise": "string",
    "unique_mechanism_name": "string",
    "mechanism_explanation": "string",
    "who_its_for": "string",
    "why_now": "string",
    "proof_strategy": "string",
    "differentiation": ["string", "string", "string"],
    "strategic_angle": "string"
  },
  "option_2": {
    "big_promise": "string",
    "unique_mechanism_name": "string",
    "mechanism_explanation": "string",
    "who_its_for": "string",
    "why_now": "string",
    "proof_strategy": "string",
    "differentiation": ["string", "string", "string"],
    "strategic_angle": "string"
  },
  "option_3": {
    "big_promise": "string",
    "unique_mechanism_name": "string",
    "mechanism_explanation": "string",
    "who_its_for": "string",
    "why_now": "string",
    "proof_strategy": "string",
    "differentiation": ["string", "string", "string"],
    "strategic_angle": "string"
  },
  "recommended_option": "option_1 | option_2 | option_3",
  "recommendation_rationale": "string (2-3 sentences explaining why this option best aligns with user priorities and research)"
}

Generate comprehensive, specific, and compelling offer rationales now.`;
}
