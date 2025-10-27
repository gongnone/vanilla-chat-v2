# Strategic Offer Design Generator - Implementation Guide

## Current Status: Phase 1 & 2.1 Complete ✅

**Completed Components:**
- ✅ Type definitions (`src/types/offer-preferences.ts`)
- ✅ Form component (`src/components/offer-design-form.tsx`)
- ✅ Client-side logic (`public/static/offer-design.js`)
- ✅ Route integration (`/offer-design` in `src/index.tsx`)
- ✅ Research data extractor (`src/prompts/research-data-extractor.ts`)

**Token Budget Status:**
- Extraction helper: ~700-750 tokens (within 850 target ✅)
- Allows ~5,500-6,000 tokens for prompt instructions
- Allows 2,500 tokens for AI output
- Total per stage: <9,000 tokens (well within 24K limit)

---

## Phase 2.2-2.3: Build 7 Prompt Functions

### Overview
Create prompt builders for Stages 7-13. Each prompt will:
1. Import `extractEssentialResearchData()` helper
2. Use inline value extraction (NOT `JSON.stringify`)
3. Include user preferences guidance
4. Define clear JSON output structure
5. Stay within token budget (<6,000 tokens for instructions)

### Stage 7: Offer Rationale

**File:** `src/prompts/stage7-offer-rationale.ts`

**Purpose:** Generate 3-5 credible rationale options for why this generous offer exists

**Key Inputs from User Preferences:**
- `strategic_priorities` - align rationale with business goals
- `proprietary_frameworks` - reference unique IP
- `pricing_strategy` - match rationale to pricing approach

**JSON Output Structure:**
```typescript
{
  selected_rationale: string; // Most credible option
  rationale_options: Array<{
    name: string; // e.g., "Introductory Launch"
    explanation: string; // 50-100 words
    credibility_score: number; // 1-10
    excitement_score: number; // 1-10
  }>;
  positioning_statement: string; // 100-150 words
}
```

**Token Budget:** ~7,500 total (5,000 prompt + 2,500 output)

**Template:**
```typescript
import type { BusinessContext } from "../types";
import type { CompleteResearchData } from "../types/research-stages";
import type { OfferGenerationPreferences } from "../types/offer-preferences";
import { extractEssentialResearchData } from "./research-data-extractor";

export function buildStage7OfferRationalePrompt(
  context: BusinessContext,
  research: CompleteResearchData,
  preferences: OfferGenerationPreferences
): string {
  const researchSummary = extractEssentialResearchData(research);

  return `You are a strategic offer design consultant specializing in creating credible, compelling rationales for premium offers.

# BUSINESS CONTEXT
Business: ${context.business_name}
Niche: ${context.niche}
Current Offer: ${context.current_offer_description.substring(0, 200)}...
Unique Mechanism: ${context.unique_mechanism}

# RESEARCH INSIGHTS
${researchSummary}

# USER STRATEGIC PRIORITIES
Primary Goals: ${preferences.strategic_priorities.join(', ')}
Proprietary IP: ${preferences.proprietary_frameworks}
Pricing Strategy: ${preferences.pricing_strategy}

# YOUR TASK
Create 3-5 rationale options explaining WHY you're making this generous offer.

Each rationale must:
- Sound logical and credible (not hype or BS)
- Align with strategic priorities: ${preferences.strategic_priorities[0]}
- Reference unique frameworks/IP when relevant
- Be specific to this business (not generic)

RATIONALE CATEGORIES TO CONSIDER:
1. Introductory launch (testing market, building case studies)
2. Case study round (collecting testimonials for growth)
3. Testing new version (validating improvements)
4. Cutting out middlemen (direct-to-customer savings)
5. Industry positioning (anti-scam, transparency focus)
6. Capacity filling (limited spots, optimize schedule)
7. Strategic partnership (cross-promotion opportunity)

For EACH rationale provide:
- name: Category name
- explanation: Why this offer exists (50-100 words)
- credibility_score: 1-10 (how believable is this?)
- excitement_score: 1-10 (how exciting for buyer?)

Then SELECT the highest combined score as your recommended rationale.

Finally, write a positioning_statement (100-150 words) that:
- Uses the selected rationale
- References buyer language: "${research.stage2_buyer_psychology.buyer_language[0]?.exact_phrase}"
- Addresses top fear: "${research.stage2_buyer_psychology.top_fears[0]?.name}"
- Promises top desire: "${research.stage2_buyer_psychology.top_desires[0]?.name}"

