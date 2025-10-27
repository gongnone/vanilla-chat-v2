# Content Strategy Generator - API Documentation

**Last Updated**: January 27, 2025
**Version**: 1.0
**Endpoint**: `POST /api/content/stage/17`

---

## Overview

The Content Strategy Generator API (Stage 17) creates strategic content pillar recommendations based on market research and offer positioning data. It returns 3-5 content pillars with example topics, content mix framework, and strategic rationale.

**Use Case**: After completing market research (Stages 1-6) and optionally offer design (Stages 7-13), generate a content strategy that aligns with your buyer psychology and business positioning.

---

## Endpoint

```
POST /api/content/stage/17
```

### Headers

```http
Content-Type: application/json
```

### Authentication

No authentication required (public API).

### Rate Limiting

- No explicit rate limits implemented
- AI generation takes 3-4 minutes per request
- Natural throttling via generation time

---

## Request Format

### Request Body

```typescript
interface ContentStrategyRequest {
  context: BusinessContext;       // Required: Business information
  stage1: Stage1MarketAnalysis;   // Required: Market analysis data
  stage2: Stage2BuyerPsychology;  // Required: Buyer psychology data
  stage7?: Stage7OfferRationale;  // Optional: Offer rationale (recommended)
  stage8?: Stage8ValueStack;      // Optional: Value stack (recommended)
}
```

### Request Example

```json
{
  "context": {
    "business_name": "Ashley Shaw Consulting",
    "current_offer_description": "Executive coaching for women in tech leadership roles",
    "niche": "Executive coaching for women in tech leadership",
    "specialization_keywords": "leadership development, executive presence, career acceleration",
    "business_stage": "growth",
    "revenue_range": "100k-500k",
    "preferred_market_category": "wealth",
    "target_market_hypothesis": "High-achieving women in tech aged 35-50",
    "target_demographics": "Women aged 35-50, earning $150K-$300K in tech",
    "target_psychographics": "High achievers driven by impact and legacy",
    "biggest_customer_pain_point": "Hit a career ceiling despite exceptional performance",
    "service_type": "coaching",
    "delivery_format": "1:1",
    "price_point_current": "$15,000",
    "offer_duration": "6 months",
    "unique_mechanism": "Leadership Breakthrough Accelerator"
  },
  "stage1": {
    "market_growth_rate": "10.2% annually",
    "market_size_2024": "$4.2 billion",
    "market_size_2025_projected": "$4.7 billion",
    "bleeding_neck_problem": "Undervalued, overlooked, and underpromoted women in tech leadership",
    "purchasing_power": {
      "average_household_income": "$275,000-$425,000",
      "discretionary_spending": "$10,000-$20,000 per year"
    },
    "targetability": {
      "platform_fit": "Facebook and Instagram",
      "targeting_interests": ["leadership development", "career advancement"],
      "targeting_behaviors": ["high-income professionals"],
      "difficulty_score": 8
    },
    "top_20_percent": {
      "demographics": "Women aged 38-48, Directors/VPs in tech",
      "psychographics": "Value personal growth, leadership development",
      "characteristics": "Highly motivated, results-driven"
    },
    "power_4_percent": {
      "demographics": "Women aged 40-45, earning $300K-$450K, VPs/Senior Managers",
      "psychographics": "Driven by impact and legacy, value authenticity",
      "buying_frequency": "Every 12-24 months for high-ticket coaching",
      "lifetime_value": "$50,000-$100,000",
      "differentiation": "Willing to invest in themselves"
    }
  },
  "stage2": {
    "top_fears": [
      {
        "name": "Being Found Out",
        "quote": "I'm terrified someone will realize I don't belong here"
      },
      {
        "name": "Hitting Ceiling",
        "quote": "I've done everything right but keep getting passed over"
      },
      {
        "name": "Burning Out",
        "quote": "I can't keep working this hard to prove myself"
      }
    ],
    "top_desires": [
      {
        "name": "Recognition & Respect",
        "aspirational_quote": "I want my contributions valued without having to fight for it"
      },
      {
        "name": "C-Suite Role",
        "aspirational_quote": "I'm ready for the VP or C-suite role I've earned"
      },
      {
        "name": "Authentic Leadership",
        "aspirational_quote": "I want to lead powerfully without sacrificing who I am"
      }
    ],
    "buyer_language": [
      { "exact_phrase": "I feel like I'm working twice as hard to get half the credit" },
      { "exact_phrase": "They told me I need more 'executive presence' but won't tell me what that means" },
      { "exact_phrase": "I'm the only woman in the room and it's exhausting" }
    ]
  },
  "stage7": {
    "recommended_unique_mechanism": {
      "mechanism_name": "Leadership Breakthrough Accelerator",
      "core_promise": "Break through career ceiling to C-suite in 6-12 months without burnout",
      "positioning_angle": "Only coaching program designed specifically for women in tech leadership",
      "why_it_works": "Combines strategic career planning with executive presence development"
    }
  },
  "stage8": {
    "value_components": [
      { "component_name": "1:1 Executive Coaching", "perceived_value": "$18,000" },
      { "component_name": "Group Mastermind Access", "perceived_value": "$6,000" },
      { "component_name": "Career Acceleration Playbook", "perceived_value": "$2,000" },
      { "component_name": "Executive Presence Framework", "perceived_value": "$3,000" }
    ],
    "total_perceived_value": "$29,000"
  }
}
```

