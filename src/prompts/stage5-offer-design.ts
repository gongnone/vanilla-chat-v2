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
${stage2.top_fears.slice(0, 3).map((f, i) => `${i + 1}. ${f.name}: "${f.quote}" - ${f.how_offer_addresses}`).join('\n')}

**Top 3 Desires:**
${stage2.top_desires.slice(0, 3).map((d, i) => `${i + 1}. ${d.name}: "${d.aspirational_quote}" - ${d.how_business_delivers}`).join('\n')}

**Competitive UVP:** ${stage3.unique_value_proposition}

**Avatar:** ${stage4.avatar_name}
**Avatar Price Sensitivity:** ${stage4.price_sensitivity} - ${stage4.price_sensitivity_justification}

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

## 4. 15 Marketing Messages

Create 15 high-converting marketing messages using buyer language from Stage 2:

**5 Pain-Based Messages**: Hook using specific pain/frustration
**5 Desire-Based Messages**: Hook using aspirational outcome
**5 Curiosity-Based Messages**: Hook using intrigue/pattern interrupt

For EACH message provide:
- **type**: "pain-based" | "desire-based" | "curiosity"
- **headline**: 10-15 word headline/hook
- **usage**: Where to use this (FB ad, email subject, landing page, etc.)

Use ACTUAL buyer language phrases from Stage 2 - these should sound like something ${stage4.avatar_name} would say or resonate with.

## 5. Risk-Reversal Guarantee

Create a guarantee that addresses the #1 fear: ${stage2.top_fears[0].name}

Provide:
- **guarantee_text**: Full guarantee statement (50-100 words)
- **why_it_works**: Why this guarantee reduces risk and increases conversions

**Not just**: "30-day money-back guarantee"
**But rather**: Outcome-based, conditional, or performance-based guarantee that's hard to abuse but builds massive trust

## 6. Irresistible Bonuses

Create 3-5 bonuses that:
- Increase perceived value by 2-3x
- Address desires from Stage 2
- Speed up results or reduce friction
- Have clear dollar value