# OUTPUT FORMAT
Return ONLY valid JSON matching this structure:

\`\`\`json
{
  "selected_rationale": "Case Study Round",
  "rationale_options": [
    {
      "name": "Case Study Round",
      "explanation": "We're selecting 10 committed professionals to document their transformation journey. In exchange for detailed feedback and permission to share your results, you get our premium program at 40% off standard pricing. This helps us build proof while you get exceptional value.",
      "credibility_score": 9,
      "excitement_score": 8
    },
    {
      "name": "Introductory Launch",
      "explanation": "...",
      "credibility_score": 7,
      "excitement_score": 6
    }
  ],
  "positioning_statement": "You've told us you feel overwhelmed and need a proven system. We're opening 10 spots for our Case Study Round where you'll get the full Executive Time Mastery program at an introductory price. Why? We're documenting real transformations to prove what's possible when busy leaders implement our framework. You get results. We get proof. Everyone wins."
}
\`\`\`

# CRITICAL REQUIREMENTS
- All rationales must be SPECIFIC and CREDIBLE
- Reference actual business context (not generic templates)
- Positioning statement must use BUYER LANGUAGE from research
- NO placeholder text or generic statements
- Return only JSON, no commentary

Return the JSON now.`;
}
```

**Validation Checklist:**
- [ ] Imports all required types
- [ ] Uses `extractEssentialResearchData()` helper
- [ ] Prompt length: ~5,000 tokens (17,500 chars)
- [ ] References user preferences (3+ fields)
- [ ] Uses research insights (buyer language, fears, desires)
- [ ] JSON structure clearly defined
- [ ] Build succeeds without errors
- [ ] Test with mock data validates structure

---

### Stage 8: Value Stack

**File:** `src/prompts/stage8-value-stack.ts`

**Purpose:** Create value stack with proof elements for each component

**Key Inputs:**
- `unique_tools_resources` - what deliverables to include
- `exclusive_access` - community/support elements
- `proof_assets_available` - what proof types to reference

**JSON Output:**
```typescript
{
  value_elements: Array<{
    name: string;
    normal_price: string; // e.g., "$497"
    benefit_statement: string;
    proof: string; // Testimonial snippet, stat, or case study reference
  }>;
  total_stacked_value: string; // e.g., "$12,497"
  presentation_script: string; // How to present value stack (200 words)
}
```

**Token Budget:** ~8,500 total

**Key Prompt Sections:**
1. Business context + user unique assets
2. Research insights (top desires, proof justification)
3. Instructions for value element creation
4. Proof integration guidance (use available assets)
5. Value anchoring psychology
6. Presentation script template

---

### Stage 9: 3-Tier Pricing Framework

**File:** `src/prompts/stage9-pricing-framework.ts`

**Purpose:** Design Good/Better/Best pricing with psychological positioning

**Key Inputs:**
- `comfortable_price_range` - min/max boundaries
- `pricing_strategy` - value-based, premium, or competitive
- Research: Power 4% LTV, price sensitivity, competitive analysis

**JSON Output:**
```typescript
{
  entry_tier: {
    tier_name: string;
    price: string;
    deliverables: string[]; // 5-8 items
    best_for: string;
    psychological_positioning: string;
  };
  core_tier: {
    // Same structure, mark as recommended
    is_recommended: true;
  };
  deluxe_tier: {
    // Same structure
  };
  pricing_psychology: string; // Why this structure works
  daily_equivalent: string; // e.g., "Less than $2/day"
  comparison_item: string; // e.g., "Less than daily Starbucks"
}
```

**Token Budget:** ~9,500 total (largest prompt)

**Critical Elements:**
- Respect user price range boundaries
- Use Power 4% LTV as anchor for core tier
- Reference competitive pricing analysis
- Apply pricing strategy (value-based math)
- Decoy pricing psychology (make core tier obvious choice)

---

### Stage 10: Payment Plans

**File:** `src/prompts/stage10-payment-plans.ts`

**Purpose:** Create 2-3 flexible payment options

**Key Inputs:**
- `emphasize_components` - check for "payment_flexibility"
- Research: Avatar price sensitivity, purchasing power

**JSON Output:**
```typescript
{
  payment_options: Array<{
    name: string; // e.g., "Pay in Full", "3-Month Plan"
    structure: string; // "$3,000 down + $1,000/mo x 6"
    total_cost: string; // "$9,000"
    justification: string; // Why this plan exists (1 sentence)
    discount_or_premium: string; // "Save $500" or "Adds $500"
  }>;
  recommended_default: string; // Which plan to pre-select
}
```

**Token Budget:** ~7,500 total

---

### Stage 11: Premium Bonuses

**File:** `src/prompts/stage11-premium-bonuses.ts`

**Purpose:** Design 3-5 irresistible bonuses that speed results

**Key Inputs:**
- `unique_tools_resources` - source material for bonuses
- Research: Top desires (bonuses must deliver these)
- `primary_transformation` - bonuses accelerate this

**JSON Output:**
```typescript
{
  bonuses: Array<{
    name: string;
    type: 'tangible' | 'digital' | 'experiential';
    value: string; // Dollar amount
    benefit: string; // One-sentence value prop
    speeds_results_how: string; // How it accelerates transformation
    addresses_desire: string; // Which top desire from research
  }>;
  value_stack_order: string[]; // Order to present bonuses for max impact
}
```

**Token Budget:** ~8,000 total

**Bonus Quality Criteria:**
1. MUST speed path to primary transformation
2. MUST address a specific desire from Stage 2
3. MUST have clear dollar value
4. MUST be perceived as valuable (not fluff)
5. Bonus #1 should be "implementation accelerator"

---

### Stage 12: Power Guarantee

**File:** `src/prompts/stage12-power-guarantee.ts`

**Purpose:** Create guarantee options that reverse risk

**Key Inputs:**
- `guarantee_risk_tolerance` - conservative/moderate/aggressive
- Research: Top fear #1 (guarantee must address this)
- `primary_transformation` - outcome to guarantee

**JSON Output:**
```typescript
{
  guarantee_options: Array<{
    type: 'time-based' | 'performance-based' | 'conditional';
    text: string; // Full guarantee statement (75-150 words)
    risk_level_to_you: string; // "Low", "Medium", "High"
    reassurance_level: string; // "Moderate", "Strong", "Extreme"
    addresses_fear: string; // Which fear from Stage 2
  }>;
  recommended_guarantee: string; // Full text of best option
  why_this_guarantee_works: string; // Psychology explanation (100 words)
}
```

**Token Budget:** ~8,000 total

**Guarantee Types by Risk Tolerance:**
- **Conservative:** 30-60 day money-back, simple refund
- **Moderate:** 90-day outcome-based, conditional on implementation
- **Aggressive:** Results guarantee + "keep working until success" clause

---

### Stage 13: Scarcity, Urgency, Order Bumps & Upsells

**File:** `src/prompts/stage13-scarcity-upsells.ts`

**Purpose:** Create urgency mechanisms + 3 order bumps ($27-$47) + 2 upsells ($97-$997)

**Key Inputs:**
- `emphasize_components` - check for urgency/scarcity emphasis
- `unique_tools_resources` - source for order bumps
- Research: Buyer triggers, platform preferences

**JSON Output:**
```typescript
{
  scarcity_mechanisms: Array<{
    type: string; // "Limited spots", "Deadline", "Bonus expiration"
    implementation: string; // How to implement genuinely
    ad_copy_line: string; // One-liner for ads/emails
  }>;
  order_bumps: Array<{
    name: string;
    price: string; // MUST be $27-$47
    value_proposition: string; // Why add at checkout (1 sentence)
    conversion_trigger: string; // Psychological hook
    speeds_results_how: string;
  }>; // Exactly 3
  upsells: Array<{
    name: string;
    price: string; // MUST be $97-$997
    value_proposition: string;
    best_presented_when: string; // "Immediately after purchase", "Day 7 email"
    amplifies_transformation_how: string;
  }>; // Exactly 2
}
```

**Token Budget:** ~10,000 total (most complex)

**Order Bump Requirements:**
- Complement main offer (not replace)
- Quick wins or implementation accelerators
- Price: $27 (intro), $37 (mid), $47 (premium)
- Source from user's unique tools/resources

**Upsell Requirements:**
- Upsell #1 ($97-$297): Amplify main transformation
- Upsell #2 ($497-$997): Premium add-on for Power 4%
- Present strategically (not aggressive)
- Reference buyer psychology

---

## Phase 3: Backend API Implementation

### 3.1: Create Stage Output Interfaces

**File:** `src/types/offer-stages.ts`

Copy JSON output structures from each prompt into TypeScript interfaces:

```typescript
export interface Stage7OfferRationale {
  selected_rationale: string;
  rationale_options: Array<{
    name: string;
    explanation: string;
    credibility_score: number;
    excitement_score: number;
  }>;
  positioning_statement: string;
}