### Required Fields

**Minimum Required**:
- `context` - All 16 business context fields
- `stage1` - Complete market analysis data
- `stage2` - Complete buyer psychology data (top fears, desires, language)

**Recommended (Not Required)**:
- `stage7` - Offer rationale with unique mechanism
- `stage8` - Value stack components

**Why Offer Data is Recommended**: Including `stage7` and `stage8` aligns content pillars with your unique mechanism and offer positioning, creating more targeted and effective content strategy. Without offer data, pillars are still high-quality but more generic.

---

## Response Format

### Success Response

**Status Code**: `200 OK`

**Content-Type**: `application/json`

**Response Body**:

```typescript
interface ContentPillarStrategy {
  pillar_count: number;                    // Number of pillars generated (3-5)
  pillars: ContentPillar[];                // Array of content pillars
  content_mix_framework: ContentMixFramework;  // Content type distribution
  strategic_rationale: string;             // Why this strategy works
  competitive_differentiation: string;     // How content stands out
}

interface ContentPillar {
  pillar_name: string;                     // Pillar title (e.g., "Authority Building")
  description: string;                     // What this pillar covers
  audience_value: string;                  // Why audience cares about this
  business_goal: string;                   // How it drives business results
  buyer_psychology_tie: string;            // Fear/desire it addresses
  example_topics: string[];                // 10-15 content topic ideas
  frequency_percentage: number;            // Recommended % of total content (0-100)
}

interface ContentMixFramework {
  educational: number;     // % of how-to guides, tutorials (0-100)
  entertaining: number;    // % of stories, case studies (0-100)
  promotional: number;     // % of product features, offers (0-100)
  engagement: number;      // % of questions, polls (0-100)
}
```

### Response Example

