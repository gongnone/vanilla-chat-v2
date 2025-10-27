# Content Strategy Generator - Testing Guide

## Overview

This document provides a comprehensive testing checklist for the Content Pillar Generator (Stage 17) feature.

**Feature Route**: `/content-strategy`

**Related Files**:
- Backend: `src/index.tsx`, `src/prompts/stage17-pillars.ts`, `src/types/content-stages.ts`, `src/model-config.ts`
- Frontend: `src/components/content-strategy-form.tsx`, `public/static/content-strategy.js`
- Styles: `public/static/style.css`

---

## Prerequisites for Testing

### 1. Build and Deploy
```bash
# Build the project
npm run build

# Option A: Test locally (AI will be mocked)
npm run dev

# Option B: Test remotely (real AI, recommended)
npm run dev:remote  # Terminal 1: Watch files
npm run preview:remote  # Terminal 2: Deploy preview
```

### 2. Prepare Test Data

**Method 1: Auto-fill Test Data (Fastest)**
1. Navigate to `/content-strategy`
2. Click "🧪 Fill Test Data" button (top-right)
3. Test strategy loads immediately with 4 pillars

**Method 2: Use Real Research Data**
1. Navigate to `/research`
2. Generate or load existing research data
3. Navigate to `/content-strategy`

**Method 3: Use Research + Offer Data (Full Integration)**
1. Complete `/research` (Stages 1-6)
2. Complete `/offer-design` (Stages 7-13)
3. Navigate to `/content-strategy`

---

## Testing Checklist

### Phase 1: Page Load & Prerequisites (5 min)

#### Test 1.1: Initial Page Load
- [ ] Page loads without errors at `/content-strategy`
- [ ] Header displays correctly with gradient (indigo-600 to purple-700)
- [ ] "🧪 Fill Test Data" button visible in top-right
- [ ] Info panel explains "What Are Content Pillars?" with benefits grid
- [ ] Generate section visible with CTA button
- [ ] Footer tips visible

#### Test 1.2: Prerequisites Check
- [ ] **No Data**: Yellow warning shows "Complete Market Research first"
- [ ] **Research Only**: Yellow warning shows "Complete Offer Design (optional)"
- [ ] **Research + Offer**: Green notice shows "Ready to generate"

**How to Test**:
```javascript
// Clear all data
localStorage.clear();
// Reload page - should see red warning

// Add research data only
localStorage.setItem('last-research-data', '{"stage1":{},"stage2":{}}');
localStorage.setItem('last-business-context', '{}');
// Reload page - should see yellow warning

// Add offer data
localStorage.setItem('last-offer-data', '{"stage7":{},"stage8":{}}');
// Reload page - should see green notice
```

---

### Phase 2: Test Data Functionality (5 min)

#### Test 2.1: Fill Test Data Button
- [ ] Click "🧪 Fill Test Data" button
- [ ] Loading state appears with spinner (3-4 seconds)
- [ ] Results section appears with:
  - [ ] 4 pillars (Authority Building, Transformation Stories, Practical Strategies, Industry Insights)
  - [ ] Each pillar shows: name, description, frequency percentage
  - [ ] All pillars collapsed by default
- [ ] Content mix bars display (Educational 45%, Entertaining 25%, Promotional 20%, Engagement 10%)
- [ ] Strategic rationale text displays
- [ ] Competitive differentiation text displays
- [ ] Save Strategy and Export JSON buttons visible

---

### Phase 3: API Call & Generation (10-15 min)

#### Test 3.1: Generate with Research Data Only
1. **Setup**: Ensure research data exists, clear offer data
2. **Action**: Click "🎯 Generate Content Pillars"
3. **Expected**:
   - [ ] Form hides, loading state shows
   - [ ] Loading message: "Analyzing your research data..."
   - [ ] Progress indicators update
   - [ ] After 3-4 minutes, results appear
   - [ ] 3-5 pillars generated
   - [ ] Each pillar has 10-15 topics

#### Test 3.2: Generate with Research + Offer Data
1. **Setup**: Ensure both research and offer data exist
2. **Action**: Click "🎯 Generate Content Pillars"
3. **Expected**:
   - [ ] Same as 3.1 but incorporates offer positioning
   - [ ] Strategic rationale mentions offer components
   - [ ] Pillars align with unique mechanism from offer

#### Test 3.3: API Validation
**Check browser console for warnings**:
- [ ] No warnings about pillar count (should be 3-5)
- [ ] No warnings about frequency sum (should equal 100%)
- [ ] No warnings about topic count (should be 10-15 per pillar)

**Check Network tab**:
- [ ] POST request to `/api/content/stage/17`
- [ ] Request payload includes: `context`, `stage1`, `stage2`, optional `stage7`, `stage8`
- [ ] Response status: 200 OK
- [ ] Response JSON structure matches `ContentPillarStrategy` interface

---

### Phase 4: UI Interactions (10 min)

