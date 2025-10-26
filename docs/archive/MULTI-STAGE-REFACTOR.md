# Multi-Stage Research Generator Refactor - Implementation Plan

## Current Status

**Date Started**: 2025-10-24
**Status**: In Progress - Foundation Complete
**Branch**: main (will need feature branch for refactor)

## Problem Statement

The current single-prompt approach generates incomplete reports with placeholder text (`[Fear 2]`, `[Buyer Quote 1]`, etc.) because:
- Prompt asks for 8,000-12,000 words of content
- AI only has 8,000 token output limit (~6,000 words)
- AI prioritizes template structure over filling actual content
- Result: Professional-looking report with missing research data

**User Feedback**: "It appears we are missing some information in the report, how do we best handle this?"

**Decision**: Move to multi-stage approach with 6 sequential API calls for better quality over quantity.

## Architecture Design

### New Multi-Stage Flow

```
Stage 1: Market Analysis → JSON output (2K tokens)
   ↓
Stage 2: Buyer Psychology → JSON output (2.5K tokens)
   ↓
Stage 3: Competitive Analysis → JSON output (1.5K tokens)
   ↓
Stage 4: Avatar Creation → JSON output (2K tokens)
   ↓
Stage 5: Offer Design → JSON output (2K tokens)
   ↓
Stage 6: Report Synthesis → Markdown report (6K tokens)
   ↓
Final Complete Report (NO placeholders)
```

### Benefits
✅ Each LLM call focuses on ONE specific task
✅ Smaller, focused outputs = complete data every time
✅ Structured JSON output (easier to validate)
✅ Progressive status updates (user sees progress)
✅ Debuggable (inspect each stage independently)
✅ Higher quality output

### Trade-offs
⚠️ More API calls: 6 calls vs 1 (~$0.30 vs $0.13 per report)
⚠️ Slightly longer: 15-20 minutes vs 8-12 minutes
⚠️ More complex implementation

## Work Completed

### ✅ TypeScript Interfaces
**File**: `src/types/research-stages.ts`

Defined complete interfaces for:
- `Stage1MarketAnalysis` - Market data, Power 4% identification
- `Stage2BuyerPsychology` - Pain points, desires, fears, buyer language
- `Stage3CompetitiveAnalysis` - Competitor matrix, positioning gaps
- `Stage4AvatarCreation` - Dream buyer persona, day-in-life, buying triggers
- `Stage5OfferDesign` - Pricing tiers, messaging, guarantees, bonuses
- `Stage6ReportSynthesis` - Final markdown report
- `CompleteResearchData` - Combined interface for all stages

### ✅ Stage 1 Prompt Builder
**File**: `src/prompts/stage1-market-analysis.ts`

Function: `buildStage1MarketAnalysisPrompt(context: BusinessContext)`

Focuses on:
- Market growth rate and size (2024-2025 data)
- Bleeding neck problem identification
- Purchasing power analysis
- Facebook/Instagram targetability
- Top 20% vs Power 4% customer segmentation

**Output**: JSON with specific, actionable data (no placeholders)

## Remaining Work

### 📋 Stage 2: Buyer Psychology Prompt
**File**: `src/prompts/stage2-buyer-psychology.ts`
**Input**: BusinessContext + Stage1 results
**Focus**:
- Extract 10-15 buyer language phrases from online communities
- Identify 3-5 top fears with quotes and solutions
- Identify 3-5 top desires with aspirational outcomes
- Map 5 major pain points with tried solutions
- List internal/external barriers with objection handling

**Output**: `Stage2BuyerPsychology` JSON

### 📋 Stage 3: Competitive Analysis Prompt
**File**: `src/prompts/stage3-competitive-analysis.ts`
**Input**: BusinessContext + competitors_offers
**Focus**:
- Analyze 3-5 specific competitors
- Identify positioning gaps and differentiation opportunities
- Pricing analysis and value proposition
- Why this business wins vs alternatives

**Output**: `Stage3CompetitiveAnalysis` JSON

### 📋 Stage 4: Avatar Creation Prompt
**File**: `src/prompts/stage4-avatar-creation.ts`
**Input**: BusinessContext + Stage 1-3 results
**Focus**:
- Create named avatar persona
- Day-in-life narrative (morning, workday, evening, weekend)
- Buying triggers and optimal contact times
- Online communities they frequent (specific names, URLs, member counts)
- Top 3 hopes, fears, barriers