```json
{
  "pillar_count": 4,
  "pillars": [
    {
      "pillar_name": "Authority Building",
      "description": "Establish expertise and thought leadership in tech leadership through data-driven insights, industry analysis, and frameworks that position you as the go-to authority for women breaking through the leadership ceiling.",
      "audience_value": "Learn cutting-edge leadership strategies that actually work for women in tech, backed by research and real-world results—not generic advice that ignores gender dynamics.",
      "business_goal": "Position as the category leader and build trust before leads ever book a call. Content that educates establishes credibility and separates you from coaches offering surface-level advice.",
      "buyer_psychology_tie": "Addresses fear: 'Being Found Out' (imposter syndrome). When you consistently deliver expert-level insights, your audience sees you as the credible authority they can trust to guide their career transformation.",
      "example_topics": [
        "5 leadership mistakes that sabotage women in tech (and how to fix them)",
        "How to command respect in male-dominated meetings without being 'too aggressive'",
        "The executive presence formula: what it really means and how to develop it",
        "Why traditional leadership advice fails women in tech (and what works instead)",
        "How to negotiate a VP promotion when you're told you're 'not ready yet'",
        "The hidden bias in performance reviews and how to overcome it",
        "Career acceleration roadmap: Director to VP in 12-18 months",
        "How to build executive visibility without self-promotion feeling 'braggy'",
        "Strategic career planning for women in tech: beyond hard work",
        "The politics of promotion: navigating unwritten rules as a woman",
        "How to position yourself for C-suite roles (even if you don't think you're ready)",
        "Building executive presence in virtual leadership roles",
        "The confidence gap: why high achievers still doubt themselves",
        "How to ask for what you're worth (salary, equity, promotions)",
        "Leading with authenticity: balancing 'fitting in' with standing out"
      ],
      "frequency_percentage": 30
    },
    {
      "pillar_name": "Transformation Stories",
      "description": "Share real client success stories, case studies, and before-and-after transformations that demonstrate the power of strategic coaching and prove what's possible when women get the right support.",
      "audience_value": "See yourself in these stories and envision your own transformation. Real examples of women who've broken through the same ceiling you're facing—proof that it's possible for you too.",
      "business_goal": "Build emotional connection and desire. Transformation stories are the most powerful sales tool because they show the 'after' state your audience desperately wants. They also overcome skepticism by providing social proof.",
      "buyer_psychology_tie": "Addresses desire: 'C-Suite Role' (achieving the promotion they've earned). Stories of women going from Director to VP or VP to C-suite create belief that it's achievable with the right guidance.",
      "example_topics": [
        "How Sarah went from 'not ready' to VP in 9 months (full breakdown)",
        "The Director who tripled her salary by fixing one positioning mistake",
        "From imposter syndrome to C-suite: Jennifer's leadership transformation",
        "How Maria negotiated a $75K raise without changing jobs",
        "The overlooked Senior Manager who became the youngest female VP",
        "Breaking the burnout cycle: how Lisa achieved work-life integration at the VP level",
        "Client spotlight: navigating a male-dominated executive team with confidence",
        "How Emily built executive presence in 6 months (without faking it)",
        "The career pivot that led to a Chief of Staff role",
        "From 'too nice' to decisive leader: Rachel's transformation",
        "How Anna went from imposter syndrome to mentoring the next generation",
        "Client success: landing a board seat while still a VP",
        "The surprising strategy that helped Claire break through the ceiling",
        "How one conversation changed Jessica's entire career trajectory",
        "From undervalued to undeniable: transformation stories from the trenches"
      ],
      "frequency_percentage": 25
    },
    {
      "pillar_name": "Practical Strategies",
      "description": "Actionable tactics, frameworks, and step-by-step guides that your audience can implement immediately to advance their careers. Quick wins that build trust and demonstrate your expertise.",
      "audience_value": "Get tactical advice you can use today—not theory, but practical steps that create real career momentum. Walk away from every piece of content with something actionable.",
      "business_goal": "Provide immediate value that builds goodwill and positions you as the go-to resource. Practical content generates the most engagement, shares, and saves—expanding your reach organically.",
      "buyer_psychology_tie": "Addresses fear: 'Hitting Ceiling' (stuck despite doing everything right). Practical strategies give your audience agency and hope—they can take action now rather than feeling helpless.",
      "example_topics": [
        "The 5-minute daily habit that builds executive presence over time",
        "How to prepare for promotion conversations (script included)",
        "The 3-step framework for commanding respect in meetings",
        "How to manage up effectively when your boss doesn't advocate for you",
        "Networking strategies for introverted leaders",
        "How to document your wins for performance reviews (template)",
        "The executive communication framework: speak like a VP",
        "How to navigate office politics without compromising your values",
        "Building visibility without bragging: 7 subtle tactics",
        "How to ask for feedback that actually helps you grow",
        "The strategic questions to ask before accepting a promotion",
        "How to build executive sponsors (not just mentors)",
        "Time management for high performers who feel overwhelmed",
        "How to delegate effectively when you're used to doing everything yourself",
        "The salary negotiation framework: scripts and strategies"
      ],
      "frequency_percentage": 30
    },
    {
      "pillar_name": "Industry Insights",
      "description": "Commentary on tech industry trends, culture shifts, and relevant news that impacts women in leadership. Position yourself as someone who understands the landscape and can help your audience navigate it.",
      "audience_value": "Stay ahead of industry shifts that affect your career. Understand the broader context of your challenges and how to position yourself for emerging opportunities.",
      "business_goal": "Showcase thought leadership and awareness of industry dynamics. This content attracts your ideal audience by demonstrating deep understanding of their world beyond just coaching tactics.",
      "buyer_psychology_tie": "Addresses fear: 'Burning Out' (exhaustion from working twice as hard). Industry insights validate their experience and show you understand the systemic challenges they face—not just individual ones.",
      "example_topics": [
        "The hidden cost of layoffs on women in tech leadership",
        "Why remote work changed the game for executive presence (for better and worse)",
        "The diversity pledge problem: why representation isn't the same as inclusion",
        "How AI is reshaping leadership roles in tech (and what it means for you)",
        "The return-to-office debate: what women leaders need to know",
        "Why 'culture fit' is often code for bias (and how to navigate it)",
        "The new rules of executive visibility in hybrid work environments",
        "Tech industry recession playbook: protecting and advancing your career",
        "Why mentorship programs fail women (and what works instead)",
        "The rise of fractional executives: new opportunities for women leaders",
        "How DEI budget cuts are impacting women in tech (and what to do about it)",
        "The generational shift: how Gen Z is changing tech leadership culture",
        "Why the 'pipeline problem' narrative needs to die",
        "The double-edged sword of being the 'first woman' in leadership",
        "Industry trends creating new opportunities for women in tech"
      ],
      "frequency_percentage": 15
    }
  ],
  "content_mix_framework": {
    "educational": 45,
    "entertaining": 25,
    "promotional": 20,
    "engagement": 10
  },
  "strategic_rationale": "Your content strategy is built around establishing authority while maintaining emotional connection. The heavy emphasis on Educational content (45%) positions you as a trusted expert, while Entertaining content (25%) through transformation stories creates desire and belief. Promotional content (20%) is woven in naturally without being pushy, and Engagement content (10%) keeps your community active. This mix balances trust-building with conversion—educational content brings them in, stories create desire, and strategic promotions convert them into clients.",
  "competitive_differentiation": "Unlike generic leadership coaches who recycle surface-level advice, your content speaks directly to the unique challenges women in tech face—from navigating male-dominated executive teams to overcoming imposter syndrome despite exceptional performance. Your pillars are rooted in buyer psychology (addressing specific fears around being found out, hitting a ceiling, and burning out) rather than generic topics. The Authority Building and Industry Insights pillars position you as a thought leader who understands systemic issues, not just individual tactics. And your Transformation Stories provide proof that your approach works specifically for women in tech, not just anyone seeking leadership development."
}
```

