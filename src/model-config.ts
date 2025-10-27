/**
 * Model Configuration System for Multi-Stage Generation
 *
 * Progressive model upgrade strategy:
 * - Llama 3.1 70B FP8 Fast: Analytical and strategic stages (10-20% faster)
 * - Llama 3.1 70B Instruct: Creative stages with complex JSON (proven stable)
 * - Mistral Small 3.1 24B: Synthesis stage (128K context for full data)
 *
 * UPGRADE HISTORY:
 * - Jan 26, 2025: Attempted Llama 3.3 upgrade, failed at Stage 4, rolled back
 * - Jan 27, 2025: Progressive upgrade plan with per-stage configuration
 */

// Available Models on Cloudflare Workers AI
export const MODELS = {
  // Llama 3.1 70B - Proven stable, regular precision
  LLAMA_31_70B_INSTRUCT: "@cf/meta/llama-3.1-70b-instruct",

  // Llama 3.1 70B FP8 Fast - Optimized quantization, 10-20% faster
  LLAMA_31_70B_FP8_FAST: "@cf/meta/llama-3.1-70b-instruct-fp8-fast",

  // Llama 3.3 70B - TOO NEW, caused Stage 4 failures, DO NOT USE
  LLAMA_33_70B_FP8_FAST: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",

  // Mistral Small 3.1 24B - 128K context (5.3x larger than Llama)
  MISTRAL_SMALL_31_24B: "@cf/mistralai/mistral-small-3.1-24b-instruct",
} as const;

// Model characteristics for decision-making
export const MODEL_SPECS = {
  [MODELS.LLAMA_31_70B_INSTRUCT]: {
    contextWindow: 24000,
    costInput: 0.293, // per M tokens
    costOutput: 2.253,
    precision: "fp16",
    speed: "baseline",
    stability: "proven",
    bestFor: ["creative", "complex-json", "narrative"],
  },
  [MODELS.LLAMA_31_70B_FP8_FAST]: {
    contextWindow: 24000,
    costInput: 0.293,
    costOutput: 2.253,
    precision: "fp8",
    speed: "10-20% faster",
    stability: "expected-high",
    bestFor: ["analytical", "strategic", "structured"],
  },
  [MODELS.MISTRAL_SMALL_31_24B]: {
    contextWindow: 128000,
    costInput: 0.351,
    costOutput: 0.555,
    precision: "unknown",
    speed: "unknown",
    stability: "unknown",
    bestFor: ["synthesis", "long-context"],
  },
} as const;

// Stage type classification
export type StageType =
  | "analytical"      // Data-driven research
  | "creative"        // Narrative and persona creation
  | "strategic"       // Offer design and pricing
  | "synthesis";      // Long-form report generation

// Per-stage model configuration
export interface StageConfig {
  stageNumber: number;
  stageName: string;
  stageType: StageType;
  model: string;
  maxTokens: number;
  reasoning: string;
}

/**
 * Stage Model Configuration Matrix
 *
 * UPGRADE PHASES:
 * - Phase 0 (Baseline): All stages use LLAMA_31_70B_INSTRUCT
 * - Phase 1: Stages 1-3 upgrade to FP8 Fast
 * - Phase 2: Stage 5 + Stages 7-9 upgrade to FP8 Fast
 * - Phase 3: Stages 10-13 upgrade to FP8 Fast
 * - Phase 4: Stage 6 upgrade to Mistral 128K
 * - Stage 4 ALWAYS stays on LLAMA_31_70B_INSTRUCT (most complex)
 */
