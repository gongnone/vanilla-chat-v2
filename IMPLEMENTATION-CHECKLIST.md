# Strategic Offer Design - Implementation Checklist

## ✅ Phase 1: User Input Layer (COMPLETE)

- [x] Create `src/types/offer-preferences.ts`
- [x] Create `src/components/offer-design-form.tsx`
- [x] Create `public/static/offer-design.js`
- [x] Add route `/offer-design` in `src/index.tsx`
- [x] Build succeeds
- [x] Form renders at http://localhost:8788/offer-design
- [x] Test data button works

## ✅ Phase 2.1: Research Data Extraction (COMPLETE)

- [x] Create `src/prompts/research-data-extractor.ts`
- [x] Token budget validation (~750 tokens, within 850 target)
- [x] Build succeeds

---

## ✅ Phase 2.2-2.3: Prompt Engineering (COMPLETE)

### Stage 7: Offer Rationale
- [x] Create `src/prompts/stage7-offer-rationale.ts`
- [x] Import types and extraction helper
- [x] Prompt length: ~5,000 tokens (17,500 chars)
- [x] References user preferences (3+ fields)
- [x] Uses buyer language from research
- [x] JSON structure clearly defined
- [x] Build succeeds

### Stage 8: Value Stack
- [x] Create `src/prompts/stage8-value-stack.ts`
- [x] Uses `unique_tools_resources` from preferences
- [x] References `proof_assets_available`
- [x] Prompt length: ~5,500 tokens
- [x] Build succeeds

### Stage 9: Pricing Framework
- [x] Create `src/prompts/stage9-pricing-framework.ts`
- [x] Respects `comfortable_price_range` boundaries
- [x] Uses Power 4% LTV as anchor
- [x] Applies `pricing_strategy`
- [x] Prompt length: ~6,000 tokens (largest)
- [x] Build succeeds

### Stage 10: Payment Plans
- [x] Create `src/prompts/stage10-payment-plans.ts`
- [x] References avatar price sensitivity
- [x] 2-3 flexible options
- [x] Prompt length: ~4,500 tokens
- [x] Build succeeds

### Stage 11: Premium Bonuses
- [x] Create `src/prompts/stage11-premium-bonuses.ts`
- [x] Sources from `unique_tools_resources`
- [x] Addresses top desires from research
- [x] 3-5 bonuses designed
- [x] Prompt length: ~5,000 tokens
- [x] Build succeeds

### Stage 12: Power Guarantee
- [x] Create `src/prompts/stage12-power-guarantee.ts`
- [x] Uses `guarantee_risk_tolerance`
- [x] Addresses top fear #1 from research
- [x] 3 guarantee options provided
- [x] Prompt length: ~5,000 tokens
- [x] Build succeeds

### Stage 13: Scarcity & Upsells
- [x] Create `src/prompts/stage13-scarcity-upsells.ts`
- [x] 3 order bumps ($27-$47) EXACT
- [x] 2 upsells ($97-$997) EXACT
- [x] Scarcity mechanisms genuine
- [x] Prompt length: ~6,000 tokens
- [x] Build succeeds

---

## ✅ Phase 3.1-3.2: Backend Implementation (COMPLETE)

### 3.1: Type Definitions
- [x] Create `src/types/offer-stages.ts`
- [x] Stage7OfferRationale interface
- [x] Stage8ValueStack interface
- [x] Stage9Pricing interface
- [x] Stage10PaymentPlans interface
- [x] Stage11Bonuses interface
- [x] Stage12Guarantee interface
- [x] Stage13ScarcityUpsells interface
- [x] CompleteOfferData interface
- [x] Build succeeds (168.23 kB)

### 3.2: API Endpoints
- [x] Import all 7 prompt builders
- [x] Import all 7 output interfaces
- [x] Add `POST /api/offer/stage/7` endpoint
- [x] Add `POST /api/offer/stage/8` endpoint
- [x] Add `POST /api/offer/stage/9` endpoint
- [x] Add `POST /api/offer/stage/10` endpoint
- [x] Add `POST /api/offer/stage/11` endpoint
- [x] Add `POST /api/offer/stage/12` endpoint
- [x] Add `POST /api/offer/stage/13` endpoint (with validation for 3 bumps + 2 upsells)
- [x] Build succeeds (168.23 kB)

### 3.3: Test Context Creation
- [x] Create `test-offer-context.json` (complete context with realistic data)

