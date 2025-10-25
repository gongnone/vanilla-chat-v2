import { BusinessContext } from "../types";
import { CompleteResearchData } from "../types/research-stages";

/**
 * Condensed Stage 6 prompt that uses direct inline values instead of JSON blobs
 * to stay within 24K token context window.
 *
 * Reduces input from ~15K-20K tokens to ~3K-5K tokens, allowing 18K-20K for output.
 */
export function buildStage6ReportSynthesisPromptCondensed(
  context: BusinessContext,
  researchData: CompleteResearchData
): string {
  const { business_name } = context;
  const s1 = researchData.stage1_market_analysis;
  const s2 = researchData.stage2_buyer_psychology;
  const s3 = researchData.stage3_competitive_analysis;
  const s4 = researchData.stage4_avatar_creation;
  const s5 = researchData.stage5_offer_design;

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
Buyer Phrases: ${s2.buyer_phrases.join(' | ')}
Phrase Emotions: ${s2.phrase_emotions.join(', ')}

Top 3 Fears:
1. ${s2.fear_1} (${s2.fear_1_intensity}/10) - Root: ${s2.fear_1_root_emotion}
2. ${s2.fear_2} (${s2.fear_2_intensity}/10) - Root: ${s2.fear_2_root_emotion}
3. ${s2.fear_3} (${s2.fear_3_intensity}/10) - Root: ${s2.fear_3_root_emotion}

Top 3 Desires:
1. ${s2.desire_1} (${s2.desire_1_intensity}/10) - Meaning: ${s2.desire_1_deeper_meaning}
2. ${s2.desire_2} (${s2.desire_2_intensity}/10) - Meaning: ${s2.desire_2_deeper_meaning}
3. ${s2.desire_3} (${s2.desire_3_intensity}/10) - Meaning: ${s2.desire_3_deeper_meaning}

Top 3 Pain Points:
1. ${s2.pain_point_1} - Quote: "${s2.pain_point_1_quote}"
2. ${s2.pain_point_2} - Quote: "${s2.pain_point_2_quote}"
3. ${s2.pain_point_3} - Quote: "${s2.pain_point_3_quote}"

Barriers:
- Internal: ${s2.internal_barriers}
- External: ${s2.external_barriers}

Objection Handling: ${s2.objection_handling_summary}
Price Justification: ${s2.price_justification}

## Competitive Analysis
Competitors: ${s3.competitors.map(c => `${c.name} ($${c.price}) - ${c.positioning}`).join(' | ')}
Positioning Gaps: ${s3.positioning_gaps.join(' | ')}
Differentiation: ${s3.differentiation_opportunities.join(' | ')}
UVP: ${s3.unique_value_proposition}
Pricing Landscape: ${s3.competitive_pricing_landscape}
Why We Win: ${s3.why_this_business_wins.join(' | ')}

## Dream Customer Avatar
Name: ${s4.avatar_name}
Age: ${s4.age_range}
Income: ${s4.household_income}
Location: ${s4.location}
Job Title: ${s4.job_title}
Industry: ${s4.industry}
Years Experience: ${s4.years_in_career}

Psychographics:
- Values: ${s4.core_values.join(', ')}
- Beliefs: ${s4.beliefs_about_niche}
- Lifestyle: ${s4.daily_lifestyle}
- Media: ${s4.media_consumption.join(', ')}

Day in Life:
- Morning: ${s4.morning_routine}
- Workday: ${s4.workday_experience}
- Evening: ${s4.evening_routine}
- Weekend: ${s4.weekend_routine}
- Pain Moments: ${s4.pain_point_moments.join(' | ')}

Buying Intelligence:
- Contact Days: ${s4.optimal_contact_days}
- Contact Times: ${s4.optimal_contact_times}
- Decision Windows: ${s4.decision_making_windows}
- Platform Prefs: ${s4.platform_preferences}
- Content Prefs: ${s4.content_format_preferences}

Communities: ${s4.online_communities.map(c => `${c.name} (${c.platform}) - ${c.member_count} members`).join(' | ')}

Avatar Summary:
- Top Hopes: ${s4.top_3_hopes.join(' | ')}
- Top Fears: ${s4.top_3_fears.join(' | ')}
- Barriers: ${s4.top_3_barriers_to_buying.join(' | ')}
- Tone: ${s4.recommended_tone}
- Price Sensitivity: ${s4.price_sensitivity}

## Offer Design
Core Offer: ${s5.core_offer_name}
Target Outcome: ${s5.target_outcome}
Pain Points Solved: ${s5.pain_points_solved.join(' | ')}
Desires Delivered: ${s5.desires_delivered.join(' | ')}
Unique Positioning: ${s5.unique_positioning}

3 Tiers:
1. ${s5.tier_1_name} - $${s5.tier_1_price} - ${s5.tier_1_best_for}
   Deliverables: ${s5.tier_1_deliverables.join(', ')}
2. ${s5.tier_2_name} - $${s5.tier_2_price} - ${s5.tier_2_best_for} ⭐ RECOMMENDED
   Deliverables: ${s5.tier_2_deliverables.join(', ')}
3. ${s5.tier_3_name} - $${s5.tier_3_price} - ${s5.tier_3_best_for}
   Deliverables: ${s5.tier_3_deliverables.join(', ')}

Payment Plans: ${s5.payment_plans.map(p => `${p.name}: ${p.structure} (${p.total_cost})`).join(' | ')}

Marketing Messages (use these exact phrases):
Pain: ${s5.pain_based_messages.map(m => m.headline).join(' | ')}
Desire: ${s5.desire_based_messages.map(m => m.headline).join(' | ')}
Curiosity: ${s5.curiosity_based_messages.map(m => m.headline).join(' | ')}

Guarantee: ${s5.guarantee_text}
Why It Works: ${s5.guarantee_explanation}

Bonuses: ${s5.bonuses.map(b => `${b.name} ($${b.value}) - ${b.how_it_speeds_results}`).join(' | ')}

First Campaign:
- Platform: ${s5.first_campaign_platform}
- Lead Message: ${s5.first_campaign_lead_message}
- Offer: ${s5.first_campaign_offer_configuration}
- Timeline: ${s5.first_campaign_launch_timeline}

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
[Detailed profile with buying behavior]

## 3. Buyer Psychology Deep-Dive
### Buyer Language Intelligence
[Create table with all buyer phrases, emotions, and marketing applications]

### Fear Analysis
[Detail all 3 fears with intensity, quotes, root emotions]

### Desire Analysis
[Detail all 3 desires with intensity, deeper meanings]

### Major Pain Points
[All 3 pain points with quotes and solutions]

### Barriers to Purchase
[Internal and external barriers with handling strategies]

### Price Justification
[Full justification]

## 4. Competitive Intelligence
### Competitor Matrix
[Table with all competitors, prices, positioning, strengths/weaknesses]

### Positioning Gap Analysis
[All gaps as bullets]

### Differentiation Opportunities
[All opportunities as bullets]

### Unique Value Proposition
[Full UVP]

### Why This Business Wins
[All reasons]

## 5. Dream Customer Avatar: ${s4.avatar_name}
### Demographics Profile
[Complete profile]

### Psychographic Profile
[Values, beliefs, lifestyle, media consumption]

### A Day in the Life
[Morning, workday, evening, weekend routines with pain moments]

### Buying Triggers & Optimal Contact
[Days, times, windows, platforms, content preferences]

### Online Community Intelligence
[All communities with details]

### Avatar Summary
[Hopes, fears, barriers, tone, price sensitivity]

## 6. Offer Design & Pricing Strategy
### Core Offer: ${s5.core_offer_name}
[Outcome, pain points solved, desires delivered, positioning]

### 3-Tier Pricing Model
[Detail each tier with price, best for, all deliverables]

### Payment Plan Options
[Table with all plans]

### Marketing Messages
[All pain, desire, and curiosity messages organized by use case]

### Risk-Reversal Guarantee
[Full guarantee with explanation]

### Irresistible Bonuses
[All bonuses with value and impact]

## 7. First Campaign Strategy
[Platform, lead message, offer config, timeline]

## 8. Strategic Recommendations & Next Steps
### Immediate Actions (Week 1-2)
[5 specific actions]

### Short-Term Strategy (Month 1-3)
[3 strategic initiatives]

### Long-Term Vision (Month 4-12)
[3 vision items]

### Success Metrics to Track
[4-5 key metrics]

## Appendix: Research Methodology
[Brief explanation of 6-stage process]

---

**Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**For:** ${business_name}

# CRITICAL REQUIREMENTS

✅ USE ALL DATA - Every piece of research data must appear in the report
✅ NO PLACEHOLDERS - Use actual names, numbers, quotes from the data
✅ EXACT QUOTES - Use the exact buyer phrases and quotes provided
✅ COMPLETE TABLES - Fill every row with real data
✅ SPECIFIC NUMBERS - Use exact dollar amounts, percentages, dates
✅ PROFESSIONAL MARKDOWN - Proper headers, tables, bold, lists
✅ 5,000-6,000 WORDS - Comprehensive and actionable
✅ CLIENT-READY - They should be able to use this immediately

Return ONLY the complete markdown report. Start with the heading "# Market Intelligence Report: ${business_name}".`;
}