export interface Stage8ValueStack {
  value_elements: Array<{
    name: string;
    normal_price: string;
    benefit_statement: string;
    proof: string;
  }>;
  total_stacked_value: string;
  presentation_script: string;
}

// ... interfaces for Stages 9-13

export interface CompleteOfferData {
  stage7_offer_rationale: Stage7OfferRationale;
  stage8_value_stack: Stage8ValueStack;
  stage9_pricing: Stage9Pricing;
  stage10_payment_plans: Stage10PaymentPlans;
  stage11_bonuses: Stage11Bonuses;
  stage12_guarantee: Stage12Guarantee;
  stage13_scarcity_upsells: Stage13ScarcityUpsells;
}
```

**Validation:**
- [ ] All interfaces compile
- [ ] Match JSON structures in prompts exactly
- [ ] Optional fields marked with `?`
- [ ] Arrays have proper element types

---

### 3.2: Implement 7 API Endpoints

**File:** `src/index.tsx` (add after existing research endpoints)

**Import Types and Prompts:**
```typescript
import type { CompleteOfferContext } from "./types/offer-preferences";
import type {
  Stage7OfferRationale,
  Stage8ValueStack,
  Stage9Pricing,
  Stage10PaymentPlans,
  Stage11Bonuses,
  Stage12Guarantee,
  Stage13ScarcityUpsells,
} from "./types/offer-stages";