#### Test 4.1: Pillar Accordion
- [ ] Click pillar header → expands content
- [ ] Click again → collapses content
- [ ] Chevron rotates 180° on expand/collapse
- [ ] Expand multiple pillars simultaneously (all stay open)
- [ ] Collapse all pillars (all close)

#### Test 4.2: Pillar Content Display
For each expanded pillar, verify:
- [ ] **Description** field displays correctly
- [ ] **Audience Value** field displays correctly
- [ ] **Business Goal** field displays correctly
- [ ] **Buyer Psychology Tie** field displays correctly
- [ ] **Example Topics** (10-15 items) display in 2-column grid (desktop) / 1-column (mobile)
- [ ] **Frequency** percentage displays

#### Test 4.3: Edit Pillar Functionality
1. **Open Edit Mode**:
   - [ ] Click "✏️ Edit" button on a pillar
   - [ ] Pillar content replaced with edit form (yellow background)
   - [ ] All fields pre-populated with current values

2. **Edit Fields**:
   - [ ] **Pillar Name** (max 50 chars):
     - [ ] Character counter shows "0/50"
     - [ ] Counter turns orange at 45 chars (warning)
     - [ ] Counter turns red at 51+ chars (error)
     - [ ] Cannot type beyond limit
   - [ ] **Description** (max 200 chars):
     - [ ] Character counter shows correctly
     - [ ] Warning/error states work
   - [ ] **Value Proposition** (max 150 chars)
   - [ ] **Business Goal** (max 150 chars)
   - [ ] **Psychology Tie** (max 150 chars)
   - [ ] **Frequency** (0-100):
     - [ ] Only accepts numbers
     - [ ] Validation prevents >100

3. **Save Changes**:
   - [ ] Click "💾 Save Changes"
   - [ ] Pillar updates with new values
   - [ ] Modified badge appears (yellow "MODIFIED" tag)
   - [ ] Modified field highlighting (yellow background)
   - [ ] Toast notification: "Pillar updated successfully!"

4. **Cancel Changes**:
   - [ ] Make edits
   - [ ] Click "❌ Cancel"
   - [ ] Original values restored
   - [ ] No changes saved

---

### Phase 5: LocalStorage Persistence (5 min)

#### Test 5.1: Save Strategy
- [ ] Click "💾 Save Strategy" button
- [ ] Toast notification: "Strategy saved successfully!"
- [ ] Verify localStorage:
   ```javascript
   localStorage.getItem('content-pillar-strategy'); // Current version
   localStorage.getItem('content-pillar-strategy-original'); // Pristine copy
   localStorage.getItem('content-pillar-strategy-modified'); // Exists if edited
   ```

#### Test 5.2: Data Persistence
- [ ] Generate or load strategy
- [ ] Make edits to a pillar
- [ ] Refresh page
- [ ] Strategy still displays
- [ ] Edits are preserved
- [ ] Modified indicators still show

#### Test 5.3: Export JSON
- [ ] Click "📥 Export JSON" button
- [ ] File downloads: `content-strategy-YYYYMMDD-HHMMSS.json`
- [ ] Open file → valid JSON structure
- [ ] Contains: `pillar_count`, `pillars[]`, `content_mix_framework`, `strategic_rationale`, `competitive_differentiation`

---

### Phase 6: Content Mix Bars (5 min)

#### Test 6.1: Bar Display
- [ ] 4 bars display: Educational, Entertaining, Promotional, Engagement
- [ ] Each bar shows:
  - [ ] Label (e.g., "Educational")
  - [ ] Percentage (e.g., "45%")
  - [ ] Colored fill bar (width matches percentage)
