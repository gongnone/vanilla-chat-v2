# Content Strategy Generator - User Guide

**Last Updated**: January 27, 2025
**Version**: 1.0
**Feature URL**: `/content-strategy`

---

## 🎯 What is the Content Strategy Generator?

The Content Strategy Generator (Stage 17) creates a comprehensive content pillar strategy for your business based on your market research and offer design. It generates 3-5 strategic content themes (pillars) that establish your authority, attract your ideal customers, and drive business results.

**What You Get**:
- 3-5 Content Pillars (strategic themes for all your content)
- 10-15 Example Topics per pillar
- Content Mix Framework (Educational, Entertaining, Promotional, Engagement percentages)
- Strategic Rationale (why this strategy works for your business)
- Competitive Differentiation (how your content stands out)

**Time**: 3-4 minutes per generation
**Cost**: ~$0.02 per generation (AI costs)

---

## 📋 Prerequisites

Before using the Content Strategy Generator, you must complete:

### Required ✅
1. **Market Research** (`/research`) - Stages 1-6
   - Market analysis
   - Buyer psychology
   - Competitive analysis
   - Dream customer avatar
   - Offer design

### Optional (Highly Recommended) ⚡
2. **Offer Design** (`/offer-design`) - Stages 7-13
   - Offer rationale
   - Value stack
   - Pricing strategy
   - Unique mechanism

**Why Offer Data Helps**: Including your offer data aligns content pillars with your unique mechanism and positioning, creating more targeted and effective content strategy.

**Prerequisites Check**: The page automatically detects what data you have:
- 🔴 **Red**: Missing market research (cannot generate)
- 🟡 **Yellow**: Have research, missing offer (can generate but less targeted)
- 🟢 **Green**: Have both research + offer (best results)

---

## 🚀 Quick Start Guide

### Step 1: Complete Prerequisites
1. Navigate to `/research`
2. Complete the Market Intelligence Generator (all 6 stages)
3. *Optional*: Navigate to `/offer-design` and complete Offer Design

### Step 2: Navigate to Content Strategy
1. Go to `/content-strategy`
2. Check prerequisites notice (should be green if both completed)

### Step 3: Generate Your Content Strategy
1. Click **"🎯 Generate Content Pillars"** button
2. Wait 3-4 minutes while AI analyzes your data
3. Watch progress indicators:
   - ⏳ Analyzing your research data...
   - ⏳ Identifying strategic content themes...
   - ⏳ Creating example topics...
   - ✅ Content strategy complete!

### Step 4: Review Your Pillars
1. **Expand a Pillar**: Click pillar header to see details
2. **Review Components**:
   - Description (what this pillar covers)
   - Audience Value (why your audience cares)
   - Business Goal (how it drives results)
   - Buyer Psychology Tie (fear/desire it addresses)
   - Example Topics (10-15 content ideas)
   - Frequency Percentage (how often to post this type)

### Step 5: Save Your Strategy
1. Click **"💾 Save Strategy"** button
2. Toast notification confirms save
3. Strategy persists even if you close the browser

---

## 🔧 Feature Guide

### Accordion Interface

**Expand a Pillar**:
- Click pillar header → Content expands
- Chevron icon rotates to indicate state
- All pillars can be expanded simultaneously

**Collapse a Pillar**:
- Click header again → Content collapses

### Content Mix Framework

Visual bars show recommended content distribution:
- 📘 **Educational** (Blue): How-to guides, tutorials, insights
- 🎭 **Entertaining** (Green): Stories, case studies, behind-the-scenes
- 💰 **Promotional** (Purple): Product features, testimonials, offers
- 💬 **Engagement** (Orange): Questions, polls, community interaction

**Percentages add to 100%**: This framework ensures balanced content that builds trust while driving conversions.

### Edit Pillar Functionality

**When to Edit**:
- Want to adjust pillar name or description
- Need to modify audience value proposition
- Want to change frequency percentage
- Refine business goals or psychology ties

**How to Edit**:
1. Expand the pillar you want to edit
2. Click **"✏️ Edit"** button
3. Edit form appears with:
   - Pillar Name (max 50 characters)
   - Description (max 200 characters)
   - Value Proposition (max 150 characters)
   - Business Goal (max 150 characters)
   - Psychology Tie (max 150 characters)
   - Frequency Percentage (0-100)
4. Make your changes (character counters guide you)
5. Click **"💾 Save Changes"**
6. **Modified Badge** appears on edited pillars (yellow "MODIFIED" tag)
7. Modified fields highlighted with yellow background

**Cancel Edits**:
- Click **"❌ Cancel"** to discard changes
- Original values restored

**Character Limits**:
- Counter shows current/max characters
- 🟢 Green: Safe (0-80% of limit)
- 🟡 Orange: Warning (80-100% of limit)
- 🔴 Red: Error (over limit - save disabled)

### Save Strategy

**Manual Save**:
- Click **"💾 Save Strategy"** button
- Saves current strategy to browser storage
- Persists across browser sessions