**Output**: `Stage4AvatarCreation` JSON

### 📋 Stage 5: Offer Design Prompt
**File**: `src/prompts/stage5-offer-design.ts`
**Input**: BusinessContext + Stage 1-4 results
**Focus**:
- 3-tier pricing model (with Power 4% tier marked)
- Payment plan options
- 15 marketing messages (5 pain, 5 desire, 5 curiosity hooks)
- Risk-reversal guarantee
- 3-5 irresistible bonuses
- First campaign recommendation

**Output**: `Stage5OfferDesign` JSON

### 📋 Stage 6: Report Synthesis Prompt
**File**: `src/prompts/stage6-report-synthesis.ts`
**Input**: ALL previous stage results + BusinessContext
**Focus**:
- Take structured JSON data from Stages 1-5
- Format into client-facing Market Intelligence Report
- Fill EVERY section with actual data (no placeholders)
- Professional markdown formatting
- Use Market Intelligence Report template structure

**Output**: `Stage6ReportSynthesis` with full markdown report

### 🔧 Backend Orchestration
**File**: `src/index.tsx`

**New Endpoint**: `POST /api/research/multi-stage`

```typescript
async function orchestrateMultiStageResearch(
  context: BusinessContext,
  c: Context
): Promise<CompleteResearchData> {

  // Stage 1: Market Analysis
  const stage1 = await runStage1(context, c);

  // Stage 2: Buyer Psychology (depends on stage1)
  const stage2 = await runStage2(context, stage1, c);

  // Stage 3: Competitive Analysis (depends on stage1, stage2)
  const stage3 = await runStage3(context, stage1, stage2, c);

  // Stage 4: Avatar Creation (depends on all previous)
  const stage4 = await runStage4(context, stage1, stage2, stage3, c);

  // Stage 5: Offer Design (depends on all previous)
  const stage5 = await runStage5(context, stage1, stage2, stage3, stage4, c);

  return {
    stage1_market_analysis: stage1,
    stage2_buyer_psychology: stage2,
    stage3_competitive_analysis: stage3,
    stage4_avatar_creation: stage4,
    stage5_offer_design: stage5,
  };
}

// Final synthesis endpoint (streams markdown)
app.post("/api/research/synthesize", async (c) => {
  const data: CompleteResearchData = await c.req.json();
  const context: BusinessContext = data.original_context;

  const prompt = buildStage6ReportSynthesisPrompt(context, data);

  // Stream final markdown report
  return streamText(c, async (stream) => {
    // ... streaming logic
  });
});
```

**Key Considerations**:
- Each stage needs error handling and retry logic
- Store intermediate results (memory or optional LocalStorage)
- Progress tracking for frontend updates
- Total time: ~15-20 minutes (2-3 min per stage)

### 🎨 Frontend Updates
**File**: `public/static/research.js`

**Progressive Status Updates**:
```javascript
const stages = [
  { id: 1, name: 'Market Analysis', status: 'pending' },
  { id: 2, name: 'Buyer Psychology', status: 'pending' },
  { id: 3, name: 'Competitive Analysis', status: 'pending' },
  { id: 4, name: 'Avatar Creation', status: 'pending' },
  { id: 5, name: 'Offer Design', status: 'pending' },
  { id: 6, name: 'Report Synthesis', status: 'pending' },
];

// Update UI as each stage completes
function updateStageStatus(stageId, status) {
  // Show: ⏳ In Progress, ✅ Complete, ❌ Error
}
```

**Loading State Updates**:
- Show current stage name and progress (1/6, 2/6, etc.)
- Estimated time remaining
- Ability to cancel/retry if stage fails

## Testing Strategy

### Unit Tests (per stage)
1. Test each prompt builder function individually
2. Mock AI responses with sample JSON
3. Validate JSON structure matches TypeScript interfaces

### Integration Tests
1. Test full 6-stage orchestration with real AI
2. Verify no placeholders in final output
3. Check progressive status updates work
4. Test error handling and retry logic

