# Research Data Editor - User Guide

## Quick Start

After generating your research report, you can edit the **15 critical fields** that directly impact your offer quality.

---

## Why Edit Research Data?

Your offer generation uses a condensed version of your research data due to token budget constraints. Only **~15 fields** from your complete research report actually get used in offer generation.

**Editing these 15 fields has 10x more impact** than editing the other 85+ fields!

---

## The 15 Fields That Matter

### 🧠 Buyer Psychology (HIGHEST IMPACT)

These drive your guarantee, bonuses, and ALL marketing copy:

1. **Top Fear #1 Quote** → Used for guarantee design
2. **Top Fear #2 Quote** → Used for guarantee design
3. **Top Desire #1 Quote** → Used for bonus design
4. **Top Desire #2 Quote** → Used for bonus design
5. **Buyer Language #1** → Used in all marketing copy
6. **Buyer Language #2** → Used in all marketing copy
7. **Buyer Language #3** → Used in all marketing copy
8. **Pain Point #1 Quote** → Used for value stack
9. **Pain Point #2 Quote** → Used for value stack
10. **Price Justification** → Used for pricing framework

### 📊 Market Context (Medium Impact)

These frame your positioning and opportunity:

11. **Market Growth Rate** → Market opportunity framing
12. **Market Size 2024** → TAM context
13. **Bleeding Neck Problem** → Core positioning
14. **Power 4% Demographics** → Ideal customer profile
15. **Power 4% Lifetime Value** → Pricing anchor

---

## How to Edit

### Step 1: Generate Research Report

1. Go to `/research` on your deployed site
2. Fill out the 18-field form (or click "🧪 Fill Test Data")
3. Generate your report (15-20 minutes)
4. Review the complete report

### Step 2: Open the Editor

Click the **"📝 Edit Research Data"** button at the bottom of your report.

### Step 3: Edit Critical Fields

The editor opens with 2 sections:

- **🧠 Buyer Psychology** (10 fields) - Open by default
- **📊 Market Context** (5 fields) - Click to expand

For each field you can:

- **Edit directly** - Type in the text box
- **See impact** - Labels show which offer stage uses this field
- **Monitor characters** - Character count shows current/max
- **Reset if needed** - Click "Reset to AI" to restore original

### Step 4: Save Changes

1. Make your edits (auto-saves every 500ms as you type)
2. Click **"Save & Update Offer Context"**
3. See success confirmation

### Step 5: Generate Offer

1. Click **"→ Design Your Strategic Offer"**
2. Your offer will use the **edited** research data
3. Higher quality offers from refined inputs!

---

## Tips for Effective Editing

### What to Edit

✅ **DO Edit**:
- Fear quotes that feel generic → Make them specific and emotional
- Buyer language that's too formal → Use actual customer words
- Desire quotes that are vague → Make them vivid and aspirational
- Price justification that's weak → Strengthen with specific value
- Pain point quotes that don't resonate → Make them visceral

❌ **DON'T Waste Time Editing**:
- Market size numbers (minimal impact)
- Avatar day-in-life narratives (not used in extraction)
- Competitor details (only UVP matters)
- Online communities (only first one used)

### Common Improvements

**Fear Quotes** (Before/After):

❌ Before: "I'm worried about failing"
✅ After: "I'm terrified I'll invest all this money and time and still not get promoted, proving I'm not good enough"

**Buyer Language** (Before/After):

❌ Before: "I need help with my career"
✅ After: "I'm stuck at this level and can't figure out why"

**Price Justification** (Before/After):

❌ Before: "They'll pay because they want results"
✅ After: "They'll pay $25K because VP promotion = $50K+ salary increase, 3-5x ROI in first year"

---

## Visual Indicators

### Modified Fields
- **Yellow border** around text box
- **"Modified" badge** next to field label
- **"Reset to AI" button** appears

### Character Count
- **Gray text**: Normal (e.g., "45/200")
- **Orange text**: Approaching limit (e.g., "170/200")
- Prevents token budget overflow

### Save Status
- **"Typing..."** - You're editing
- **"✓ Auto-saved"** - Draft saved to browser
- **"✅ Saved successfully!"** - Changes committed

---

## Understanding Impact Labels

Each field shows which offer stage uses it:

