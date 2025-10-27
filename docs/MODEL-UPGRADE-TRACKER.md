# Model Upgrade Tracker - Progressive Rollout

This document tracks the progressive model upgrade process across all 13 stages of the Market Intelligence Generator.

## Current Status: Phase 0 (Baseline)

**Last Updated**: January 27, 2025

**All stages currently using**: `@cf/meta/llama-3.1-70b-instruct` (proven stable)

## Upgrade Strategy Overview

### Phase Progression
1. **Phase 0** (Current): All stages on baseline Llama 3.1 70B
2. **Phase 1**: Upgrade Stages 1-3 (analytical) to FP8 Fast
3. **Phase 2**: Upgrade Stages 5, 7-9 (strategic) to FP8 Fast
4. **Phase 3**: Upgrade Stages 10-13 (creative) to FP8 Fast
5. **Phase 4**: Upgrade Stage 6 (synthesis) to Mistral 128K
6. **Stage 4 Protected**: Keep Llama 3.1 70B Instruct (most complex)

### Model Selection by Stage Type

| Stage Type | Current Model | Target Model | Risk Level |
|------------|--------------|--------------|------------|
| Analytical (1-3, 9) | Llama 3.1 70B | Llama 3.1 70B FP8 Fast | Low |
| Creative (4) | Llama 3.1 70B | **KEEP STABLE** | Critical |
| Strategic (5, 7-8, 10-12) | Llama 3.1 70B | Llama 3.1 70B FP8 Fast | Low-Med |
| Creative (11, 13) | Llama 3.1 70B | Llama 3.1 70B FP8 Fast | Medium |
| Synthesis (6) | Llama 3.1 70B | Mistral Small 3.1 24B | Medium |

---

## Phase 1: Analytical Stages (1-3)

**Target**: Upgrade Stages 1-3 to `@cf/meta/llama-3.1-70b-instruct-fp8-fast`

**Expected Benefits**:
- 10-20% faster generation time
- Same quality as Llama 3.1 70B
- Same cost ($0.293/M input, $2.253/M output)

### Pre-Upgrade Checklist
- [ ] Create baseline test results with current models
- [ ] Update `src/model-config.ts` to upgrade Stages 1-3
- [ ] Build project: `npm run build`
- [ ] Deploy to preview: `npm run preview:remote`
- [ ] Run test suite: `npx tsx test-model-upgrade.ts <preview-url>`
- [ ] Verify all stages pass validation
- [ ] Compare results against baseline (speed, quality, cost)

### Stages 1-3 Configuration Changes

**src/model-config.ts**:
```typescript
1: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
2: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
3: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
```

### Post-Upgrade Validation
- [ ] Stage 1: Market Analysis - JSON valid, all fields complete
- [ ] Stage 2: Buyer Psychology - 10-15 phrases, 3-5 fears/desires
- [ ] Stage 3: Competitive Analysis - 3-5 competitors, positioning gaps
- [ ] Compare response times (expect 10-20% improvement)
- [ ] Verify no quality degradation
- [ ] Monitor for 24 hours on preview URL

### Rollback Plan (if needed)
If any issues detected, revert `src/model-config.ts`:
```typescript
model: MODELS.LLAMA_31_70B_INSTRUCT,  // Revert to baseline
```
Then: `npm run build && npm run deploy`

---

## Phase 2: Strategic Stages (5, 7-9)

**Target**: Upgrade Stages 5, 7-9 to `@cf/meta/llama-3.1-70b-instruct-fp8-fast`

**Prerequisite**: Phase 1 must be stable for 24+ hours

### Pre-Upgrade Checklist
- [ ] Phase 1 completed successfully
- [ ] No issues reported from Phase 1 upgrade
- [ ] Update `src/model-config.ts` for Stages 5, 7-9
- [ ] Build and deploy to preview
- [ ] Run full test suite (all 13 stages)
- [ ] Validate Stages 5, 7-9 specifically

### Stages 5, 7-9 Configuration Changes

**src/model-config.ts**:
```typescript
5: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
7: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
8: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
9: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
```

### Post-Upgrade Validation
- [ ] Stage 5: Offer Design - 3 tiers, 15 messages, guarantee
- [ ] Stage 7: Offer Rationale - 3 options with distinct positioning
- [ ] Stage 8: Value Stack - 5-7 components, total value calculated
- [ ] Stage 9: Pricing Framework - Anchoring strategy, sensitivity mitigation
- [ ] Compare quality against baseline
- [ ] Monitor for 24 hours

---

## Phase 3: Creative Stages (10-13)

**Target**: Upgrade Stages 10-13 to `@cf/meta/llama-3.1-70b-instruct-fp8-fast`

**Prerequisite**: Phase 2 must be stable for 24+ hours

### Pre-Upgrade Checklist
- [ ] Phases 1 & 2 completed successfully
- [ ] Update `src/model-config.ts` for Stages 10-13
- [ ] Build and deploy to preview
- [ ] Run full test suite
- [ ] Special attention to Stage 13 (complex validation)

### Stages 10-13 Configuration Changes

**src/model-config.ts**:
```typescript
10: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
11: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
12: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
13: {
  // ...
  model: MODELS.LLAMA_31_70B_FP8_FAST,  // Changed from LLAMA_31_70B_INSTRUCT
  // ...
},
```

### Post-Upgrade Validation
- [ ] Stage 10: Payment Plans - 2-3 options with psychology
- [ ] Stage 11: Premium Bonuses - 3-5 bonuses with value
- [ ] Stage 12: Power Guarantee - 3 options with risk assessment
- [ ] Stage 13: Scarcity & Upsells - Exactly 3 bumps + 2 upsells
- [ ] Validate pricing ranges (bumps $27-$47, upsells $97-$997)
- [ ] Monitor for 24 hours