export const STAGE_MODEL_CONFIG: Record<number, StageConfig> = {
  // RESEARCH STAGES (1-6)
  1: {
    stageNumber: 1,
    stageName: "Market Analysis",
    stageType: "analytical",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 1
    maxTokens: 2500,
    reasoning: "Analytical market data and Power 4% identification",
  },
  2: {
    stageNumber: 2,
    stageName: "Buyer Psychology",
    stageType: "analytical",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 1
    maxTokens: 2500,
    reasoning: "Buyer language, fears, desires extraction",
  },
  3: {
    stageNumber: 3,
    stageName: "Competitive Analysis",
    stageType: "analytical",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 1
    maxTokens: 2000,
    reasoning: "Competitor intelligence and positioning gaps",
  },
  4: {
    stageNumber: 4,
    stageName: "Avatar Creation",
    stageType: "creative",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // KEEP STABLE - Most complex JSON + narrative
    maxTokens: 2500,
    reasoning: "CRITICAL: 40+ field JSON with creative narratives. Failed with Llama 3.3. Keep proven stable model.",
  },
  5: {
    stageNumber: 5,
    stageName: "Offer Design",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Test FP8_FAST in Phase 2 after Stage 4 validates
    maxTokens: 2500,
    reasoning: "3-tier pricing, marketing messages, guarantees",
  },
  6: {
    stageNumber: 6,
    stageName: "Report Synthesis",
    stageType: "synthesis",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to MISTRAL_SMALL in Phase 4 (128K context)
    maxTokens: 12000,
    reasoning: "6K word report. Currently uses condensed data. Mistral 128K would allow full data.",
  },

  // OFFER DESIGN STAGES (7-13)
  7: {
    stageNumber: 7,
    stageName: "Offer Rationale",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 2
    maxTokens: 2500,
    reasoning: "3 offer positioning options with strategic angles",
  },
  8: {
    stageNumber: 8,
    stageName: "Value Stack",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 2
    maxTokens: 2500,
    reasoning: "5-7 value components with perceived value calculation",
  },
  9: {
    stageNumber: 9,
    stageName: "Pricing Framework",
    stageType: "analytical",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 2
    maxTokens: 2500,
    reasoning: "Price anchoring and sensitivity mitigation",
  },
  10: {
    stageNumber: 10,
    stageName: "Payment Plans",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 3
    maxTokens: 2000,
    reasoning: "2-3 payment options with conversion psychology",
  },
  11: {
    stageNumber: 11,
    stageName: "Premium Bonuses",
    stageType: "creative",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Test FP8_FAST in Phase 3 (after Stage 5 validates)
    maxTokens: 2500,
    reasoning: "3-5 bonuses with value and delivery timing",
  },
  12: {
    stageNumber: 12,
    stageName: "Power Guarantee",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Upgrade to FP8_FAST in Phase 3
    maxTokens: 2500,
    reasoning: "3 guarantee options with risk assessment",
  },
  13: {
    stageNumber: 13,
    stageName: "Scarcity & Upsells",
    stageType: "creative",
    model: MODELS.LLAMA_31_70B_INSTRUCT, // TODO: Test FP8_FAST in Phase 3 (after Stage 5 validates)
    maxTokens: 3000,
    reasoning: "3 order bumps + 2 upsells + scarcity mechanisms",
  },

  // CONTENT STRATEGY STAGES (17-20)
  17: {
    stageNumber: 17,
    stageName: "Content Pillars",
    stageType: "strategic",
    model: MODELS.LLAMA_31_70B_INSTRUCT,
    maxTokens: 3000,
    reasoning: "3-5 strategic content themes with buyer psychology integration, example topics, and frequency allocation",
  },
};

/**
 * Get model configuration for a specific stage
 */
export function getStageModelConfig(stageNumber: number): StageConfig {
  const config = STAGE_MODEL_CONFIG[stageNumber];
  if (!config) {
    throw new Error(`No model configuration found for stage ${stageNumber}`);
  }
  return config;
}

/**
 * Get model for a specific stage
 */
export function getStageModel(stageNumber: number): string {
  return getStageModelConfig(stageNumber).model;
}

/**
 * Get max tokens for a specific stage
 */
export function getStageMaxTokens(stageNumber: number): number {
  return getStageModelConfig(stageNumber).maxTokens;
}

/**
 * Get all stages by type
 */
export function getStagesByType(type: StageType): StageConfig[] {
  return Object.values(STAGE_MODEL_CONFIG).filter(config => config.stageType === type);
}

/**
 * Get upgrade status - which stages are using upgraded models
 */
export function getUpgradeStatus(): {
  baseline: number[];
  upgraded: number[];
  phase: string;
} {
  const baseline: number[] = [];
  const upgraded: number[] = [];

  Object.values(STAGE_MODEL_CONFIG).forEach(config => {
    if (config.model === MODELS.LLAMA_31_70B_INSTRUCT) {
      baseline.push(config.stageNumber);
    } else {
      upgraded.push(config.stageNumber);
    }
  });

  // Determine current phase
  let phase = "Phase 0: Baseline";
  if (upgraded.length > 0) {
    if (upgraded.length <= 3) phase = "Phase 1: Analytical stages";
    else if (upgraded.length <= 7) phase = "Phase 2: Strategic stages";
    else if (upgraded.length <= 11) phase = "Phase 3: Creative stages";
    else phase = "Phase 4: All stages upgraded";
  }

  return { baseline, upgraded, phase };
}