**What Gets Saved**:
- All pillar data (original and modified)
- Content mix framework
- Strategic rationale
- Competitive differentiation
- Modification history

**Storage Location**: Browser LocalStorage (per-device, per-browser)

### Export to JSON

**When to Export**:
- Want to back up your strategy
- Need to share with team members
- Want to use data in other tools
- Creating archive of strategies

**How to Export**:
1. Click **"📥 Export JSON"** button
2. File downloads: `content-strategy-YYYYMMDD-HHMMSS.json`
3. Open file in text editor to view structured data

**JSON Structure**:
```json
{
  "pillar_count": 4,
  "pillars": [...],
  "content_mix_framework": {...},
  "strategic_rationale": "...",
  "competitive_differentiation": "...",
  "exported_at": "2025-01-27T10:30:00Z"
}
```

---

## 🧪 Testing with Test Data

**For Development/Demo Only**: The **"🧪 Fill Test Data"** button (top-right corner) loads sample data for testing the interface without completing prerequisites.

**What It Does**:
1. Loads test business context (Ashley Shaw Consulting example)
2. Loads test research data (Stages 1-2)
3. Loads test offer data (Stages 7-8)
4. Updates prerequisites to GREEN
5. Displays 4 mock content pillars

**Use Cases**:
- Testing the UI without real data
- Demonstrating the feature to others
- Understanding what a complete strategy looks like
- Testing real generation with consistent test data

**Test Data Example**:
- Business: Executive coaching for women in tech leadership
- 4 Pillars: Authority Building, Transformation Stories, Practical Strategies, Industry Insights
- Complete with example topics and psychology ties

---

## 💡 Best Practices

### Strategy Quality
1. **Complete Both Prerequisites**: Research + Offer = best results
2. **Review Before Editing**: AI-generated strategy is optimized based on your data
3. **Trust the Frequency Mix**: Percentages calculated based on your buyer psychology
4. **Use Example Topics**: 10-15 topics per pillar provide 50+ total content ideas

### Content Planning
1. **Start with Highest Frequency**: Focus on pillars with highest percentage first
2. **Balance Content Mix**: Follow the Educational/Entertaining/Promotional/Engagement framework
3. **Rotate Pillars**: Cover all pillars regularly, not just favorites
4. **Track Performance**: Note which pillars/topics resonate most with audience

### Editing Guidelines
1. **Minor Edits Only**: Small refinements to language/positioning
2. **Keep Psychology Ties**: These connect to your buyer's fears/desires
3. **Maintain Frequency Balance**: Total should still equal ~100%
4. **Save Frequently**: Click "Save Strategy" after making edits

### Long-term Use
1. **Regenerate Quarterly**: Revisit as business/market evolves
2. **Test and Learn**: Try different topics within pillars
3. **Refine Based on Data**: Update strategy based on content performance
4. **Archive Old Strategies**: Export JSON before regenerating

---

## ❓ Frequently Asked Questions

### General Questions

**Q: How long does generation take?**
A: 3-4 minutes for complete strategy with 3-5 pillars.

**Q: Can I regenerate if I don't like the results?**
A: Yes, click "Generate" again. Each generation uses your latest data.

**Q: Will my edits be overwritten if I regenerate?**
A: Yes, regeneration creates a fresh strategy. Export JSON to back up edits first.

**Q: Can I create multiple strategies?**
A: Currently one active strategy per browser. Export JSON to archive old strategies.

**Q: Why only 3-5 pillars?**
A: Research shows 3-5 themes are optimal for consistency and audience recognition. More themes dilute your message.

### Prerequisites Questions

**Q: Can I generate without completing Offer Design?**
A: Yes, but results will be less targeted. Offer data aligns pillars with your unique mechanism.

**Q: What if I haven't completed Market Research?**
A: You must complete Research first. Content strategy requires buyer psychology and market data.

**Q: Can I use someone else's research data?**
A: Not currently. Each strategy is tied to data in your browser's LocalStorage.

### Technical Questions

**Q: Where is my data stored?**
A: Browser LocalStorage (per-device, per-browser). Not synced across devices.

**Q: What happens if I clear browser data?**
A: Strategy is lost. Export JSON regularly to back up.

**Q: Can I import a JSON file back?**
A: Not currently. JSON export is for archival and external use only.

**Q: Does it work offline?**
A: No, requires internet connection for AI generation. Viewing saved strategies works offline.

**Q: Is my data secure?**
A: Data stays in your browser. Not sent to external servers except Cloudflare Workers AI during generation.

### Usage Questions

**Q: How many topics should I use per pillar?**
A: All 10-15 topics provide months of content ideas. Start with 5-7 highest priority.

**Q: Should I follow the frequency percentages exactly?**
A: Use as a guide, not a rigid rule. Adjust based on your capacity and audience response.

**Q: Can I add my own topics?**
A: Not directly in the interface. Edit pillar description to note additional topics, or use external tools.

