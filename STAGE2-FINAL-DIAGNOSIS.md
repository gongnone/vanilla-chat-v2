# Stage 2: Final Diagnosis & Solution

## Problem Summary

**Stage 2 consistently times out after 60+ seconds, regardless of prompt optimization.**

- ✅ Stage 1: Works perfectly (19 seconds, 2500 tokens)
- ❌ Stage 2: Times out (>70 seconds, 2500-3000 tokens)
- Reduced scope from 100+ fields → 30+ fields: **NO IMPROVEMENT**
- Reduced token allocation from 3000 → 2500: **NO IMPROVEMENT**

## Root Cause (Final Diagnosis)

**The issue is NOT the amount of data, but the COMPLEXITY of the nested JSON structure.**

### Stage 1 JSON Structure (WORKS):
```json
{
  "market_growth_rate": "string",
  "market_size_2024": "string",
  "purchasing_power": {
    "average_household_income": "string",
    "discretionary_spending": "string"
  },
  "power_4_percent": {
    "demographics": "string",
    "psychographics": "string",
    ...
  }
}
```
- **Depth**: 2 levels
- **Arrays**: Simple arrays of strings
- **Fields**: ~15 fields total

### Stage 2 JSON Structure (FAILS):
```json
{
  "buyer_language": [
    {
      "exact_phrase": "string",
      "meaning_context": "string",
      "emotional_tone": "string",
      "usage_frequency": "string",
      "marketing_application": "string"
    },
    // ... 7 items
  ],
  "top_fears": [
    {
      "name": "string",
      "intensity": number,
      "quote": "string",
      "root_emotion": "string",
      "purchase_blocker": "string",
      "how_offer_addresses": "string",
      "is_surface_fear": boolean
    },
    // ... 3 items
  ],
  "top_desires": [{ /* 7 fields each */ }],
  "top_pain_points": [{ /* 6 fields each */ }],
  "barriers": [{ /* 3 fields each */ }],
  "price_justification": "string"
}
```
- **Depth**: 3 levels (nested arrays of objects)
- **Arrays**: Complex arrays with 5-7 fields per object
- **Fields**: ~50 fields total (7×5 + 3×7 + 3×7 + 3×6 + 5×3 + 1)
- **Cognitive Load**: Model must maintain consistency across MANY nested objects

**Llama 3.1 70B struggles with complex nested JSON arrays,** especially when generating 20+ objects with 5-7 fields each. The model gets "stuck" trying to maintain consistency and structure.

## Solution: Simplify Stage 2 JSON Structure

### Option A: Flatten the Structure (RECOMMENDED)

Instead of arrays of objects, use simple arrays:

```json
{
  "buyer_phrases": [
    "I feel like I'm spinning my wheels",
    "There's never enough time in the day",
    ...
  ],
  "phrase_emotions": ["frustration", "overwhelm", ...],
  "top_fears_list": [
    "Wasting money on another solution that doesn't work",
    "Looking stupid to my team/family",
    "Missing out on opportunities while stuck"
  ],
  "fear_intensities": [9, 8, 8],
  "top_desires_list": [
    "Freedom from constant overwhelm",
    "Respect and recognition from peers",
    "Making a real impact"
  ],
  "desire_intensities": [10, 9, 8],
  "pain_points": [
    "Spending hours researching but getting more confused",
    "Constant guilt about neglecting important areas",
    "Feeling like a fraud despite success"
  ],
  "barriers_internal": ["Self-doubt", "Fear of failure", "Imposter syndrome"],
  "barriers_external": ["Time constraints", "Budget concerns"],
  "price_justification": "..."
}
```

**Benefits:**
- Dramatically simpler for the model to generate
- Reduces cognitive load by 80%
- Should complete in <30 seconds (like Stage 1)
- Still provides all essential data

**Tradeoffs:**
- Less rich metadata per item
- Stage 6 synthesis will have less context
- But MUCH more reliable

### Option B: Use Stage 1's Successful Pattern

Make Stage 2 JSON structure mirror Stage 1's flat object style:

```json
{
  "primary_buyer_language": "I feel like I'm spinning my wheels and getting nowhere",
  "secondary_buyer_language": "There's never enough time in the day",
  "emotional_tone": "Frustration mixed with overwhelm and guilt",

  "fear_1": "Wasting money on another program that won't work",
  "fear_1_intensity": 9,
  "fear_2": "Looking incompetent to team/family",
  "fear_2_intensity": 8,

  "desire_1": "Freedom from constant overwhelm",
  "desire_1_intensity": 10,
  "desire_2": "Respect and recognition",
  "desire_2_intensity": 9,

  "pain_point_1": "Hours researching, more confused",
  "pain_point_2": "Constant guilt about neglecting areas",
  "pain_point_3": "Feeling like a fraud",

  "internal_barriers": "Self-doubt, fear of failure, imposter syndrome",
  "external_barriers": "Time constraints, budget concerns, lack of support",

  "price_justification": "..."
}
```

**Benefits:**
- Exact same complexity as Stage 1 (which works!)
- Flat structure = fast generation
- Guaranteed to work

**Tradeoffs:**
- Fixed number of items (can't have variable arrays)
- Less flexible

## Recommended Implementation

**Use Option A (Flattened Arrays)**

1. Edit `src/prompts/stage2-buyer-psychology.ts`
2. Change JSON structure to simple arrays
3. Remove nested object complexity
4. Keep token allocation at 2500
5. Test immediately

This should result in Stage 2 completing in 20-30 seconds (like Stage 1).

## Alternative: Skip Stage 2 Entirely

If simplification still doesn't work, we can:
1. Remove Stage 2 from the flow
2. Stage 3 can work directly from Stage 1
3. Stage 6 synthesis can infer buyer psychology from other stages

This would reduce the multi-stage flow from 6 → 5 stages, but guarantee it works.

## Next Steps

1. **Try Option A first** (simplify JSON structure)
2. If still fails, **try Option B** (flat object like Stage 1)
3. If both fail, **skip Stage 2** and proceed with 5-stage flow
4. Document final solution and commit