---

## Validation Rules

The API validates the response against the following rules:

### Pillar Count
- **Expected**: 3-5 pillars
- **Warning**: Logged if count < 3 or count > 5
- **Action**: Log warning, do not reject response

### Frequency Percentages
- **Expected**: Sum of all `frequency_percentage` values should equal ~100% (±5%)
- **Warning**: Logged if sum < 95% or sum > 105%
- **Action**: Log warning, do not reject response

### Example Topics Count
- **Expected**: 10-15 topics per pillar
- **Warning**: Logged if count < 10 or count > 15
- **Action**: Log warning, do not reject response

### Content Mix Framework
- **Expected**: Sum of all content mix values should equal 100%
- **Warning**: Logged if sum ≠ 100%
- **Action**: Log warning, do not reject response

**Note**: Validation warnings are logged but do not cause API failure. AI may occasionally deviate from specifications, and responses are still usable.

---

## Error Responses

### 400 Bad Request

**Missing Required Fields**:
```json
{
  "error": "Missing required field: context",
  "message": "Request must include business context, stage1 (market analysis), and stage2 (buyer psychology)"
}
```

**Invalid JSON**:
```json
{
  "error": "Invalid JSON",
  "message": "Request body must be valid JSON"
}
```

### 500 Internal Server Error

