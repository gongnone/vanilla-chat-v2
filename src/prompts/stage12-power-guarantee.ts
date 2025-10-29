// Stage 12: Power Guarantee
// Designs risk-reversal guarantee that addresses top fear

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage12PowerGuaranteePrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  return `You are an expert conversion optimizer specializing in risk-reversal guarantees.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Service Type: ${business_context.service_type}
Duration: ${business_context.offer_duration}

USER'S RISK TOLERANCE
Guarantee Risk Tolerance: ${user_preferences.guarantee_risk_tolerance}

PRIMARY TRANSFORMATION
${user_preferences.primary_transformation}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design 3 guarantee options that remove risk and directly address the top fear from research.

Each guarantee must:
- Directly address TOP FEAR: ${research_data.stage2_buyer_psychology?.top_fears?.[0]?.fear || 'from research'}
- Be specific and measurable (not vague promises)
- Align with user's risk tolerance level
- Be realistic for the business to honor
- Use buyer language from research

For each guarantee option, provide:

1. **GUARANTEE NAME** - Compelling name that addresses the fear
2. **GUARANTEE TERMS** - Specific conditions and timeline
3. **WHAT'S COVERED** - Exactly what is guaranteed
4. **TRIGGER CONDITIONS** - When/how customer can invoke it
5. **REFUND/REMEDY TERMS** - What they get (full refund, partial, redo, etc.)
6. **PSYCHOLOGICAL IMPACT** - Why this removes the buying friction
7. **RISK LEVEL** - How much risk this carries for the business

GUARANTEE OPTIONS TO DESIGN:

**Option 1 - Conservative Guarantee** (${user_preferences.guarantee_risk_tolerance === 'conservative' ? 'RECOMMENDED' : 'Low Risk'})
- Traditional money-back guarantee with conditions
- 30-60 day window
- Requires proof of implementation
- Example: "Complete all modules and don't see results? Full refund."

**Option 2 - Moderate Guarantee** (${user_preferences.guarantee_risk_tolerance === 'moderate' ? 'RECOMMENDED' : 'Balanced'})
- Performance-based or results-oriented
- 60-90 day window
- Tied to specific milestones
- Example: "If you don't achieve [specific outcome] in 90 days, we'll work with you free until you do"

**Option 3 - Aggressive Guarantee** (${user_preferences.guarantee_risk_tolerance === 'aggressive' ? 'RECOMMENDED' : 'High Impact'})
- Bold promise or "better than money-back"
- 90-180 day window OR outcome-based
- May include bonuses for invoking
- Example: "If you complete the program and don't get results, we'll refund you AND you keep everything"

CRITICAL REQUIREMENTS:
- MUST address top fear: ${research_data.stage2_buyer_psychology?.top_fears?.[0]?.fear || 'from research'}
- Use buyer language: "${research_data.stage2_buyer_psychology?.buyer_language?.[0]?.exact_phrase || 'from research'}"
- Recommend the guarantee that matches user's ${user_preferences.guarantee_risk_tolerance} risk tolerance
- Avoid predatory or misleading terms
- Make sure guarantee is actually deliverable
- Consider service type: ${business_context.service_type} (some guarantees don't work for certain services)

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "guarantee_options": [
    {
      "guarantee_name": "string",
      "guarantee_terms": "string (2-3 sentences, specific)",
      "whats_covered": "string",
      "trigger_conditions": "string",
      "refund_remedy_terms": "string",
      "psychological_impact": "string (how this removes buying friction)",
      "risk_level": "low | moderate | high"
    }
  ],
  "recommended_guarantee": "1 | 2 | 3 (which option number)",
  "recommendation_rationale": "string (2-3 sentences explaining why based on risk tolerance and market research)"
}

Generate 3 compelling, fear-crushing guarantee options now.`;
}
