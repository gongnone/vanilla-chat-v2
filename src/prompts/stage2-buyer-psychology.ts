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

## 1. Buyer Language Extraction (7 phrases)

Find 7 EXACT phrases that ${target_market_hypothesis} use when discussing ${biggest_customer_pain_point} in online communities, forums, social media, and reviews.

For EACH phrase provide:
- **exact_phrase**: Word-for-word quote (e.g., "I feel like I'm drowning in information")
- **meaning_context**: What they really mean beneath the surface
- **emotional_tone**: fear | hope | frustration | pride | shame | desire
- **usage_frequency**: high | medium | low (how often this appears)
- **marketing_application**: How to use this in headlines, ads, or sales copy

**Research Sources**: Reddit, Facebook groups, Quora, Amazon reviews, forum discussions related to ${niche}

## 2. Top Fears Analysis (3 fears)

Identify 3 MAJOR fears that prevent ${target_market_hypothesis} from achieving their goals or buying solutions like ${current_offer_description}.

For EACH fear provide:
- **name**: Short name for the fear (e.g., "Wasting Money Fear")
- **intensity**: 1-10 scale (10 = extremely intense)
- **quote**: Actual buyer quote expressing this fear
- **root_emotion**: Deeper emotion underneath (e.g., shame, inadequacy, overwhelm)
- **purchase_blocker**: Specific objection this creates ("I can't afford to fail again")
- **how_offer_addresses**: How ${unique_mechanism} specifically resolves this fear

**Distinguish**: Surface fears vs deep fears (e.g., "afraid of wasting money" is surface, "afraid of looking stupid to spouse" is deep)

## 3. Top Desires Analysis (3 desires)

Identify 3 MAJOR desires that ${target_market_hypothesis} are trying to achieve (beyond the obvious surface desire).

For EACH desire provide:
- **name**: Short name (e.g., "Freedom Desire")
- **intensity**: 1-10 scale (10 = extremely intense)
- **aspirational_quote**: Quote showing what they dream about
- **deeper_meaning**: What this desire REALLY represents (freedom | validation | balance | impact | security)
- **timeline_expectation**: How fast they expect/need results
- **willingness_to_pay**: How much they'd invest to achieve this
- **how_business_delivers**: Specific way your offer fulfills this desire

**Go Deeper**: Don't just list "make more money" - go to "what would more money give them?" (freedom, respect, security, impact, etc.)

## 4. Major Pain Points (3 pain points)

Detail the 3 MAJOR daily frustrations related to ${biggest_customer_pain_point}.

For EACH pain point provide:
- **frustration**: Specific daily frustration they experience
- **quote**: Buyer quote expressing this frustration
- **root_emotion**: fear | guilt | overwhelm | shame | anger
- **what_theyve_tried**: 2-3 solutions they've already attempted
- **why_it_didnt_work**: Why previous solutions failed
- **how_unique_mechanism_solves**: How ${unique_mechanism} addresses the root cause

## 5. Barriers Analysis (5 total barriers)

List 5 barriers preventing them from taking action, split into:

**Internal Barriers** (psychological):
- Self-doubt, fear of failure, imposter syndrome, etc.
- Provide 2-3 internal barriers with: name + objection_handling_script

**External Barriers** (practical):
- Time, money, resources, support, knowledge, etc.
- Provide 2-3 external barriers with: name + objection_handling_script

## 6. Price Justification

Based on ${target_demographics} and Power 4% analysis:
- Why can they afford premium pricing?
- What budget do they currently waste on ineffective solutions?
- What's the ROI they'd get from solving ${biggest_customer_pain_point}?

# OUTPUT FORMAT

Return ONLY a valid JSON object with this SIMPLIFIED flat structure (no nested arrays of objects):

\`\`\`json
{
  "buyer_phrases": [
    "I feel like I'm spinning my wheels",
    "There's never enough time in the day",
    "I'm drowning in information but starving for clarity",
    "Every solution I try just adds more complexity",
    "I feel guilty about neglecting important areas"
  ],
  "phrase_emotions": ["frustration", "overwhelm", "confusion", "anxiety", "guilt"],
  "phrase_marketing_hooks": [
    "Stop Spinning Your Wheels - Start Seeing Real Progress",
    "Finally Find Time for What Matters Most",
    "Cut Through Information Overload - Get Crystal Clarity",
    "The Simple System That Actually Works",
    "End the Guilt - Master Your Priorities"
  ],

  "fear_1": "Wasting money on another solution that doesn't work",
  "fear_1_intensity": 9,
  "fear_1_root_emotion": "shame and regret from past failures",
  "fear_2": "Looking incompetent or failing in front of team/family",
  "fear_2_intensity": 8,
  "fear_2_root_emotion": "fear of judgment and loss of respect",
  "fear_3": "Missing critical opportunities while stuck in current situation",
  "fear_3_intensity": 8,
  "fear_3_root_emotion": "anxiety about falling behind peers",

  "desire_1": "Freedom from constant overwhelm and stress",
  "desire_1_intensity": 10,
  "desire_1_deeper_meaning": "True freedom to focus on what matters without guilt",
  "desire_2": "Respect and recognition from peers and team",
  "desire_2_intensity": 9,
  "desire_2_deeper_meaning": "Validation of their worth and capabilities",
  "desire_3": "Making meaningful impact in their field",
  "desire_3_intensity": 8,
  "desire_3_deeper_meaning": "Legacy and significance beyond just success",

  "pain_point_1": "Spending hours researching solutions but getting more confused by conflicting advice",
  "pain_point_1_quote": "Every expert says something different - I don't know who to trust anymore",
  "pain_point_2": "Constant guilt about neglecting important areas while firefighting urgent issues",
  "pain_point_2_quote": "I know I should be working on strategy, but I'm always putting out fires",
  "pain_point_3": "Feeling like a fraud despite external success",
  "pain_point_3_quote": "From the outside I look successful, but inside I feel like I'm barely holding it together",

  "internal_barriers": "Self-doubt about ability to change; Fear of failure; Imposter syndrome; Perfectionism paralysis",
  "external_barriers": "Time constraints; Budget concerns; Lack of support system; Too many competing priorities",
  "objection_handling_summary": "Address fear of wasting money with guarantee + proven system. Handle time concerns with 2-3 hour weekly commitment. Combat self-doubt with accountability and proven framework for people who've struggled before.",

  "price_justification": "Power 4% segment ($500K-$1M income) currently wastes $10K-20K annually on ineffective solutions, consultants, and opportunity cost. Solving [time management] generates $100K-300K value annually through increased productivity, better decisions, and reclaimed strategic time. Premium pricing of $15K represents 7-20x ROI within 12 months."
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