**AI Service Failure**:
```json
{
  "error": "AI service unavailable",
  "message": "Failed to generate content strategy. Please try again."
}
```

**Token Budget Overflow**:
```json
{
  "error": "Token budget exceeded",
  "message": "Input data too large. Try reducing research/offer data."
}
```

### 503 Service Unavailable

**AI Service Timeout**:
```json
{
  "error": "Request timeout",
  "message": "AI generation took too long. Please try again."
}
```

---

## Token Budget

### Context Window Limit

**Total Available**: 24,000 tokens

**Typical Breakdown**:
- Business Context: ~300 tokens
- Stage 1 (Market Analysis): ~1,500 tokens
- Stage 2 (Buyer Psychology): ~1,000 tokens
- Stage 7 (Offer Rationale): ~400 tokens (optional)
- Stage 8 (Value Stack): ~400 tokens (optional)
- Prompt Template: ~8,000 tokens
- **Total Input**: ~12,000 tokens

**Output**:
- Content Strategy JSON: ~3,000 tokens

**Buffer**: ~9,000 tokens unused

### Token Budget Management

**If you exceed the context window** (rare):
1. Reduce `stage1` data (remove less critical fields)
2. Reduce `stage2.buyer_language` to 5 phrases instead of 7
3. Omit `stage7` and `stage8` (optional fields)

**Token Estimation Formula**:
```typescript
const estimatedTokens = Math.ceil(JSON.stringify(request).length / 3.5);
```

**Example**:
- Request size: 10,000 characters
- Estimated tokens: 10,000 / 3.5 ≈ 2,857 tokens

---

## Performance

### Response Times

**Typical**:
- Generation: 3-4 minutes
- Network latency: <500ms
- **Total**: 3-4 minutes

**Maximum Observed**:
- Generation: 6-7 minutes (peak AI load)
- **Total**: 6-7 minutes

### Timeout

**No timeout implemented** - AI generation completes when ready.

**Best Practice**: Set client-side timeout to 10 minutes, then prompt user to retry if no response.

---

## Example cURL Request

```bash
curl -X POST https://vanilla-chat-demo-tmpl-al4.pages.dev/api/content/stage/17 \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "business_name": "Ashley Shaw Consulting",
      "current_offer_description": "Executive coaching for women in tech leadership roles",
      "niche": "Executive coaching for women in tech leadership",
      "specialization_keywords": "leadership development, executive presence, career acceleration",
      "business_stage": "growth",
      "revenue_range": "100k-500k",
      "preferred_market_category": "wealth",
      "target_market_hypothesis": "High-achieving women in tech aged 35-50",
      "target_demographics": "Women aged 35-50, earning $150K-$300K in tech",
      "target_psychographics": "High achievers driven by impact and legacy",
      "biggest_customer_pain_point": "Hit a career ceiling despite exceptional performance",
      "service_type": "coaching",
      "delivery_format": "1:1",
      "price_point_current": "$15,000",
      "offer_duration": "6 months",
      "unique_mechanism": "Leadership Breakthrough Accelerator"
    },
    "stage1": {
      "market_growth_rate": "10.2% annually",
      "market_size_2024": "$4.2 billion",
      "bleeding_neck_problem": "Undervalued, overlooked women in tech",
      "power_4_percent": {
        "demographics": "Women 40-45, $300K-$450K, VPs",
        "lifetime_value": "$50,000-$100,000"
      }
    },
    "stage2": {
      "top_fears": [
        {"name": "Being Found Out", "quote": "I'\''m terrified someone will realize I don'\''t belong here"}
      ],
      "top_desires": [
        {"name": "C-Suite Role", "aspirational_quote": "I'\''m ready for the VP role I'\''ve earned"}
      ],
      "buyer_language": [
        {"exact_phrase": "I feel like I'\''m working twice as hard to get half the credit"}
      ]
    }
  }'
```

