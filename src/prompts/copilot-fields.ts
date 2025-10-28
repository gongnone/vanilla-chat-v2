/**
 * Field-Specific Prompt Enhancements
 *
 * These enhance the system prompt for specific form fields that users commonly struggle with.
 * Each enhancement provides specialized instructions to help the AI provide better, more
 * contextual assistance for that particular field.
 */

/**
 * Target Psychographics Field Enhancement
 * Most confusing field for users - needs extra help explaining values, beliefs, lifestyle
 */
export const PSYCHOGRAPHICS_ENHANCEMENT = `
## Special Instructions for "Target Psychographics"
This field confuses most users. Help them understand:
- Psychographics = VALUES (what matters to them) + BELIEFS (what they think is true) + LIFESTYLE (how they spend time/money)
- Give 3-5 specific examples based on their business niche
- Use phrases like "They probably value..." and "They might believe..."
- Format as a paragraph, not bullets (feels more natural)

Example good response:
"Psychographics are your customers' values and beliefs - what drives their decisions beyond demographics. Based on your prenatal coaching business, your customers probably value holistic approaches and natural solutions. They likely believe that healing happens from within and that emotional wellness affects physical health. Their lifestyle probably includes things like yoga, therapy, and podcasts about personal growth. Want me to write that up for your form?"
`;

/**
 * Unique Mechanism Field Enhancement
 * Users often don't realize they HAVE a unique mechanism
 */
export const UNIQUE_MECHANISM_ENHANCEMENT = `
## Special Instructions for "Unique Mechanism"
Users often don't realize they HAVE a unique mechanism. Help them find it:
- Look at their specialization_keywords and current_offer_description
- Identify what makes their approach DIFFERENT (method, framework, philosophy)
- Name it if possible (e.g., "The [Benefit] [Method]")
- Explain WHY it's different from competitors

Example good response:
"Looking at what you've shared, I can see your unique mechanism! You combine trauma-informed practices with prenatal coaching, which most coaches don't do. Let me suggest: 'The Generational Healing Birth Method - a trauma-informed approach that combines somatic practices with prenatal coaching to break cycles of birth trauma and create secure attachment from conception.' Does that sound close to what you do?"
`;

/**
 * Current Offer Description Field Enhancement
 * Users often write too little - need to expand with WHAT-WHO-DURATION-RESULT framework
 */
export const OFFER_DESCRIPTION_ENHANCEMENT = `
## Special Instructions for "Current Offer Description"
Users often write 1-2 sentences. Help them expand with the WHAT-WHO-DURATION-RESULT framework:
- Ask WHAT (format: 1:1, group, course?)
- Ask WHO (specific target customer)
- Ask HOW LONG (duration: weeks, months?)
- Ask WHAT RESULT (transformation they get)
- Offer to assemble their answers into a complete paragraph

Example good response:
"Good start! To get you a great report, I need a bit more detail. Can you tell me: How do you deliver this (1:1 calls? Group program? Course)? How long does it take (weeks? months?)? And what specific transformation do your clients get? I'll weave it all together for you into a complete description."
`;

/**
 * Target Demographics Field Enhancement
 * Users often write vague descriptions like "women 30-50" - need specificity
 */
export const DEMOGRAPHICS_ENHANCEMENT = `
## Special Instructions for "Target Demographics"
Users often write vague descriptions like "women 30-50". Help them be specific:
- Ask about AGE RANGE (narrow it: "30-50" → "35-42")
- Ask about INCOME (specific range: "$150K-$300K household income")
- Ask about LOCATION (urban/suburban? Specific cities?)
- Ask about EDUCATION level
- Ask about FAMILY STATUS (married? Kids? Pregnant?)

Example good response:
"Let's make this more specific so the AI gives you better insights. Instead of just 'women 30-50', can you narrow it? Like: 'Women 35-42, household income $200K-$400K, urban/suburban areas, college-educated, married or partnered, currently pregnant or planning pregnancy within 12 months.' See how much more detailed that is? Want me to help you build that level of detail?"
`;

/**
 * Get field-specific enhancement based on field name
 */
export function getFieldEnhancement(fieldName: string): string {
  switch (fieldName) {
    case 'target_psychographics':
      return PSYCHOGRAPHICS_ENHANCEMENT;
    case 'unique_mechanism':
      return UNIQUE_MECHANISM_ENHANCEMENT;
    case 'current_offer_description':
      return OFFER_DESCRIPTION_ENHANCEMENT;
    case 'target_demographics':
      return DEMOGRAPHICS_ENHANCEMENT;
    default:
      return '';
  }
}
