// Stage 11: Premium Bonuses
// Designs irresistible bonuses that increase perceived value

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage11PremiumBonusesPrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  // Build unique assets context
  const uniqueAssets = [
    user_preferences.proprietary_frameworks,
    user_preferences.unique_tools_resources,
    user_preferences.exclusive_access
  ].filter(Boolean).join('\n- ');

  return `You are an expert offer designer specializing in high-value bonuses that drive conversions.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Unique Mechanism: ${business_context.unique_mechanism}

UNIQUE ASSETS AVAILABLE
${uniqueAssets || 'Create from research insights'}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design 3-5 premium bonuses that address top desires and remove friction.

Each bonus must:
- Address a specific desire from top 2 desires in research
- Be delivered quickly (instant access or within first week)
- Have clear, believable perceived value
- Complement core offer without diluting it
- Use buyer language from research

For each bonus, provide:

1. **BONUS NAME** - Compelling name using buyer language (not generic)
2. **WHAT IT IS** - Specific deliverable (template, checklist, video, tool access, etc.)
3. **WHAT IT DOES** - Tangible quick win or friction remover (1 sentence)
4. **DESIRE/PAIN ADDRESSED** - Which research insight this targets
5. **DELIVERY TIMING** - When they get it (instant, day 1, week 1, etc.)
6. **PERCEIVED VALUE** - Realistic dollar value ($100-$2,000 range per bonus)
7. **WHY IT'S VALUABLE** - 1 sentence explaining why they'd want this standalone

BONUS DESIGN STRATEGY:

**Bonus Types to Consider:**
- Quick-start tools (templates, checklists, swipe files)
- Expert training (recordings, masterclasses, workshops)
- Community access (group calls, private forum, networking)
- Done-for-you services (audits, reviews, setup calls)
- Resources (tools, software, databases, directories)
- Time-limited bonuses (accountability calls, hot seats)

**Strategic Bonus Purposes:**
1. **Speed to First Win** - Help them get quick result in first 7 days
2. **Remove Common Obstacle** - Address objection/fear from research
3. **Accelerate Results** - Shortcut to desired outcome
4. **Add Premium Touch** - VIP experience element
5. **Build Community** - Connection to others on same journey

CRITICAL REQUIREMENTS:
- Address TOP 2 DESIRES:
  1. ${research_data.stage2_buyer_psychology?.top_desires?.[0]?.aspirational_quote || 'from research'}
  2. ${research_data.stage2_buyer_psychology?.top_desires?.[1]?.aspirational_quote || 'from research'}
- Use buyer language: "${research_data.stage2_buyer_psychology?.buyer_language?.[0]?.exact_phrase || 'from research'}"
- Total bonus value should be $500-$3,000 (adds to value stack without seeming fake)
- Each bonus must be deliverable with user's resources
- Avoid bonuses that require ongoing commitment from user

CRITICAL: YOU MUST RESPOND WITH ONLY VALID JSON. DO NOT include any explanatory text, commentary, or markdown formatting. START your response with { and END with }. No other text is allowed.

OUTPUT FORMAT: Valid JSON only, no markdown, no explanations, no additional text.

{
  "bonuses": [
    {
      "bonus_name": "string",
      "what_it_is": "string",
      "what_it_does": "string",
      "desire_pain_addressed": "string",
      "delivery_timing": "string",
      "perceived_value": "number (just the number, no $ sign)",
      "why_its_valuable": "string"
    }
  ],
  "total_bonus_value": "number (sum of all bonuses)",
  "strategic_bonus_summary": "string (2-3 sentences explaining how bonuses work together to increase conversion)"
}

REMEMBER: Respond with ONLY the JSON object. No text before the opening {. No text after the closing }.`;
}
