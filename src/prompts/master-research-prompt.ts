import { BusinessContext } from "../types";

export function buildMasterPrompt(context: BusinessContext): string {
  const {
    // Step 1 fields
    business_name,
    current_offer_description,
    niche,
    specialization_keywords,
    business_stage,
    revenue_range,
    preferred_market_category,

    // Step 2 fields
    target_market_hypothesis,
    target_demographics,
    target_psychographics,
    current_customers_description,
    biggest_customer_pain_point,

    // Step 3 fields
    service_type,
    delivery_format,
    price_point_current,
    desired_price_point,
    offer_duration,
    unique_mechanism,
    competitors_offers
  } = context;

  const keywords = specialization_keywords
    ? specialization_keywords.split(',').map(k => k.trim()).filter(k => k).join(', ')
    : '';

  return `You are a world-class market research analyst and business strategist with expertise in ${preferred_market_category} markets. You specialize in creating comprehensive, actionable market research reports that lead directly to profitable offer design.

# BUSINESS CONTEXT

**Business Name:** ${business_name}
**Niche:** ${niche}
**Specialization:** ${keywords || 'General'}
**Stage:** ${business_stage} (${revenue_range} annual revenue)
**Market Category:** ${preferred_market_category}

**Current Offer:**
${current_offer_description}
- Type: ${service_type}
- Format: ${delivery_format}
- Price: ${price_point_current}
- Duration: ${offer_duration}
- Unique Mechanism: ${unique_mechanism}

**Target Market Hypothesis:**
${target_market_hypothesis}

**Demographics:** ${target_demographics}
**Psychographics:** ${target_psychographics}
${current_customers_description ? `**Current Customers:** ${current_customers_description}` : ''}
**Biggest Pain Point:** ${biggest_customer_pain_point}

${competitors_offers ? `**Competitive Landscape:** ${competitors_offers}` : ''}
${desired_price_point ? `**Desired New Price Point:** ${desired_price_point}` : ''}

---

# YOUR TASK

Create a comprehensive market research report that will enable ${business_name} to design an irresistible high-ticket offer. Execute the following research phases with EXTREME specificity and actionability.

**CRITICAL INSTRUCTIONS:**
- Use the business context above to inform EVERY answer
- Reference specific details from the context in your analysis
- Make connections between different data points
- Prioritize actionability over theory
- Use real-world examples similar to this business
- Be specific about numbers, demographics, and psychographics
- Output should be 8,000-12,000 words of high-value insights

---

# PHASE 1: MARKET VALIDATION & POWER 4% ANALYSIS

## 1.1 Market Opportunity Assessment

Given that ${business_name} operates in the ${niche} space within the ${preferred_market_category} market category, analyze:

- **Market Growth Rate:** Is the ${niche} market growing at minimum 9%? Provide 2024-2025 data.
- **Bleeding Neck Problem:** What is the MOST urgent, painful problem that ${target_market_hypothesis} face? (Reference: "${biggest_customer_pain_point}")
- **Purchasing Power:** What is the average household income and discretionary spending of ${target_demographics}?
- **Targetability:** How easy is it to reach ${target_market_hypothesis} on Facebook/Instagram? What interests, behaviors, or lookalike audiences work best?

## 1.2 Revenue Concentration Analysis (Power 4%)

Based on the current price point of ${price_point_current} and ${delivery_format} delivery:

- **Top 20% Customers:** Who are the customers that would pay ${price_point_current} with minimal objections?
- **Power 4%:** Within that 20%, identify the 4% who would:
  - Pay ${desired_price_point || 'premium pricing'}
  - Refer others enthusiastically
  - Complete the program successfully
  - Provide powerful testimonials

**For each group, describe:**
- Demographics (be hyper-specific)
- Psychographics (values, beliefs, lifestyle)
- Buying frequency and lifetime value
- What differentiates them from average customers

---

# PHASE 2: DEMOGRAPHIC VALIDATION & COMMUNITY ECOSYSTEM

## 2.1 Evidence-Based Demographic Profile

Search recent (2023-2025) market data for ${niche} targeting ${target_market_hypothesis}:

- **Age Range & Gender:** Validate or refine "${target_demographics}"
- **Income Clusters:** Specific income ranges most likely to pay ${price_point_current}
- **Education & Profession:** Most common education levels and career types
- **Location:** Geographic clusters (urban/suburban/rural, specific cities/regions)
- **Family Status:** Relationship/parenting stage relevance
- **Lifestyle Patterns:** Daily routines, hobbies, media consumption

**Connect to Business:** How does this demographic profile align with ${business_name}'s unique mechanism of "${unique_mechanism}"?

## 2.2 Community Ecosystem Scan

Where does ${target_market_hypothesis} spend time online and offline?

Provide **specific, active examples** with member counts:

**Online Communities:**
- Facebook Groups (names + member counts + engagement level)
- LinkedIn Groups or hashtags
- Reddit subreddits (subscriber counts + top posts)
- Discord servers or Slack communities
- Quora topics with high activity
- Instagram hashtags with engagement

**Content Channels:**
- YouTube channels they subscribe to (subscriber counts)
- Podcasts they listen to (episode downloads)
- Influencers they follow (follower counts + engagement rates)
- Blogs or Substacks they read

**Offline Spaces:**
- Events, conferences, or meetups
- Local communities or organizations
- Professional associations

**For each space:**
- Why does the audience trust it?
- What's the tone and cultural norms?
- What topics get the most engagement?
- Include 3-5 real post titles or discussion themes

**Advertising Opportunity:** Based on ${current_offer_description}, which communities are best for targeted ads?

---

# PHASE 3: LANGUAGE & EMOTIONAL INTELLIGENCE

## 3.1 Market Vernacular Extraction

Extract EXACT language that ${target_market_hypothesis} use when discussing "${biggest_customer_pain_point}" and related desires.

**Sources to reference:**
- Reddit threads about ${niche}
- Amazon reviews of competitors${competitors_offers ? ` (${competitors_offers})` : ''}
- Quora answers about ${preferred_market_category} and ${niche}
- Facebook posts in relevant groups
- YouTube comments on ${niche} videos

**Output Format:**
| Term/Phrase | Meaning/Context | Emotional Tone | Usage Frequency |
|-------------|-----------------|----------------|-----------------|
| [exact quote] | [what it means] | Fear/Hope/Frustration/Pride | High/Medium/Low |

**Include at least 15 phrases** that ${business_name} should use in marketing copy.

**Application:** Show how to mirror this language in ads, landing pages, and sales conversations for ${business_name}.

## 3.2 Pain Point Scan with Real Quotes

Find what ${target_market_hypothesis} complain about most related to "${biggest_customer_pain_point}".

**Top 5 Frustrations:**
1. [Frustration with exact quote or close paraphrase]
   - Root emotion: [fear/guilt/overwhelm/shame]
   - What they've tried: [products/coaches/methods that failed]
   - Why it didn't work: [specific reasons]
   - How ${unique_mechanism} solves this differently

[Repeat for frustrations 2-5]

**Gap Analysis:** How does ${current_offer_description} at ${price_point_current} fill the gap competitors miss?

## 3.3 Hopes, Dreams & Desires (Promised Land)

What aspirational outcomes does ${target_market_hypothesis} post about?

**Top 5 Emotional Desires:**
1. [Desire with exact quote]
   - What achieving this represents: [freedom/validation/balance/impact/security]
   - Timeline expectation: [how fast they want results]
   - Willingness to pay: [price sensitivity for this desire]
   - Connection to ${business_name}: [how your offer delivers this]

[Repeat for desires 2-5]

**Price Justification:** Given these desires, justify why ${desired_price_point || price_point_current} is a NO-BRAINER investment.

## 3.4 Fear Matrix & Barriers

**5 Surface Fears:**
1. [Fear] - [Quote] - Intensity (1-10): X
   - How to address in sales copy

[Repeat for fears 2-5]

**5 Core Fears:**
1. [Identity/failure/rejection/regret fear] - [Quote] - Intensity (1-10): X
   - Deep psychological driver
   - How ${unique_mechanism} addresses this

[Repeat for fears 2-5]

**Internal Barriers:**
- Limiting beliefs about ${niche}
- Shame or impostor syndrome
- Past failures with ${competitors_offers || 'similar offers'}

**External Barriers:**
- Time constraints (${delivery_format} compatibility)
- Budget objections (${price_point_current} justification)
- Skepticism about ${service_type}
- Partner/family buy-in needed

**Objection Handling Script:** For each barrier, write a 2-3 sentence reframe that ${business_name} can use.

---

# PHASE 4: BEHAVIORAL SYNTHESIS & AVATAR CREATION

## 4.1 Day-in-the-Life Behavioral Map

Create a detailed narrative of a typical day for ${target_market_hypothesis} based on ${target_demographics} and ${target_psychographics}:

**Morning (5am-9am):**
- Wake-up routine and emotional state
- First activities and stress triggers
- Media consumption patterns
- Decision fatigue moments

**Workday (9am-5pm):**
- Professional responsibilities
- Breaks and coping mechanisms
- Stress accumulation points
- When they research solutions like ${current_offer_description}

**Evening (5pm-10pm):**
- Family/personal time
- Reflections on ${biggest_customer_pain_point}
- When they scroll social media (ad timing!)
- Decision-making windows

**Best Times for Ads/Emails:**
- Optimal days and times to reach them
- Platform preferences (Facebook/Instagram/Email)
- Content format preferences (video/text/image)

## 4.2 Dream Buyer Avatar (Narrative Persona)

Integrate ALL findings into a 500-word story of the Dream Buyer.

**Include:**
- Name (archetypal), age, profession, income, family
- Core desires (from Phase 3.3)
- Core fears (from Phase 3.4)
- Daily behaviors (from Phase 4.1)
- Exact phrases they use (from Phase 3.1)
- What transformation they crave
- Why ${unique_mechanism} is perfect for them
- Why they'd pay ${desired_price_point || price_point_current}

**Make it feel like a real case study** with emotional texture.

## 4.3 Avatar Summary Card

| Attribute | Details |
|-----------|---------|
| **Name** | [Archetypal name] |
| **Demographics** | [One-line summary] |
| **Top 3 Hopes** | 1. [Hope]<br>2. [Hope]<br>3. [Hope] |
| **Top 3 Fears** | 1. [Fear]<br>2. [Fear]<br>3. [Fear] |
| **Top 3 Barriers** | 1. [Barrier]<br>2. [Barrier]<br>3. [Barrier] |
| **Key Phrases** | "[Phrase 1]", "[Phrase 2]", "[Phrase 3]" |
| **Best Channels** | [Platform 1, Platform 2, Platform 3] |
| **Tone of Voice** | [Empathetic/Authoritative/Aspirational/etc.] |
| **Price Sensitivity** | [High/Medium/Low] - Justification |

---

# PHASE 5: COPY STRATEGY & MESSAGING

## 5.1 Hook & Headline Generator

Using EXACT buyer language from Phase 3.1, generate:

**5 Pain-Based Headlines:**
1. [Headline ≤15 words using buyer language]
2. [Headline ≤15 words using buyer language]
3. [Headline ≤15 words using buyer language]
4. [Headline ≤15 words using buyer language]
5. [Headline ≤15 words using buyer language]

**5 Desire-Based Headlines:**
1. [Promise the transformation using buyer language]
2. [Promise the transformation using buyer language]
3. [Promise the transformation using buyer language]
4. [Promise the transformation using buyer language]
5. [Promise the transformation using buyer language]

**5 Curiosity Hooks:**
1. [Pattern interrupt + emotion]
2. [Pattern interrupt + emotion]
3. [Pattern interrupt + emotion]
4. [Pattern interrupt + emotion]
5. [Pattern interrupt + emotion]

**Application:** Show how each would work in Facebook ads for ${business_name}.

## 5.2 Cognitive Dissonance Audit

Identify 3-5 contradictions between what ${target_market_hypothesis} SAY they want and what their BEHAVIOR shows:

**Contradiction 1:**
- What they say: "[Quote from research]"
- What they actually do: [Behavioral pattern]
- Psychological driver: [Why the gap exists]
- Reframe for ${business_name}: [How to ethically address this in marketing]

[Repeat for contradictions 2-5]

---

# PHASE 6: GODFATHER OFFER DESIGN

## 6.1 Core Offer Recommendation

Based on ALL research above, what should ${business_name}'s new high-ticket offer be?

**Recommended Offer Structure:**
- **Name:** [Compelling offer name]
- **Target Outcome:** [Specific, measurable transformation]
- **Ideal For:** [Power 4% profile from Phase 1.2]
- **Solves:** [Top 3 pain points from Phase 3.2]
- **Delivers:** [Top 3 desires from Phase 3.3]
- **Unique Mechanism:** [Enhanced version of "${unique_mechanism}"]
- **Format:** [1:1/group/hybrid with reasoning]
- **Duration:** [Optimal timeline based on research]
- **Price Point:** [Recommended price with justification]

## 6.2 Value Stack & Perceived Value

**Core Program Components:**
| Component | Normal Value | Benefit Statement | Proof |
|-----------|--------------|-------------------|-------|
| [Module 1] | $X,XXX | [Quick benefit] | [Testimonial/screenshot] |
| [Module 2] | $X,XXX | [Quick benefit] | [Testimonial/screenshot] |
| [Module 3] | $X,XXX | [Quick benefit] | [Testimonial/screenshot] |
| [Module 4] | $X,XXX | [Quick benefit] | [Testimonial/screenshot] |

**Total Stacked Value:** $XX,XXX

**Actual Price:** ${desired_price_point || price_point_current}

**Savings:** $XX,XXX (XX% discount)

## 6.3 Irresistible Bonuses

**5 Premium Bonuses:**
1. **[Bonus Name]** (Value: $X,XXX)
   - Type: Tangible/Digital/Experiential
   - Directly aligns with: [Core desire from Phase 3.3]
   - Speeds up results by: [Specific timeframe]
   - Why they want it: [Emotional driver]

[Repeat for bonuses 2-5]

## 6.4 Power Guarantee

**3 Guarantee Options:**

**Option A: Time-Based**
[30-day/6-month guarantee with specific terms]

**Option B: Performance-Based**
"If you [complete X steps] and don't [achieve Y specific outcome] within [Z timeframe], we'll [refund/continue working/specific remedy]."

**Option C: Conditional**
"If you [meet these criteria] and don't get [specific result], [specific resolution]."

**Recommended:** [Which option and why based on ${service_type} and ${business_stage}]

## 6.5 Pricing Strategy

**3-Tier Model (Good/Better/Best):**

**Tier 1: [Name]** - $X,XXX
- [Core deliverables]
- Best for: [Specific avatar subset]
- Psychological purpose: [Anchor/entry point]

**Tier 2: [Name]** - $X,XXX ⭐ MOST POPULAR
- [Enhanced deliverables]
- Best for: [Power 4% profile]
- Psychological purpose: [Sweet spot]

**Tier 3: [Name]** - $X,XXX
- [Premium deliverables + VIP access]
- Best for: [Ultra-premium buyers]
- Psychological purpose: [Status/fastest results]

**Payment Plans:**
1. Pay in Full: [Price] (save [amount])
2. Split Pay: [X payments of Y]
3. [Custom plan based on ${delivery_format}]

## 6.6 Scarcity & Urgency

**3 Genuine Scarcity Mechanisms:**
1. [Limited spots/deadline/bonus expiration]
   - Believability: High/Medium
   - Ad copy: "[One-liner for ads]"

2. [Second mechanism]
   - Believability: High/Medium
   - Ad copy: "[One-liner for ads]"

3. [Third mechanism]
   - Believability: High/Medium
   - Ad copy: "[One-liner for ads]"

## 6.7 Offer Paragraph (Sales Copy)

Write the complete offer paragraph that includes:
- What they get
- Anchored value ($XX,XXX value)
- Actual price reveal (dramatic)
- Guarantee reinforcement
- No-brainer CTA

**Use buyer language from Phase 3.1 and emotional drivers from Phase 3.3.**

---

# OUTPUT FORMAT: PROFESSIONAL MARKET INTELLIGENCE REPORT

Now synthesize ALL the research above into a professional, client-facing Market Intelligence Report with this exact structure:

---

# MARKET INTELLIGENCE REPORT
## ${business_name} - Comprehensive Market Analysis

*Generated: [Today's Date]*
*Market Category: ${preferred_market_category} | Niche: ${niche}*

---

## 📋 EXECUTIVE SUMMARY

[Provide a compelling 3-4 paragraph overview covering:]

**Market Opportunity:** [One paragraph on ${niche} market viability with 2024-2025 growth data from Phase 1.1]

**Dream Buyer Profile:** [One paragraph Power 4% avatar summary from Phase 1.2 - who will pay ${desired_price_point || price_point_current}]

**Core Recommendation:** [One paragraph offer strategy and positioning from Phase 6.1]

**Strategic Advantage:** [One paragraph on why ${business_name} is uniquely positioned with "${unique_mechanism}" compared to ${competitors_offers || 'competitors'}]

**Recommended Action:** [One sentence immediate next step for ${business_name}]

---

## 📚 RESEARCH SOURCES & METHODOLOGY

**Research Methods Used:**
- Market analysis of ${niche} industry (2023-2025 data)
- Competitive landscape review: ${competitors_offers || 'industry standards and alternatives'}
- Buyer psychology analysis for ${target_market_hypothesis}
- Community ecosystem scan (Reddit, Facebook, Quora, industry forums)
- Buyer language extraction from ${preferred_market_category} discussions

**Data Sources Cited:**
- Industry reports: [List specific reports referenced - MarketsandMarkets, Statista, industry publications]
- Community platforms analyzed: [Specific subreddits, Facebook groups, podcasts, YouTube channels from Phase 2.2]
- Competitive analysis: [Specific competitors and their price points researched]
- Demographic data: [Census data, income statistics, geographic trends from Phase 2.1]

**Methodology:**
- Analyzed buyer language patterns from online discussions about ${biggest_customer_pain_point}
- Extracted pain points and desires from community conversations
- Identified cognitive dissonance between stated wants vs observed behaviors
- Mapped customer journey for ${target_demographics} targeting ${niche} solutions
- Validated findings against current customer patterns ${current_customers_description ? `from ${business_name}'s existing clients` : ''}

**Research Confidence Level:** [High/Medium - explain based on data availability and market maturity]

---

## 💡 KEY INSIGHTS

### Top 5 Customer Fears:
[From Phase 3.4 - present with intensity ratings and solutions]

1. **[Fear Name]** (Intensity: X/10)
   - **Direct Quote:** "[Real or paraphrased quote from buyer research]"
   - **Purchase Blocker:** [How this fear prevents buying decision]
   - **How ${unique_mechanism} Addresses It:** [Specific solution from ${business_name}]

[Repeat for fears 2-5, using exact findings from Phase 3.4]

### Top 5 Customer Desires:
[From Phase 3.3 - present with emotional drivers]

1. **[Desire Name]**
   - **Aspirational Quote:** "[What they say they want from research]"
   - **Deeper Meaning:** [Freedom/validation/balance/impact/security it represents]
   - **Timeline Expectation:** [How fast they want results]
   - **How ${business_name} Delivers:** [Connection to offer and ${unique_mechanism}]

[Repeat for desires 2-5, using exact findings from Phase 3.3]

### Critical Contradictions (Cognitive Dissonance):
[From Phase 5.2 - present as strategic opportunities]

**Contradiction 1:**
- **What They Say:** "[Quote from research]"
- **What They Actually Do:** [Behavioral pattern observed]
- **Strategic Opportunity for ${business_name}:** [How to ethically address this gap in messaging]

[Repeat for contradictions 2-3 from Phase 5.2]

### Buyer Language Lexicon:
[From Phase 3.1 - create quick reference table of exact phrases]

| Exact Phrase Used | Emotional Tone | Usage Frequency | Marketing Application |
|------------------|----------------|-----------------|----------------------|
| "[Buyer Quote 1]" | Fear/Hope/Frustration/Pride | High/Medium/Low | [Where/how ${business_name} should use it] |
| "[Buyer Quote 2]" | Fear/Hope/Frustration/Pride | High/Medium/Low | [Where/how to use it] |

[Include 10-15 top phrases from Phase 3.1 research]

---

## 👤 DREAM BUYER PROFILE: "Power 4%" Avatar

### Demographics:
- **Archetypal Name:** [Sarah, Michael, etc. - from Phase 4.2]
- **Age Range:** [Specific range from Phase 2.1]
- **Household Income:** [Range that can afford ${price_point_current}]
- **Geographic Location:** [Clusters from Phase 2.1]
- **Profession/Industry:** [Career types from Phase 2.1]
- **Family Status:** [Relationship/parenting stage relevant to ${niche}]

### Psychographics:
- **Core Values:** [3-5 values from ${target_psychographics} and Phase 4.2]
- **Beliefs About ${niche}:** [What they believe about the problem and solutions]
- **Daily Lifestyle:** [Summary from Phase 4.1]
- **Media Consumption:** [Where they spend time online/offline from Phase 2.2]

### A Day in Their Life:
[500-word narrative story from Phase 4.1 - make it vivid, relatable, and reference ${biggest_customer_pain_point}]

### Buying Triggers & Best Times to Reach:
- **Optimal Contact Days/Times:** [From Phase 4.1 behavioral analysis]
- **Decision-Making Windows:** [When they're most likely to buy from Phase 4.1]
- **Platform Preferences:** [Facebook/Instagram/Email priority order from Phase 2.2]
- **Content Format:** [Video/text/image preferences from Phase 2.2]

### Quick Reference Card:
[From Phase 4.3 - Avatar Summary Card]

| Attribute | Details |
|-----------|---------|
| **Top 3 Hopes** | 1. [Hope from Phase 3.3]<br>2. [Hope from Phase 3.3]<br>3. [Hope from Phase 3.3] |
| **Top 3 Fears** | 1. [Fear from Phase 3.4]<br>2. [Fear from Phase 3.4]<br>3. [Fear from Phase 3.4] |
| **Top 3 Barriers** | 1. [Barrier from Phase 3.4] → [How to overcome]<br>2. [Barrier] → [Solution]<br>3. [Barrier] → [Solution] |
| **Best Marketing Channels** | [Platform 1, Platform 2, Platform 3 from Phase 2.2] |
| **Recommended Tone** | [Empathetic/Authoritative/Aspirational from research] |
| **Price Sensitivity** | [High/Medium/Low based on ${revenue_range}] - [Justification] |

---

## 🎯 MESSAGING & OFFER OPPORTUNITIES

### Recommended Core Offer
[From Phase 6.1 - Core Offer Recommendation]

**Offer Name:** "${business_name} [Compelling Name Based on ${unique_mechanism}]"

**Target Outcome:** [Specific, measurable transformation for ${target_market_hypothesis}]

**Directly Solves These Pain Points:**
1. [Pain from Key Insights above]
2. [Pain from Key Insights above]
3. [Pain from Key Insights above]

**Delivers These Desires:**
1. [Desire from Key Insights above]
2. [Desire from Key Insights above]
3. [Desire from Key Insights above]

**Unique Positioning:** [Enhanced version of "${unique_mechanism}" that addresses the market gap left by ${competitors_offers || 'current alternatives'}]

### Pricing Strategy (3-Tier Model):
[From Phase 6.5 - Good/Better/Best pricing]

**Tier 1: [Name]** - $X,XXX
- [Core deliverables]
- Best for: [Specific avatar subset]
- Psychological purpose: [Anchor/entry point]

**Tier 2: [Name]** - $X,XXX ⭐ RECOMMENDED FOR POWER 4%
- [Enhanced deliverables]
- Best for: Dream buyer profile above
- Psychological purpose: [Sweet spot]

**Tier 3: [Name]** - $X,XXX
- [Premium deliverables + VIP access]
- Best for: Ultra-premium buyers seeking fastest results
- Psychological purpose: [Status/exclusivity]

**Payment Plans:** [From Phase 6.5]
1. Pay in Full: [Price] (save [amount])
2. Split Pay: [X payments of Y]
3. [Custom plan based on ${delivery_format}]

### Marketing Message Testing Kit:

**5 Pain-Based Headlines** (using EXACT buyer language from Phase 3.1):
1. [Headline ≤15 words]
2. [Headline ≤15 words]
3. [Headline ≤15 words]
4. [Headline ≤15 words]
5. [Headline ≤15 words]

**5 Desire-Based Headlines** (promising transformation):
1. [Promise using buyer language]
2. [Promise using buyer language]
3. [Promise using buyer language]
4. [Promise using buyer language]
5. [Promise using buyer language]

**5 Curiosity Hooks** (pattern interrupt):
1. [Hook + emotion]
2. [Hook + emotion]
3. [Hook + emotion]
4. [Hook + emotion]
5. [Hook + emotion]

### Power Guarantee (Risk Reversal):
[From Phase 6.4 - select best option]

**Recommended Guarantee:** "[Performance-based or time-based guarantee that directly addresses the #1 fear from Key Insights]"

**Why It Works:** [Specifically addresses the objection/fear and builds trust for ${business_name}]

### Irresistible Bonuses:
[From Phase 6.3 - aligned with desires]

1. **[Bonus Name]** (Value: $X,XXX)
   - Directly addresses: [Desire from Key Insights]
   - Speeds up results by: [Specific timeline]
   - Why they want it: [Emotional driver]

[List 3-5 premium bonuses that align with top desires]

### First Campaign to Launch:

**Platform:** [Top channel from Dream Buyer Profile]
**Message:** "[Winning hook from Marketing Message Testing Kit above]"
**Offer Configuration:** Tier 2 with [specific bonuses]
**Launch Timeline:** Within [timeframe] for maximum market impact

---

## ✅ NEXT STEPS: 30-Day Action Plan for ${business_name}

### Week 1: Foundation & Validation
- [ ] **Validate Offer Positioning:** Test Tier 2 messaging with 5-10 current/past customers
- [ ] **Create Landing Page:** Build page using pain-based headline #[X] from above
- [ ] **Set Up Analytics:** Implement tracking for campaign testing and conversion measurement
- [ ] **Prepare Marketing Assets:** Design ads featuring buyer language from Lexicon

### Week 2: Market Testing & Launch
- [ ] **Launch Campaign 1:** Run ads on [platform] using [specific hook] targeting ${target_market_hypothesis}
- [ ] **A/B Test Headlines:** Test pain-based vs desire-based messaging
- [ ] **Gather Buyer Feedback:** Survey responses to validate Key Insights accuracy
- [ ] **Monitor Objections:** Track common questions/hesitations for sales script refinement

### Week 3: Optimization & Expansion
- [ ] **Analyze Initial Results:** Review conversion rates, cost per lead, objection patterns
- [ ] **Refine Winning Messages:** Double down on highest-performing headlines/hooks
- [ ] **Expand to Channel 2:** Launch on second-priority platform from Dream Buyer Profile
- [ ] **Test Guarantee Language:** A/B test guarantee presentation for maximum risk reversal

### Week 4: Scale Preparation
- [ ] **Document Winning Formula:** Codify what's working for repeatable success
- [ ] **Plan Tier 3 Launch:** Create premium offering for high-performers wanting VIP experience
- [ ] **Build Referral System:** Leverage Power 4% customers for word-of-mouth growth
- [ ] **Optimize Sales Process:** Streamline based on learnings to improve close rate

### Immediate Priority Actions (Do This Week):
1. **[Specific action tailored to ${business_name} and ${business_stage}]**
2. **[Specific action based on ${niche} market dynamics]**
3. **[Specific action leveraging "${unique_mechanism}" advantage]**

### Critical Success Metrics to Track:
- **Conversion Rate:** ${target_market_hypothesis} vs other segments (target: [X]%)
- **Average Deal Size:** Target ${desired_price_point || price_point_current}
- **Customer Acquisition Cost:** By channel (benchmark: [X]% of LTV)
- **Time to Close:** Benchmark against ${offer_duration} program length
- **Referral Rate:** Especially from Power 4% customers (target: [X]%)

---

## 📊 QUICK REFERENCE APPENDIX

**Power 4% Profile in One Sentence:** [From Phase 1.2]

**Top 3 Pain Points + How to Address in Sales:**
- [Pain 1] → [Sales script reframe]
- [Pain 2] → [Sales script reframe]
- [Pain 3] → [Sales script reframe]

**Top 3 Desires + How Offer Delivers:**
- [Desire 1] → [Specific delivery mechanism via ${unique_mechanism}]
- [Desire 2] → [How offer provides this]
- [Desire 3] → [How offer provides this]

**Best Marketing Channels (Priority Order):**
1. [Channel] - [Why it works + specific targeting strategy]
2. [Channel] - [Why it works + specific targeting strategy]
3. [Channel] - [Why it works + specific targeting strategy]

**Recommended Offer Summary:**
- **Name:** [Compelling offer name]
- **Price Point:** ${desired_price_point || price_point_current}
- **Format:** ${delivery_format} delivered over ${offer_duration}
- **Guarantee:** [One sentence from Phase 6.4]
- **Unique Selling Proposition:** ${unique_mechanism}

**First Marketing Message to Test:** "[Copy the #1 winning hook from Marketing Message Testing Kit]"

---

# CRITICAL FORMATTING REQUIREMENTS:

- Use markdown formatting with clear heading hierarchy (H1, H2, H3)
- Include emoji section headers exactly as shown (📋 📚 💡 👤 🎯 ✅ 📊)
- **Bold** all key insights, buyer quotes, and critical recommendations
- Use tables for all comparative data and quick references
- Include specific numbers, percentages, and prices throughout every section
- Reference ${business_name} naturally in every major section
- Make content highly scannable with bullet points and short paragraphs
- Total output should be 7,000-10,000 words of actionable, high-value insights
- Professional, client-ready tone suitable for business presentation
- Ensure all data points connect back to business context provided

**BEGIN THE PROFESSIONAL MARKET INTELLIGENCE REPORT NOW:**
`;
}
