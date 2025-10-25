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
${stage2.top_fears.slice(0, 3).map(f => `- ${f.name}: ${f.quote}`).join('\n')}

**Top 3 Buyer Desires:**
${stage2.top_desires.slice(0, 3).map(d => `- ${d.name}: ${d.aspirational_quote}`).join('\n')}

# YOUR TASK

Research the competitive landscape and return a structured JSON object with actionable competitive intelligence.

## 1. Competitor Research (3-5 competitors)

Identify 3-5 DIRECT competitors in the ${niche} space who serve similar target markets.

${competitors_offers ? `Start with these known competitors: ${competitors_offers}` : 'Research and identify the top competitors in this space.'}

For EACH competitor provide:
- **name**: Business/product name
- **price_point**: Exact pricing (e.g., "$2,997 one-time" or "$497/month")
- **positioning**: How they position themselves (premium, budget, results-focused, etc.)
- **strengths**: What they do well (2-3 specific strengths)
- **weaknesses**: Where they fall short (2-3 specific weaknesses)
- **target_audience**: Who they primarily serve (be specific)

**Research Sources**: Competitor websites, reviews, social media, online communities where customers compare options

## 2. Positioning Gap Analysis

Based on competitor research, identify 5-7 SPECIFIC positioning gaps where ${business_name} can win:

Examples:
- "Competitors focus on [X], but buyers actually want [Y]"
- "No competitor addresses [specific fear/desire from Stage 2]"
- "All competitors use [delivery format], creating opportunity for [alternative]"
- "Price gap between $500 DIY options and $10K+ high-touch programs"

Be SPECIFIC about the gap and WHY it matters to the Power 4% target audience.

## 3. Differentiation Opportunities

List 5-7 ways ${business_name} can differentiate using:
- **Unique Mechanism:** ${unique_mechanism}
- **Buyer Psychology:** Fears and desires from Stage 2
- **Market Gaps:** Identified positioning gaps

Each opportunity should be:
- Specific and actionable
- Tied to buyer psychology (what they actually want)
- Defensible (not easily copied)

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

Based on ALL analysis, provide 5-7 specific reasons why ${business_name} will win against competitors:

- Must reference unique mechanism
- Must tie to buyer psychology (fears/desires)
- Must leverage positioning gaps
- Must be defensible competitive advantages

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "competitors": [
    {
      "name": "Competitor Business Name",
      "price_point": "$3,000 for 12 weeks",
      "positioning": "Premium results-focused program for executives",
      "strengths": "Strong brand recognition, proven track record with 500+ testimonials, comprehensive curriculum",
      "weaknesses": "Generic approach, no personalization, 12-week timeline too long for urgent needs, limited support after program",
      "target_audience": "Corporate executives 35-55, $150K+ income, seeking career advancement"
    }
    // ... 2-4 more competitors
  ],
  "positioning_gaps": [
    "All competitors use group coaching format, but Power 4% segment explicitly wants 1:1 personalized attention and is willing to pay premium for it",
    "No competitor addresses the fear of 'wasting time on another program that doesn't work' - they focus on features rather than guaranteed outcomes",
    "Competitors position around 'more knowledge' but buyers are overwhelmed - opportunity to position around 'clarity and implementation' instead"
    // ... 4-6 total gaps
  ],
  "differentiation_opportunities": [
    "Unique Mechanism (${unique_mechanism}) is proprietary and solves the problem in a novel way that competitors don't address",
    "Positioning around 'done-with-you' vs competitors' 'do-it-yourself' approach speaks to Power 4% desire for support and speed",
    "Money-back guarantee based on completion metrics (not just satisfaction) addresses fear of wasting money"
    // ... 4-6 total opportunities
  ],
  "unique_value_proposition": "We help [specific Power 4% target] achieve [specific transformation] through [unique mechanism] without [biggest fear/objection] - guaranteed results in [timeframe] or money back",
  "competitive_pricing_analysis": "Budget competitors: $200-$800 (DIY courses, group programs). Mid-tier: $1,500-$4,000 (hybrid coaching, group with some 1:1). Premium: $5,000-$15,000+ (high-touch 1:1, done-for-you). Current price of ${price_point_current} positions in [tier]. Target price of ${desired_price_point || 'premium'} justified by: [specific value gaps - personalization, guarantee, speed, unique mechanism, results]. Power 4% segment currently wastes $5K-15K on partial solutions, making premium pricing a value play.",
  "why_business_wins": [
    "Unique Mechanism directly addresses root cause while competitors treat symptoms - creates better results faster",
    "Only solution addressing the #1 fear (from Stage 2) with structural guarantee, not just promises",
    "Positioned for Power 4% who value speed and certainty over saving money - underserved segment",
    "1:1 personalization vs generic group programs creates 10x better outcomes for premium buyers",
    "Fills pricing gap between $3K mid-tier and $15K high-end - premium quality at accessible price point"
    // ... 5-7 total reasons
  ]
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
