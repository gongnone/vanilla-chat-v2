import { BusinessContext } from "../types";
import {
  Stage1MarketAnalysis,
  Stage2BuyerPsychology,
  Stage3CompetitiveAnalysis,
  Stage4AvatarCreation,
} from "../types/research-stages";

export function buildStage5OfferDesignPrompt(
  context: BusinessContext,
  stage1: Stage1MarketAnalysis,
  stage2: Stage2BuyerPsychology,
  stage3: Stage3CompetitiveAnalysis,
  stage4: Stage4AvatarCreation
): string {
  const {
    business_name,
    current_offer_description,
    unique_mechanism,
    price_point_current,
    desired_price_point,
  } = context;

  return `You are a professional offer design strategist and conversion expert. Your task is to design an irresistible offer structure and marketing campaign for ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}
**Current Offer:** ${current_offer_description}
**Unique Mechanism:** ${unique_mechanism}
**Current Price:** ${price_point_current}
**Target Price:** ${desired_price_point || 'Premium pricing'}

# INSIGHTS FROM PREVIOUS STAGES

**Power 4% Target:** ${stage1.power_4_percent.demographics}
**Lifetime Value:** ${stage1.power_4_percent.lifetime_value}

**Top 3 Fears:**
1. ${stage2.fear_1}
2. ${stage2.fear_2}
3. ${stage2.fear_3}

**Top 3 Desires:**
1. ${stage2.desire_1}
2. ${stage2.desire_2}
3. ${stage2.desire_3}

**Competitive UVP:** ${stage3.unique_value_proposition}

**Avatar:** ${stage4.avatar_name}
**Avatar Price Sensitivity:** ${stage4.price_sensitivity} - ${stage4.price_sensitivity_reason}

# YOUR TASK

Design a complete offer structure with pricing, messaging, and first campaign recommendation.

## 1. Core Offer Definition

Define the core offer that will resonate with the Power 4% avatar:

- **offer_name**: Compelling name that hints at transformation (not generic)
- **target_outcome**: Specific measurable outcome they'll achieve
- **pain_points_solved**: 3-5 specific pain points this solves (from Stage 2)
- **desires_delivered**: 3-5 specific desires this fulfills (from Stage 2)
- **unique_positioning**: How this is positioned differently than competitors

## 2. 3-Tier Pricing Model

Create 3 pricing tiers optimized for the Power 4% segment:

**Tier 1 (Gateway)**: Entry point for those who need to "test the waters"
**Tier 2 (Signature)**: Main offer for the Power 4% - mark with \`is_recommended: true\`
**Tier 3 (Premium)**: For those who want maximum support/speed

For EACH tier provide:
- **tier_number**: 1, 2, or 3
- **tier_name**: Compelling name (e.g., "Accelerator", "VIP Intensive")
- **price**: Exact price with payment structure
- **deliverables**: 5-8 specific deliverables included
- **best_for**: Who this tier is perfect for
- **is_recommended**: true/false (only Tier 2 should be true)

**Pricing Strategy**:
- Tier 1: 40-50% of Tier 2 price (with 40-50% of value)
- Tier 2: Target price ${desired_price_point || 'premium'} with full value stack
- Tier 3: 150-200% of Tier 2 price (with premium bonuses and access)

## 3. Payment Plan Options

Create 2-3 payment plan options to reduce barrier to entry:

For EACH plan provide:
- **name**: Plan name (e.g., "Pay in Full", "3-Month Plan", "6-Month Plan")
- **structure**: Exact payment structure (e.g., "$3,000 upfront then $1,000/month x 6")
- **total_cost**: Total cost over life of plan

**Strategy**: Pay-in-full should save 10-15%, payment plans add 10-20% to total

## 4. 9 Marketing Messages

Create 9 high-converting marketing messages using buyer language from Stage 2:

**3 Pain-Based Messages**: Hook using specific pain/frustration
**3 Desire-Based Messages**: Hook using aspirational outcome
**3 Curiosity-Based Messages**: Hook using intrigue/pattern interrupt

For EACH message provide one headline (10-15 words) that ${stage4.avatar_name} would resonate with.

## 5. Risk-Reversal Guarantee

Create a guarantee that addresses the #1 fear: ${stage2.fear_1}

Provide:
- **guarantee_text**: Full guarantee statement (50-100 words)
- **why_it_works**: Why this guarantee reduces risk and increases conversions

**Not just**: "30-day money-back guarantee"
**But rather**: Outcome-based, conditional, or performance-based guarantee that's hard to abuse but builds massive trust

## 6. Irresistible Bonuses

Create 3 bonuses that increase perceived value, address desires, and speed up results.

For EACH bonus provide:
- **name**: Compelling bonus name
- **value**: Dollar value (e.g., "$497 value")
- **benefit**: One sentence on how it speeds results

## 7. First Campaign Recommendation

Based on ${stage4.avatar_name}'s buying triggers and online communities, recommend the optimal first campaign:

Provide:
- **platform**: Primary platform to launch on (Facebook, LinkedIn, Instagram, Email, etc.)
- **message**: Which message from the 15 to lead with (copy the headline)
- **offer_configuration**: Which tier to promote and which bonuses to emphasize
- **launch_timeline**: Specific timeline (e.g., "Launch Tuesday 8am EST, run for 5 days, close Sunday 11:59pm")

**Based on**: ${stage4.buying_triggers.optimal_contact_days.join(', ')} at ${stage4.buying_triggers.optimal_contact_times.join(' or ')}

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "offer_name": "The [Transformation] Accelerator",
  "target_outcome": "Specific measurable outcome in X timeframe",
  "pain_points_solved": "Pain 1, Pain 2, Pain 3 from Stage 2",
  "desires_delivered": "Desire 1, Desire 2, Desire 3 from Stage 2",
  "unique_positioning": "Positioned as [unique angle] unlike competitors who [competitor approach], delivers [outcome] in [timeframe] without [objection]",

  "tier_1_name": "Foundation Program",
  "tier_1_price": "$4,997 one-time or 3 payments of $1,797",
  "tier_1_deliverables": "12 weeks program access, Core framework templates, Weekly group coaching, Private community, Email support 48hr",
  "tier_1_best_for": "Self-motivated wanting guidance with community support",

  "tier_2_name": "VIP Accelerator ⭐ RECOMMENDED",
  "tier_2_price": "$12,997 one-time or $3,000 down + $2,500/month x 4",
  "tier_2_deliverables": "12 weeks intensive 1:1 coaching, Personalized strategy roadmap, Bi-weekly 60-min sessions, Unlimited email/Voxer, Custom templates, All Foundation deliverables, 30-day post-program support, Accountability tracking",
  "tier_2_best_for": "Power 4% buyers who value speed, personalization, guaranteed results",

  "tier_3_name": "Done-With-You Platinum",
  "tier_3_price": "$24,997 one-time",
  "tier_3_deliverables": "Everything in VIP, Weekly 90-min sessions, Done-with-you implementation, Direct phone/text access, 6-month post-program support, Fast-track 6 weeks vs 12, Priority scheduling",
  "tier_3_best_for": "Executives wanting maximum speed and white-glove support",

  "payment_plan_1": "Pay in Full: $11,697 one-time (save $1,300)",
  "payment_plan_2": "4-Month Plan: $3,000 down + $2,500/month x 4 = $13,000 total",
  "payment_plan_3": "6-Month Plan: $2,000 down + $2,000/month x 6 = $14,000 total",

  "pain_message_1": "Stop Spinning Your Wheels: Get Clarity and Results in 90 Days or Less",
  "pain_message_2": "Working 60-Hour Weeks But Still Falling Behind? Here's Why (And How to Fix It)",
  "pain_message_3": "Drowning in Tasks with No Time for What Actually Matters? There's a Better Way",

  "desire_message_1": "What If You Could [Desired Outcome] Without [Main Fear/Objection]?",
  "desire_message_2": "Finally Be Fully Present With Your Family (Without Sacrificing Your Career)",
  "desire_message_3": "Get Promoted to [Next Level] While Working 20% Fewer Hours",

  "curiosity_message_1": "The Counterintuitive Strategy Top Performers Use to Get Ahead (While Working Less)",
  "curiosity_message_2": "Why the 'Hustle Harder' Advice is Keeping You Stuck (And What to Do Instead)",
  "curiosity_message_3": "The One Thing Successful [Role] Do Differently That Nobody Talks About",

  "guarantee_text": "Complete the program, implement frameworks, attend sessions. If you don't achieve [specific outcome] within 90 days, we continue at no cost until you do - or refund 100%. Success guaranteed, not just satisfaction.",
  "guarantee_why": "Outcome-based guarantee addresses #1 fear by tying refund to measurable results. Performance accountability filters bad-fit clients while building trust. 'Keep working' clause shows investment in success not just sale.",

  "bonus_1_name": "Fast-Track Implementation Templates",
  "bonus_1_value": "$1,497",
  "bonus_1_benefit": "Pre-built templates eliminate 20+ hours setup, get implementing within 48 hours vs 2-3 weeks",

  "bonus_2_name": "Private 'Power Hour' Strategy Session",
  "bonus_2_value": "$997",
  "bonus_2_benefit": "1:1 intensive removes decision paralysis, creates personalized roadmap in single session",

  "bonus_3_name": "Lifetime Access to Program Updates",
  "bonus_3_value": "$2,997",
  "bonus_3_benefit": "Never worry about being left behind - get all future updates, frameworks, improvements",

  "campaign_platform": "Facebook/Instagram to 'Women in Leadership' communities and lookalike audiences",
  "campaign_message": "Working 60-Hour Weeks But Still Falling Behind? Here's Why (And How to Fix It)",
  "campaign_offer": "Promote Tier 2 (VIP) as recommended with all 3 bonuses. Present Tier 1 for budget-conscious, Tier 3 for speed. Lead with pain-based message for Sunday evening engagement.",
  "campaign_timeline": "Launch Sunday 6pm EST, run 5 days through Friday. Scarcity: 'Only 5 new clients this month.' Close Friday 11:59pm. Waitlist email Saturday."
}
\`\`\`

# CRITICAL REQUIREMENTS

- Offer name must be COMPELLING and transformation-focused (not generic)
- Pricing must be SPECIFIC with exact dollar amounts and payment structures
- Deliverables must be CONCRETE and valuable (not fluff)
- Marketing messages must use ACTUAL buyer language from Stage 2
- Guarantee must be OUTCOME-BASED and address specific fears
- Bonuses must SPEED RESULTS and have clear dollar value
- First campaign must reference ACTUAL avatar data (platforms, timing, communities)
- Everything must tie back to research from previous stages
- NO placeholders or generic statements

Return only the JSON object, no additional commentary.`;
}
