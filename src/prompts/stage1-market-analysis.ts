import { BusinessContext } from "../types";

export function buildStage1MarketAnalysisPrompt(context: BusinessContext): string {
  const {
    business_name,
    niche,
    preferred_market_category,
    target_market_hypothesis,
    target_demographics,
    biggest_customer_pain_point,
    price_point_current,
    desired_price_point,
    delivery_format,
  } = context;

  return `You are a professional market research analyst. Your task is to conduct focused market validation research and identify the "Power 4%" customer segment for ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}
**Niche:** ${niche}
**Market Category:** ${preferred_market_category}
**Target Market Hypothesis:** ${target_market_hypothesis}
**Current Price Point:** ${price_point_current}
**Desired Price Point:** ${desired_price_point || 'Not specified'}
**Delivery Format:** ${delivery_format}

# YOUR TASK

Conduct market analysis and return a structured JSON object with specific, actionable data.

## Market Opportunity Assessment

Research the **${niche}** market within the **${preferred_market_category}** category:

1. **Market Growth Rate**: Find 2024-2025 data on market growth. Is it growing at minimum 9% annually? Provide specific percentage.

2. **Market Size**: Current market size (2024) and projected size (2025). Use specific dollar amounts.

3. **Bleeding Neck Problem**: What is the MOST urgent, painful problem that ${target_market_hypothesis} face right now? This should relate to "${biggest_customer_pain_point}".

4. **Purchasing Power**:
   - Average household income for ${target_demographics}
   - Discretionary spending capacity
   - Financial readiness to invest in ${niche} solutions

5. **Targetability** (for Facebook/Instagram advertising):
   - How easy to reach this audience on social platforms? (1-10 score)
   - Specific interest targeting keywords
   - Behavioral targeting options
   - Lookalike audience potential

## Power 4% Analysis

Based on ${price_point_current} current pricing and potential ${desired_price_point || 'premium'} pricing:

**Top 20% Customers**: Who would pay ${price_point_current} with minimal objections?
- Demographics (be hyper-specific about age, income, location, profession)
- Psychographics (values, beliefs, lifestyle patterns)
- Key characteristics that differentiate them

**Power 4% Segment**: Within that top 20%, identify the 4% who would:
- Pay ${desired_price_point || 'premium pricing'} without hesitation
- Refer others enthusiastically
- Complete the program successfully
- Provide powerful testimonials

For this Power 4%:
- Exact demographics (age range, income bracket, location clusters, professions)
- Psychographics (core values, beliefs, lifestyle, media consumption)
- Buying frequency (how often they invest in ${preferred_market_category} solutions)
- Lifetime value estimate
- What makes them DIFFERENT from average customers?

# OUTPUT FORMAT

Return ONLY a valid JSON object with this exact structure:

\`\`\`json
{
  "market_growth_rate": "X% annually (2024-2025)",
  "market_size_2024": "$X billion/million",
  "market_size_2025_projected": "$X billion/million",
  "bleeding_neck_problem": "Specific description of the most urgent problem...",
  "purchasing_power": {
    "average_household_income": "$XXX,XXX - $XXX,XXX",
    "discretionary_spending": "$X,XXX - $XX,XXX per year for ${preferred_market_category} solutions"
  },
  "targetability": {
    "platform_fit": "Facebook/Instagram/LinkedIn - explain why",
    "targeting_interests": ["interest 1", "interest 2", "interest 3", "interest 4", "interest 5"],
    "targeting_behaviors": ["behavior 1", "behavior 2", "behavior 3"],
    "difficulty_score": 7
  },
  "top_20_percent": {
    "demographics": "Specific age range, income bracket, locations, professions...",
    "psychographics": "Core values, beliefs, lifestyle patterns...",
    "characteristics": "What makes them willing to pay ${price_point_current}..."
  },
  "power_4_percent": {
    "demographics": "Ultra-specific description - age, income, exact locations, professions...",
    "psychographics": "Deep values, beliefs, lifestyle, media habits, aspirations...",
    "buying_frequency": "How often they invest in similar solutions (e.g., every 6 months, annually)",
    "lifetime_value": "$XX,XXX - $XXX,XXX over 3-5 years",
    "differentiation": "Specific traits that separate them from the top 20% - why they'd pay ${desired_price_point || 'premium'} vs ${price_point_current}"
  }
}
\`\`\`

# CRITICAL REQUIREMENTS

- Use REAL market data from 2024-2025 research
- Be SPECIFIC with numbers, percentages, dollar amounts
- NO placeholders or generic statements
- Demographics must include: age ranges, income brackets, specific locations, exact professions
- Psychographics must include: actual values, beliefs, lifestyle details
- Targeting data must be usable for real Facebook/Instagram campaigns
- Power 4% segment must be clearly differentiated from top 20%

Return only the JSON object, no additional commentary.`;
}