For EACH bonus provide:
- **name**: Compelling bonus name
- **value**: Dollar value (e.g., "$497 value")
- **addresses_desire**: Which desire from Stage 2 this addresses
- **how_it_speeds_results**: How this accelerates transformation

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
  "core_offer": {
    "offer_name": "The [Transformation] Accelerator",
    "target_outcome": "Specific measurable outcome achieved in X timeframe",
    "pain_points_solved": [
      "Specific pain point 1 from Stage 2",
      "Specific pain point 2 from Stage 2",
      "Specific pain point 3 from Stage 2"
    ],
    "desires_delivered": [
      "Specific desire 1 from Stage 2",
      "Specific desire 2 from Stage 2",
      "Specific desire 3 from Stage 2"
    ],
    "unique_positioning": "Positioned as [unique angle] unlike competitors who [competitor approach], this [unique mechanism] delivers [specific outcome] in [timeframe] without [main objection]"
  },
  "pricing_tiers": [
    {
      "tier_number": 1,
      "tier_name": "Foundation Program",
      "price": "$4,997 one-time or 3 payments of $1,797",
      "deliverables": [
        "12 weeks of program access",
        "Core framework and implementation templates",
        "Weekly group coaching calls",
        "Private community access",
        "Email support (48hr response)"
      ],
      "best_for": "Those who are self-motivated and want guidance with community support",
      "is_recommended": false
    },
    {
      "tier_number": 2,
      "tier_name": "VIP Accelerator",
      "price": "$12,997 one-time or $3,000 down + $2,500/month x 4",
      "deliverables": [
        "12 weeks of intensive 1:1 coaching",
        "Personalized strategy and implementation roadmap",
        "Bi-weekly 60-min private coaching sessions",
        "Unlimited email/Voxer support",
        "Custom templates and frameworks",
        "All Foundation Program deliverables",
        "30-day post-program integration support",
        "Accountability tracking and progress reviews"
      ],
      "best_for": "Power 4% buyers who value speed, personalization, and guaranteed results",
      "is_recommended": true
    },
    {
      "tier_number": 3,
      "tier_name": "Done-With-You Platinum",
      "price": "$24,997 one-time",
      "deliverables": [
        "Everything in VIP Accelerator",
        "Weekly 90-min intensive sessions (vs bi-weekly 60-min)",
        "Done-with-you implementation (I do it with you in real-time)",
        "Direct phone/text access to coach",
        "6-month post-program support (vs 30 days)",
        "Fast-track timeline: 6 weeks vs 12 weeks",
        "Priority scheduling and immediate response"
      ],
      "best_for": "Executives and high-performers who want maximum speed and white-glove support",
      "is_recommended": false
    }
  ],
  "payment_plans": [
    {
      "name": "Pay in Full (Save 10%)",
      "structure": "$11,697 one-time payment",
      "total_cost": "$11,697 (save $1,300)"
    },
    {
      "name": "4-Month Payment Plan",
      "structure": "$3,000 down payment + $2,500/month x 4 months",
      "total_cost": "$13,000"
    },
    {
      "name": "Extended 6-Month Plan",
      "structure": "$2,000 down payment + $2,000/month x 6 months",
      "total_cost": "$14,000"
    }
  ],
  "marketing_messages": [
    {
      "type": "pain-based",
      "headline": "Stop Spinning Your Wheels: Get Clarity and Results in 90 Days or Less",
      "usage": "Facebook ad headline targeting warm audience who's been researching solutions"
    },
    {
      "type": "pain-based",
      "headline": "Working 60-Hour Weeks But Still Falling Behind? Here's Why (And How to Fix It)",
      "usage": "Email subject line to engaged subscribers"
    },
    {
      "type": "desire-based",
      "headline": "What If You Could [Desired Outcome] Without [Main Fear/Objection]?",
      "usage": "Landing page headline for cold traffic"
    },
    {
      "type": "desire-based",
      "headline": "Finally Be Fully Present With Your Family (Without Sacrificing Your Career)",
      "usage": "Instagram ad targeting working parents in leadership"
    },
    {
      "type": "curiosity",
      "headline": "The Counterintuitive Strategy Top Performers Use to Get Ahead (While Working Less)",
      "usage": "LinkedIn post or article headline"
    }
    // ... 10 more messages (total 15)
  ],
  "guarantee": {
    "guarantee_text": "Complete the 12-week program, implement the frameworks as outlined, and attend all scheduled sessions. If you don't achieve [specific measurable outcome] within 90 days, we'll continue working with you at no additional cost until you do - or refund 100% of your investment. Your success is guaranteed, not just your satisfaction.",
    "why_it_works": "This outcome-based guarantee addresses the #1 fear ('wasting money on another program that doesn't work') by tying refund to measurable results, not subjective satisfaction. It also includes performance accountability (must complete the work) which filters out bad-fit clients while building massive trust with serious buyers. The 'or we keep working' clause shows we're invested in their success, not just the sale."
  },
  "bonuses": [
    {
      "name": "Fast-Track Implementation Templates",
      "value": "$1,497 value",
      "addresses_desire": "Freedom Desire - want results faster without reinventing the wheel",
      "how_it_speeds_results": "Pre-built templates eliminate 20+ hours of setup work and get you implementing within 48 hours vs 2-3 weeks"
    },
    {
      "name": "Private 'Power Hour' Strategy Session",
      "value": "$997 value",
      "addresses_desire": "Validation Desire - want confidence they're on right track",
      "how_it_speeds_results": "1:1 intensive removes decision paralysis and creates personalized roadmap in single session"
    },
    {
      "name": "Lifetime Access to Program Updates",
      "value": "$2,997 value",
      "addresses_desire": "Security Desire - want ongoing support not one-time help",
      "how_it_speeds_results": "Never worry about being left behind - you get all future updates, frameworks, and improvements"
    }
  ],
  "first_campaign": {
    "platform": "Facebook/Instagram to 'Women in Leadership' communities and lookalike audiences",
    "message": "Working 60-Hour Weeks But Still Falling Behind? Here's Why (And How to Fix It)",
    "offer_configuration": "Promote Tier 2 (VIP Accelerator) as recommended option with all 3 bonuses included. Present Tier 1 as alternative for budget-conscious, Tier 3 for those who want speed. Lead with pain-based message since research shows higher engagement Sunday evenings when week anxiety peaks.",
    "launch_timeline": "Launch Sunday 6pm EST (optimal contact time), run 5-day campaign through Friday. Use scarcity: 'Only accepting 5 new clients this month.' Close Friday 11:59pm. Follow up with waitlist email Saturday for those who missed deadline."
  }
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
