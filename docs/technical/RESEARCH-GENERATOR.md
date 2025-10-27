# Market Research Generator

Comprehensive market research and offer design tool powered by Cloudflare Workers AI.

## Features

- **18-Field Context Collection** - 3-step wizard form captures complete business context
- **6-Stage Generation Architecture** - Sequential AI calls for complete data with NO placeholders
- **AI-Powered Analysis** - Generates comprehensive market research reports (~6,000 words)
- **Real-Time Progress Tracking** - Visual status updates for each stage (⏳ → ✅)
- **Comprehensive Coverage** - Market validation, buyer psychology, competitive intelligence, avatar creation, offer design
- **Streaming Results** - Real-time report generation with live markdown rendering
- **Quality Validation** - Client-side checks ensure detailed inputs for better outputs
- **LocalStorage Persistence** - Saves reports and context for later reference

## How to Use

### 1. Navigate to Research Page

Visit `/research` on your deployed site (or locally at `http://localhost:8788/research`)

### 2. Complete 3-Step Form

**Step 1: Business Foundation (7 fields)**
- Business name
- Current offer description (detailed - aim for 100+ words)
- Niche/industry
- Specialization keywords
- Business stage
- Revenue range
- Market category

**Step 2: Target Market Context (5 fields)**
- Target market hypothesis
- Demographics (age, gender, income, location, etc.)
- Psychographics (values, beliefs, lifestyle)
- Current customers (optional)
- Biggest customer pain point

**Step 3: Offer Context (6 fields)**
- Service type
- Delivery format
- Current price point
- Desired price point (optional)
- Offer duration
- Unique mechanism
- Competitors' offers (optional)

### 3. Generate Report

Click "Generate Research Report" and watch as the AI creates your comprehensive report through 6 sequential stages:

**6-Stage Generation Process:**
- 📊 **Stage 1:** Market Analysis - Growth rate, market size, Power 4% identification
- 🧠 **Stage 2:** Buyer Psychology - Real buyer quotes, fears, desires, language patterns
- 🎯 **Stage 3:** Competitive Analysis - Specific competitor intelligence and differentiation opportunities
- 👤 **Stage 4:** Avatar Creation - Named persona with day-in-life narratives and decision criteria
- 💎 **Stage 5:** Offer Design - 3-tier pricing, marketing messages, bonuses, guarantees
- 📝 **Stage 6:** Report Synthesis - Complete ~6,000 word markdown report with all data

**Generation Time:** 15-20 minutes
**Quality:** 100% complete data with NO placeholders
**Output:** Professional, client-ready market intelligence report

### 4. Export & Use

- Copy to clipboard
- Save to your documents
- Use insights for marketing, offers, and positioning

## Example Use Case: Birth Coaching Business

```json
{
  "business_name": "Conscious Parenting Coaching",
  "current_offer_description": "6-month 1:1 coaching program for expectant mothers and new parents focused on breaking generational trauma cycles through somatic healing and conscious parenting education",
  "niche": "Prenatal & parenting coaching with trauma-informed approach",
  "specialization_keywords": "trauma-informed, somatic healing, generational trauma, conscious parenting, holistic wellness",
  "business_stage": "startup",
  "revenue_range": "10k-50k",
  "preferred_market_category": "health",
  "target_market_hypothesis": "Highly successful, financially capable women or couples (30-45) who are trying to conceive or pregnant",
  "target_demographics": "Women 30-45, household income $150K+, college-educated, urban/suburban, professional careers",
  "target_psychographics": "Values conscious living, seeks holistic approaches, willing to do deep inner work, prioritizes child's emotional health",
  "biggest_customer_pain_point": "Fear of unconsciously repeating their parents' harmful patterns and passing trauma to their children",
  "service_type": "coaching",
  "delivery_format": "1:1",
  "price_point_current": "$5,000 for 6 months",
  "desired_price_point": "$15,000 for 6 months",
  "offer_duration": "6 months",
  "unique_mechanism": "Somatic Ancestral Healing™ - combines nervous system regulation, somatic trauma release, and conscious parenting frameworks to heal generational patterns at the body level before baby arrives",
  "competitors_offers": "BetterHelp therapy ($200-400/month), The Gottman Institute courses ($500), Jai Institute for Parenting ($3,000)"
}
```

## Technical Details

### Architecture

- **Frontend:** 3-step wizard form with Tailwind CSS
- **Backend:** Hono app with Workers AI binding
- **AI Model:** `@cf/meta/llama-3.1-70b-instruct` (most capable)
- **Streaming:** Real-time SSE streaming with EventSourceParserStream
- **Rendering:** markdown-it for markdown rendering
- **Storage:** LocalStorage for client-side persistence

### File Structure