---

## Phase 4: Synthesis Stage (6) - Mistral 128K

**Target**: Upgrade Stage 6 to `@cf/mistralai/mistral-small-3.1-24b-instruct`

**Prerequisite**: Phases 1-3 completed successfully

**Benefits**:
- 128K context window (5.3x larger than Llama's 24K)
- Use full research data without condensing
- Potentially richer, more detailed reports

**Trade-offs**:
- 20% higher cost ($0.351 input / $0.555 output)
- Smaller model (24B vs 70B parameters)
- Unknown stability on Cloudflare

### Pre-Upgrade Checklist
- [ ] All previous phases stable
- [ ] Backup Stage 6 condensed prompt implementation
- [ ] Update `src/model-config.ts` for Stage 6
- [ ] Update Stage 6 synthesis to use full research data
- [ ] Build and deploy to preview
- [ ] Run test suite
- [ ] Compare report quality and completeness

### Stage 6 Configuration Changes

**src/model-config.ts**:
```typescript
6: {
  // ...
  model: MODELS.MISTRAL_SMALL_31_24B,  // Changed from LLAMA_31_70B_INSTRUCT
  maxTokens: 12000,  // Adjust based on 128K context availability
  // ...
},
```

### Post-Upgrade Validation
- [ ] Report generates successfully
- [ ] 5,000-6,000 word target met
- [ ] No placeholders or incomplete sections
- [ ] Quality equal or better than Llama 3.1
- [ ] Cost impact acceptable (+20%)
- [ ] Monitor for stability issues

---

## Stage 4: Protected Status

**Stage 4 (Avatar Creation)** will remain on `@cf/meta/llama-3.1-70b-instruct` indefinitely.

**Rationale**:
- Most complex JSON schema (40+ fields)
- Creative narrative requirements
- Failed with Llama 3.3 70B FP8 Fast (500 errors)
- Critical dependency for Stages 5-13
- Risk not worth potential 10-20% speed gain

**Never upgrade Stage 4 without**:
1. Extensive testing in isolated environment
2. User approval
3. Immediate rollback plan
4. Monitoring during upgrade

---

## Upgrade Testing Protocol

### 1. Baseline Test
Before any upgrade, run baseline test:
```bash
npm run preview:remote
# Wait for deployment URL
npx tsx test-model-upgrade.ts <preview-url>
# Save results to test-results/baseline-<date>.json
```

### 2. Upgrade Test
After upgrade changes:
```bash
npm run build
npm run preview:remote
# Wait for deployment URL
npx tsx test-model-upgrade.ts <preview-url>
# Save results to test-results/phase-<N>-<date>.json
```

### 3. Comparison Analysis
Compare test results:
- **Quality Score**: Should be ≥95% for all stages
- **Response Time**: Expect 10-20% improvement with FP8
- **Error Rate**: Should remain <1%
- **Placeholders**: Must be 0
- **Cost**: Track per-stage token usage

### 4. 24-Hour Monitoring
After upgrade approval:
```bash
npm run deploy  # Deploy to production
npx wrangler pages deployment tail  # Monitor logs
```

Watch for:
- Error spikes
- Increased response times
- Quality complaints
- JSON parsing failures

---

## Rollback Procedures

### Quick Rollback (< 5 minutes)
If any stage fails:
1. Revert changes in `src/model-config.ts`
2. `npm run build`
3. `npm run deploy`
4. Verify system stable

### Emergency Rollback (Production Issues)
If production issues detected:
1. `git revert <commit-hash>`
2. `npm run build && npm run deploy`
3. Document incident in this file
4. Investigate root cause before retry

---

## Success Metrics

### Per-Phase Goals
- ✅ All stages pass validation
- ✅ 10-20% speed improvement (FP8 upgrades)
- ✅ Quality score ≥95% for all stages
- ✅ Error rate <1%
- ✅ No placeholders in any output
- ✅ Cost remains stable or decreases

### Overall System Goals
- ✅ 15-20% total generation time reduction
- ✅ Maintain 100% report completeness
- ✅ No quality degradation
- ✅ <1 hour total generation time (research + offer)

---

## Upgrade History

### Phase 0: Baseline (Current)
**Date**: January 27, 2025
**Status**: ✅ Stable
**Models**: All stages using Llama 3.1 70B Instruct
**Notes**: Post-rollback from failed Llama 3.3 attempt

### Failed Attempt: Llama 3.3 70B FP8 Fast
**Date**: January 26, 2025
**Status**: ❌ Failed - Rolled back
**Stages Affected**: All (1-13)
**Failure Point**: Stage 4 (Avatar Creation) - 500 errors
**Root Cause**: Model too new/unstable on Cloudflare
**Documentation**: See `MODEL-UPGRADE-JAN-2025.md`

---

## Next Steps

1. **Build project** to verify no TypeScript errors
2. **Create baseline test results** with current stable models
3. **Begin Phase 1** (Stages 1-3) upgrade when ready
4. **Document results** after each phase
5. **Update this tracker** with progress and findings

---

## References

- **Model Configuration**: `src/model-config.ts`
- **Validation Framework**: `src/validation/stage-validators.ts`
- **Test Suite**: `test-model-upgrade.ts`
- **Previous Attempt**: `docs/MODEL-UPGRADE-JAN-2025.md`
- **Cloudflare Docs**: `cloudflare-llms-full.md`
