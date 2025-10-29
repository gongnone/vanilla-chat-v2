// Stage 8: Value Stack
// Designs the complete value stack with core offer components

import type { CompleteOfferContext } from '../types/offer-preferences';
import { extractEssentialResearchData } from './research-data-extractor';

export function buildStage8ValueStackPrompt(context: CompleteOfferContext): string {
  const { business_context, research_data, user_preferences } = context;

  // Extract condensed research data (~750 tokens)
  const researchSummary = extractEssentialResearchData(research_data);

  // Build unique assets context
  const uniqueAssets = [
    user_preferences.proprietary_frameworks,
    user_preferences.unique_tools_resources,
    user_preferences.exclusive_access
  ].filter(Boolean).join('\n- ');

  // Build components to emphasize
  const emphasizeComponents = user_preferences.emphasize_components.length > 0
    ? user_preferences.emphasize_components.join(', ')
    : 'Not specified';

  return `You are an expert offer designer specializing in irresistible value stacks.

BUSINESS CONTEXT
Name: ${business_context.business_name}
Service Type: ${business_context.service_type}
Delivery: ${business_context.delivery_format}
Duration: ${business_context.offer_duration}
Unique Mechanism: ${business_context.unique_mechanism}

PRIMARY TRANSFORMATION
${user_preferences.primary_transformation}

UNIQUE ASSETS AVAILABLE TO INCLUDE
${uniqueAssets || 'None specified - create conceptual components'}

COMPONENTS TO EMPHASIZE
${emphasizeComponents}

MARKET RESEARCH INSIGHTS
${researchSummary}

---

YOUR TASK: Design a comprehensive value stack with 5-7 core components that deliver the primary transformation.

Each component must:
- Address a specific desire from the top 2 desires in research
- Use buyer language from research
- Build logically toward the transformation
- Be specific and tangible (not vague promises)

For each component, provide:

1. **COMPONENT NAME** - Compelling name using buyer language
2. **WHAT IT IS** - Specific deliverable (template, training, tool, access, etc.)
3. **WHAT IT DOES** - Tangible outcome (1 sentence)
4. **DESIRE ADDRESSED** - Which top desire from research this satisfies
5. **DELIVERY FORMAT** - How they receive it (module, worksheet, video, etc.)
6. **PERCEIVED VALUE** - Estimated dollar value if sold separately

CRITICAL REQUIREMENTS:
- Use EXACT buyer language: "${research_data.stage2_buyer_psychology?.buyer_language?.[0]?.exact_phrase || 'from research'}"
- Address TOP 2 DESIRES:
  1. ${research_data.stage2_buyer_psychology?.top_desires?.[0]?.aspirational_quote || 'from research'}
  2. ${research_data.stage2_buyer_psychology?.top_desires?.[1]?.aspirational_quote || 'from research'}
- Incorporate user's unique assets (frameworks, tools, access) where provided
- Total perceived value should be 3-5x the eventual price point
- Components must work for ${business_context.delivery_format} delivery format

OUTPUT FORMAT: Valid JSON only, no markdown.

{
  "core_components": [
    {
      "component_name": "string",
      "what_it_is": "string",
      "what_it_does": "string",
      "desire_addressed": "string",
      "delivery_format": "string",
      "perceived_value": "number (just the number, no $ sign)"
    }
  ],
  "total_perceived_value": "number (sum of all component values)",
  "value_stack_summary": "string (2-3 sentences describing the complete journey through all components)"
}

Generate a compelling, specific value stack now.`;
}