- **💎 Used in: Stage 12 Power Guarantee** → Your edits will directly improve guarantee design
- **💎 Used in: Stage 11 Premium Bonuses** → Your edits will directly improve bonus positioning
- **💎 Used in: ALL marketing copy** → Your edits appear throughout entire offer

This helps you prioritize which fields to focus on!

---

## Keyboard Shortcuts

- **Tab** - Navigate between fields
- **Escape** - Close modal (with confirmation if unsaved)
- **Enter** (in text field) - Move to next field
- **Ctrl/Cmd + Z** - Undo last change (browser default)

---

## Troubleshooting

### "Edit Research Data button not appearing"

**Cause**: No research data in browser storage
**Solution**: Generate a research report first

### "Modal opens but fields are empty"

**Cause**: Research data corrupted or missing
**Solution**: Regenerate research report

### "Changes not saving"

**Cause**: Browser storage disabled or full
**Solution**:
1. Check if browser has localStorage enabled
2. Clear old data from localStorage
3. Try incognito mode to test

### "Edits don't appear in offer generation"

**Cause**: Edited data not being used
**Solution**:
1. Check localStorage for `last-research-data-modified`
2. Verify it contains your edits
3. Regenerate offer (don't use cached offer data)

---

## Data Persistence

### Where Your Data is Stored

**Browser localStorage** contains:
- `last-research-data` - Current active data (updated on save)
- `last-research-data-original` - AI-generated original (preserved)
- `last-research-data-modified` - Your edited version
- `last-research-data-edit-history` - Change log

### Clearing Data

To start fresh:
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh page
4. Generate new research report

### Exporting Data

Currently: Use browser console to export
```javascript
copy(localStorage.getItem('last-research-data'))
```

Future: Import/export buttons (Phase 3)

---

## Best Practices

### Before Editing

1. **Read the full report** - Understand what AI generated
2. **Identify weak spots** - Which quotes feel generic?
3. **Have real quotes ready** - Pull from customer interviews, reviews, etc.
4. **Focus on emotions** - Make fears visceral, desires vivid

### During Editing

1. **Start with buyer psychology** - Highest impact section
2. **Use real customer language** - Not marketing speak
3. **Be specific** - "I'm terrified..." not "I'm worried..."
4. **Respect character limits** - Stay within token budgets

### After Editing

1. **Review changes** - Scroll through modified fields
2. **Test with offer generation** - See how edits improve output
3. **Iterate** - Edit → Generate → Refine → Repeat
4. **Save externally** - Copy research data for backup

---

## Example Editing Session

**Scenario**: Executive coaching for women in tech

### Original AI Output (Generic)
- Fear #1: "I'm worried about not advancing in my career"
- Desire #1: "I want to be more successful"
- Buyer Language: "career growth", "leadership skills", "advancement"

### After Editing (Specific & Emotional)
- Fear #1: "I'm terrified I'll keep getting passed over for VP roles in favor of less qualified men, proving I'm not good enough despite working twice as hard"
- Desire #1: "I want to walk into that boardroom as a confident executive, knowing I deserve to be there, and finally get paid what I'm worth"
- Buyer Language: "stuck at this level", "passed over again", "executive presence"

### Impact on Offer Quality
- **Guarantee** becomes more specific: "If you don't land a VP+ role within 12 months..."
- **Bonuses** address specific desires: "Boardroom Confidence Toolkit"
- **Marketing copy** uses authentic language that resonates

---

## Phase 1 vs Future Phases

### Current (Phase 1)
- ✅ 15 critical fields
- ✅ Browser-based editing
- ✅ Auto-save
- ✅ Reset functionality

### Coming Soon (Phase 2)
- 🔜 All 100+ fields editable
- 🔜 Advanced field types (arrays, objects)
- 🔜 Search/filter fields

### Future (Phase 3)
- 🔮 Import/export JSON
- 🔮 Version history
- 🔮 A/B testing
- 🔮 Templates

---

## Getting Help

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify localStorage contains data
3. Try regenerating research report
4. Clear browser cache and try again

---

## Summary

**In 3 Steps**:
1. Generate research report
2. Click "📝 Edit Research Data"
3. Edit 15 critical fields → Save → Generate offer

**Remember**: Editing these 15 fields has **10x more impact** than editing anything else!

Focus on:
- Making fear quotes visceral
- Making desire quotes aspirational
- Using real customer language
- Strengthening price justification

**Result**: Higher quality offers that convert better! 🚀