---

## Integration Examples

### JavaScript/TypeScript

```typescript
async function generateContentStrategy(data: ContentStrategyRequest): Promise<ContentPillarStrategy> {
  const response = await fetch('/api/content/stage/17', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Usage
const strategy = await generateContentStrategy({
  context: { /* business context */ },
  stage1: { /* market analysis */ },
  stage2: { /* buyer psychology */ }
});

console.log(`Generated ${strategy.pillar_count} pillars`);
strategy.pillars.forEach(pillar => {
  console.log(`- ${pillar.pillar_name} (${pillar.frequency_percentage}%)`);
});
```

### Python

```python
import requests
import json

def generate_content_strategy(data):
    url = "https://vanilla-chat-demo-tmpl-al4.pages.dev/api/content/stage/17"
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, json=data, timeout=600)
    response.raise_for_status()

    return response.json()

# Usage
strategy = generate_content_strategy({
    "context": { # business context },
    "stage1": { # market analysis },
    "stage2": { # buyer psychology }
})

print(f"Generated {strategy['pillar_count']} pillars")
for pillar in strategy['pillars']:
    print(f"- {pillar['pillar_name']} ({pillar['frequency_percentage']}%)")
```

---

## Best Practices

### 1. Include Complete Data

**Do**: Include all required fields with complete, accurate data
**Don't**: Send partial or placeholder data

**Why**: AI quality depends on data quality. Incomplete data = generic output.

### 2. Include Offer Data When Available

**Do**: Include `stage7` and `stage8` for aligned content strategy
**Don't**: Omit offer data if you have it

**Why**: Offer data aligns content with your unique mechanism, creating more targeted pillars.

### 3. Handle Long Generation Times

**Do**: Show progress indicators, allow 5-7 minutes before timeout
**Don't**: Use aggressive timeouts (<3 minutes)

**Why**: AI generation is inherently variable in time. Premature timeouts cause failed requests.

### 4. Validate Responses Gracefully

**Do**: Log validation warnings but use response anyway
**Don't**: Reject responses that slightly deviate from specs

**Why**: AI may occasionally generate 6 pillars or 95% frequency sum. Still usable content.

### 5. Cache Responses

**Do**: Store responses in LocalStorage or database for reuse
**Don't**: Regenerate on every page load

**Why**: Regeneration costs $0.02 and takes 3-4 minutes. Cache for efficiency.

### 6. Export for Backup

**Do**: Provide JSON export functionality to users
**Don't**: Rely solely on browser storage

**Why**: LocalStorage can be cleared. Exports provide backup and portability.

---

## Changelog

### v1.0 (January 27, 2025)

**Initial Release**:
- POST /api/content/stage/17 endpoint
- 3-5 content pillar generation
- Content mix framework
- Strategic rationale and competitive differentiation
- Validation rules with graceful degradation
- Token budget management within 24K context window

---

## Support & Feedback

**Issues**: Report bugs or request features via GitHub Issues
**Questions**: Check User Guide (`CONTENT-STRATEGY-USER-GUIDE.md`) first
**API Changes**: Breaking changes will be versioned (v2.0, v3.0, etc.)

---

**Document Version**: 1.0
**Last Updated**: January 27, 2025
**Maintained By**: Development Team