**Q: How do I know which fear/desire each topic addresses?**
A: Review "Buyer Psychology Tie" in each pillar. Topics are designed to address those themes.

---

## 🐛 Troubleshooting

### Issue: "Complete Market Research first" Error

**Symptoms**: Red notice, cannot generate
**Cause**: Missing research data in LocalStorage
**Solution**:
1. Navigate to `/research`
2. Complete all 6 research stages
3. Return to `/content-strategy`
4. Prerequisites should now show green or yellow

### Issue: Generation Takes Longer Than 4 Minutes

**Symptoms**: Stuck on "Analyzing..." for 5+ minutes
**Cause**: AI service delay or network issues
**Solution**:
1. Wait up to 10 minutes (AI can have variable response times)
2. Check browser console (F12) for errors
3. If no progress after 10 minutes, refresh page and try again
4. Check internet connection stability

### Issue: Pillars Don't Reflect My Business

**Symptoms**: Generic or irrelevant pillars
**Cause**: Missing or incomplete prerequisite data
**Solution**:
1. Verify research data is complete and accurate
2. Add offer data for better targeting
3. Check that buyer psychology (Stage 2) reflects your actual customers
4. Regenerate with updated data

### Issue: Can't Edit Pillar

**Symptoms**: Edit button doesn't work
**Cause**: Browser JavaScript error
**Solution**:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Check browser console (F12) for errors
4. Try different browser (Chrome, Firefox, Safari)

### Issue: Modified Badge Won't Clear

**Symptoms**: Yellow "MODIFIED" badge persists after resetting
**Cause**: Cached modification data
**Solution**:
1. Regenerate strategy (creates fresh version)
2. Or manually clear: `localStorage.removeItem('content-pillar-strategy-modified')`

### Issue: Export JSON Contains No Data

**Symptoms**: Empty or minimal JSON file
**Cause**: Strategy not saved before export
**Solution**:
1. Click "💾 Save Strategy" first
2. Wait for confirmation toast
3. Then click "📥 Export JSON"

### Issue: Test Data Button Does Nothing

**Symptoms**: Click test data button, nothing happens
**Cause**: JavaScript error or loading issue
**Solution**:
1. Hard refresh page
2. Check browser console for errors
3. Ensure JavaScript is enabled
4. Try different browser

### Issue: Prerequisites Always Red/Yellow

**Symptoms**: Even after completing research/offer
**Cause**: Data not saved properly or different browser/device
**Solution**:
1. Complete research/offer in SAME browser where you're viewing content strategy
2. Check LocalStorage contains data (F12 → Application → Local Storage)
3. Re-save research/offer data if missing

---

## 📞 Support & Feedback

### Getting Help

**Check First**:
1. Read this User Guide (especially Troubleshooting section)
2. Review Testing Guide: `docs/CONTENT-STRATEGY-TESTING-GUIDE.md`
3. Check browser console (F12) for error messages

**Common Issues**:
- 90% of issues are missing/incomplete prerequisites
- 5% are browser cache/LocalStorage issues
- 5% are actual bugs requiring support

**Report Issues**:
- Include browser version and OS
- Describe steps to reproduce
- Share any console errors
- Include screenshots if helpful

### Feature Requests

**Planned Features** (coming soon):
- Topic-level editing (add/remove individual topics)
- Drag-and-drop pillar reordering
- Import JSON (restore archived strategies)
- Cloud storage (sync across devices)
- Multiple strategy profiles
- PDF export with formatted layout

**Request New Features**:
- Describe your use case (why you need it)
- Explain expected behavior
- Provide examples if applicable

---

## 📚 Related Documentation

- **[Testing Guide](CONTENT-STRATEGY-TESTING-GUIDE.md)** - Comprehensive testing procedures
- **[Implementation Guide](CONTENT-STRATEGY-IMPLEMENTATION.md)** - Technical implementation details
- **[API Documentation](CONTENT-STRATEGY-API.md)** - Stage 17 API specifications
- **[Known Issues](CONTENT-STRATEGY-KNOWN-ISSUES.md)** - Current limitations and workarounds

---

## 📝 Glossary

**Content Pillar**: A strategic theme or topic category that all your content revolves around. Establishes your expertise and authority in specific areas.

**Content Mix Framework**: The percentage distribution of content types (Educational, Entertaining, Promotional, Engagement) designed to balance trust-building with conversions.

**Buyer Psychology Tie**: Connection between content pillar and your ideal customer's core fears, desires, or pain points from market research.

**Frequency Percentage**: Recommended percentage of total content that should focus on each pillar. Based on buyer psychology importance.

**LocalStorage**: Browser-based data storage that persists across sessions but is device-specific and not synced to cloud.

**Stage 17**: Internal designation for Content Pillar Strategy generation in the multi-stage business intelligence system.

**Unique Mechanism**: Your proprietary method, framework, or approach that differentiates your offer (from Offer Design stage).

---

**Document Version**: 1.0
**Last Updated**: January 27, 2025
**Feedback**: Please report issues or suggestions for improving this guide
