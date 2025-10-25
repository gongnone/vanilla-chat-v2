# Multi-Stage Timeout Issue

## Problem

Multi-stage research generation is failing with timeouts because **Cloudflare Pages Functions have a 60-second execution limit** and our implementation makes 5 sequential AI calls that exceed this limit.

### Timeline

- **Stage 1-5**: Each AI call takes ~10-15 seconds (2500 tokens each)
- **Total time needed**: ~50-75 seconds
- **Pages Function limit**: 60 seconds (hard timeout)
- **Result**: Request times out before completing all stages

### Evidence

```
curl timeout after 3 minutes (180s)
- Request accepted
- No response data returned
- Backend logs show no errors (because execution was killed by platform)
```

## Root Causes Identified

1. **Missing `stream: false`** - Fixed in commit 8806232
   - Without explicit `stream: false`, Workers AI may attempt streaming
   - JSON parsing fails on streamed responses
   - Status: FIXED ✅

2. **No timeout handling** - Fixed in commit 8806232
   - AI calls could hang indefinitely
   - Added 45s timeout wrapper with Promise.race()
   - Status: FIXED ✅

3. **Pages Functions 60s limit** - BLOCKING ISSUE ❌
   - Platform limitation, cannot be changed
   - 5 sequential AI calls take 50-75 seconds
   - Exceeds execution limit
   - Status: NEEDS ARCHITECTURAL CHANGE

## Solution Options

### Option 1: Use Cloudflare Workflows (RECOMMENDED)

**Pros:**
- Built for long-running operations (hours/days)
- No timeout limits
- Built-in persistence and retry logic
- Can pause/resume between stages

**Cons:**
- Requires migration to Workers (not Pages)
- New deployment architecture
- Learning curve for Workflows API

**Implementation:**
```typescript
// Define workflow
export class ResearchWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const stage1 = await step.do('stage1', async () => {
      return await callAIStage(...);
    });

    const stage2 = await step.do('stage2', async () => {
      return await callAIStage(..., stage1);
    });

    // ... stages 3-6
  }
}
```

### Option 2: Client-Side Sequential Calls

**Pros:**
- No backend changes needed
- Each stage stays under 60s
- Frontend controls progress

**Cons:**
- 6 separate HTTP requests
- More network overhead
- Client must stay connected entire time

**Implementation:**
- Frontend calls `/api/research/stage/1`
- Gets JSON response
- Frontend calls `/api/research/stage/2` with stage1 data
- Repeat for all 6 stages

### Option 3: Use Cloudflare Queues

**Pros:**
- Async processing
- No client wait time
- Built-in retry logic

**Cons:**
- Requires polling or webhooks for completion
- More complex state management
- Delays user feedback

### Option 4: Optimize AI Calls (Parallel where possible)

**Current:**
- Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5 → Stage 6
- Total: 50-75 seconds

**Optimized:**
- Stage 1 (required first)
- Stages 2-4 IN PARALLEL (all depend only on Stage 1)
- Stage 5 (depends on 2-4)
- Stage 6 (final synthesis)
- Total: ~30-40 seconds

**Pros:**
- Might fit within 60s timeout
- No architecture change
- Faster completion

**Cons:**
- Still risky (close to timeout)
- Higher memory usage
- Doesn't solve the core issue

## Recommended Path Forward

**Short-term (today):**
1. Implement Option 2 (client-side sequential calls) ✅
   - Fastest to implement
   - Enables testing of prompts and JSON parsing
   - Works with existing Pages deployment

**Long-term (next sprint):**
2. Migrate to Option 1 (Workflows) once core functionality validated
   - Better UX (no 6 separate loading states)
   - Production-grade reliability
   - Enables advanced features (pause/resume, checkpointing)

## Implementation Plan for Option 2

### Backend Changes

Create 6 individual stage endpoints:

```typescript
// Stage 1: No dependencies
app.post("/api/research/stage/1", async (c) => {
  const context = await c.req.json();
  const prompt = buildStage1MarketAnalysisPrompt(context);
  const result = await callAIStage("Market Analysis", 1, prompt);
  return c.json(result);
});

// Stage 2: Depends on Stage 1
app.post("/api/research/stage/2", async (c) => {
  const { context, stage1 } = await c.req.json();
  const prompt = buildStage2BuyerPsychologyPrompt(context, stage1);
  const result = await callAIStage("Buyer Psychology", 2, prompt);
  return c.json(result);
});

// ... stages 3-5

// Stage 6: Synthesis (streaming response)
app.post("/api/research/stage/6", async (c) => {
  const { context, researchData } = await c.req.json();
  const prompt = buildStage6ReportSynthesisPrompt(context, researchData);
  // Stream final markdown report
  return streamText(c, aiEventSourceStream);
});
```

### Frontend Changes

Update `generateMultiStageReport()` in `research.js`:

```javascript
async function generateMultiStageReport(businessContext) {
  createStageProgressUI();

  try {
    // Stage 1
    updateStageStatus(1, 'in_progress');
    const stage1Response = await fetch('/api/research/stage/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessContext)
    });
    const stage1 = await stage1Response.json();
    updateStageStatus(1, 'complete');

    // Stage 2
    updateStageStatus(2, 'in_progress');
    const stage2Response = await fetch('/api/research/stage/2', {
      method: 'POST',
      body: JSON.stringify({ context: businessContext, stage1 })
    });
    const stage2 = await stage2Response.json();
    updateStageStatus(2, 'complete');

    // ... stages 3-5

    // Stage 6 (streaming)
    updateStageStatus(6, 'in_progress');
    const stage6Response = await fetch('/api/research/stage/6', {
      method: 'POST',
      body: JSON.stringify({
        context: businessContext,
        researchData: { stage1, stage2, stage3, stage4, stage5 }
      })
    });
    // Stream and render markdown
    streamReport(stage6Response);
    updateStageStatus(6, 'complete');

  } catch (error) {
    console.error('Multi-stage generation failed:', error);
    showError('Report generation failed');
  }
}
```

## Testing Strategy

1. **Test each stage individually** with curl/Postman
2. **Validate JSON schemas** for stages 1-5
3. **Test frontend progression** with real UI
4. **Measure timing**: Each stage should complete in <15s
5. **Error handling**: Test retry logic and timeout scenarios

## Success Criteria

- ✅ Each stage completes in <15 seconds
- ✅ All 6 stages can complete successfully
- ✅ Progress UI updates accurately
- ✅ Final markdown report has NO placeholders
- ✅ LocalStorage persistence works
- ✅ Error handling provides clear user feedback

## Next Steps

1. Create `/api/research/stage/[1-6]` endpoints
2. Update frontend to make sequential calls
3. Test end-to-end with real data
4. Update documentation
5. Deploy and validate
