# Market Research Generator

Comprehensive market research and offer design tool powered by Cloudflare Workers AI.

## Features

- **18-Field Context Collection** - 3-step wizard form captures complete business context
- **Multi-Stage Generation** (Beta) - 6 sequential AI calls for complete data with NO placeholders
- **Single-Stage Generation** (Legacy) - Fast generation that may include placeholder text
- **AI-Powered Analysis** - Generates comprehensive market research reports
- **Real-Time Progress Tracking** - Visual status updates for each stage (⏳ → ✅)
- **Comprehensive Coverage** - Market validation, buyer psychology, competitive intelligence, avatar creation, offer design
- **Streaming Results** - Real-time report generation with live markdown rendering
- **Quality Validation** - Client-side checks ensure detailed inputs for better outputs
- **LocalStorage Persistence** - Saves reports, preferences, and context for later reference

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

### 3. Choose Generation Mode

**Multi-Stage (Recommended for Quality):**
- Enable "Use Beta Multi-Stage Generation" checkbox in header
- Takes 15-20 minutes
- Generates reports with 100% complete data, NO placeholders
- 6 visible stages with progress tracking

**Single-Stage (Fast but may be incomplete):**
- Leave checkbox unchecked
- Takes 8-12 minutes
- May include `[placeholder]` text in some sections
- Good for quick drafts

### 4. Generate Report

Click "Generate Research Report" and watch as the AI creates:

**Multi-Stage Mode (6 Stages):**
- 📊 **Stage 1:** Market Analysis - Growth rate, Power 4% identification
- 🧠 **Stage 2:** Buyer Psychology - Real buyer quotes, fears, desires
- 🎯 **Stage 3:** Competitive Analysis - Specific competitor intelligence
- 👤 **Stage 4:** Avatar Creation - Named persona with day-in-life narratives
- 💎 **Stage 5:** Offer Design - 3-tier pricing, marketing messages, bonuses
- 📝 **Stage 6:** Report Synthesis - Complete markdown report with all data

**Single-Stage Mode (Legacy):**
- Generates report in one streaming call
- May include placeholder text if token limits exceeded

### 5. Export & Use

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
  types.ts                              # BusinessContext interface
  prompts/
    master-research-prompt.ts           # 18-field prompt template
  components/
    research-form.tsx                   # 3-step wizard JSX
  index.tsx                             # Routes: /research, /api/research

public/static/
  research.js                           # Form logic, validation, streaming
```

### API Endpoint

**POST /api/research**

Request body: `BusinessContext` object with all 18 fields

Response: Streaming markdown report (8,000 tokens = ~6,000 words)

AI Configuration:
- Model: `@cf/meta/llama-3.1-70b-instruct`
- max_tokens: 8,000 (reduced to fit within 24K context window)
- Context window: 24,000 tokens (model limit)
- Typical usage: ~15K input + 8K output = ~23K total

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

**Single-Stage (Legacy):**
- **Per Report:** ~$0.13
- **Token Breakdown:**
  - Input: ~15,000 tokens (prompt) = $0.05
  - Output: 8,000 tokens (report) = $0.08
  - Total: ~$0.13 per report
- **Limitation:** Often incomplete with placeholders

**Multi-Stage (Recommended):**
- **Per Report:** ~$0.30 (2.3x more expensive)
- **Token Breakdown:**
  - Stage 1: ~7K total tokens
  - Stage 2: ~9.5K total tokens
  - Stage 3: ~7.5K total tokens
  - Stage 4: ~10K total tokens
  - Stage 5: ~10.5K total tokens
  - Stage 6: ~21K total tokens
  - Total: ~65K tokens across all 6 calls
- **Value:** 100% complete data with NO placeholders

**Monthly (100 reports):**
- Single-Stage: ~$13
- Multi-Stage: ~$30
- **ROI:** Higher cost justified by complete, actionable reports

**No additional services required** (uses existing Workers AI binding)

## Tips for Best Results

1. **Use Multi-Stage Mode** - Enable the beta toggle for complete reports with NO placeholders
2. **Be detailed** - More context = better insights (especially important for multi-stage)
3. **Use specific language** - Include exact phrases your customers use
4. **Fill optional fields** - Competitors and current customers add valuable context
5. **Review quality warnings** - Accept them if you're okay with shorter insights
6. **Save your report** - Use copy button to save to your documents
7. **Be patient** - Multi-stage takes 15-20 minutes but delivers professional-quality reports

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
- **Single-Stage:** 8-12 minutes
- **Multi-Stage:** 15-20 minutes (worth the wait for complete data)
- Don't close the browser window during generation
- Check browser console for errors
- Use `wrangler pages deployment tail` to see real-time progress logs

**"Report has placeholder text like [Fear 2] or [Competitor 1]"**
- This happens with single-stage generation when token limits are exceeded
- **Solution:** Enable "Use Beta Multi-Stage Generation" toggle
- Multi-stage guarantees NO placeholders - every section filled with real data

**"Multi-stage stuck on a stage"**
- Each stage has 3 retry attempts with exponential backoff
- Check browser console for error messages
- Check `wrangler pages deployment tail` for backend errors
- If persistent, refresh and try again (form data is saved in LocalStorage)

**"Report cut off or too short"**
- Ensure you're using multi-stage mode for complete reports
- Check logs to confirm all 6 stages completed
- Single-stage limited to 8,000 tokens and may be incomplete

## Future Enhancements

Potential upgrades (not currently implemented):

- KV storage for report persistence
- User accounts and report history
- PDF export functionality
- Email delivery of completed reports
- Progress indicators during generation
- Pause/resume capability (requires Workflows)
- Multiple report versions for A/B testing