- [ ] Colors:
  - [ ] Educational = Blue (#3b82f6)
  - [ ] Entertaining = Green (#22c55e)
  - [ ] Promotional = Purple (#a855f7)
  - [ ] Engagement = Orange (#f97316)

#### Test 6.2: Animation
- [ ] On page load, bars animate from 0 to target width (300ms transition)
- [ ] Smooth animation with cubic-bezier easing

---

### Phase 7: Error Handling (5 min)

#### Test 7.1: Missing Prerequisites
- [ ] Clear all localStorage
- [ ] Try to click generate button
- [ ] Error displays: "Please complete Market Research first"
- [ ] Generate button disabled or error prevents API call

#### Test 7.2: API Failure
**Simulate failure**:
```javascript
// In browser console before generating:
localStorage.setItem('last-research-data', 'invalid-json');
```
- [ ] Click generate
- [ ] Error state displays with message
- [ ] "🔄 Try Again" button appears
- [ ] Clicking retry button resets to initial state

#### Test 7.3: Invalid Edit Data
- [ ] Edit pillar frequency to 150
- [ ] Try to save
- [ ] Validation error displays
- [ ] Cannot save invalid data

---

### Phase 8: Navigation & Integration (5 min)

#### Test 8.1: Navigation from Offer Design
1. Complete Offer Design (or load test data)
2. Scroll to bottom of offer results
3. Verify:
   - [ ] Blue/purple gradient box displays
   - [ ] Success message: "✅ Offer Design Complete!"
   - [ ] Description explains next step
   - [ ] Button displays: "🎯 Generate Content Strategy →"
4. Click button:
   - [ ] Navigates to `/content-strategy`
   - [ ] Prerequisites already met (green notice)
   - [ ] Can generate immediately

#### Test 8.2: Direct Access
- [ ] Navigate directly to `/content-strategy` via URL
- [ ] Page loads without errors
- [ ] Prerequisites check works correctly

---

### Phase 9: Responsive Design (10 min)

#### Test 9.1: Desktop (1920x1080)
- [ ] Content width: max 56rem (896px)
- [ ] Centered on page
- [ ] Pillar topics: 2-column grid
- [ ] All elements visible
- [ ] No horizontal scroll

#### Test 9.2: Tablet (768x1024)
- [ ] Content adjusts to viewport
- [ ] Pillar topics: 2-column grid
- [ ] Buttons stack if needed
- [ ] Readable font sizes

#### Test 9.3: Mobile (375x667)
- [ ] Content width: full viewport with padding
- [ ] Pillar topics: 1-column grid
- [ ] Buttons stack vertically
- [ ] Toast notifications: full width (left to right)
- [ ] Header font size: 1rem (smaller)
- [ ] All interactive elements easily tappable (44x44px minimum)

**Test on**:
- [ ] Chrome DevTools (mobile emulation)
- [ ] Real iPhone (if available)
- [ ] Real Android (if available)

---

### Phase 10: Cross-Browser Compatibility (10 min)

#### Test 10.1: Chrome (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth

#### Test 10.2: Firefox (Latest)
- [ ] All features work
- [ ] Gradient backgrounds display correctly
- [ ] LocalStorage persistence works

#### Test 10.3: Safari (Latest)
- [ ] All features work
- [ ] Flexbox layouts correct
- [ ] Form validation works
- [ ] Animations smooth

#### Test 10.4: Edge (Latest)
- [ ] All features work
- [ ] No rendering issues

---

## Performance Testing

### Metrics to Measure

1. **Initial Page Load**: <1 second
2. **Test Data Load**: 3-4 seconds (simulated)
3. **API Call**: 3-4 minutes (real AI generation)
4. **Expand/Collapse Animation**: <200ms
5. **Edit Save**: <100ms

### Tools
- Chrome DevTools > Lighthouse
- Network tab (check payload sizes)
- Performance tab (check for layout thrashing)

**Expected Lighthouse Scores**:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

---

## Known Issues & Limitations

### Current Limitations
1. **No Undo**: Once saved, changes are permanent (must manually restore from original)
2. **No Drag-and-Drop**: Cannot reorder pillars
3. **No Topic Editing**: Example topics are read-only (edit entire pillar to change)
4. **No Multi-User**: LocalStorage is per-browser, not synced across devices

### Future Enhancements (Out of Scope)
- Cloud storage for cross-device sync
- Topic-level editing (add/remove/reorder individual topics)
- Pillar reordering with drag-and-drop
- Export to PDF with formatted layout
- Import custom pillar templates

---

## Bug Reporting Template

If you find issues, report them with this format:

```markdown
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. Go to '/content-strategy'
2. Click '...'
3. See error

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Browser**: Chrome 120.0.6099.109
**OS**: macOS 14.2.1
**Screen Size**: 1920x1080

**Console Errors**: [Paste any errors from browser console]

**Screenshots**: [Attach if applicable]
```

---

## Testing Sign-Off

Once all tests pass, sign off here:

- [ ] Phase 1: Page Load & Prerequisites ✅
- [ ] Phase 2: Test Data Functionality ✅
- [ ] Phase 3: API Call & Generation ✅
- [ ] Phase 4: UI Interactions ✅
- [ ] Phase 5: LocalStorage Persistence ✅
- [ ] Phase 6: Content Mix Bars ✅
- [ ] Phase 7: Error Handling ✅
- [ ] Phase 8: Navigation & Integration ✅
- [ ] Phase 9: Responsive Design ✅
- [ ] Phase 10: Cross-Browser Compatibility ✅

**Tester Name**: _________________
**Date**: _________________
**Build Version**: _________________

---

## Quick Smoke Test (5 min)

For rapid verification after changes:

1. [ ] Navigate to `/content-strategy`
2. [ ] Click "🧪 Fill Test Data"
3. [ ] Verify 4 pillars appear
4. [ ] Expand a pillar → verify topics display
5. [ ] Click "✏️ Edit" → make a change → save
6. [ ] Verify modified badge appears
7. [ ] Click "💾 Save Strategy"
8. [ ] Refresh page → verify data persists
9. [ ] Click "📥 Export JSON" → verify file downloads

**All smoke tests pass**: ✅ / ❌
