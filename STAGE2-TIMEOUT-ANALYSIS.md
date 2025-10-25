# Stage 2 Timeout Analysis

## Problem

Stage 2 (Buyer Psychology) is consistently timing out after 60 seconds, while Stage 1 completed successfully in 19 seconds.

## Evidence

**Stage 1 Performance:**
- Completed: 19 seconds ✅
- Token allocation: 2500 tokens
- Prompt length: ~3,000 characters
- Output: ~2KB JSON

**Stage 2 Performance:**
- Status: Timeout after 60+ seconds ❌
- Token allocation: 3000 tokens (highest of all stages)
- Prompt length: ~5,000 characters
- Expected output: ~5-8KB JSON (much larger than Stage 1)

## Root Cause

### Issue 1: Overly Ambitious Prompt Scope

The Stage 2 prompt requests an **enormous amount of detailed data**:

1. **Buyer Language**: 10-15 phrases (each with 5 fields)
2. **Top Fears**: 3-5 fears (each with 7 fields)
3. **Top Desires**: 3-5 desires (each with 7 fields)
4. **Pain Points**: 5 pain points (each with 6 fields)
5. **Barriers**: 7-10 barriers (each with 3 fields)
6. **Price Justification**: Detailed ROI analysis

**Total Expected Fields**: ~100-150 data points

This is **2-3x more data** than any other stage requests!

### Issue 2: Insufficient Token Allocation

- **Current**: 3000 tokens
- **Estimated Needed**: 4000-5000 tokens to complete all requested data
- **Result**: AI times out trying to fit comprehensive response within token limit

### Issue 3: Model Performance Under Pressure

Llama 3.1 70B may struggle with:
- Complex structured JSON generation
- Large number of nested objects
- Maintaining consistency across 100+ fields
- Completing within 60-second timeout

## Solution Options

### Option 1: Reduce Stage 2 Scope (RECOMMENDED)

**Simplify Stage 2 to request less data:**

```
Buyer Language: 10-15 → 5-7 phrases
Top Fears: 3-5 → 3 fears
Top Desires: 3-5 → 3 desires
Pain Points: 5 → 3 pain points
Barriers: 7-10 → 5 barriers
```

**Impact:**
- Reduces output from ~5KB → ~3KB
- Likely completes within 30-40 seconds
- Still provides sufficient data for Stage 6 synthesis
- Maintains quality without overwhelming AI

**Pros:**
- Fastest to implement (edit prompt file only)
- No architecture changes needed
- Should fit within 3000 tokens
- More reliable completion

**Cons:**
- Less comprehensive buyer psychology data
- May need to iterate on specificity

### Option 2: Increase Token Allocation

**Change Stage 2 maxTokens from 3000 → 5000**

**Pros:**
- Allows AI to complete full response
- Maintains current prompt scope
- No prompt changes needed

**Cons:**
- May still timeout (more tokens = more time)
- Risks exceeding Llama 3.1 70B context window
- Increases cost per generation
- Doesn't address fundamental complexity issue

### Option 3: Split Stage 2 into Two Stages

**Stage 2A: Buyer Language & Fears** (2000 tokens)
- Buyer language (7-10 phrases)
- Top fears (3 fears)

**Stage 2B: Desires, Pain Points & Barriers** (2500 tokens)
- Top desires (3 desires)
- Pain points (3 pain points)
- Barriers (5 barriers)
- Price justification

**Pros:**
- Each stage completes faster
- Better isolation of concerns
- More granular progress tracking

**Cons:**
- Requires backend + frontend refactor
- 7 total stages instead of 6
- More API calls (slower overall)
- Increased complexity

## Recommended Implementation

**Use Option 1: Reduce Scope**

### Changes Needed

1. **Edit `src/prompts/stage2-buyer-psychology.ts`:**
   - Reduce buyer_language from 10-15 → 7 phrases
   - Reduce top_fears from 3-5 → 3 fears
   - Reduce top_desires from 3-5 → 3 desires
   - Reduce top_pain_points from 5 → 3 pain points
   - Reduce barriers from 7-10 → 5 barriers

2. **Update TypeScript interface** (if needed):
   - Verify `Stage2BuyerPsychology` interface allows variable array lengths

3. **Test with curl**:
   - Deploy and test Stage 2 with reduced scope
   - Verify completion time <45 seconds
   - Verify JSON structure is valid

### Success Criteria

- ✅ Stage 2 completes in <45 seconds
- ✅ Returns valid JSON
- ✅ Contains 5-7 buyer phrases (not 10-15)
- ✅ Contains 3 fears, 3 desires, 3 pain points
- ✅ Provides sufficient data for Stage 6 synthesis

## Alternative: Quick Test First

Before reducing scope, try increasing timeout to 90 seconds and see if Stage 2 completes:

```typescript
const TIMEOUT_MS = maxTokens > 2500 ? 90000 : 60000;
```

If it completes in 60-90 seconds, we know it's just slow (not broken). Then we can decide whether to:
- Accept slower performance (90s per stage)
- Reduce scope anyway (for reliability)
- Switch models (try different model for Stage 2)

## Next Steps

1. Try 90s timeout first (quick test)
2. If still fails, implement Option 1 (reduce scope)
3. Deploy and test Stage 2 individually
4. Test full 6-stage flow
5. Document final performance metrics
