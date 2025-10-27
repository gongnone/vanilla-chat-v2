/**
 * Automated Model Upgrade Test Suite
 *
 * Tests all 13 stages with real business context against a deployed preview environment.
 * Validates responses and compares against baseline metrics.
 *
 * Usage:
 *   1. Deploy to preview: npm run preview:remote
 *   2. Run tests: npx tsx test-model-upgrade.ts <preview-url>
 *   3. Review results in test-results/model-upgrade-<timestamp>.json
 *
 * Example:
 *   npx tsx test-model-upgrade.ts https://abc123.vanilla-chat-demo-tmpl-al4.pages.dev
 */

import { validateStage, validateAllStages, type ValidationResult } from './src/validation/stage-validators';
import { getStageModelConfig, getUpgradeStatus } from './src/model-config';
import type { BusinessContext } from './src/types';
import type { CompleteOfferContext } from './src/types/offer-preferences';
import * as fs from 'fs';
import * as path from 'path';

// Test business context (same as "Fill Test Data" button)
const TEST_BUSINESS_CONTEXT: BusinessContext = {
  business_name: "Ashley Shaw Consulting",
  current_offer_description: "1:1 executive coaching for women in tech leadership",
  niche: "Women in tech leadership",
  specialization_keywords: "women, tech, leadership, executive coaching",
  business_stage: "established",
  revenue_range: "100k-250k",
  preferred_market_category: "wealth",
  target_market_hypothesis: "Women tech executives aged 35-45, $200K+ income",
  target_demographics: "35-45 years old, $200K+ household income, tech industry",
  target_psychographics: "Achievement-oriented, values work-life balance, growth mindset",
  biggest_customer_pain_point: "Imposter syndrome and lack of executive presence in male-dominated tech",
  service_type: "coaching",
  delivery_format: "1:1",
  price_point_current: "$8,000",
  desired_price_point: "$15,000-$25,000",
  offer_duration: "6 months",
  unique_mechanism: "Confident Leader Framework™",
};

// Test offer preferences for Stages 7-13
const TEST_OFFER_PREFERENCES = {
  strategic_priorities: ['premium_pricing', 'proof_heavy', 'transformation_speed'],
  primary_transformation: "From imposter syndrome to confident executive presence in 90 days",
  proof_assets_available: {
    case_studies: true,
    testimonials: true,
    before_after_data: true,
    certifications: true,
    media_features: false,
    awards: false,
  },
  voice_preferences: {
    tone: "professional but warm, empowering",
    avoid_words: "guru, secret, hack",
    must_include_concepts: "evidence-based, proven, transformation",
  },
};

interface StageTestResult {
  stage: number;
  stageName: string;
  model: string;
  success: boolean;
  responseTime: number; // milliseconds
  tokenCount: number;
  validation: ValidationResult;
  error?: string;
}

interface TestRun {
  timestamp: string;
  previewUrl: string;
  upgradePhase: string;
  stagesBaseline: number[];
  stagesUpgraded: number[];
  results: StageTestResult[];
  summary: {
    totalStages: number;
    successfulStages: number;
    failedStages: number;
    totalTime: number; // milliseconds
    averageQualityScore: number;
    totalErrors: number;
    totalWarnings: number;
  };
}

/**
 * Test a single research stage
 */
async function testResearchStage(
  previewUrl: string,
  stageNumber: number,
  payload: any
): Promise<StageTestResult> {
  const config = getStageModelConfig(stageNumber);
  const startTime = Date.now();

  try {
    console.log(`🔄 Testing Stage ${stageNumber}: ${config.stageName}...`);

    const response = await fetch(`${previewUrl}/api/research/stage/${stageNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseText = JSON.stringify(data);
    const tokenCount = Math.ceil(responseText.length / 4);

    // Validate the response
    const validation = validateStage(stageNumber, data);

    console.log(`${validation.isValid ? '✅' : '❌'} Stage ${stageNumber}: ${config.stageName} (${responseTime}ms, ${tokenCount} tokens, quality: ${validation.qualityScore}%)`);

    return {
      stage: stageNumber,
      stageName: config.stageName,
      model: config.model,
      success: validation.isValid,
      responseTime,
      tokenCount,
      validation,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ Stage ${stageNumber} failed:`, error);

    return {
      stage: stageNumber,
      stageName: config.stageName,
      model: config.model,
      success: false,
      responseTime,
      tokenCount: 0,
      validation: {
        isValid: false,
        stage: stageNumber,
        stageName: config.stageName,
        errors: [String(error)],
        warnings: [],
        qualityScore: 0,
        metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
      },
      error: String(error),
    };
  }
}

