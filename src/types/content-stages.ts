// Content Generation Stage Output Interfaces
// Stage 17: Content Pillar Strategy

export interface ContentPillar {
  pillar_name: string; // 2-4 word pillar name (e.g., "Authority Building")
  pillar_description: string; // What this pillar is about (100-200 chars)
  audience_value_proposition: string; // Why audience cares about this content
  business_goal: string; // How this pillar serves business outcomes
  buyer_psychology_tie: string; // Which research insights this leverages (fears, desires, language)
  example_topics: string[]; // 10-15 specific topic ideas for this pillar
  post_frequency_percentage: number; // % of content calendar (should sum to 100% across pillars)
}

export interface ContentPillarStrategy {
  pillar_count: 3 | 4 | 5; // Number of content pillars generated
  pillars: ContentPillar[]; // Array of 3-5 content pillars

  content_mix_framework: {
    educational: number; // % of educational content (typically 40-50%)
    entertaining: number; // % of entertaining content (typically 20-30%)
    promotional: number; // % of promotional content (typically 15-20%)
    engagement: number; // % of engagement content (typically 10-15%)
  };

  strategic_rationale: string; // Why these specific pillars for this business
  competitive_differentiation: string; // How these pillars set business apart from competitors
}