### End-to-End Tests (with Playwright)
1. Fill test data form
2. Submit and monitor progressive status
3. Verify final report has complete data
4. Check all sections filled (no `[placeholder]` text)

## Migration Strategy

### Option A: Parallel Implementation (Recommended)
- Keep existing `/api/research` endpoint (single-stage)
- Add new `/api/research/multi-stage` endpoint
- Add toggle in UI: "Use Beta Multi-Stage Generator"
- Allows comparison and gradual rollout

### Option B: Direct Replacement
- Replace `/api/research` implementation entirely
- Update frontend to use new flow
- Higher risk but cleaner architecture

## Performance & Cost Analysis

### Current Single-Stage
- **API Calls**: 1
- **Tokens**: ~15K input + 8K output = 23K total
- **Cost**: ~$0.13 per report
- **Time**: 8-12 minutes
- **Quality**: Incomplete (placeholders)

### New Multi-Stage
- **API Calls**: 6 (5 JSON + 1 markdown)
- **Tokens**:
  - Stage 1: ~5K input + 2K output = 7K
  - Stage 2: ~7K input + 2.5K output = 9.5K
  - Stage 3: ~6K input + 1.5K output = 7.5K
  - Stage 4: ~8K input + 2K output = 10K
  - Stage 5: ~8K input + 2K output = 10K
  - Stage 6: ~15K input + 6K output = 21K
  - **Total**: ~65K tokens across all calls
- **Cost**: ~$0.30 per report (2.3x more expensive)
- **Time**: 15-20 minutes (1.5x longer)
- **Quality**: Complete (no placeholders) ✅

**ROI Justification**: Higher cost worth it for complete, actionable reports

## Next Steps for New Session

1. **Create feature branch**: `git checkout -b feature/multi-stage-research`

2. **Build remaining prompts** (Stage 2-6):
   - Copy pattern from Stage 1
   - Focus on JSON output with no placeholders
   - Include specific examples in prompts

3. **Implement backend orchestration**:
   - Add sequential stage execution
   - Error handling and retry logic
   - Progress tracking

4. **Update frontend**:
   - Progressive status display
   - Stage-by-stage updates
   - Better error messaging

5. **Test thoroughly**:
   - Each stage individually
   - Full workflow end-to-end
   - Verify no placeholders in output

6. **Deploy beta**:
   - Preview deployment for testing
   - Compare with current single-stage
   - Gather feedback

7. **Documentation**:
   - Update CLAUDE.md with new architecture
   - Update RESEARCH-GENERATOR.md with multi-stage details
   - Add troubleshooting for each stage

## Questions to Consider

1. **Storage**: Should intermediate stage results be stored in D1 or just kept in memory?
2. **Retry Logic**: How many retries per stage? Exponential backoff?
3. **Cancellation**: Should users be able to cancel mid-generation?
4. **Caching**: Should we cache stage results for re-runs with different synthesis?
5. **Monitoring**: How to log/debug each stage in production?

## Files Reference

**Completed**:
- ✅ `src/types/research-stages.ts`
- ✅ `src/prompts/stage1-market-analysis.ts`

**To Create**:
- ⏳ `src/prompts/stage2-buyer-psychology.ts`
- ⏳ `src/prompts/stage3-competitive-analysis.ts`
- ⏳ `src/prompts/stage4-avatar-creation.ts`
- ⏳ `src/prompts/stage5-offer-design.ts`
- ⏳ `src/prompts/stage6-report-synthesis.ts`

**To Modify**:
- ⏳ `src/index.tsx` - Add orchestration endpoint
- ⏳ `public/static/research.js` - Progressive status UI
- ⏳ `src/components/research-form.tsx` - Loading state updates

**To Update**:
- ⏳ `CLAUDE.md` - Document new architecture
- ⏳ `RESEARCH-GENERATOR.md` - Multi-stage details
- ⏳ `TESTING.md` - Test each stage

## Success Criteria

✅ Final report has ZERO placeholder text
✅ All sections filled with specific, actionable data
✅ Real buyer quotes and pain points
✅ Concrete marketing messages and pricing strategy
✅ User sees progressive status throughout generation
✅ Complete generation in 15-20 minutes consistently
✅ Error recovery works for individual stage failures

---

**Ready to implement in next session!** 🚀
