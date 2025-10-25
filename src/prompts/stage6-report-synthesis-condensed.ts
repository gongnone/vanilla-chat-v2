import { BusinessContext } from "../types";
import { CompleteResearchData } from "../types/research-stages";

/**
 * Condensed Stage 6 prompt that uses direct inline values instead of JSON blobs
 * to stay within 24K token context window.
 *
 * FIXED: Corrected all property access patterns to match actual JSON structure from Stages 1-5
 * Reduces input from ~15K-20K tokens to ~3K-5K tokens, allowing 18K-20K for output.
 */
export function buildStage6ReportSynthesisPromptCondensed(
  context: BusinessContext,
  researchData: CompleteResearchData
): string {
  const { business_name } = context;

  // Cast to 'any' because actual runtime data is FLAT structure
  // Stages 2-5 prompts explicitly request flat JSON, not nested objects/arrays
  const s1 = researchData.stage1_market_analysis as any;
  const s2 = researchData.stage2_buyer_psychology as any;
  const s3 = researchData.stage3_competitive_analysis as any;
  const s4 = researchData.stage4_avatar_creation as any;
  const s5 = researchData.stage5_offer_design as any;

  // Defensive checks
  if (!s1 || !s2 || !s3 || !s4 || !s5) {
    throw new Error('Missing required stage data');
  }

  return `You are a professional market intelligence report writer. Create a comprehensive Market Intelligence Report for ${business_name} using the research data below.

# RESEARCH DATA SUMMARY

## Market Analysis
- Market Size 2024: ${s1.market_size_2024}
- Market Size 2025: ${s1.market_size_2025_projected}
- Growth Rate: ${s1.market_growth_rate}
- Bleeding Neck Problem: ${s1.bleeding_neck_problem}
- Avg Household Income: ${s1.purchasing_power.average_household_income}
- Discretionary Spending: ${s1.purchasing_power.discretionary_spending}
- Platform Fit: ${s1.targetability.platform_fit}
- Difficulty Score: ${s1.targetability.difficulty_score}/10
- Targeting Interests: ${s1.targetability.targeting_interests.join(', ')}
- Targeting Behaviors: ${s1.targetability.targeting_behaviors.join(', ')}

Top 20% Profile:
- Demographics: ${s1.top_20_percent.demographics}
- Psychographics: ${s1.top_20_percent.psychographics}
- Characteristics: ${s1.top_20_percent.characteristics}

Power 4% Profile:
- Demographics: ${s1.power_4_percent.demographics}
- Psychographics: ${s1.power_4_percent.psychographics}
- Buying Frequency: ${s1.power_4_percent.buying_frequency}
- Lifetime Value: ${s1.power_4_percent.lifetime_value}
- Differentiation: ${s1.power_4_percent.differentiation}

## Buyer Psychology
Buyer Phrases: ${(s2.buyer_phrases || []).join(' | ')}
Phrase Emotions: ${(s2.phrase_emotions || []).join(', ')}
Phrase Marketing Hooks: ${(s2.phrase_marketing_hooks || []).join(' | ')}

Top 3 Fears:
1. ${s2.fear_1 || 'Not specified'} (${s2.fear_1_intensity || 'N/A'}/10)
   Root Emotion: ${s2.fear_1_root_emotion || 'Not specified'}

2. ${s2.fear_2 || 'Not specified'} (${s2.fear_2_intensity || 'N/A'}/10)
   Root Emotion: ${s2.fear_2_root_emotion || 'Not specified'}

3. ${s2.fear_3 || 'Not specified'} (${s2.fear_3_intensity || 'N/A'}/10)
   Root Emotion: ${s2.fear_3_root_emotion || 'Not specified'}

Top 3 Desires:
1. ${s2.desire_1 || 'Not specified'} (${s2.desire_1_intensity || 'N/A'}/10)
   Deeper Meaning: ${s2.desire_1_deeper_meaning || 'Not specified'}

2. ${s2.desire_2 || 'Not specified'} (${s2.desire_2_intensity || 'N/A'}/10)
   Deeper Meaning: ${s2.desire_2_deeper_meaning || 'Not specified'}

3. ${s2.desire_3 || 'Not specified'} (${s2.desire_3_intensity || 'N/A'}/10)
   Deeper Meaning: ${s2.desire_3_deeper_meaning || 'Not specified'}

Top 3 Pain Points:
1. ${s2.pain_point_1 || 'Not specified'}
   Quote: "${s2.pain_point_1_quote || 'Not specified'}"

2. ${s2.pain_point_2 || 'Not specified'}
   Quote: "${s2.pain_point_2_quote || 'Not specified'}"

3. ${s2.pain_point_3 || 'Not specified'}
   Quote: "${s2.pain_point_3_quote || 'Not specified'}"

Barriers:
- Internal: ${s2.internal_barriers || 'Not specified'}
- External: ${s2.external_barriers || 'Not specified'}
- Objection Handling: ${s2.objection_handling_summary || 'Not specified'}

Price Justification: ${s2.price_justification || 'Not specified'}

## Competitive Analysis
Competitors (3 analyzed):
1. ${s3.competitor_1_name || 'Not specified'} at ${s3.competitor_1_price || 'N/A'}
   Positioning: ${s3.competitor_1_positioning || 'Not specified'}
   Target: ${s3.competitor_1_target || 'Not specified'}
   Strengths: ${s3.competitor_1_strengths || 'Not specified'}
   Weaknesses: ${s3.competitor_1_weaknesses || 'Not specified'}

2. ${s3.competitor_2_name || 'Not specified'} at ${s3.competitor_2_price || 'N/A'}
   Positioning: ${s3.competitor_2_positioning || 'Not specified'}
   Target: ${s3.competitor_2_target || 'Not specified'}
   Strengths: ${s3.competitor_2_strengths || 'Not specified'}
   Weaknesses: ${s3.competitor_2_weaknesses || 'Not specified'}

3. ${s3.competitor_3_name || 'Not specified'} at ${s3.competitor_3_price || 'N/A'}
   Positioning: ${s3.competitor_3_positioning || 'Not specified'}
   Target: ${s3.competitor_3_target || 'Not specified'}
   Strengths: ${s3.competitor_3_strengths || 'Not specified'}
   Weaknesses: ${s3.competitor_3_weaknesses || 'Not specified'}

Positioning Gaps (5 identified):
1. ${s3.gap_1 || 'Not specified'}
2. ${s3.gap_2 || 'Not specified'}
3. ${s3.gap_3 || 'Not specified'}
4. ${s3.gap_4 || 'Not specified'}
5. ${s3.gap_5 || 'Not specified'}

Differentiation Opportunities (5 identified):
1. ${s3.diff_1 || 'Not specified'}
2. ${s3.diff_2 || 'Not specified'}
3. ${s3.diff_3 || 'Not specified'}
4. ${s3.diff_4 || 'Not specified'}
5. ${s3.diff_5 || 'Not specified'}

Unique Value Proposition: ${s3.unique_value_proposition || 'Not specified'}
Pricing Analysis: ${s3.pricing_analysis || 'Not specified'}

Why This Business Wins (5 reasons):
1. ${s3.win_reason_1 || 'Not specified'}
2. ${s3.win_reason_2 || 'Not specified'}
3. ${s3.win_reason_3 || 'Not specified'}
4. ${s3.win_reason_4 || 'Not specified'}
5. ${s3.win_reason_5 || 'Not specified'}

## Dream Customer Avatar
Name: ${s4.avatar_name || 'Not specified'}

Demographics:
- Age: ${s4.age || 'Not specified'}
- Income: ${s4.household_income || 'Not specified'}
- Location: ${s4.location || 'Not specified'}
- Profession: ${s4.profession || 'Not specified'}
- Family: ${s4.family || 'Not specified'}
- Education: ${s4.education || 'Not specified'}

Psychographics:
- Core Values: ${s4.core_values || 'Not specified'}
- Beliefs: ${s4.beliefs_about_niche || 'Not specified'}
- Lifestyle: ${s4.daily_lifestyle || 'Not specified'}
- Media Consumption: ${s4.media_consumption || 'Not specified'}

Day in Life:
${s4.typical_day_summary || 'Not specified'}

Pain Moments:
1. ${s4.pain_moment_1 || 'Not specified'}
2. ${s4.pain_moment_2 || 'Not specified'}
3. ${s4.pain_moment_3 || 'Not specified'}
4. ${s4.pain_moment_4 || 'Not specified'}
5. ${s4.pain_moment_5 || 'Not specified'}

Buying Intelligence:
- Optimal Contact Days/Times: ${s4.optimal_contact_days || 'Not specified'} at ${s4.optimal_contact_times || 'Not specified'}
- Decision Windows: ${s4.decision_windows || 'Not specified'}
- Platform Preferences: ${s4.platforms || 'Not specified'}
- Content Preferences: ${s4.content_preferences || 'Not specified'}

Online Communities (3 analyzed):
1. ${s4.community_1_name || 'Not specified'} (${s4.community_1_platform || 'N/A'})
   Members: ${s4.community_1_members || 'N/A'}, Engagement: ${s4.community_1_engagement || 'N/A'}
   Topics: ${s4.community_1_topics || 'Not specified'}
   Approach: ${s4.community_1_approach || 'Not specified'}

2. ${s4.community_2_name || 'Not specified'} (${s4.community_2_platform || 'N/A'})
   Members: ${s4.community_2_members || 'N/A'}, Engagement: ${s4.community_2_engagement || 'N/A'}
   Topics: ${s4.community_2_topics || 'Not specified'}
   Approach: ${s4.community_2_approach || 'Not specified'}

3. ${s4.community_3_name || 'Not specified'} (${s4.community_3_platform || 'N/A'})
   Members: ${s4.community_3_members || 'N/A'}, Engagement: ${s4.community_3_engagement || 'N/A'}
   Topics: ${s4.community_3_topics || 'Not specified'}
   Approach: ${s4.community_3_approach || 'Not specified'}

Avatar Summary:
- Top 3 Hopes:
  1. ${s4.hope_1 || 'Not specified'}
  2. ${s4.hope_2 || 'Not specified'}
  3. ${s4.hope_3 || 'Not specified'}

- Top 3 Fears:
  1. ${s4.fear_1 || 'Not specified'}
  2. ${s4.fear_2 || 'Not specified'}
  3. ${s4.fear_3 || 'Not specified'}

- Top 3 Barriers:
  1. ${s4.barrier_1 || 'Not specified'} → Solution: ${s4.barrier_1_solution || 'Not specified'}
  2. ${s4.barrier_2 || 'Not specified'} → Solution: ${s4.barrier_2_solution || 'Not specified'}
  3. ${s4.barrier_3 || 'Not specified'} → Solution: ${s4.barrier_3_solution || 'Not specified'}

- Recommended Tone: ${s4.recommended_tone || 'Not specified'}
- Price Sensitivity: ${s4.price_sensitivity || 'Not specified'} (${s4.price_sensitivity_reason || 'Not specified'})

## Offer Design
Core Offer: ${s5.offer_name || 'Not specified'}
Target Outcome: ${s5.offer_outcome || 'Not specified'}
Unique Positioning: ${s5.offer_positioning || 'Not specified'}

3-Tier Pricing Model:
1. ${s5.tier_1_name || 'Tier 1'} - ${s5.tier_1_price || 'Not specified'}
   Best For: ${s5.tier_1_best_for || 'Not specified'}
   Deliverables: ${s5.tier_1_deliverables || 'Not specified'}

2. ${s5.tier_2_name || 'Tier 2'} - ${s5.tier_2_price || 'Not specified'} ⭐ RECOMMENDED
   Best For: ${s5.tier_2_best_for || 'Not specified'}
   Deliverables: ${s5.tier_2_deliverables || 'Not specified'}

3. ${s5.tier_3_name || 'Tier 3'} - ${s5.tier_3_price || 'Not specified'}
   Best For: ${s5.tier_3_best_for || 'Not specified'}
   Deliverables: ${s5.tier_3_deliverables || 'Not specified'}

Payment Plans (3 options):
1. ${s5.payment_plan_1 || 'Not specified'}
2. ${s5.payment_plan_2 || 'Not specified'}
3. ${s5.payment_plan_3 || 'Not specified'}

Marketing Messages (use these exact phrases):
PAIN-BASED (3 messages):
1. ${s5.pain_message_1 || 'Not specified'}
2. ${s5.pain_message_2 || 'Not specified'}
3. ${s5.pain_message_3 || 'Not specified'}

DESIRE-BASED (3 messages):
1. ${s5.desire_message_1 || 'Not specified'}
2. ${s5.desire_message_2 || 'Not specified'}
3. ${s5.desire_message_3 || 'Not specified'}

CURIOSITY (3 messages):
1. ${s5.curiosity_message_1 || 'Not specified'}
2. ${s5.curiosity_message_2 || 'Not specified'}
3. ${s5.curiosity_message_3 || 'Not specified'}

Guarantee:
${s5.guarantee_text || 'Not specified'}
Why It Works: ${s5.guarantee_why || 'Not specified'}

Irresistible Bonuses (3 total):
1. ${s5.bonus_1_name || 'Not specified'} (${s5.bonus_1_value || 'N/A'} value)
   Benefit: ${s5.bonus_1_benefit || 'Not specified'}

2. ${s5.bonus_2_name || 'Not specified'} (${s5.bonus_2_value || 'N/A'} value)
   Benefit: ${s5.bonus_2_benefit || 'Not specified'}

3. ${s5.bonus_3_name || 'Not specified'} (${s5.bonus_3_value || 'N/A'} value)
   Benefit: ${s5.bonus_3_benefit || 'Not specified'}

First Campaign Recommendation:
- Platform: ${s5.campaign_platform || 'Not specified'}
- Lead Message: ${s5.campaign_message || 'Not specified'}
- Offer Configuration: ${s5.campaign_offer || 'Not specified'}
- Launch Timeline: ${s5.campaign_timeline || 'Not specified'}

# YOUR TASK

Create a comprehensive 5,000-6,000 word Market Intelligence Report in markdown format using ALL the data above.

## Required Structure

# Market Intelligence Report: ${business_name}

## Executive Summary
[300-400 words covering market opportunity, Power 4% profile, key buyer insights, competitive positioning, recommended offer, and first campaign]

## 1. Market Validation & Opportunity
### Market Growth & Size
[Use exact numbers from data]

### Bleeding Neck Problem
[Explain in detail]

### Purchasing Power Analysis
[Income and spending data]

### Targetability Assessment
[Platform fit, difficulty score, targeting options]

## 2. Customer Segmentation
### Top 20% Customer Profile
[Demographics, psychographics, characteristics]

### Power 4% Dream Customer Profile
[Detailed profile with buying behavior and lifetime value]

## 3. Buyer Psychology Deep-Dive
### Buyer Language Intelligence
[Create table with ALL 5 buyer phrases, 5 emotions, and 5 marketing hooks from data]

### Fear Analysis
[Detail ALL 3 fears with intensity (1-10), root emotions from data above]

### Desire Analysis
[Detail ALL 3 desires with intensity (1-10), deeper meanings from data above]

### Major Pain Points
[All 3 pain points with exact quotes from data above]

### Barriers to Purchase
[Internal and external barriers with objection handling from data above]

### Price Justification
[Full justification from data]

## 4. Competitive Intelligence
### Competitor Matrix
[Table with ALL 3 competitors, prices, positioning, strengths/weaknesses, target audience]

### Positioning Gap Analysis
[All 5 positioning gaps as bullets]

### Differentiation Opportunities
[All 5 differentiation opportunities as bullets]

### Unique Value Proposition
[Full UVP from data]

### Why This Business Wins
[All 5 reasons from competitive analysis]

## 5. Dream Customer Avatar: ${s4.avatar_name || 'Not specified'}
### Demographics Profile
[Complete profile with all 6 demographic attributes from data]

### Psychographic Profile
[Values, beliefs, lifestyle, media consumption from data]

### A Day in the Life
[Use typical day summary and 5 specific pain moments from data]

### Buying Triggers & Optimal Contact
[Optimal days/times, decision windows, platforms, content preferences from data]

### Online Community Intelligence
[ALL 3 communities with platform, members, engagement, topics, approach from data]

### Avatar Summary
[Top 3 hopes, 3 fears, 3 barriers with solutions, recommended tone, price sensitivity from data]

## 6. Offer Design & Pricing Strategy
### Core Offer: ${s5.offer_name || 'Not specified'}
[Target outcome, unique positioning from data]

### 3-Tier Pricing Model
[Detail each of the 3 tiers with exact prices, best for, deliverables, mark tier 2 as RECOMMENDED]

### Payment Plan Options
[Table with ALL 3 payment plans from data]

### Marketing Messages
[Organize ALL 9 messages by type: 3 pain-based, 3 desire-based, 3 curiosity. Use exact messages from data.]

### Risk-Reversal Guarantee
[Full guarantee text and explanation of why it works from data]

### Irresistible Bonuses
[ALL 3 bonuses with dollar values and benefits from data]

## 7. First Campaign Strategy
[Platform, lead message, offer configuration, launch timeline from campaign data]

## 8. Strategic Recommendations & Next Steps
### Immediate Actions (Week 1-2)
[5 specific actions based on the research]

### Short-Term Strategy (Month 1-3)
[3 strategic initiatives]

### Long-Term Vision (Month 4-12)
[3 vision items]

### Success Metrics to Track
[4-5 key metrics specific to this business]

## Appendix: Research Methodology
[Brief explanation of 6-stage research process used to generate this report]

---

**Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**For:** ${business_name}

# CRITICAL REQUIREMENTS

✅ USE ALL DATA - Every piece of research data must appear in the report
✅ NO PLACEHOLDERS - Use actual names, numbers, quotes from the data above
✅ EXACT QUOTES - Use the exact buyer phrases (5 phrases), fear quotes (3 fears), desire statements (3 desires), pain point quotes (3 pain points)
✅ COMPLETE TABLES - Fill every row with real data (3 competitors, 3 communities, 3 pricing tiers, 3 payment plans)
✅ SPECIFIC NUMBERS - Use exact dollar amounts, percentages, dates from data
✅ ALL MARKETING MESSAGES - Include all 9 marketing messages (3 pain-based + 3 desire-based + 3 curiosity)
✅ ALL BONUSES - Include all 3 bonuses with dollar values and benefits
✅ PROFESSIONAL MARKDOWN - Proper headers, tables, bold, lists
✅ 5,000-6,000 WORDS - Comprehensive and actionable
✅ CLIENT-READY - They should be able to use this immediately

Return ONLY the complete markdown report. Start with the heading "# Market Intelligence Report: ${business_name}".`;
}
