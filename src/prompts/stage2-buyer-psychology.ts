import { BusinessContext } from "../types";
import { Stage1MarketAnalysis } from "../types/research-stages";

export function buildStage2BuyerPsychologyPrompt(
  context: BusinessContext,
  stage1: Stage1MarketAnalysis
): string {
  const {
    business_name,
    niche,
    target_market_hypothesis,
    target_demographics,
    target_psychographics,
    biggest_customer_pain_point,
    unique_mechanism,
    current_offer_description,
  } = context;

  return `You are a professional buyer psychology analyst and market research expert. Your task is to deep-dive into buyer language, emotional triggers, and psychological barriers for ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}
**Niche:** ${niche}
**Target Market:** ${target_market_hypothesis}
**Demographics:** ${target_demographics}
**Psychographics:** ${target_psychographics}
**Main Pain Point:** ${biggest_customer_pain_point}
**Unique Mechanism:** ${unique_mechanism}
**Current Offer:** ${current_offer_description}

# MARKET INSIGHTS FROM STAGE 1

**Bleeding Neck Problem:** ${stage1.bleeding_neck_problem}
**Power 4% Demographics:** ${stage1.power_4_percent.demographics}
**Power 4% Psychographics:** ${stage1.power_4_percent.psychographics}

# YOUR TASK

Research buyer psychology and return a structured JSON object with ACTUAL buyer language and emotional data.

## 1. Buyer Language Extraction (10-15 phrases)

Find 10-15 EXACT phrases that ${target_market_hypothesis} use when discussing ${biggest_customer_pain_point} in online communities, forums, social media, and reviews.

For EACH phrase provide:
- **exact_phrase**: Word-for-word quote (e.g., "I feel like I'm drowning in information")
- **meaning_context**: What they really mean beneath the surface
- **emotional_tone**: fear | hope | frustration | pride | shame | desire
- **usage_frequency**: high | medium | low (how often this appears)
- **marketing_application**: How to use this in headlines, ads, or sales copy

**Research Sources**: Reddit, Facebook groups, Quora, Amazon reviews, forum discussions related to ${niche}

## 2. Top Fears Analysis (3-5 fears)

Identify 3-5 MAJOR fears that prevent ${target_market_hypothesis} from achieving their goals or buying solutions like ${current_offer_description}.

For EACH fear provide:
- **name**: Short name for the fear (e.g., "Wasting Money Fear")
- **intensity**: 1-10 scale (10 = extremely intense)
- **quote**: Actual buyer quote expressing this fear
- **root_emotion**: Deeper emotion underneath (e.g., shame, inadequacy, overwhelm)
- **purchase_blocker**: Specific objection this creates ("I can't afford to fail again")
- **how_offer_addresses**: How ${unique_mechanism} specifically resolves this fear

**Distinguish**: Surface fears vs deep fears (e.g., "afraid of wasting money" is surface, "afraid of looking stupid to spouse" is deep)

## 3. Top Desires Analysis (3-5 desires)

Identify 3-5 MAJOR desires that ${target_market_hypothesis} are trying to achieve (beyond the obvious surface desire).

For EACH desire provide:
- **name**: Short name (e.g., "Freedom Desire")
- **intensity**: 1-10 scale (10 = extremely intense)
- **aspirational_quote**: Quote showing what they dream about
- **deeper_meaning**: What this desire REALLY represents (freedom | validation | balance | impact | security)
- **timeline_expectation**: How fast they expect/need results
- **willingness_to_pay**: How much they'd invest to achieve this
- **how_business_delivers**: Specific way your offer fulfills this desire

**Go Deeper**: Don't just list "make more money" - go to "what would more money give them?" (freedom, respect, security, impact, etc.)

## 4. Major Pain Points (5 pain points)

Detail the 5 MAJOR daily frustrations related to ${biggest_customer_pain_point}.

For EACH pain point provide:
- **frustration**: Specific daily frustration they experience
- **quote**: Buyer quote expressing this frustration
- **root_emotion**: fear | guilt | overwhelm | shame | anger
- **what_theyve_tried**: 2-3 solutions they've already attempted
- **why_it_didnt_work**: Why previous solutions failed
- **how_unique_mechanism_solves**: How ${unique_mechanism} addresses the root cause

## 5. Barriers Analysis (Internal + External)

List all barriers preventing them from taking action, split into:

**Internal Barriers** (psychological):
- Self-doubt, fear of failure, imposter syndrome, etc.
- For each: name + objection_handling_script

**External Barriers** (practical):
- Time, money, resources, support, knowledge, etc.
- For each: name + objection_handling_script

## 6. Price Justification

Based on ${target_demographics} and Power 4% analysis:
- Why can they afford premium pricing?
- What budget do they currently waste on ineffective solutions?
- What's the ROI they'd get from solving ${biggest_customer_pain_point}?

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "buyer_language": [
    {
      "exact_phrase": "I feel like I'm spinning my wheels",
      "meaning_context": "They're working hard but seeing no progress toward their goal",
      "emotional_tone": "frustration",
      "usage_frequency": "high",
      "marketing_application": "Use in headlines to create instant recognition: 'Stop Spinning Your Wheels and Start Seeing Real Progress'"
    }
    // ... 9-14 more phrases
  ],
  "top_fears": [
    {
      "name": "Wasting Money Fear",
      "intensity": 9,
      "quote": "I've spent thousands on programs that didn't work, I can't afford another mistake",
      "root_emotion": "shame",
      "purchase_blocker": "What if this is just another program I don't finish?",
      "how_offer_addresses": "Money-back guarantee + accountability system ensures completion",
      "is_surface_fear": false
    }
    // ... 2-4 more fears
  ],
  "top_desires": [
    {
      "name": "Freedom Desire",
      "intensity": 10,
      "aspirational_quote": "I just want to wake up without that knot in my stomach",
      "deeper_meaning": "freedom",
      "timeline_expectation": "See progress within 30 days, full transformation in 3-6 months",
      "willingness_to_pay": "$5,000-$15,000 for guaranteed solution",
      "how_business_delivers": "Systematic framework creates predictable progress and eliminates guesswork"
    }
    // ... 2-4 more desires
  ],
  "top_pain_points": [
    {
      "frustration": "Spending hours researching solutions but getting more confused",
      "quote": "Every expert says something different, I don't know who to trust anymore",
      "root_emotion": "overwhelm",
      "what_theyve_tried": "Free YouTube videos, $500 online course, 1-hour coaching session",
      "why_it_didnt_work": "Too generic, no personalized support, conflicting information",
      "how_unique_mechanism_solves": "Personalized roadmap eliminates decision fatigue and provides clear next steps"
    }
    // ... 4 more pain points
  ],
  "barriers": [
    {
      "barrier": "Self-doubt about ability to succeed",
      "type": "internal",
      "objection_handling_script": "I understand you've tried before and it didn't work. That's not a reflection of you - it's a reflection of the program. Our system is designed for people who've struggled before, with accountability and support built in."
    },
    {
      "barrier": "Time constraints",
      "type": "external",
      "objection_handling_script": "This is designed for busy professionals. The framework requires just 2-3 focused hours per week, and we help you identify what to eliminate to create that space."
    }
    // ... 5-8 more barriers total
  ],
  "price_justification": "Power 4% segment has household income of $200K-500K+ with $20K-50K annual discretionary spending. Currently wasting $5K-15K/year on partial solutions, ineffective programs, and opportunity cost. Solving [pain point] would generate $50K-200K+ value annually through [specific outcomes]. Premium pricing of $10K-25K represents 10-40% ROI within 12 months."
}
\`\`\`

# CRITICAL REQUIREMENTS

- Use REAL buyer language from actual online research (Reddit, Facebook, Quora, etc.)
- ALL quotes must sound authentic and specific (not generic marketing speak)
- Fears and desires must go DEEP (not surface level)
- Pain points must connect to REAL daily experiences
- Objection handling must address the ROOT concern, not just surface objection
- NO placeholders or generic statements
- Price justification must use specific numbers and ROI calculations

Return only the JSON object, no additional commentary.`;
}
