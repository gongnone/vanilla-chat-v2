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
${stage2.top_fears.slice(0, 3).map(f => `- ${f.name}: "${f.quote}"`).join('\n')}

**Top 3 Desires:**
${stage2.top_desires.slice(0, 3).map(d => `- ${d.name}: "${d.aspirational_quote}"`).join('\n')}

**Top 3 Pain Points:**
${stage2.top_pain_points.slice(0, 3).map(p => `- ${p.frustration}`).join('\n')}

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

## 3. Day in the Life Narrative

Create a VIVID narrative of their typical day showing where pain points appear:

- **morning_routine**: What do they do from wake-up to leaving house? (150-200 words)
- **workday_experience**: What's their work like? Where does stress/frustration appear? (200-250 words)
- **evening_routine**: After work through bedtime - what do they do? (150-200 words)
- **weekend_routine**: How do they spend weekends? What do they wish they could do instead? (150-200 words)
- **pain_point_moments**: 5-7 specific moments in their day/week when they FEEL the problem acutely

The narrative should feel REAL and show (not tell) their frustrations and desires.

## 4. Buying Triggers & Optimal Contact

When and how to reach them:
- **optimal_contact_days**: Best days of the week (e.g., "Sunday evenings, Tuesday mornings")
- **optimal_contact_times**: Specific times (e.g., "6:30-7:30am during coffee, 9-10pm after kids sleep")
- **decision_making_windows**: When they research and make buying decisions
- **platform_preferences**: Where they spend time online (be specific: "LinkedIn for industry news, Instagram for inspiration, Reddit for honest reviews")
- **content_format_preferences**: What content they consume (long-form articles, short videos, podcasts, etc.)

## 5. Online Communities Deep-Dive

Research and identify 5-7 REAL online communities where this avatar spends time:

For EACH community provide:
- **platform**: Facebook, Reddit, LinkedIn, Slack, Discord, etc.
- **name**: REAL community name (research actual groups)
- **url**: If publicly accessible (optional)
- **member_count**: Approximate size
- **engagement_level**: high | medium | low
- **trust_factor**: How much trust members have in recommendations there
- **tone_and_norms**: Communication style and unwritten rules
- **top_topics**: 5-7 recurring discussion topics
- **top_post_examples**: 3-5 examples of actual post types/titles that perform well
- **advertising_opportunity**: Can you advertise there? How to approach?

