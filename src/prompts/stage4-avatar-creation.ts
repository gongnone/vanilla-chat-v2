import { BusinessContext } from "../types";
import {
  Stage1MarketAnalysis,
  Stage2BuyerPsychology,
  Stage3CompetitiveAnalysis,
} from "../types/research-stages";

export function buildStage4AvatarCreationPrompt(
  context: BusinessContext,
  stage1: Stage1MarketAnalysis,
  stage2: Stage2BuyerPsychology,
  stage3: Stage3CompetitiveAnalysis
): string {
  const {
    business_name,
    niche,
    target_market_hypothesis,
    unique_mechanism,
  } = context;

  return `You are a professional customer avatar specialist and narrative storyteller. Your task is to create a detailed, named persona for the Power 4% dream customer of ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}
**Niche:** ${niche}
**Target Market Hypothesis:** ${target_market_hypothesis}
**Unique Mechanism:** ${unique_mechanism}

# INSIGHTS FROM PREVIOUS STAGES

**Power 4% Demographics:** ${stage1.power_4_percent.demographics}
**Power 4% Psychographics:** ${stage1.power_4_percent.psychographics}
**Purchasing Power:** ${stage1.purchasing_power.average_household_income}

**Top 3 Fears:**
- ${stage2.fear_1}
- ${stage2.fear_2}
- ${stage2.fear_3}

**Top 3 Desires:**
- ${stage2.desire_1}
- ${stage2.desire_2}
- ${stage2.desire_3}

**Top 3 Pain Points:**
- ${stage2.pain_point_1}
- ${stage2.pain_point_2}
- ${stage2.pain_point_3}

**Unique Value Prop:** ${stage3.unique_value_proposition}

# YOUR TASK

Create a detailed avatar persona that brings the Power 4% customer to life. This should feel like a REAL PERSON with a name, story, and daily life.

## 1. Avatar Identity

Create a NAMED persona with:
- **avatar_name**: Realistic first and last name (e.g., "Jennifer Martinez" or "David Chen")
- **demographics**: Ultra-specific details including:
  - Exact age (not range)
  - Specific household income
  - City/region where they live
  - Exact profession and industry
  - Family status (married, kids, etc.)
  - Education level and background

## 2. Psychographic Profile

Deep psychological profile:
- **core_values**: 5-7 specific values they hold (not generic - be specific)
- **beliefs_about_niche**: What they believe about ${niche} and why they're invested
- **daily_lifestyle**: Typical daily routine, habits, priorities
- **media_consumption**: Specific podcasts, books, influencers, newsletters they follow

## 3. Day in the Life Summary

Create a brief summary of their typical day showing where pain points appear:

- **typical_day_summary**: 100-150 word summary of their daily routine and where pain points appear
- **pain_point_moments**: 5 specific moments when they feel the problem (one sentence each)

## 4. Buying Triggers & Optimal Contact

When and how to reach them:
- **optimal_contact_days**: Best days of the week (e.g., "Sunday evenings, Tuesday mornings")
- **optimal_contact_times**: Specific times (e.g., "6:30-7:30am during coffee, 9-10pm after kids sleep")
- **decision_making_windows**: When they research and make buying decisions
- **platform_preferences**: Where they spend time online (be specific: "LinkedIn for industry news, Instagram for inspiration, Reddit for honest reviews")
- **content_format_preferences**: What content they consume (long-form articles, short videos, podcasts, etc.)

## 5. Online Communities

Identify 3 REAL online communities where this avatar spends time.

For EACH community provide:
- **platform**: Facebook, Reddit, LinkedIn, etc.
- **name**: REAL community name
- **member_count**: Approximate size
- **engagement_level**: high | medium | low
- **top_topics**: 3 recurring topics (comma-separated)
- **advertising_approach**: One sentence on how to reach them there

## 6. Avatar Summary

- **top_3_hopes**: What they hope will happen in next 12 months
- **top_3_fears**: What they're afraid will happen if nothing changes
- **top_3_barriers**: Biggest obstacles preventing them from taking action + how to overcome each
- **recommended_tone**: How to communicate with them (formal, casual, empathetic, direct, etc.)
- **price_sensitivity**: high | medium | low + justification

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "avatar_name": "Sarah Mitchell",
  "age": "42 years old",
  "household_income": "$285,000 annually",
  "location": "Suburban Austin, Texas",
  "profession": "Senior Marketing Director at SaaS company",
  "family": "Married, 2 kids (ages 8 and 11)",
  "education": "MBA from UT Austin",

  "core_values": "Personal growth, work-life integration, authenticity, making impact, health and wellness",
  "beliefs_about_niche": "Believes it's essential but frustrated most solutions don't work. Values evidence-based approaches and measurable results.",
  "daily_lifestyle": "Wakes 5:30am for exercise, works 8am-6pm with back-to-back meetings, struggles to disconnect evenings, prioritizes family but feels constantly behind.",
  "media_consumption": "Podcasts (How I Built This, Tim Ferriss), Books (Atomic Habits, Deep Work), Newsletters (Morning Brew), Social (LinkedIn, Instagram)",

  "typical_day_summary": "Starts 5:30am checking emails during workout. Day filled with back-to-back Zoom calls, no time for deep strategic work. Skips lunch responding to Slack. Logs off 6pm but continues working after kids sleep at 9pm. Falls asleep anxious checking Instagram. Sunday evenings are breaking point - researches solutions and makes buying decisions when week stress peaks.",

  "pain_moment_1": "5:45am during workout when mind races - feels like failing at work and self-care",
  "pain_moment_2": "11am realizing no time for strategic work she's responsible for",
  "pain_moment_3": "During exec presentation without confident answers - feels like imposter",
  "pain_moment_4": "6:30pm not listening to kids because checking phone",
  "pain_moment_5": "Sunday afternoon looking at week ahead with dread not excitement",

  "optimal_contact_days": "Sunday evenings 6-9pm, Tuesday mornings 6-8am, Thursday lunch",
  "optimal_contact_times": "6:30-7:30am coffee, 12-1pm lunch, 9-10:30pm after kids sleep",
  "decision_windows": "Researches Sunday afternoons when stress peaks. Buys Sunday evening or Monday morning. Needs results within 30-60 days.",
  "platforms": "LinkedIn (daily morning), Instagram (evening), Podcasts (workouts), Reddit (Sunday research)",
  "content_preferences": "Long-form case studies with data, short videos 10-15min, email newsletters Tuesday/Thursday, live webinars Tuesday/Wednesday 8-9pm",

  "community_1_platform": "Facebook",
  "community_1_name": "Women in Leadership - Tech & SaaS",
  "community_1_members": "24,000",
  "community_1_engagement": "high",
  "community_1_topics": "Imposter syndrome, work-life integration, productivity systems",
  "community_1_approach": "Participate authentically, build trust 3-4 weeks before mentioning services",

  "community_2_platform": "LinkedIn",
  "community_2_name": "Women Executives in Tech",
  "community_2_members": "45,000",
  "community_2_engagement": "medium",
  "community_2_topics": "Leadership development, career advancement, executive presence",
  "community_2_approach": "Share valuable content, comment on discussions, establish thought leadership",

  "community_3_platform": "Reddit",
  "community_3_name": "r/careerguidance",
  "community_3_members": "2.5M",
  "community_3_engagement": "high",
  "community_3_topics": "Career transitions, work stress, productivity advice",
  "community_3_approach": "Answer questions helpfully, no self-promotion, let users DM",

  "hope_1": "Finally feel confident and in control at work",
  "hope_2": "Be fully present with family without work anxiety",
  "hope_3": "Get promoted to VP within 18 months",

  "fear_1": "Burning out and having to quit job she worked hard for",
  "fear_2": "Missing kids' childhood being stressed and distracted",
  "fear_3": "Getting passed over for VP because seen as tactical not strategic",

  "barrier_1": "Time - doesn't have time for one more thing",
  "barrier_1_solution": "Saves 10+ hours weekly, built into existing workflow",
  "barrier_2": "Skepticism - tried programs before that didn't work",
  "barrier_2_solution": "Money-back guarantee based on measurable outcomes",
  "barrier_3": "Investment - price feels like a lot even though affordable",
  "barrier_3_solution": "Wastes more annually on partial solutions, pays for itself in 3-6 months",

  "recommended_tone": "Direct but empathetic. Values efficiency not fluff. Needs to feel understood not judged. Use data but acknowledge emotional experience. Speak as peer not someone to fix.",
  "price_sensitivity": "medium",
  "price_sensitivity_reason": "$285K income with $30K+ discretionary but been burned before. Won't blink at $10K-20K IF believes it works. More concerned about wasting time than price."
}
\`\`\`

# CRITICAL REQUIREMENTS

- Avatar name must feel REAL and appropriate for demographics
- Day-in-life narratives must be VIVID and SPECIFIC (show, don't tell)
- Online communities must be REAL communities (research actual groups)
- Pain point moments must feel AUTHENTIC (not generic)
- Buying triggers must be ACTIONABLE (specific days/times)
- Tone and preferences must match psychographic profile
- NO placeholders or generic statements
- Everything should feel like a real person you could meet

Return only the JSON object, no additional commentary.`;
}
