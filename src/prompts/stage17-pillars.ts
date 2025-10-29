import { BusinessContext } from "../types";
import { Stage1MarketAnalysis, Stage2BuyerPsychology } from "../types/research-stages";
import { Stage7OfferRationale, Stage8ValueStack, ValueStackComponent } from "../types/offer-stages";

/**
 * Stage 17: Content Pillar Strategy Generator
 *
 * Generates 3-5 strategic content themes (pillars) based on:
 * - Market positioning (Stage 1)
 * - Buyer psychology (Stage 2)
 * - Offer positioning (Stage 7, optional)
 * - Value stack (Stage 8, optional)
 * - User feedback for regeneration (optional)
 *
 * Token Budget: ~7K input + 3K output = 10K total
 */
export function buildStage17ContentPillarsPrompt(
  context: BusinessContext,
  stage1: Stage1MarketAnalysis,
  stage2: Stage2BuyerPsychology,
  stage7?: Stage7OfferRationale,
  stage8?: Stage8ValueStack,
  userFeedback?: string
): string {
  const {
    business_name,
    niche,
    target_market_hypothesis,
    target_demographics,
    biggest_customer_pain_point,
    unique_mechanism,
  } = context;

  // Extract top buyer psychology elements (condensed) - with null-safety
  const topFears = stage2?.top_fears?.slice(0, 3).map(f => `"${f.name}": ${f.quote}`).join('; ') || 'from research';
  const topDesires = stage2?.top_desires?.slice(0, 3).map(d => `"${d.name}": ${d.aspirational_quote}`).join('; ') || 'from research';
  const topBuyerLanguage = stage2?.buyer_language?.slice(0, 7).map(bl => `"${bl.exact_phrase}"`).join(', ') || 'from research';

  // Optional: Offer positioning (if available)
  const offerContext = stage7 ? `
# OFFER POSITIONING (from Strategic Offer Design)

**Unique Mechanism:** ${stage7[stage7.recommended_option].unique_mechanism_name}
**Core Promise:** ${stage7[stage7.recommended_option].big_promise}
**Positioning Angle:** ${stage7[stage7.recommended_option].strategic_angle}
` : '';

  const valueStackContext = stage8 ? `
**Value Components:** ${stage8.core_components.map((vc: ValueStackComponent) => vc.component_name).join(', ')}
**Total Perceived Value:** ${stage8.total_perceived_value}
` : '';

  // User feedback for regeneration (if provided)
  const feedbackSection = userFeedback ? `

# ⚠️ USER FEEDBACK FOR IMPROVEMENT

The user is regenerating the content strategy and has provided the following feedback on the previous version:

"${userFeedback}"

**CRITICAL INSTRUCTION**: Take this feedback seriously and adjust the strategy accordingly. If the user wants:
- Different tone → Adjust language style throughout
- More/fewer pillars → Generate the requested number (within 3-5 range)
- Different focus → Emphasize the requested themes
- Specific changes → Apply them to relevant pillars

Your goal is to address the feedback while maintaining strategic quality and alignment with research data.
` : '';

  return `You are a content strategy expert specializing in business-to-consumer content marketing. Your task is to create 3-5 strategic "Content Pillars" for ${business_name}.${feedbackSection}

# WHAT ARE CONTENT PILLARS?

Content pillars are the 3-5 CORE THEMES that all your content revolves around. They:
- Establish topical authority for search engines and social algorithms
- Provide structure and consistency to content creation
- Align content with business goals and buyer psychology
- Differentiate your brand from competitors

# BUSINESS CONTEXT

**Business:** ${business_name}
**Niche:** ${niche}
**Target Audience:** ${target_market_hypothesis}
**Demographics:** ${target_demographics}
**Main Pain Point:** ${biggest_customer_pain_point}
**Unique Mechanism:** ${unique_mechanism}

# MARKET INSIGHTS (from Research)

**Market Category:** ${stage1?.power_4_percent?.demographics || 'from research'}
**Bleeding Neck Problem:** ${stage1?.bleeding_neck_problem || 'from research'}
**Power 4% Psychographics:** ${stage1?.power_4_percent?.psychographics || 'from research'}
**Lifetime Value:** ${stage1?.power_4_percent?.lifetime_value || 'from research'}

# BUYER PSYCHOLOGY (from Research)

**Top 3 Fears:** ${topFears}

**Top 3 Desires:** ${topDesires}

**Buyer Language (exact phrases):** ${topBuyerLanguage}
${offerContext}${valueStackContext}

# YOUR TASK

Generate 3-5 strategic content pillars that:

1. **Align with buyer psychology** - Address fears, promise desires, use their language
2. **Support business goals** - Drive conversions, establish authority, differentiate from competitors
3. **Provide diverse content opportunities** - Each pillar should have 10-15 specific topic ideas
4. **Balance content types** - Educational (40-50%), Entertaining (20-30%), Promotional (15-20%), Engagement (10-15%)

## Guidelines for Each Pillar:

1. **Pillar Name**: 2-4 words (e.g., "Authority Building", "Transformation Stories", "Expert Insights")
2. **Description**: What this pillar is about (100-200 characters)
3. **Audience Value Proposition**: Why your target audience will care about this content
4. **Business Goal**: How this pillar serves your business objectives (conversions, authority, trust, etc.)
5. **Buyer Psychology Tie**: Which specific fears, desires, or pain points from research this addresses
6. **Example Topics**: 10-15 specific, actionable topic ideas that fit this pillar
   - Make topics SPECIFIC, not generic (e.g., "3 frameworks tech leaders use to 10x productivity" not "productivity tips")
   - Use numbers, specifics, and buyer language
   - Mix formats: how-to, listicles, case studies, frameworks, hot takes
7. **Post Frequency %**: What percentage of your content calendar should this pillar occupy (must sum to 100% across all pillars)

## Content Mix Framework:

Recommend how to distribute content types:
- **Educational**: Teaching, how-to, frameworks (typically 40-50%)
- **Entertaining**: Stories, behind-the-scenes, hot takes (typically 20-30%)
- **Promotional**: Offers, testimonials, case studies (typically 15-20%)
- **Engagement**: Questions, polls, community posts (typically 10-15%)

## Strategic Considerations:

1. **The Accordion Method**: These pillars support a "high volume → learn what works → compress effort" strategy
2. **Platform Optimization**: Consider that LinkedIn favors 1-2 posts/day, Twitter 3-7/day, Instagram 3-5 feed posts/week
3. **Competitive Differentiation**: What content angles can ${business_name} own that competitors aren't covering?

# OUTPUT FORMAT

Return ONLY valid JSON matching this structure:

\`\`\`json
{
  "pillar_count": 4,
  "pillars": [
    {
      "pillar_name": "Authority Building",
      "pillar_description": "Establish thought leadership through proven frameworks and industry insights",
      "audience_value_proposition": "Learn from an expert with 10+ years and 200+ client success stories",
      "business_goal": "Position as premium authority to command higher prices and attract Power 4% clients",
      "buyer_psychology_tie": "Addresses Fear #1: 'Wasting money on unproven advice'. Promises validation and respect.",
      "example_topics": [
        "3 frameworks that transformed 50+ engineering leaders in 6 months",
        "Why most leadership advice fails tech professionals (and what actually works)",
        "The hidden skill that separates mediocre leaders from exceptional ones",
        "How I turned 32 failed tech leaders into top performers using this system",
        "5 myths about leadership that are costing you promotions",
        "The truth about imposter syndrome that no one talks about",
        "Behind the scenes: How we help leaders 10x their impact in 90 days",
        "Case study: From burnout to breakthrough in 8 weeks",
        "3 questions that reveal if you're ready for executive coaching",
        "The biggest mistake tech leaders make (and how to avoid it)",
        "My contrarian take on work-life balance for tech executives",
        "7 signs you need a leadership coach (based on 200+ client assessments)",
        "The framework Fortune 500 companies use for leadership development",
        "Why senior engineers struggle with leadership (psychological breakdown)",
        "How to know if you're a 'management material' engineer"
      ],
      "post_frequency_percentage": 30
    }
  ],
  "content_mix_framework": {
    "educational": 45,
    "entertaining": 25,
    "promotional": 20,
    "engagement": 10
  },
  "strategic_rationale": "These 4 pillars work together to establish authority (Pillar 1), demonstrate transformation (Pillar 2), provide practical value (Pillar 3), and build community (Pillar 4). The mix heavily favors educational content (45%) to position ${business_name} as a trusted expert, with entertainment (25%) to humanize the brand and create engagement. Promotional content (20%) strategically placed after value delivery, and engagement posts (10%) to build community and gather feedback.",
  "competitive_differentiation": "Unlike generic business coaches who post motivational quotes, ${business_name} focuses on tech-specific leadership challenges with concrete frameworks and real client results. The emphasis on '${unique_mechanism}' sets this apart from competitors who offer generic advice without a proprietary system."
}
\`\`\`

# IMPORTANT REMINDERS

1. **Use buyer language**: Incorporate exact phrases from research (e.g., "${stage2?.buyer_language?.[0]?.exact_phrase || 'specific pain point'}")
2. **Be specific**: "3 frameworks that transformed 50+ leaders" NOT "leadership tips"
3. **Tie to fears/desires**: Each pillar should clearly address specific buyer psychology insights
4. **Frequency must sum to 100%**: Ensure post_frequency_percentage across all pillars totals exactly 100
5. **10-15 topics per pillar**: Not less, not more
6. **Valid JSON only**: No additional commentary outside JSON structure

Generate the content pillar strategy now.`;
}
