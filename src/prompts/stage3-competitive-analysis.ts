import { BusinessContext } from "../types";
import { Stage1MarketAnalysis, Stage2BuyerPsychology } from "../types/research-stages";

export function buildStage3CompetitiveAnalysisPrompt(
  context: BusinessContext,
  stage1: Stage1MarketAnalysis,
  stage2: Stage2BuyerPsychology
): string {
  const {
    business_name,
    niche,
    current_offer_description,
    unique_mechanism,
    competitors_offers,
    price_point_current,
    desired_price_point,
  } = context;

  return `You are a professional competitive intelligence analyst. Your task is to conduct deep competitive analysis and identify positioning opportunities for ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}
**Niche:** ${niche}
**Current Offer:** ${current_offer_description}
**Unique Mechanism:** ${unique_mechanism}
**Current Price:** ${price_point_current}
**Target Price:** ${desired_price_point || 'Not specified'}
**Known Competitors:** ${competitors_offers || 'Not provided - research required'}

# MARKET INSIGHTS FROM PREVIOUS STAGES

**Bleeding Neck Problem:** ${stage1.bleeding_neck_problem}
**Power 4% Target:** ${stage1.power_4_percent.demographics}

**Top 3 Buyer Fears:**
- ${stage2.fear_1} (intensity: ${stage2.fear_1_intensity}/10)
- ${stage2.fear_2} (intensity: ${stage2.fear_2_intensity}/10)
- ${stage2.fear_3} (intensity: ${stage2.fear_3_intensity}/10)

**Top 3 Buyer Desires:**
- ${stage2.desire_1} (intensity: ${stage2.desire_1_intensity}/10)
- ${stage2.desire_2} (intensity: ${stage2.desire_2_intensity}/10)
- ${stage2.desire_3} (intensity: ${stage2.desire_3_intensity}/10)

# YOUR TASK

Research the competitive landscape and return a structured JSON object with actionable competitive intelligence.

## 1. Competitor Research (3 competitors)

Identify 3 DIRECT competitors in the ${niche} space who serve similar target markets.

${competitors_offers ? `Start with these known competitors: ${competitors_offers}` : 'Research and identify the top competitors in this space.'}

For EACH competitor provide:
- **name**: Business/product name
- **price_point**: Exact pricing (e.g., "$2,997 one-time" or "$497/month")
- **positioning**: Single sentence positioning (premium, budget, results-focused, etc.)
- **strengths**: 2 specific strengths as comma-separated string
- **weaknesses**: 2 specific weaknesses as comma-separated string
- **target_audience**: One-line description of who they serve

**Research Sources**: Competitor websites, reviews, social media, online communities where customers compare options

## 2. Positioning Gap Analysis

Based on competitor research, identify 5 SPECIFIC positioning gaps where ${business_name} can win.

Each gap should be a single sentence explaining the specific opportunity.

## 3. Differentiation Opportunities

List 5 ways ${business_name} can differentiate.

Each opportunity should be a single specific sentence.

## 4. Unique Value Proposition

Craft a clear, compelling UVP that:
- Addresses the bleeding neck problem: ${stage1.bleeding_neck_problem}
- Differentiates from ALL competitors
- Speaks to Power 4% buyer desires
- Highlights the unique mechanism

Format: "We help [target] achieve [outcome] through [unique mechanism] without [main objection/fear]"

## 5. Competitive Pricing Analysis

Analyze pricing landscape:
- What do budget competitors charge? (bottom 25%)
- What do mid-tier competitors charge? (middle 50%)
- What do premium competitors charge? (top 25%)
- Where does ${price_point_current} fit?
- Where should ${desired_price_point || 'premium pricing'} be positioned?
- What value gap justifies premium pricing?

## 6. Why This Business Wins

Based on ALL analysis, provide 5 specific reasons why ${business_name} will win against competitors.

Each reason should be one specific sentence.

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "competitor_1_name": "Competitor Business Name 1",
  "competitor_1_price": "$3,000 for 12 weeks",
  "competitor_1_positioning": "Premium results-focused program for executives",
  "competitor_1_strengths": "Strong brand recognition, proven track record",
  "competitor_1_weaknesses": "Generic approach, no personalization",
  "competitor_1_target": "Corporate executives 35-55, $150K+ income",

  "competitor_2_name": "Competitor Business Name 2",
  "competitor_2_price": "$1,500 for 8 weeks",
  "competitor_2_positioning": "Mid-tier group coaching program",
  "competitor_2_strengths": "Affordable pricing, active community",
  "competitor_2_weaknesses": "Limited 1:1 support, slow results",
  "competitor_2_target": "Mid-level managers 30-45",

  "competitor_3_name": "Competitor Business Name 3",
  "competitor_3_price": "$10,000+ for 6 months",
  "competitor_3_positioning": "High-end executive coaching",
  "competitor_3_strengths": "White-glove service, executive network",
  "competitor_3_weaknesses": "Prohibitively expensive, generic curriculum",
  "competitor_3_target": "C-suite executives $500K+ income",

  "gap_1": "All competitors use group coaching format, but Power 4% segment wants 1:1 personalized attention",
  "gap_2": "No competitor addresses fear of wasting time with outcome guarantees",
  "gap_3": "Competitors focus on knowledge but buyers want clarity and implementation",
  "gap_4": "Price gap between $1.5K mid-tier and $10K+ high-end creates opportunity",
  "gap_5": "No competitor emphasizes speed - all have 12+ week timelines",

  "diff_1": "Unique Mechanism solves problem in novel way competitors don't address",
  "diff_2": "Done-with-you vs do-it-yourself approach speaks to Power 4% desire for support",
  "diff_3": "Outcome-based guarantee addresses fear of wasting money",
  "diff_4": "6-8 week timeline vs competitors' 12+ weeks delivers results faster",
  "diff_5": "1:1 personalization at mid-tier price point (best of both worlds)",

  "unique_value_proposition": "We help [Power 4% target] achieve [transformation] through [unique mechanism] without [main fear] - guaranteed results in [timeframe] or money back",
  "pricing_analysis": "Budget: $500-$1.5K (DIY/group). Mid-tier: $1.5K-$4K (hybrid). Premium: $5K-$15K+ (1:1/done-for-you). Current price fits [tier]. Target price justified by: personalization, guarantee, speed, unique mechanism. Power 4% wastes $5K-15K annually on partial solutions.",

  "win_reason_1": "Unique Mechanism addresses root cause while competitors treat symptoms",
  "win_reason_2": "Only solution with outcome-based guarantee vs generic satisfaction promises",
  "win_reason_3": "Positioned for Power 4% who value speed and certainty over price",
  "win_reason_4": "1:1 personalization creates 10x better outcomes than generic group programs",
  "win_reason_5": "Fills pricing gap - premium quality at accessible price point"
}
\`\`\`

# CRITICAL REQUIREMENTS

- Use REAL competitor data from actual market research
- Competitor names must be REAL businesses (if known) or realistic examples
- Pricing must be SPECIFIC with dollar amounts and timeframes
- Positioning gaps must be REAL opportunities (not generic statements)
- Differentiation must be DEFENSIBLE (not easily copied)
- UVP must be CLEAR and SPECIFIC (not marketing fluff)
- Why business wins must be EVIDENCE-BASED (tied to research)
- NO placeholders or generic statements

Return only the JSON object, no additional commentary.`;
}