/**
 * Test a single offer stage
 */
async function testOfferStage(
  previewUrl: string,
  stageNumber: number,
  completeOfferContext: CompleteOfferContext
): Promise<StageTestResult> {
  const config = getStageModelConfig(stageNumber);
  const startTime = Date.now();

  try {
    console.log(`🔄 Testing Stage ${stageNumber}: ${config.stageName}...`);

    const response = await fetch(`${previewUrl}/api/offer/stage/${stageNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeOfferContext),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseText = JSON.stringify(data);
    const tokenCount = Math.ceil(responseText.length / 4);

    // Validate the response
    const validation = validateStage(stageNumber, data);

    console.log(`${validation.isValid ? '✅' : '❌'} Stage ${stageNumber}: ${config.stageName} (${responseTime}ms, ${tokenCount} tokens, quality: ${validation.qualityScore}%)`);

    return {
      stage: stageNumber,
      stageName: config.stageName,
      model: config.model,
      success: validation.isValid,
      responseTime,
      tokenCount,
      validation,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ Stage ${stageNumber} failed:`, error);

    return {
      stage: stageNumber,
      stageName: config.stageName,
      model: config.model,
      success: false,
      responseTime,
      tokenCount: 0,
      validation: {
        isValid: false,
        stage: stageNumber,
        stageName: config.stageName,
        errors: [String(error)],
        warnings: [],
        qualityScore: 0,
        metrics: { fieldCount: 0, placeholderCount: 0, emptyFieldCount: 0, responseLength: 0 },
      },
      error: String(error),
    };
  }
}

/**
 * Run complete test suite
 */