### 3.4: Preview Deployment Testing
- [x] `npm run build` succeeds (168.51 kB)
- [x] `npm run deploy` succeeds (https://396494e5.vanilla-chat-demo-tmpl-al4.pages.dev)
- [x] Test Stage 7 with real AI (HTTP 200, valid JSON) ✅ 3 options generated
- [x] Test Stage 8 with real AI ✅ 6 core components
- [x] Test Stage 9 with real AI ✅ $20,000 price, 9:1 value ratio
- [x] Test Stage 10 with real AI ✅ 3 payment plans
- [x] Test Stage 11 with real AI ✅ 4 premium bonuses
- [x] Test Stage 12 with real AI ✅ 3 guarantee options
- [x] Test Stage 13 with real AI ✅ 3 order bumps + 2 upsells
- [ ] Verify token usage in logs (<11.5K per stage)
- [x] No truncation in any responses ✅ All complete
- [x] Order bumps priced $27-$47 ✅ ($37, $42, $29)
- [x] Upsells priced $97-$997 ✅ ($497, $997)

---

## ✅ Phase 4: Frontend Orchestration (COMPLETE)

- [x] Complete `displayOfferResults()` in `offer-design.js` ✅ 220 lines
- [x] Render all 7 stage outputs ✅ All stages with proper formatting
- [x] Order bumps display: exactly 3 ✅ Grid layout with pricing
- [x] Upsells display: exactly 2 ✅ Larger cards with conversion hooks
- [x] Expandable details work (rationale options, guarantees) ✅ Using `<details>` elements
- [x] Copy to clipboard works ✅ Existing functionality preserved
- [x] New offer button resets form ✅ Existing functionality preserved
- [ ] Mobile responsive (test @ 375px) - Requires browser testing

---

## ⏳ Phase 5: E2E Testing (TODO)

### 5.1: Manual Testing
- [ ] Complete research at `/research`
- [ ] Navigate to `/offer-design`
- [ ] Fill test data
- [ ] Submit form
- [ ] All 7 stages complete (8-12 min)
- [ ] Results fully populated
- [ ] No "undefined" values
- [ ] Copy button works
- [ ] New offer resets correctly

### 5.2: Playwright MCP Testing
- [ ] Create Playwright test script
- [ ] Test complete flow (research → offer)
- [ ] Verify order bumps count = 3
- [ ] Verify upsells count = 2
- [ ] Verify pricing ranges correct
- [ ] Screenshot captured
- [ ] All assertions pass

---

## ⏳ Phase 6: Documentation & Deployment (TODO)

### 6.1: Documentation
- [ ] Create `OFFER-DESIGN-GENERATOR.md`
- [ ] Update `CLAUDE.md` (routes, file structure)
- [ ] Update `README.md` (feature overview)

### 6.2: Production Deployment
- [ ] Final `npm run build`
- [ ] `npm run deploy` to production
- [ ] Test complete offer generation on prod
- [ ] Monitor `wrangler pages deployment tail`
- [ ] Verify all stages complete
- [ ] Check order bumps/upsells pricing
- [ ] No errors in production logs

---

## Final Acceptance Criteria

- [ ] All 7 offer stages generate successfully
- [ ] Generation time: 8-12 minutes
- [ ] Token usage: <11.5K per stage (within 24K limit)
- [ ] Zero placeholder text
- [ ] Order bumps: exactly 3, priced $27-$47
- [ ] Upsells: exactly 2, priced $97-$997
- [ ] Complete offer ready for implementation
- [ ] Total cost per offer: ~$0.35
- [ ] Professional export format

---

## Quick Start Commands

```bash
# Local development
npm run dev
# Visit http://localhost:8788/offer-design

# Build
npm run build

# Preview with real AI
npm run preview:remote

# Production deploy
npm run deploy

# Monitor logs
npx wrangler pages deployment tail

# Test endpoint (local)
curl -X POST http://localhost:8788/api/offer/stage/7 \
  -H "Content-Type: application/json" \
  -d @test-offer-context.json

# Test endpoint (preview)
curl -X POST https://preview-url.pages.dev/api/offer/stage/7 \
  -H "Content-Type: application/json" \
  -d @test-offer-context.json | jq
```

---

## Token Budget Reference

| Stage | Max Output | Est. Input | Total Budget | Status |
|-------|-----------|------------|--------------|---------|
| 7     | 2,500     | ~5,000     | <9,000       | ✅ Safe |
| 8     | 2,500     | ~5,500     | <10,000      | ✅ Safe |
| 9     | 2,500     | ~6,000     | <11,000      | ⚠️ Monitor |
| 10    | 2,000     | ~4,500     | <8,500       | ✅ Safe |
| 11    | 2,500     | ~5,000     | <9,500       | ✅ Safe |
| 12    | 2,500     | ~5,000     | <9,000       | ✅ Safe |
| 13    | 3,000     | ~6,000     | <11,500      | ⚠️ Monitor |

**Context Window:** 24,000 tokens (Llama 3.1 70B)
**Extraction Helper:** ~750 tokens (optimized)
**Safety Buffer:** 500 tokens per stage

---

## Common Issues & Solutions

**Issue:** Token budget exceeded
**Solution:** Reduce content in `research-data-extractor.ts`

**Issue:** Order bump prices outside range
**Solution:** Add stricter constraints in Stage 13 prompt: "MUST be between $27-$47"

**Issue:** Stage timeout
**Solution:** Increase timeout in `callAIStage()` for complex stages (Stage 9, 13)

**Issue:** Invalid JSON response
**Solution:** Add more JSON examples in prompt output section