```
src/
  types.ts                                    # BusinessContext interface
  types/
    research-stages.ts                        # Stage output interfaces
  prompts/
    stage1-market-analysis.ts                 # Stage 1 prompt
    stage2-buyer-psychology.ts                # Stage 2 prompt
    stage3-competitive-analysis.ts            # Stage 3 prompt
    stage4-avatar-creation.ts                 # Stage 4 prompt
    stage5-offer-design.ts                    # Stage 5 prompt
    stage6-report-synthesis-condensed.ts      # Stage 6 synthesis prompt
  components/
    research-form.tsx                         # 3-step wizard JSX
  index.tsx                                   # All routes and endpoints

public/static/
  research.js                                 # Form logic, multi-stage orchestration
```

### API Endpoints

**Stage Endpoints (POST):**
- `/api/research/stage/1` - Market Analysis (2.5K tokens JSON)
- `/api/research/stage/2` - Buyer Psychology (2.5K tokens JSON)
- `/api/research/stage/3` - Competitive Analysis (2K tokens JSON)
- `/api/research/stage/4` - Avatar Creation (2.5K tokens JSON)
- `/api/research/stage/5` - Offer Design (2.5K tokens JSON)

**Synthesis Endpoint (POST):**
- `/api/research/synthesize` - Final Report (8-12K tokens Markdown)

**Legacy Endpoint (POST):**
- `/api/research` - Returns 410 Gone (deprecated)

AI Configuration:
- Model: `@cf/meta/llama-3.1-70b-instruct`
- Context window: 24,000 tokens per call
- Each stage optimized to stay within limits
- Stage 6 uses condensed prompts to fit synthesis data

### Local Development

```bash
# Start dev server (mock AI responses)
npm run dev

# Visit http://localhost:8788/research
# Fill form and submit - will show mock response
```

### Remote Testing (Real AI)

```bash
# Build and deploy preview
npm run build
npm run preview:remote

# Visit preview URL at /research
# This uses real Workers AI
```

### Production Deployment

```bash
npm run deploy
```

Visit: `https://vanilla-chat-demo-tmpl-al4.pages.dev/research`

## Cost Estimates

**6-Stage Architecture:**
- **Per Report:** ~$0.30
- **Token Breakdown:**
  - Stage 1: ~7K total tokens
  - Stage 2: ~9.5K total tokens
  - Stage 3: ~7.5K total tokens
  - Stage 4: ~10K total tokens
  - Stage 5: ~10.5K total tokens
  - Stage 6: ~21K total tokens
  - **Total:** ~65K tokens across all 6 calls
- **Value:** 100% complete data with NO placeholders

**Monthly Usage (100 reports):**
- **Cost:** ~$30/month
- **ROI:** Professional-quality reports justify cost
- **Quality:** Every section filled with specific, actionable data

**No additional services required** (uses existing Workers AI binding)

## Tips for Best Results

1. **Be detailed** - More context = better insights across all 6 stages
2. **Use specific language** - Include exact phrases your customers use
3. **Fill optional fields** - Competitors and current customers add valuable context for competitive analysis
4. **Review quality warnings** - Accept them if you're okay with shorter insights
5. **Save your report** - Use copy button to save to your documents
6. **Be patient** - Generation takes 15-20 minutes but delivers professional-quality reports
7. **Watch stage progress** - Each stage emoji (⏳ → ✅) shows real-time progress

## Quality Validation

The form includes automatic quality checks:

- ✅ Required field validation
- ✅ Minimum length checks (50+ chars for critical fields)
- ✅ Specificity warnings (e.g., missing income in demographics)
- ✅ Pre-submission quality prompts

## Output Format

Reports are structured markdown with:

- Clear heading hierarchy (H1-H3)
- Tables for data (demographics, language, value stack)
- Bullet points for lists
- Bold for key insights and buyer quotes
- Specific numbers, percentages, prices throughout

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires `fetch` API for streaming
- Requires `TextDecoderStream` for response parsing
- Tested on Chrome, Firefox, Safari, Edge

## Troubleshooting

**"AI binding not available"**
- Deploy to Cloudflare Pages to access Workers AI
- Use `npm run preview:remote` for testing

**"Form validation failed"**
- Fill all required fields (marked with *)
- Ensure minimum lengths for detailed fields

**"Generation taking too long"**
- **Normal Duration:** 15-20 minutes for 6-stage generation
- Don't close the browser window during generation
- Check browser console for errors
- Use `wrangler pages deployment tail` to see real-time progress logs
- Each stage has its own timeout (45-60 seconds)

**"Stage stuck or failing"**
- Each stage has 3 retry attempts with exponential backoff
- Check browser console for error messages
- Check `wrangler pages deployment tail` for backend errors
- If persistent, refresh and try again (form data is saved in LocalStorage)
- Look for specific stage number in error message

**"Report cut off or too short"**
- Verify all 6 stages completed (all show ✅)
- Check logs to confirm synthesis stage (Stage 6) completed
- Refresh page and check LocalStorage for saved report

## Future Enhancements

Potential upgrades (not currently implemented):

- KV storage for report persistence
- User accounts and report history
- PDF export functionality
- Email delivery of completed reports
- Progress indicators during generation
- Pause/resume capability (requires Workflows)
- Multiple report versions for A/B testing