import { buildStage7OfferRationalePrompt } from "./prompts/stage7-offer-rationale";
import { buildStage8ValueStackPrompt } from "./prompts/stage8-value-stack";
import { buildStage9PricingPrompt } from "./prompts/stage9-pricing-framework";
import { buildStage10PaymentPlansPrompt } from "./prompts/stage10-payment-plans";
import { buildStage11BonusesPrompt } from "./prompts/stage11-premium-bonuses";
import { buildStage12GuaranteePrompt } from "./prompts/stage12-power-guarantee";
import { buildStage13ScarcityUpsellsPrompt } from "./prompts/stage13-scarcity-upsells";
```

**Endpoint Pattern (reuse for all 7 stages):**
```typescript
// Stage 7: Offer Rationale
app.post("/api/offer/stage/7", async (c) => {
  try {
    const payload: CompleteOfferContext = await c.req.json();
    const { business_context, research_data, user_preferences } = payload;

    const prompt = buildStage7OfferRationalePrompt(
      business_context,
      research_data,
      user_preferences
    );

    const result: Stage7OfferRationale = await callAIStage(
      c,
      "Offer Rationale",
      7,
      prompt,
      2500, // Max output tokens
      RESEARCH_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 7 error:', error);
    return c.json({
      error: 'Stage 7 failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Stages 8-13: Follow exact same pattern
// Just change stage number, name, prompt builder, and interface
```

**Token Allocation by Stage:**
- Stage 7: 2,500 tokens output
- Stage 8: 2,500 tokens output
- Stage 9: 2,500 tokens output
- Stage 10: 2,000 tokens output
- Stage 11: 2,500 tokens output
- Stage 12: 2,500 tokens output
- Stage 13: 3,000 tokens output (largest - order bumps + upsells)

**Validation for Each Endpoint:**
- [ ] Endpoint compiles without TypeScript errors
- [ ] Correct prompt builder imported and called
- [ ] Correct output interface type
- [ ] Error handling includes try/catch
- [ ] Stage number in logs matches endpoint
- [ ] Test with curl:
  ```bash
  curl -X POST http://localhost:8788/api/offer/stage/7 \
    -H "Content-Type: application/json" \
    -d @test-offer-context.json
  ```

---

### 3.3: Create Test Data File

**File:** `test-offer-context.json`

Use actual research report from LocalStorage plus test preferences:

```json
{
  "business_context": {
    "business_name": "Test Business",
    "niche": "Tech coaching",
    ...
  },
  "research_data": {
    "stage1_market_analysis": { ... },
    "stage2_buyer_psychology": { ... },
    ...
  },
  "user_preferences": {
    "strategic_priorities": ["maximize_conversion_rate", "build_trust_authority"],
    "primary_transformation": "Achieve work-life balance without sacrificing career growth",
    "proof_assets_available": {
      "testimonials": true,
      "case_studies": true,
      "before_after": false,
      "certifications": true,
      "media_mentions": false
    },
    "pricing_strategy": "value-based",
    "comfortable_price_range": { "min": 5000, "max": 25000 },
    "proprietary_frameworks": "Time Mastery System™",
    "unique_tools_resources": "Custom time audit, templates, workbooks",
    "exclusive_access": "Private Slack community",
    "guarantee_risk_tolerance": "moderate",
    "emphasize_components": ["premium_bonuses", "results_guarantee"]
  }
}
```

---

### 3.4: Deploy Preview & Test Real AI

**Commands:**
```bash
# Build
npm run build

# Deploy preview
npm run preview:remote

# Monitor logs (in separate terminal)
npx wrangler pages deployment tail
```

**Test Each Stage:**
```bash
# Get preview URL from deployment output
PREVIEW_URL="https://abc123.vanilla-chat-v2.pages.dev"

# Test Stage 7
curl -X POST $PREVIEW_URL/api/offer/stage/7 \
  -H "Content-Type: application/json" \
  -d @test-offer-context.json | jq

# Verify:
# - HTTP 200 response
# - Valid JSON returned
# - Matches Stage7OfferRationale interface
# - No truncation (response completes)
# - Check logs for token usage

# Repeat for Stages 8-13
```

**Token Usage Validation (from logs):**
```
Expected log format:
📍 Stage 7: Offer Rationale - Starting...
  model: @cf/meta/llama-3.1-70b-instruct
  maxTokens: 2500
  estimatedInputTokens: 5234
  totalEstimatedTokens: 7734

✅ Stage 7: Offer Rationale - Complete
  totalTimeSeconds: 12
```

**Acceptance Criteria:**
- [ ] All 7 stages return HTTP 200
- [ ] All responses are valid JSON
- [ ] All responses match TypeScript interfaces
- [ ] No responses are truncated
- [ ] Token usage within budget for each stage:
  - Stage 7: <9,000 total
  - Stage 8: <10,000 total
  - Stage 9: <11,000 total
  - Stage 10: <8,500 total
  - Stage 11: <9,500 total
  - Stage 12: <9,000 total
  - Stage 13: <11,500 total
- [ ] No context window overflow errors
- [ ] Total generation time: 8-12 minutes for all stages

---

## Phase 4: Frontend Orchestration

### 4.1: Update Client-Side Logic

**File:** `public/static/offer-design.js`

Already has skeleton. Complete the `displayOfferResults()` function:

```javascript
function displayOfferResults(completeOffer) {
  document.getElementById('offer-loading-state').classList.add('hidden');
  document.getElementById('offer-output').classList.remove('hidden');

  const content = document.getElementById('offer-content');
  const { stages } = completeOffer;

  let html = '<div class="space-y-10">';

  // Stage 7: Offer Rationale
  html += `
    <section class="border-l-4 border-purple-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">📋 Offer Rationale</h2>
      <div class="bg-purple-50 p-6 rounded-lg mb-4">
        <p class="text-lg font-semibold mb-2">${stages.stage7.selected_rationale}</p>
        <p class="text-gray-700">${stages.stage7.positioning_statement}</p>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-900">View all rationale options</summary>
        <div class="mt-4 space-y-3">
          ${stages.stage7.rationale_options.map(opt => `
            <div class="border border-gray-200 p-4 rounded">
              <p class="font-semibold">${opt.name}</p>
              <p class="text-sm text-gray-600 mt-1">${opt.explanation}</p>
              <p class="text-xs text-gray-500 mt-2">
                Credibility: ${opt.credibility_score}/10 |
                Excitement: ${opt.excitement_score}/10
              </p>
            </div>
          `).join('')}
        </div>
      </details>
    </section>
  `;

  // Stage 8: Value Stack
  html += `
    <section class="border-l-4 border-blue-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">💎 Value Stack</h2>
      <div class="space-y-3 mb-4">
        ${stages.stage8.value_elements.map((el, i) => `
          <div class="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <p class="font-semibold">${i+1}. ${el.name}</p>
              <p class="text-sm text-gray-600 mt-1">${el.benefit_statement}</p>
              ${el.proof ? `<p class="text-xs text-gray-500 mt-2 italic">"${el.proof}"</p>` : ''}
            </div>
            <div class="ml-4 text-right">
              <p class="font-bold text-blue-600">${el.normal_price}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
        <p class="text-2xl font-bold text-center">
          Total Value: ${stages.stage8.total_stacked_value}
        </p>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-900">View presentation script</summary>
        <div class="mt-4 p-4 bg-gray-50 rounded">
          <p class="text-sm">${stages.stage8.presentation_script}</p>
        </div>
      </details>
    </section>
  `;

  // Stage 9: Pricing Framework
  html += `
    <section class="border-l-4 border-green-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">💰 Pricing Tiers</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        ${renderPricingTier(stages.stage9.entry_tier, 'Entry')}
        ${renderPricingTier(stages.stage9.core_tier, 'Recommended', true)}
        ${renderPricingTier(stages.stage9.deluxe_tier, 'Premium')}
      </div>
      <div class="bg-gray-50 p-4 rounded space-y-2 text-sm">
        <p><strong>Psychology:</strong> ${stages.stage9.pricing_psychology}</p>
        <p><strong>Daily Cost:</strong> ${stages.stage9.daily_equivalent}</p>
        <p><strong>Compare To:</strong> ${stages.stage9.comparison_item}</p>
      </div>
    </section>
  `;

  // Stage 10: Payment Plans
  html += `
    <section class="border-l-4 border-yellow-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">💳 Payment Plans</h2>
      <div class="space-y-4">
        ${stages.stage10.payment_options.map((plan, i) => `
          <div class="border-2 ${plan.name === stages.stage10.recommended_default ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'} p-4 rounded-lg">
            <p class="font-bold">${plan.name} ${plan.name === stages.stage10.recommended_default ? '⭐' : ''}</p>
            <p class="text-sm text-gray-700 mt-1">${plan.structure}</p>
            <p class="text-sm font-semibold mt-2">Total: ${plan.total_cost}</p>
            <p class="text-xs text-gray-500 mt-1">${plan.justification}</p>
            ${plan.discount_or_premium ? `<p class="text-xs font-semibold mt-1 text-green-600">${plan.discount_or_premium}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Stage 11: Premium Bonuses
  html += `
    <section class="border-l-4 border-pink-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">🎁 Premium Bonuses</h2>
      <div class="space-y-4">
        ${stages.stage11.bonuses.map((bonus, i) => `
          <div class="bg-pink-50 border-2 border-pink-200 p-5 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <p class="font-bold text-lg">Bonus #${i+1}: ${bonus.name}</p>
              <span class="bg-pink-500 text-white px-3 py-1 rounded text-sm font-semibold">${bonus.value}</span>
            </div>
            <p class="text-sm text-gray-700 mb-2"><strong>Type:</strong> ${bonus.type}</p>
            <p class="text-gray-700 mb-2">${bonus.benefit}</p>
            <p class="text-sm text-gray-600"><strong>Speeds Results:</strong> ${bonus.speeds_results_how}</p>
            <p class="text-xs text-gray-500 mt-2"><strong>Delivers:</strong> ${bonus.addresses_desire}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Stage 12: Power Guarantee
  html += `
    <section class="border-l-4 border-indigo-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">🛡️ Risk Reversal Guarantee</h2>
      <div class="bg-indigo-50 border-2 border-indigo-300 p-6 rounded-lg mb-4">
        <p class="text-lg font-semibold mb-3">Recommended Guarantee:</p>
        <p class="text-gray-800 leading-relaxed">${stages.stage12.recommended_guarantee}</p>
      </div>
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-semibold mb-2">Why This Works:</p>
        <p class="text-sm text-gray-700">${stages.stage12.why_this_guarantee_works}</p>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-gray-900">View all guarantee options</summary>
        <div class="mt-4 space-y-3">
          ${stages.stage12.guarantee_options.map(opt => `
            <div class="border border-gray-200 p-4 rounded">
              <p class="font-semibold">${opt.type}</p>
              <p class="text-sm text-gray-700 mt-2">${opt.text}</p>
              <div class="flex gap-4 mt-3 text-xs text-gray-600">
                <span>Risk to You: ${opt.risk_level_to_you}</span>
                <span>Reassurance: ${opt.reassurance_level}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </details>
    </section>
  `;

  // Stage 13: Scarcity, Order Bumps, Upsells
  html += `
    <section class="border-l-4 border-red-500 pl-6">
      <h2 class="text-2xl font-bold mb-4">⚡ Urgency & Revenue Maximizers</h2>

      <!-- Scarcity Mechanisms -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Scarcity & Urgency</h3>
        <div class="space-y-2">
          ${stages.stage13.scarcity_mechanisms.map(mech => `
            <div class="bg-red-50 p-3 rounded">
              <p class="font-semibold text-sm">${mech.type}</p>
              <p class="text-xs text-gray-600 mt-1">${mech.implementation}</p>
              <p class="text-xs italic mt-2">"${mech.ad_copy_line}"</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Order Bumps -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Order Bumps (Checkout Add-Ons)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${stages.stage13.order_bumps.map((bump, i) => `
            <div class="border-2 border-orange-300 bg-orange-50 p-4 rounded-lg">
              <p class="font-bold">Bump #${i+1}: ${bump.name}</p>
              <p class="text-2xl font-bold text-orange-600 my-2">${bump.price}</p>
              <p class="text-sm text-gray-700 mb-2">${bump.value_proposition}</p>
              <p class="text-xs text-gray-600"><strong>Trigger:</strong> ${bump.conversion_trigger}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Upsells -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Upsells (Post-Purchase)</h3>
        <div class="space-y-4">
          ${stages.stage13.upsells.map((upsell, i) => `
            <div class="border-2 border-green-300 bg-green-50 p-5 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <p class="font-bold text-lg">Upsell #${i+1}: ${upsell.name}</p>
                <span class="bg-green-600 text-white px-4 py-2 rounded text-lg font-bold">${upsell.price}</span>
              </div>
              <p class="text-gray-700 mb-2">${upsell.value_proposition}</p>
              <p class="text-sm text-gray-600 mb-1"><strong>Present:</strong> ${upsell.best_presented_when}</p>
              <p class="text-sm text-gray-600"><strong>Amplifies:</strong> ${upsell.amplifies_transformation_how}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  html += '</div>';
  content.innerHTML = html;

  // Scroll to results
  document.getElementById('offer-output').scrollIntoView({ behavior: 'smooth' });
}

// Helper function for pricing tier rendering
function renderPricingTier(tier, label, isRecommended = false) {
  return `
    <div class="border-2 ${isRecommended ? 'border-green-500 bg-green-50 shadow-lg transform scale-105' : 'border-gray-300'} rounded-lg p-6">
      ${isRecommended ? '<div class="bg-green-500 text-white text-center py-1 mb-4 -mt-6 -mx-6 rounded-t-lg font-bold">RECOMMENDED</div>' : ''}
      <p class="text-lg font-bold mb-2">${tier.tier_name}</p>
      <p class="text-3xl font-bold mb-4">${tier.price}</p>
      <p class="text-sm text-gray-600 mb-4">${tier.best_for}</p>
      <ul class="text-sm space-y-2 mb-4">
        ${tier.deliverables.map(d => `<li class="flex items-start"><span class="mr-2">✓</span>${d}</li>`).join('')}
      </ul>
      ${tier.psychological_positioning ? `<p class="text-xs text-gray-500 italic mt-4">${tier.psychological_positioning}</p>` : ''}
    </div>
  `;
}
```

**Validation:**
- [ ] All 7 stages render correctly
- [ ] Data displays match JSON structures
- [ ] Order bumps: exactly 3, prices $27-$47
- [ ] Upsells: exactly 2, prices $97-$997
- [ ] No "undefined" or "null" values
- [ ] Expandable details work (rationale options, guarantee options)
- [ ] Mobile responsive (test @ 375px width)

---

## Phase 5: End-to-End Testing

### 5.1: Manual Testing Flow

1. Complete market research at `/research`
2. Navigate to `/offer-design`
3. Click "Fill Test Data" button
4. Submit form
5. Watch 7 stages complete (8-12 minutes)
6. Review all sections of generated offer
7. Copy to clipboard
8. Generate new offer (test form reset)

**Validation Points:**
- [ ] Prerequisites warning shows if no research
- [ ] Form validation catches errors
- [ ] Test data fills correctly
- [ ] Generation starts without errors
- [ ] Progress UI updates for all 7 stages
- [ ] All stages complete (no failures)
- [ ] Results display fully populated
- [ ] Copy button works
- [ ] New offer button resets form

---

### 5.2: Playwright MCP E2E Test

**Test Script:**
```javascript
// Test: Complete offer design generation
const { test, expect } = require('@playwright/test');

test('Complete offer design generation flow', async ({ page }) => {
  const PREVIEW_URL = 'https://your-preview-url.pages.dev';

  // Navigate to offer design
  await page.goto(`${PREVIEW_URL}/offer-design`);

  // Fill form using test data button
  await page.click('text=Fill Test Data');

  // Verify form populated
  await expect(page.locator('[name="primary_transformation"]')).not.toBeEmpty();

  // Submit form
  await page.click('text=Generate Strategic Offer Design');

  // Wait for all 7 stages to complete (15 min timeout)
  await page.waitForSelector('#offer-stage-13 .stage-icon:has-text("✅")', {
    timeout: 900000
  });

  // Verify results displayed
  await expect(page.locator('#offer-output')).toBeVisible();

  // Verify order bumps count
  const orderBumps = await page.locator('text=Bump #').count();
  expect(orderBumps).toBe(3);

  // Verify upsells count
  const upsells = await page.locator('text=Upsell #').count();
  expect(upsells).toBe(2);

  // Verify order bump prices in range
  const bump1Price = await page.locator('text=Bump #1').locator('..').locator('.text-2xl').textContent();
  expect(bump1Price).toMatch(/\$[2-4][0-9]/); // $27-$47

  // Verify upsell prices in range
  const upsell1Price = await page.locator('text=Upsell #1').locator('..').locator('.text-lg').textContent();
  expect(upsell1Price).toMatch(/\$[1-9][0-9]{2,3}/); // $97-$997

  // Take screenshot
  await page.screenshot({ path: 'offer-design-complete.png', fullPage: true });
});
```

---

## Phase 6: Documentation & Deployment

### 6.1: Feature Documentation

**File:** `OFFER-DESIGN-GENERATOR.md`

```markdown
# Strategic Offer Design Generator

## Overview
7-stage AI-powered offer design system that creates complete pricing, bonuses, guarantees, order bumps, and upsells based on market research insights and user strategic priorities.

## Features
- 📋 Strategic offer rationale (5 options)
- 💎 Value stack with proof elements
- 💰 3-tier pricing framework
- 💳 Flexible payment plans
- 🎁 3-5 premium bonuses
- 🛡️ Risk-reversal guarantee options
- ⚡ 3 order bumps ($27-$47) + 2 upsells ($97-$997)

## Usage
1. Complete market research at `/research`
2. Navigate to `/offer-design`
3. Fill strategic priorities form
4. Generate (8-12 minutes)
5. Export complete offer

## Architecture
- 7 sequential AI calls
- Token budget: <11K per stage
- Total cost: ~$0.35 per offer
- Quality: 100% complete, no placeholders

## Output
Professional offer design document ready for implementation with all pricing, copy, and revenue maximizers.
```

---

### 6.2: Update Main Documentation

**File:** `CLAUDE.md`

Add to routes section:
```markdown
- `GET /offer-design` - Strategic Offer Design form
- `POST /api/offer/stage/7` - Offer Rationale
- `POST /api/offer/stage/8` - Value Stack
- `POST /api/offer/stage/9` - Pricing Framework
- `POST /api/offer/stage/10` - Payment Plans
- `POST /api/offer/stage/11` - Premium Bonuses
- `POST /api/offer/stage/12` - Power Guarantee
- `POST /api/offer/stage/13` - Scarcity & Upsells
```

Add to file structure:
```markdown
src/
  types/
    offer-preferences.ts          # User strategic preferences
    offer-stages.ts               # Stages 7-13 outputs
  prompts/
    research-data-extractor.ts    # Condensed extraction helper
    stage7-offer-rationale.ts     # Stage 7 prompt
    stage8-value-stack.ts         # Stage 8 prompt
    ... (stages 9-13)
  components/
    offer-design-form.tsx         # Offer preferences form
public/static/
  offer-design.js                 # Client orchestration
```

---

### 6.3: Production Deployment

```bash
# Final build
npm run build

# Deploy
npm run deploy

# Monitor
npx wrangler pages deployment tail
```

**Post-Deployment Validation:**
- [ ] `/offer-design` accessible
- [ ] Complete test offer generation
- [ ] Verify all 7 stages complete
- [ ] Check order bumps/upsells pricing
- [ ] Monitor production logs for errors

---

## Troubleshooting

### Token Budget Exceeded
**Symptom:** Responses truncated mid-sentence
**Solution:** Reduce `extractEssentialResearchData()` content further

### Stage Timeout
**Symptom:** Stage fails after 45-60s
**Solution:** Increase timeout in `callAIStage()` for complex stages

### Invalid JSON Response
**Symptom:** JSON parse error
**Solution:** Add more explicit JSON structure examples in prompt

### Order Bump/Upsell Prices Wrong
**Symptom:** Prices outside $27-$47 or $97-$997 ranges
**Solution:** Add stricter constraints in Stage 13 prompt

---

## Success Metrics

✅ All 7 stages complete in 8-12 minutes
✅ Zero placeholder text in final offer
✅ Token usage <11.5K per stage (within 24K limit)
✅ Order bumps: exactly 3, priced $27-$47
✅ Upsells: exactly 2, priced $97-$997
✅ Professional export format ready for implementation
✅ Total cost: ~$0.35 per complete offer design
