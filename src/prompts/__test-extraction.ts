// TEST FILE - Validation of research-data-extractor.ts
// This file should be deleted after validation

import { extractEssentialResearchData, validateExtractionSize } from './research-data-extractor';
import type { CompleteResearchData } from '../types/research-stages';

// Mock complete research data (realistic example)
const mockResearchData: CompleteResearchData = {
  stage1_market_analysis: {
    market_growth_rate: '11.2% annually',
    market_size_2024: '$4.8 billion',
    market_size_2025_projected: '$5.3 billion',
    bleeding_neck_problem: 'Inefficient time management leading to burnout',
    purchasing_power: {
      average_household_income: '$250,000 - $500,000',
      discretionary_spending: '$10,000 - $20,000 per year',
    },
    targetability: {
      platform_fit: 'Facebook and Instagram',
      targeting_interests: ['tech entrepreneurship', 'leadership development', 'productivity'],
      targeting_behaviors: ['small business owners', 'executives'],
      difficulty_score: 8,
    },
    top_20_percent: {
      demographics: 'Tech leaders aged 35-42',
      psychographics: 'Value innovation and personal growth',
      characteristics: 'Highly motivated',
    },
    power_4_percent: {
      demographics: 'Tech leaders aged 38-40, income $500K-$1M',
      psychographics: 'Value innovation and disruption',
      buying_frequency: 'Every 12-18 months',
      lifetime_value: '$50,000 - $100,000',
      differentiation: 'Commitment to excellence',
    },
  },
  stage2_buyer_psychology: {
    buyer_language: [
      { exact_phrase: 'I feel overwhelmed', meaning_context: 'Too many priorities', emotional_tone: 'frustration', usage_frequency: 'high', marketing_application: 'Pain-based messaging' },
      { exact_phrase: 'Work-life balance is a myth', meaning_context: 'Skepticism about solutions', emotional_tone: 'frustration', usage_frequency: 'high', marketing_application: 'Address objections' },
      { exact_phrase: 'I want more time with family', meaning_context: 'Core desire', emotional_tone: 'desire', usage_frequency: 'high', marketing_application: 'Desire-based messaging' },
      { exact_phrase: 'Tried productivity hacks, nothing works', meaning_context: 'Past failures', emotional_tone: 'frustration', usage_frequency: 'medium', marketing_application: 'Differentiation' },
      { exact_phrase: 'Need a proven system', meaning_context: 'Want structured approach', emotional_tone: 'hope', usage_frequency: 'high', marketing_application: 'Positioning' },
    ],
    top_fears: [
      { name: 'Burnout', intensity: 9, quote: "I'm terrified of burning out and losing everything I've built", root_emotion: 'fear', purchase_blocker: 'Afraid solutions will add more work', how_offer_addresses: 'Focus on reduction and simplification, not addition', is_surface_fear: false },
      { name: 'Missing family moments', intensity: 8, quote: "I don't want to miss my kids growing up", root_emotion: 'guilt', purchase_blocker: 'Skeptical about work-life balance promises', how_offer_addresses: 'Concrete time-blocking and boundary systems', is_surface_fear: false },
      { name: 'Career stagnation', intensity: 7, quote: "What if I slow down and fall behind?", root_emotion: 'fear', purchase_blocker: 'Worried about productivity loss', how_offer_addresses: 'Show how efficiency creates more career opportunities', is_surface_fear: true },
    ],
    top_desires: [
      { name: 'Time freedom', intensity: 10, aspirational_quote: "I want to work 30-40 hours and achieve more than I do in 60", deeper_meaning: 'freedom', timeline_expectation: '3-6 months', willingness_to_pay: '$10,000-$25,000', how_business_delivers: 'Time Mastery System teaches prioritization' },
      { name: 'Present with family', intensity: 9, aspirational_quote: "I want to be fully present when I'm with my family", deeper_meaning: 'balance', timeline_expectation: '1-3 months', willingness_to_pay: '$5,000-$15,000', how_business_delivers: 'Boundary-setting frameworks' },
      { name: 'Peak performance', intensity: 8, aspirational_quote: "I want to be at my best in all areas of life", deeper_meaning: 'validation', timeline_expectation: '6-12 months', willingness_to_pay: '$15,000-$30,000', how_business_delivers: 'Holistic approach to energy management' },
    ],
    top_pain_points: [
      { frustration: 'Always behind on email', quote: "My inbox has 500 unread messages and I can't keep up", root_emotion: 'overwhelm', what_theyve_tried: 'Inbox zero methods, email apps', why_it_didnt_work: "Doesn't address root prioritization issues", how_unique_mechanism_solves: 'Teach what not to respond to, not how to respond faster' },
      { frustration: 'No time for strategy', quote: "I'm so busy with execution I never have time to think strategically", root_emotion: 'fear', what_theyve_tried: 'Time blocking, calendar apps', why_it_didnt_work: 'Calendar still filled with urgent tasks', how_unique_mechanism_solves: 'Create protected strategic thinking time weekly' },
      { frustration: 'Meetings take over day', quote: "Back-to-back meetings leave no time for actual work", root_emotion: 'anger', what_theyve_tried: 'Saying no, shorter meetings', why_it_didnt_work: "Can't say no to everything", how_unique_mechanism_solves: 'Meeting audit and delegation framework' },
    ],
    barriers: [
      { barrier: 'Time to implement', type: 'internal', objection_handling_script: "Our system is designed for busy executives - 15 min/week to implement" },
      { barrier: 'Skepticism about change', type: 'internal', objection_handling_script: "We show quick wins in week 1 to build momentum and belief" },
    ],
    price_justification: 'If time management saves even 5 hours/week at $200/hour value, ROI is $52K annually',
  },
  stage3_competitive_analysis: {
    competitors: [
      { name: 'Time Management App X', price_point: '$20/month ($240/year)', positioning: 'Tech solution for productivity', strengths: 'Easy to use, cheap', weaknesses: 'No coaching, generic system', target_audience: 'General professionals' },
    ],
    positioning_gaps: ['Personal 1:1 coaching with proven framework'],
    differentiation_opportunities: ['Combine tech + human coaching', 'Focus on executives specifically'],
    unique_value_proposition: 'Only system combining Time Mastery Framework with executive 1:1 coaching',
    competitive_pricing_analysis: 'Competitors range $200-$5,000, we can price premium at $10K-$25K',
    why_business_wins: 'Personal attention + proven framework vs generic apps',
  },
  stage4_avatar_creation: {
    avatar_name: 'Sarah Chen',
    demographics: {
      age_range: '38-42',
      household_income: '$500,000-$750,000',
      geographic_location: 'San Francisco Bay Area',
      profession_industry: 'Tech VP / Director',
      family_status: 'Married with 2 kids (ages 5-10)',
      education: 'MBA or technical graduate degree',
    },
    psychographics: {
      core_values: ['Excellence', 'Family', 'Innovation'],
      beliefs_about_niche: 'Believes in working smarter not harder',
      daily_lifestyle: 'Wakes 5:30am, works until 7pm, struggles with boundaries',
      media_consumption: ['LinkedIn', 'Tech blogs', 'Podcasts during commute'],
    },
    day_in_life: {
      morning_routine: '5:30am wake, email check, gym, family breakfast',
      workday_experience: 'Back-to-back meetings, lunch at desk, constant email',
      evening_routine: 'Home 7pm, quick dinner, kids bedtime, more email until midnight',
      weekend_routine: 'Try to disconnect but check email multiple times',
      pain_point_moments: ['Missing kids events due to meetings', 'Working weekends', 'Exhausted evenings'],
    },
    buying_triggers: {
      optimal_contact_days: ['Sunday evening', 'Tuesday morning'],
      optimal_contact_times: ['7-9pm Sunday', '6-8am Tuesday'],
      decision_making_windows: 'Quarterly planning periods (Jan, Apr, Jul, Oct)',
      platform_preferences: ['LinkedIn', 'Facebook'],
      content_format_preferences: ['Video testimonials', 'Case studies', 'Email'],
    },
    online_communities: [
      { platform: 'Facebook', name: 'Women in Tech Leadership', url: '', member_count: '45,000', engagement_level: 'high', trust_factor: 'High - vetted members only', tone_and_norms: 'Supportive, professional', top_topics: ['Work-life balance', 'Career growth'], top_post_examples: ['"How do you handle burnout?"', '"Best productivity systems?"'], advertising_opportunity: 'High - open to coaching ads' },
    ],
    top_3_hopes: ['Be present with family', 'Excel at work without sacrificing health', 'Build something meaningful'],
    top_3_fears: ['Burnout', 'Missing family moments', 'Career stagnation'],
    top_3_barriers: [
      { barrier: 'Time to implement', solution: 'Quick-start 15-min weekly system' },
    ],
    recommended_tone: 'Professional but warm, data-driven but empathetic',
    price_sensitivity: 'low',
    price_sensitivity_justification: '$500K+ income, values time over money, willing to invest in solutions',
  },
  stage5_offer_design: {
    core_offer: {
      offer_name: 'Executive Time Mastery Accelerator',
      target_outcome: 'Work 40 hours/week while achieving 20% more output in 90 days',
      pain_points_solved: ['Email overwhelm', 'No strategic thinking time', 'Meeting overload'],
      desires_delivered: ['Time freedom', 'Present with family', 'Peak performance'],
      unique_positioning: 'Only system combining proven framework with 1:1 executive coaching',
    },
    pricing_tiers: [
      { tier_number: 1, tier_name: 'Foundation', price: '$5,000', deliverables: ['12-week program', 'Group coaching'], best_for: 'Self-motivated learners', is_recommended: false },
      { tier_number: 2, tier_name: 'VIP Accelerator', price: '$15,000', deliverables: ['1:1 coaching', 'Custom roadmap', 'Unlimited support'], best_for: 'Busy executives', is_recommended: true },
      { tier_number: 3, tier_name: 'Platinum', price: '$30,000', deliverables: ['Weekly 1:1', 'Done-with-you implementation'], best_for: 'C-suite leaders', is_recommended: false },
    ],
    payment_plans: [
      { name: 'Pay in Full', structure: '$13,500 one-time (save $1,500)', total_cost: '$13,500' },
    ],
    marketing_messages: [
      { type: 'pain-based', headline: 'Stop Working 60-Hour Weeks While Missing Your Family', usage: 'Facebook ads' },
    ],
    guarantee: {
      guarantee_text: 'Complete program, implement systems, attend sessions. If you don\'t reclaim at least 10 hours/week within 90 days, we continue at no cost until you do - or full refund.',
      why_it_works: 'Outcome-based guarantee tied to measurable result (10 hours/week)',
    },
    bonuses: [
      { name: 'Fast-Track Templates', value: '$1,500', addresses_desire: 'Time freedom', how_it_speeds_results: 'Pre-built templates eliminate 20 hours of setup' },
    ],
    first_campaign: {
      platform: 'Facebook to Women in Tech Leadership groups',
      message: 'Stop Working 60-Hour Weeks While Missing Your Family',
      offer_configuration: 'Promote VIP tier with all bonuses',
      launch_timeline: 'Launch Sunday 7pm, run 5 days',
    },
  },
};

// Test extraction
console.log('Testing research data extraction...\n');

const extractedData = extractEssentialResearchData(mockResearchData);
const validation = validateExtractionSize(extractedData);

console.log(validation.message);
console.log(`Character count: ${validation.characterCount}`);
console.log(`Estimated tokens: ${validation.estimatedTokens}`);
console.log(`\nExtracted data preview (first 500 chars):\n${extractedData.substring(0, 500)}...`);

if (!validation.valid) {
  console.error('\n❌ VALIDATION FAILED: Extraction exceeds token budget');
  console.error('ACTION REQUIRED: Reduce extracted content to stay within 850 token target');
  process.exit(1);
}

console.log('\n✅ All extraction tests passed!');