async function runTestSuite(previewUrl: string): Promise<TestRun> {
  console.log('\n🧪 Model Upgrade Test Suite\n');
  console.log(`Preview URL: ${previewUrl}`);

  // Get current upgrade status
  const upgradeStatus = getUpgradeStatus();
  console.log(`Upgrade Phase: ${upgradeStatus.phase}`);
  console.log(`Baseline stages: ${upgradeStatus.baseline.join(', ')}`);
  console.log(`Upgraded stages: ${upgradeStatus.upgraded.join(', ') || 'none'}\n`);

  const results: StageTestResult[] = [];
  const startTime = Date.now();

  // RESEARCH STAGES (1-5)
  console.log('📊 Testing Research Stages (1-5)\n');

  // Stage 1: Market Analysis
  const stage1Result = await testResearchStage(previewUrl, 1, TEST_BUSINESS_CONTEXT);
  results.push(stage1Result);
  if (!stage1Result.success) {
    console.error('🚨 Stage 1 failed! Cannot continue with sequential stages.');
    throw new Error('Stage 1 failed');
  }
  const stage1Data = JSON.parse(JSON.stringify(stage1Result.validation));

  // Stage 2: Buyer Psychology
  const stage2Result = await testResearchStage(previewUrl, 2, {
    context: TEST_BUSINESS_CONTEXT,
    stage1: stage1Data,
  });
  results.push(stage2Result);
  if (!stage2Result.success) {
    console.error('🚨 Stage 2 failed! Cannot continue.');
    throw new Error('Stage 2 failed');
  }
  const stage2Data = JSON.parse(JSON.stringify(stage2Result.validation));

  // Stage 3: Competitive Analysis
  const stage3Result = await testResearchStage(previewUrl, 3, {
    context: TEST_BUSINESS_CONTEXT,
    stage1: stage1Data,
    stage2: stage2Data,
  });
  results.push(stage3Result);
  if (!stage3Result.success) {
    console.error('🚨 Stage 3 failed! Cannot continue.');
    throw new Error('Stage 3 failed');
  }
  const stage3Data = JSON.parse(JSON.stringify(stage3Result.validation));

  // Stage 4: Avatar Creation (MOST CRITICAL)
  console.log('\n⚠️  Stage 4 (Avatar Creation) - CRITICAL TEST\n');
  const stage4Result = await testResearchStage(previewUrl, 4, {
    context: TEST_BUSINESS_CONTEXT,
    stage1: stage1Data,
    stage2: stage2Data,
    stage3: stage3Data,
  });
  results.push(stage4Result);
  if (!stage4Result.success) {
    console.error('🚨 CRITICAL: Stage 4 (Avatar Creation) failed! This is the most complex stage.');
    throw new Error('Stage 4 failed');
  }
  const stage4Data = JSON.parse(JSON.stringify(stage4Result.validation));

  // Stage 5: Offer Design
  const stage5Result = await testResearchStage(previewUrl, 5, {
    context: TEST_BUSINESS_CONTEXT,
    stage1: stage1Data,
    stage2: stage2Data,
    stage3: stage3Data,
    stage4: stage4Data,
  });
  results.push(stage5Result);
  if (!stage5Result.success) {
    console.error('🚨 Stage 5 failed! Cannot continue.');
    throw new Error('Stage 5 failed');
  }
  const stage5Data = JSON.parse(JSON.stringify(stage5Result.validation));

  // Prepare complete offer context for stages 7-13
  const completeOfferContext: CompleteOfferContext = {
    business_context: TEST_BUSINESS_CONTEXT,
    research_data: {
      stage1_market_analysis: stage1Data,
      stage2_buyer_psychology: stage2Data,
      stage3_competitive_analysis: stage3Data,
      stage4_avatar_creation: stage4Data,
      stage5_offer_design: stage5Data,
    },
    user_preferences: TEST_OFFER_PREFERENCES,
  };

  // OFFER DESIGN STAGES (7-13)
  console.log('\n💎 Testing Offer Design Stages (7-13)\n');

  for (let stage = 7; stage <= 13; stage++) {
    const result = await testOfferStage(previewUrl, stage, completeOfferContext);
    results.push(result);
    if (!result.success) {
      console.error(`🚨 Stage ${stage} failed!`);
    }
  }

  // Calculate summary
  const totalTime = Date.now() - startTime;
  const successfulStages = results.filter(r => r.success).length;
  const failedStages = results.filter(r => !r.success).length;
  const averageQualityScore = results.reduce((sum, r) => sum + r.validation.qualityScore, 0) / results.length;
  const totalErrors = results.reduce((sum, r) => sum + r.validation.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.validation.warnings.length, 0);

  const testRun: TestRun = {
    timestamp: new Date().toISOString(),
    previewUrl,
    upgradePhase: upgradeStatus.phase,
    stagesBaseline: upgradeStatus.baseline,
    stagesUpgraded: upgradeStatus.upgraded,
    results,
    summary: {
      totalStages: results.length,
      successfulStages,
      failedStages,
      totalTime,
      averageQualityScore: Math.round(averageQualityScore),
      totalErrors,
      totalWarnings,
    },
  };

  // Print summary
  console.log('\n\n📈 TEST SUMMARY\n');
  console.log(`Total Stages: ${testRun.summary.totalStages}`);
  console.log(`✅ Successful: ${testRun.summary.successfulStages}`);
  console.log(`❌ Failed: ${testRun.summary.failedStages}`);
  console.log(`⏱️  Total Time: ${(testRun.summary.totalTime / 1000).toFixed(1)}s`);
  console.log(`📊 Average Quality Score: ${testRun.summary.averageQualityScore}%`);
  console.log(`⚠️  Total Errors: ${testRun.summary.totalErrors}`);
  console.log(`💡 Total Warnings: ${testRun.summary.totalWarnings}\n`);

  // Save results
  const resultsDir = path.join(__dirname, 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = path.join(resultsDir, `model-upgrade-${timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(testRun, null, 2));
  console.log(`💾 Results saved to: ${resultsFile}\n`);

  return testRun;
}

/**
 * Main execution
 */
async function main() {
  const previewUrl = process.argv[2];

  if (!previewUrl) {
    console.error('Usage: npx tsx test-model-upgrade.ts <preview-url>');
    console.error('Example: npx tsx test-model-upgrade.ts https://abc123.vanilla-chat-demo-tmpl-al4.pages.dev');
    process.exit(1);
  }

  try {
    const testRun = await runTestSuite(previewUrl);

    if (testRun.summary.failedStages > 0) {
      console.error('❌ TEST SUITE FAILED');
      console.error(`${testRun.summary.failedStages} stage(s) failed validation`);
      process.exit(1);
    } else {
      console.log('✅ TEST SUITE PASSED');
      console.log('All stages generated successfully with valid data');
      process.exit(0);
    }
  } catch (error) {
    console.error('🚨 TEST SUITE ERROR:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