**Research**: Use real communities in ${niche} space - Facebook groups, subreddits, LinkedIn groups, Slack communities, forums, etc.

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
  "demographics": {
    "age_range": "42 years old",
    "household_income": "$285,000 annually (combined with spouse)",
    "geographic_location": "Suburban Austin, Texas",
    "profession_industry": "Senior Marketing Director at SaaS company",
    "family_status": "Married, 2 kids (ages 8 and 11)",
    "education": "MBA from UT Austin, undergrad in Communications"
  },
  "psychographics": {
    "core_values": [
      "Personal growth and continuous learning",
      "Work-life integration (not just balance)",
      "Authenticity and transparency in relationships",
      "Making impact through meaningful work",
      "Health and wellness as foundation for success"
    ],
    "beliefs_about_niche": "Believes ${niche} is essential for [specific belief], but frustrated that most solutions are [specific criticism]. Values evidence-based approaches and measurable results.",
    "daily_lifestyle": "Wakes at 5:30am for exercise, works 8am-6pm with back-to-back meetings, struggles to disconnect in evenings, prioritizes family dinners but often checks email after kids' bedtime. Values efficiency and productivity but feels constantly behind.",
    "media_consumption": [
      "Podcasts: How I Built This, Masters of Scale, The Tim Ferriss Show",
      "Books: Atomic Habits, $100M Offers, Deep Work",
      "Newsletters: Morning Brew, James Clear's 3-2-1 Thursday",
      "Social: LinkedIn for professional content, Instagram for wellness inspiration"
    ]
  },
  "day_in_life": {
    "morning_routine": "Sarah wakes at 5:30am to her phone alarm, immediately checking emails that came in overnight from the East Coast team. She puts on workout clothes and heads to her Peloton for a 30-minute ride, though her mind races with the day's meetings rather than being present. After a quick shower, she makes breakfast for the kids while reviewing her calendar—another day of back-to-back meetings with no time for deep work. She feels the familiar knot in her stomach: today's presentation to the executive team, and she's still not confident in the strategy. The kids argue over screen time as she tries to prepare them for school, and she snaps at them, immediately feeling guilty. By 8am, she's in her home office, coffee in hand, wondering why she can't seem to get ahead despite working harder than ever.",
    "workday_experience": "Her day is a blur of Zoom calls—product strategy at 9am, team 1:1s from 10-12, exec presentation at 1pm, budget review at 3pm. Between meetings, she frantically responds to Slack messages and emails, never getting to the deep strategic work she's actually responsible for. During the exec presentation, she fields tough questions she doesn't have good answers for, and can see the CMO's disappointment. She skips lunch, eating crackers at her desk while preparing for the next meeting. By 4pm, she's exhausted but has another two hours of calls. She keeps thinking: 'There has to be a better way to do this. I'm working 60 hours a week but still feel behind. What am I missing?'",
    "evening_routine": "At 6pm she logs off (theoretically) and helps the kids with homework, though she's checking her phone every few minutes. Family dinner at 7pm is nice but rushed—she's distracted, thinking about tomorrow's deadlines. After getting kids to bed at 9pm, she opens her laptop 'just to catch up on emails' and ends up working until 11pm. She falls into bed exhausted, scrolls Instagram for 20 minutes seeing other people who seem to have it all figured out, and falls asleep anxious about tomorrow.",
    "weekend_routine": "Saturday morning she sleeps until 7:30am (a luxury), then it's kids' activities—soccer, piano lessons, birthday parties. She squeezes in a Target run and meal prep. Sunday morning is family time, but by afternoon she's back on her laptop preparing for Monday. She wishes she could truly disconnect and be present with her family, but the anxiety of falling behind is too strong. Sunday evening is her breaking point—she researches solutions, reads reviews, watches YouTube videos about [niche]. This is when she makes buying decisions.",
    "pain_point_moments": [
      "5:45am during workout when mind races instead of being present - feels like she's failing at both work and self-care",
      "11am when she realizes she's scheduled in meetings all day with zero time for actual strategic work she's responsible for",
      "During exec presentation when she doesn't have confident answers - feels like an imposter",
      "6:30pm when kids ask her a question and she realizes she wasn't listening because she was on her phone",
      "9:30pm when she chooses work over sleep for the third night this week",
      "Sunday afternoon when she looks at her calendar for the week and feels dread instead of excitement",
      "Anytime someone asks 'how are you?' and she automatically says 'busy!' but realizes that's not who she wants to be"
    ]
  },
  "buying_triggers": {
    "optimal_contact_days": ["Sunday evenings (6-9pm)", "Tuesday mornings (6-8am)", "Thursday lunch (12-1pm)"],
    "optimal_contact_times": ["6:30-7:30am during coffee before kids wake", "12-1pm during lunch break", "9-10:30pm after kids asleep"],
    "decision_making_windows": "Researches solutions Sunday afternoons/evenings when week stress peaks. Makes buying decisions Sunday evening or Monday morning when motivated by week ahead. Needs to see results within 30-60 days max.",
    "platform_preferences": [
      "LinkedIn: Professional development content and industry trends (daily morning scroll)",
      "Instagram: Wellness and productivity inspiration (evening scroll)",
      "Podcasts: During workouts and commute (30-45 min episodes preferred)",
      "Reddit: Honest reviews and recommendations when researching purchases (Sunday research sessions)"
    ],
    "content_format_preferences": [
      "Long-form case studies with data and specific outcomes (not generic testimonials)",
      "Short implementation videos (10-15 min max) she can watch during lunch",
      "Email newsletters with actionable insights (reads Tuesday/Thursday mornings)",
      "Webinars she can attend live on Tuesday/Wednesday evenings (8-9pm)"
    ]
  },
  "online_communities": [
    {
      "platform": "Facebook",
      "name": "Women in Leadership - Tech & SaaS",
      "url": "facebook.com/groups/womenleadershiptech",
      "member_count": "24,000 members",
      "engagement_level": "high",
      "trust_factor": "High - members actively seek and give recommendations, strong community guidelines create safe space",
      "tone_and_norms": "Supportive and vulnerable. Members share real struggles, not just wins. No self-promotion unless asked. Value authenticity over perfection.",
      "top_topics": [
        "Imposter syndrome and confidence challenges",
        "Work-life integration strategies",
        "Negotiating executive compensation",
        "Managing up and executive presence",
        "Productivity systems that actually work",
        "Career pivots and transitions",
        "Burnout prevention and recovery"
      ],
      "top_post_examples": [
        "'I just bombed a presentation to the CEO. How do you recover from this?'",
        "'Anyone else feel like they're working 60 hours but still not enough?'",
        "'What changed when you invested in executive coaching? Worth it?'",
        "'How do you say no to your boss without damaging relationship?'",
        "'Tools/systems that helped you get strategic work done vs just firefighting'"
      ],
      "advertising_opportunity": "No paid ads allowed. Can participate authentically by answering questions and providing value. Build trust over 3-4 weeks before mentioning services. Members actively ask for recommendations."
    }
    // ... 4-6 more real communities
  ],
  "top_3_hopes": [
    "Finally feel confident and in control at work instead of constantly behind and reactive",
    "Be fully present with family in evenings and weekends without work anxiety",
    "Get promoted to VP level within 18 months with clear executive presence and strategic impact"
  ],
  "top_3_fears": [
    "Burning out completely and having to quit the job she's worked so hard for",
    "Missing her kids' childhood because she's always stressed and distracted",
    "Getting passed over for VP promotion because she's seen as tactical not strategic"
  ],
  "top_3_barriers": [
    {
      "barrier": "Time - 'I don't have time to add one more thing to my plate'",
      "solution": "This actually saves 10+ hours per week by eliminating wasted time on ineffective approaches. Implementation is built into your existing workflow, not added on top."
    },
    {
      "barrier": "Skepticism - 'I've tried coaching/programs before and they didn't work'",
      "solution": "Money-back guarantee based on measurable outcomes, not just satisfaction. Plus implementation accountability ensures you actually complete it this time."
    },
    {
      "barrier": "Investment - '$X feels like a lot' (even though she can afford it)",
      "solution": "Currently wasting $X annually on partial solutions and opportunity cost of not getting promoted. This investment pays for itself within 3-6 months through raised confidence, better results, and promotion trajectory."
    }
  ],
  "recommended_tone": "Direct but empathetic. She values efficiency and doesn't want fluff, but needs to feel understood not judged. Use data and specific outcomes, but acknowledge emotional experience. Speak to her as a peer, not someone to be fixed.",
  "price_sensitivity": "medium",
  "price_sensitivity_justification": "Has $285K household income with $30K+ annual discretionary spending, but still price-conscious because she's been burned before. Won't blink at $10K-20K investment IF she believes it will work and sees clear ROI. More concerned about wasting time on wrong solution than price. Needs social proof and guarantee to overcome skepticism."
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
