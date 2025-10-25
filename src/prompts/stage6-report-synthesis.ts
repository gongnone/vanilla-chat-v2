import { BusinessContext } from "../types";
import { CompleteResearchData } from "../types/research-stages";

export function buildStage6ReportSynthesisPrompt(
  context: BusinessContext,
  researchData: CompleteResearchData
): string {
  const { business_name } = context;

  // Helper to safely stringify JSON sections
  const safeStringify = (obj: any) => JSON.stringify(obj, null, 2);

  return `You are a professional market intelligence report writer. Your task is to transform the structured research data into a comprehensive, client-ready Market Intelligence Report for ${business_name}.

# BUSINESS CONTEXT

**Business:** ${business_name}

# COMPLETE RESEARCH DATA

You have access to ALL research from the previous 5 stages. Your job is to synthesize this into a professional markdown report.

## Stage 1: Market Analysis
\`\`\`json
${safeStringify(researchData.stage1_market_analysis)}
\`\`\`

## Stage 2: Buyer Psychology
\`\`\`json
${safeStringify(researchData.stage2_buyer_psychology)}
\`\`\`

## Stage 3: Competitive Analysis
\`\`\`json
${safeStringify(researchData.stage3_competitive_analysis)}
\`\`\`

## Stage 4: Avatar Creation
\`\`\`json
${safeStringify(researchData.stage4_avatar_creation)}
\`\`\`

## Stage 5: Offer Design
\`\`\`json
${safeStringify(researchData.stage5_offer_design)}
\`\`\`

# YOUR TASK

Create a comprehensive Market Intelligence Report in markdown format that pulls data from ALL stages above.

## Report Structure

Use this exact structure and fill EVERY section with the actual data from the JSON above:

---

# Market Intelligence Report: ${business_name}

## Executive Summary

[Write 300-400 word executive summary covering:
- Market opportunity (growth rate, size from Stage 1)
- Power 4% customer profile (demographics from Stage 1 & 4)
- Key buyer insights (top fears/desires from Stage 2)
- Competitive positioning (UVP from Stage 3)
- Recommended offer strategy (core offer from Stage 5)
- First campaign recommendation (from Stage 5)]

---

## 1. Market Validation & Opportunity

### Market Growth & Size
- **Current Market Size (2024):** [from Stage 1]
- **Projected Market Size (2025):** [from Stage 1]
- **Growth Rate:** [from Stage 1]
- **Market Health:** [Analysis of whether this meets the 9%+ growth threshold]

### Bleeding Neck Problem
[from Stage 1 - explain the urgent problem in detail]

### Purchasing Power Analysis
- **Average Household Income:** [from Stage 1]
- **Discretionary Spending:** [from Stage 1]
- **Investment Capacity:** [Analysis from Stage 1]

### Targetability Score
- **Platform Fit:** [from Stage 1]
- **Difficulty Score:** [from Stage 1] / 10
- **Targeting Interests:** [list from Stage 1]
- **Behavioral Targeting:** [list from Stage 1]

---

## 2. Customer Segmentation

### Top 20% Customer Profile
**Demographics:** [from Stage 1]

**Psychographics:** [from Stage 1]

**Key Characteristics:** [from Stage 1]

### Power 4% Dream Customer Profile
**Demographics:** [from Stage 1]

**Psychographics:** [from Stage 1]

**Buying Frequency:** [from Stage 1]

**Lifetime Value:** [from Stage 1]

**What Makes Them Different:** [from Stage 1]

---

## 3. Buyer Psychology Deep-Dive

### Buyer Language Intelligence
[Create a table with these columns: Exact Phrase | Meaning | Emotional Tone | Marketing Application]
[Use ALL 10-15 phrases from Stage 2]

### Fear Analysis
[For each of the 3-5 fears from Stage 2, create a subsection:]

#### Fear: [Name]
- **Intensity:** [X/10]
- **Buyer Quote:** "[quote]"
- **Root Emotion:** [emotion]
- **Purchase Blocker:** [blocker]
- **How Offer Addresses:** [solution]

### Desire Analysis
[For each of the 3-5 desires from Stage 2, create a subsection:]

#### Desire: [Name]
- **Intensity:** [X/10]
- **Aspirational Quote:** "[quote]"
- **Deeper Meaning:** [meaning]
- **Timeline Expectation:** [timeline]
- **Willingness to Pay:** [amount]
- **How Business Delivers:** [delivery]

### Major Pain Points
[For each of the 5 pain points from Stage 2, create a subsection:]

#### Pain Point: [Frustration]
- **Buyer Quote:** "[quote]"
- **Root Emotion:** [emotion]
- **What They've Tried:** [solutions]
- **Why It Didn't Work:** [reasons]
- **How Unique Mechanism Solves:** [solution]

### Barriers to Purchase
**Internal Barriers:**
[List all internal barriers from Stage 2 with objection handling scripts]

**External Barriers:**
[List all external barriers from Stage 2 with objection handling scripts]

### Price Justification
[Full price justification analysis from Stage 2]

---

## 4. Competitive Intelligence

### Competitor Matrix
[Create a table with columns: Competitor | Price | Positioning | Strengths | Weaknesses | Target Audience]
[Use ALL competitors from Stage 3]

### Positioning Gap Analysis
[List ALL positioning gaps from Stage 3 as bullet points]

### Differentiation Opportunities
[List ALL differentiation opportunities from Stage 3 as bullet points]

### Unique Value Proposition
[UVP from Stage 3]

### Competitive Pricing Landscape
[Full competitive pricing analysis from Stage 3]

### Why This Business Wins
[List ALL 5-7 reasons from Stage 3 as bullet points]

---

## 5. Dream Customer Avatar: [Avatar Name from Stage 4]

### Demographics Profile
[Create detailed profile from Stage 4 demographics object]

### Psychographic Profile
**Core Values:**
[List all values from Stage 4]

**Beliefs About Niche:**
[from Stage 4]

**Daily Lifestyle:**
[from Stage 4]

**Media Consumption:**
[List all media from Stage 4]

### A Day in the Life of [Avatar Name]

#### Morning Routine
[Full narrative from Stage 4]

#### Workday Experience
[Full narrative from Stage 4]

#### Evening Routine
[Full narrative from Stage 4]

#### Weekend Routine
[Full narrative from Stage 4]

#### Pain Point Moments
[List ALL 5-7 moments from Stage 4]

### Buying Triggers & Optimal Contact
**Best Contact Days:** [from Stage 4]

**Best Contact Times:** [from Stage 4]

**Decision-Making Windows:** [from Stage 4]

**Platform Preferences:** [from Stage 4]

**Content Format Preferences:** [from Stage 4]

### Online Community Intelligence
[For EACH community from Stage 4, create a detailed subsection with all fields]

### Avatar Summary
**Top 3 Hopes:** [from Stage 4]

**Top 3 Fears:** [from Stage 4]

**Top 3 Barriers:** [from Stage 4 with solutions]

**Recommended Communication Tone:** [from Stage 4]

**Price Sensitivity:** [from Stage 4 with justification]

---

## 6. Offer Design & Pricing Strategy

### Core Offer: [Offer Name from Stage 5]

**Target Outcome:** [from Stage 5]

**Pain Points Solved:**
[List all from Stage 5]

**Desires Delivered:**
[List all from Stage 5]

**Unique Positioning:**
[from Stage 5]

### 3-Tier Pricing Model

[For EACH tier from Stage 5, create a detailed section:]

#### Tier [X]: [Tier Name] [if recommended, add "⭐ RECOMMENDED"]
**Price:** [price]

**Best For:** [description]

**Deliverables:**
[List ALL deliverables]

### Payment Plan Options
[Create a table with columns: Plan Name | Structure | Total Cost]
[Use ALL payment plans from Stage 5]

### Marketing Messages

**Pain-Based Messages:**
[List all 5 pain-based messages with headlines and usage from Stage 5]

**Desire-Based Messages:**
[List all 5 desire-based messages with headlines and usage from Stage 5]

**Curiosity-Based Messages:**
[List all 5 curiosity messages with headlines and usage from Stage 5]

### Risk-Reversal Guarantee
[Full guarantee text from Stage 5]

**Why This Works:**
[Explanation from Stage 5]

### Irresistible Bonuses
[For EACH bonus from Stage 5, create a subsection:]

#### Bonus: [Name] ([Value])
- **Addresses Desire:** [desire]
- **How It Speeds Results:** [explanation]

---

## 7. First Campaign Strategy

### Recommended Launch Campaign

**Platform:** [from Stage 5]

**Lead Message:** [from Stage 5]

**Offer Configuration:** [from Stage 5]

**Launch Timeline:** [from Stage 5]

---

## 8. Strategic Recommendations & Next Steps

### Immediate Actions (Week 1-2)
1. [Action based on offer design]
2. [Action based on avatar research - join communities, etc.]
3. [Action based on competitive analysis]
4. [Action based on buyer psychology]
5. [Action based on first campaign]

### Short-Term Strategy (Month 1-3)
1. [Strategic recommendation]
2. [Strategic recommendation]
3. [Strategic recommendation]

### Long-Term Vision (Month 4-12)
1. [Strategic recommendation]
2. [Strategic recommendation]
3. [Strategic recommendation]

### Success Metrics to Track
- [Metric from market analysis]
- [Metric from buyer psychology]
- [Metric from competitive positioning]
- [Metric from offer performance]

---

## Appendix: Research Methodology

This Market Intelligence Report was generated through a comprehensive 6-stage research process:

1. **Market Validation:** Growth rate, market size, purchasing power, Power 4% segmentation
2. **Buyer Psychology:** Language extraction, fear/desire analysis, pain point research
3. **Competitive Intelligence:** Competitor analysis, positioning gaps, differentiation opportunities
4. **Avatar Creation:** Detailed persona development with day-in-life narratives
5. **Offer Design:** Pricing strategy, messaging, bonuses, guarantees
6. **Report Synthesis:** Integration of all research into actionable intelligence

All data is based on 2024-2025 market research and real buyer intelligence.

---

**Generated:** [Current Date]
**For:** ${business_name}

# CRITICAL REQUIREMENTS

- **USE ALL DATA:** Every section must be filled with actual data from the JSON provided
- **NO PLACEHOLDERS:** Never use [Fear 1], [Competitor 2], etc. - use the actual names and data
- **EXACT QUOTES:** Use the exact buyer quotes, messages, and language from the research
- **COMPLETE TABLES:** All tables must have every row filled with real data
- **FULL NARRATIVES:** Day-in-life sections must use the complete narratives from Stage 4
- **ALL LISTS:** When research provides 5-7 items, include ALL of them, not just 2-3
- **SPECIFIC NUMBERS:** Use exact dollar amounts, percentages, dates from research
- **PROFESSIONAL FORMATTING:** Use proper markdown with headers, tables, bold, lists
- **ACTIONABLE:** Strategic recommendations must be specific and based on research

The client should be able to USE this report immediately without needing any additional information.

Return ONLY the complete markdown report, no additional commentary or meta-text.`;
}
