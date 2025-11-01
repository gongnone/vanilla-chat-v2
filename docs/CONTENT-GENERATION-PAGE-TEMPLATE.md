# Content Generation Page Template

**Purpose**: A reusable UX pattern for long-running AI content generation that allows navigation during generation and provides engaging visual feedback.

## Design Principles

1. **Non-Blocking UX**: Users can navigate away and return without losing progress
2. **Progressive Disclosure**: Show only what's necessary at each stage
3. **Visual Interest**: Keep engaged users entertained with real-time progress
4. **LocalStorage Persistence**: Save state client-side for resilience
5. **Clear Communication**: Set expectations upfront (time, cost, quality)

---

## Core Architecture

### 1. State Management (LocalStorage)

```javascript
// Save generation state to survive page refreshes/navigation
const saveGenerationState = (state) => {
  localStorage.setItem('generation-state', JSON.stringify({
    status: state.status,           // 'idle' | 'generating' | 'complete' | 'error'
    currentStage: state.currentStage,
    completedStages: state.completedStages,
    startTime: state.startTime,
    result: state.result,
    inputData: state.inputData
  }));
};

// Restore state on page load
const restoreGenerationState = () => {
  const saved = localStorage.getItem('generation-state');
  if (saved) {
    const state = JSON.parse(saved);

    // If generation was in progress, show recovery UI
    if (state.status === 'generating') {
      showRecoveryPrompt(state);
    } else if (state.status === 'complete') {
      showResults(state.result);
    }
  }
};

// Call on page load
document.addEventListener('DOMContentLoaded', restoreGenerationState);
```

### 2. Multi-Stage Progress Tracking

```javascript
// Define stages with metadata
const stages = [
  { id: 1, name: 'Stage Name', icon: '📊', estimatedTime: '2-3 min' },
  { id: 2, name: 'Another Stage', icon: '🧠', estimatedTime: '3-4 min' },
  { id: 3, name: 'Final Stage', icon: '📝', estimatedTime: '1-2 min' },
];

// Update stage status: 'pending' | 'in_progress' | 'completed' | 'error'
function updateStageStatus(stageId, status) {
  const stage = stages.find(s => s.id === stageId);
  if (!stage) return;

  stage.status = status;
  const stageEl = document.getElementById(`stage-${stageId}`);
  const iconEl = stageEl.querySelector('.stage-icon');

  // Visual states
  if (status === 'in_progress') {
    iconEl.textContent = '⏳';
    stageEl.classList.add('text-blue-600', 'font-semibold');
  } else if (status === 'completed') {
    iconEl.textContent = '✅';
    stageEl.classList.remove('text-blue-600');
    stageEl.classList.add('text-green-600');
  } else if (status === 'error') {
    iconEl.textContent = '❌';
    stageEl.classList.remove('text-blue-600');
    stageEl.classList.add('text-red-600');
  }

  // Save state
  saveGenerationState({ currentStage: stageId, status });
}
```

### 3. Progress UI Component

```javascript
function createProgressUI() {
  const progressHTML = `
    <div class="mt-6 space-y-2">
      <div class="text-sm font-semibold mb-3">Generation Progress:</div>
      ${stages.map(stage => `
        <div id="stage-${stage.id}" class="flex items-center gap-2 text-sm">
          <span class="stage-icon">${stage.icon}</span>
          <span>${stage.name}</span>
          <span class="ml-auto text-xs text-gray-500">${stage.estimatedTime}</span>
        </div>
      `).join('')}
      <div class="mt-4 pt-4 border-t border-gray-300">
        <div class="text-xs text-gray-600">
          <strong>Total Time:</strong> 8-12 minutes<br>
          <strong>Quality:</strong> Professional-grade output ✨
        </div>
      </div>
    </div>
  `;

  return progressHTML;
}
```

---

## UI States & Transitions

### State 1: Input Form (Initial)
```html
<!-- Wizard-style form for collecting input -->
<div id="input-form" class="visible">
  <form>
    <!-- Form fields -->
    <button type="submit">🎯 Generate Content</button>
  </form>
</div>
```

### State 2: Generating (Loading)
```html
<div id="loading-state" class="hidden">
  <!-- Animated spinner -->
  <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>

  <!-- Clear messaging -->
  <h3 class="text-xl font-semibold">Generating Your Content...</h3>
  <p class="text-gray-600">
    This will take 8-12 minutes. You can navigate away - we'll save your progress.
  </p>

  <!-- Progress tracking (injected dynamically) -->
  <div id="progress-container"></div>
</div>
```

### State 3: Complete (Results)
```html
<div id="results-output" class="hidden">
  <div class="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
    <h2 class="text-3xl font-bold text-white">Your Content is Ready!</h2>
  </div>

  <div class="p-8">
    <!-- Generated content -->
    <div id="content-output" class="prose prose-lg max-w-none"></div>

    <!-- Action buttons -->
    <div class="mt-6 flex gap-4">
      <button id="copy-btn">📋 Copy</button>
      <button id="export-btn">📥 Export JSON</button>
      <button id="new-btn">✨ Generate New</button>
    </div>
  </div>
</div>
```

---

## Generation Flow Pattern

### Sequential Stages (Recommended)
```javascript
async function generateContent(inputData) {
  try {
    // Stage 1: Foundation
    updateStageStatus(1, 'in_progress');
    const stage1 = await callAPI('/api/stage/1', inputData);
    updateStageStatus(1, 'completed');

    // Stage 2: Build on Stage 1
    updateStageStatus(2, 'in_progress');
    const stage2 = await callAPI('/api/stage/2', { inputData, stage1 });
    updateStageStatus(2, 'completed');

    // Stage 3: Final synthesis (streaming)
    updateStageStatus(3, 'in_progress');
    await streamFinalOutput('/api/stage/3', { inputData, stage1, stage2 });
    updateStageStatus(3, 'completed');

    // Save complete result
    localStorage.setItem('final-output', JSON.stringify({ stage1, stage2, stage3 }));

  } catch (error) {
    const currentStage = stages.find(s => s.status === 'in_progress');
    if (currentStage) updateStageStatus(currentStage.id, 'error');
    throw error;
  }
}
```

### Streaming Final Output
```javascript
async function streamFinalOutput(endpoint, data) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  const outputEl = document.getElementById('content-output');
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    fullText += value;

    // Render markdown in real-time
    if (window.markdownit) {
      outputEl.innerHTML = window.markdownit().render(fullText);
    } else {
      outputEl.textContent = fullText;
    }

    // Auto-scroll to follow new content
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  return fullText;
}
```

---

## Visual Design Patterns

### 1. Gradient Headers
```html
<div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
  <h1 class="text-3xl font-bold text-white">Page Title</h1>
  <p class="mt-2 text-blue-100">Subtitle explaining what this does</p>
</div>
```

### 2. Progress Bar
```html
<div class="bg-gray-200 h-2">
  <div id="progress-bar"
       class="bg-blue-600 h-2 transition-all duration-300"
       style="width: 33%">
  </div>
</div>
```

### 3. Stage Indicators
```html
<div class="space-y-2">
  <div class="flex items-center gap-2 text-sm">
    <span class="stage-icon text-xl">📊</span>
    <span class="font-medium">Market Analysis</span>
    <span class="ml-auto text-xs text-gray-500">2-3 min</span>
  </div>
  <!-- More stages... -->
</div>
```

### 4. Status Badges
```css
/* Tailwind classes for stage states */
.stage-pending { @apply text-gray-500; }
.stage-active { @apply text-blue-600 font-semibold animate-pulse; }
.stage-complete { @apply text-green-600; }
.stage-error { @apply text-red-600; }
```

---

## User Experience Enhancements

### 1. Time Estimates (Critical!)
```html
<!-- Always tell users how long it will take -->
<p class="text-gray-600">
  <strong>Estimated Time:</strong> 8-12 minutes<br>
  <small>You can navigate away - progress is saved automatically</small>
</p>
```

### 2. Quality Indicators
```html
<!-- Justify the wait time -->
<div class="text-sm text-gray-600">
  ✨ <strong>Quality:</strong> Professional-grade, complete data<br>
  🚫 <strong>No placeholders</strong> - fully researched content<br>
  🎯 <strong>Multi-stage AI</strong> - comprehensive analysis
</div>
```

### 3. Test Data Button (Development)
```html
<!-- Top-right corner of form -->
<button
  type="button"
  onclick="fillTestData()"
  class="absolute top-4 right-4 px-3 py-1 bg-gray-600 text-white text-xs rounded"
  title="Auto-fill form with test data">
  🧪 Fill Test Data
</button>
```

### 4. Navigation Warning
```javascript
// Warn before leaving during generation
window.addEventListener('beforeunload', (e) => {
  const state = JSON.parse(localStorage.getItem('generation-state') || '{}');

  if (state.status === 'generating') {
    e.preventDefault();
    e.returnValue = 'Generation in progress. Your progress is saved, but leaving now will interrupt the process.';
    return e.returnValue;
  }
});
```

### 5. Recovery UI
```javascript
function showRecoveryPrompt(savedState) {
  const message = `
    You have an in-progress generation from ${formatTime(savedState.startTime)}.

    Current stage: ${savedState.currentStage} of ${stages.length}

    [Resume] [Start Fresh]
  `;

  if (confirm(message)) {
    resumeGeneration(savedState);
  } else {
    localStorage.removeItem('generation-state');
    resetForm();
  }
}
```

---

## Accessibility Considerations

### 1. ARIA Live Regions
```html
<div aria-live="polite" aria-atomic="true">
  <div id="stage-status" class="sr-only">
    <!-- Announce stage changes to screen readers -->
  </div>
</div>
```

### 2. Keyboard Navigation
```javascript
// Allow Escape to cancel generation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isGenerating) {
    if (confirm('Cancel generation?')) {
      cancelGeneration();
    }
  }
});
```

### 3. Focus Management
```javascript
// Move focus to results when complete
function showResults(data) {
  const resultsEl = document.getElementById('results-output');
  resultsEl.classList.remove('hidden');
  resultsEl.querySelector('h2').focus();
}
```

---

## Error Handling

### 1. Network Errors
```javascript
async function handleStageError(stageId, error) {
  updateStageStatus(stageId, 'error');

  // Retry logic for transient failures
  if (error.message.includes('network') || error.message.includes('timeout')) {
    const retry = confirm('Network error. Retry this stage?');
    if (retry) {
      return await retryStage(stageId);
    }
  }

  // Show error UI
  showErrorState({
    stage: stages[stageId - 1].name,
    error: error.message,
    canRetry: true
  });
}
```

### 2. Error State UI
```html
<div id="error-state" class="hidden p-8 text-center">
  <div class="text-red-500 text-6xl mb-4">⚠️</div>
  <h3 class="text-xl font-semibold text-gray-900 mb-2">Generation Failed</h3>
  <p class="text-gray-600 mb-4" id="error-message"></p>
  <div class="flex gap-4 justify-center">
    <button onclick="retryGeneration()" class="btn-primary">🔄 Retry</button>
    <button onclick="resetForm()" class="btn-secondary">← Start Over</button>
  </div>
</div>
```

---

## Performance Optimization

### 1. Debounced State Saves
```javascript
// Avoid excessive localStorage writes
const debouncedSave = debounce((state) => {
  localStorage.setItem('generation-state', JSON.stringify(state));
}, 500);
```

### 2. Chunked Rendering
```javascript
// For large outputs, render in chunks to avoid blocking
async function renderInChunks(text, chunkSize = 100) {
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    appendToOutput(chunk);
    await sleep(10); // Yield to browser
  }
}
```

### 3. Progressive Enhancement
```javascript
// Fallback for browsers without streaming support
if (!window.ReadableStream) {
  // Use polling instead of streaming
  pollForCompletion(endpoint, data);
}
```

---

## Complete Example: Mini Generator

```html
<!DOCTYPE html>
<html>
<head>
  <title>Content Generator</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen py-12">
  <div class="max-w-3xl mx-auto">
    <div class="bg-white shadow-xl rounded-lg overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <h1 class="text-3xl font-bold text-white">Content Generator</h1>
        <p class="mt-2 text-blue-100">Generate professional content in 8-12 minutes</p>
      </div>

      <!-- Progress Bar -->
      <div class="bg-gray-200 h-2">
        <div id="progress-bar" class="bg-blue-600 h-2 transition-all duration-300" style="width: 0%"></div>
      </div>

      <!-- Input Form -->
      <form id="input-form" class="p-8">
        <div class="space-y-4">
          <div>
            <label class="block font-semibold mb-1">Topic</label>
            <input type="text" name="topic" required class="w-full px-4 py-2 border rounded">
          </div>
          <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🎯 Generate Content
          </button>
        </div>
      </form>

      <!-- Loading State -->
      <div id="loading-state" class="hidden p-8 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h3 class="text-xl font-semibold mb-2">Generating...</h3>
        <p class="text-gray-600 mb-4">This will take 8-12 minutes. You can navigate away.</p>
        <div id="progress-container"></div>
      </div>

      <!-- Results -->
      <div id="results-output" class="hidden">
        <div class="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
          <h2 class="text-3xl font-bold text-white">Your Content is Ready!</h2>
        </div>
        <div class="p-8">
          <div id="content-output" class="prose prose-lg"></div>
          <div class="mt-6 flex gap-4">
            <button id="copy-btn" class="px-6 py-3 bg-gray-600 text-white rounded-lg">📋 Copy</button>
            <button id="new-btn" class="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg">✨ New</button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>
    // State management
    const stages = [
      { id: 1, name: 'Research', icon: '📊', status: 'pending' },
      { id: 2, name: 'Analysis', icon: '🧠', status: 'pending' },
      { id: 3, name: 'Synthesis', icon: '📝', status: 'pending' },
    ];

    function updateStageStatus(stageId, status) {
      const stage = stages.find(s => s.id === stageId);
      stage.status = status;

      const icons = { pending: stage.icon, in_progress: '⏳', completed: '✅', error: '❌' };
      const stageEl = document.getElementById(`stage-${stageId}`);
      if (stageEl) {
        stageEl.querySelector('.stage-icon').textContent = icons[status];
      }
    }

    function createProgressUI() {
      return `
        <div class="mt-6 space-y-2">
          ${stages.map(s => `
            <div id="stage-${s.id}" class="flex items-center gap-2 text-sm">
              <span class="stage-icon">${s.icon}</span>
              <span>${s.name}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    async function generateContent(data) {
      document.getElementById('input-form').classList.add('hidden');
      document.getElementById('loading-state').classList.remove('hidden');
      document.getElementById('progress-container').innerHTML = createProgressUI();

      try {
        for (let i = 0; i < stages.length; i++) {
          updateStageStatus(i + 1, 'in_progress');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
          updateStageStatus(i + 1, 'completed');

          const progress = ((i + 1) / stages.length) * 100;
          document.getElementById('progress-bar').style.width = `${progress}%`;
        }

        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('results-output').classList.remove('hidden');
        document.getElementById('content-output').innerHTML = '<p>Generated content here!</p>';

      } catch (error) {
        alert('Generation failed: ' + error.message);
      }
    }

    document.getElementById('input-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      generateContent(Object.fromEntries(formData));
    });

    document.getElementById('new-btn').addEventListener('click', () => {
      location.reload();
    });
  </script>
</body>
</html>
```

---

## Checklist for Implementation

### Before Launch
- [ ] Set realistic time estimates (test with real AI calls)
- [ ] Implement LocalStorage persistence
- [ ] Add "navigate away safely" messaging
- [ ] Create test data button for development
- [ ] Add error recovery UI
- [ ] Test on slow connections
- [ ] Add accessibility labels (ARIA)
- [ ] Implement keyboard shortcuts
- [ ] Add analytics tracking for drop-off points

### Nice-to-Have
- [ ] Estimated time remaining (dynamic)
- [ ] Pause/resume functionality
- [ ] Email notification when complete
- [ ] Background tab detection (notify user to return)
- [ ] Download report as PDF
- [ ] Share via URL (with cache)

---

## Anti-Patterns (Avoid These!)

❌ **Don't:**
- Block the entire page with a modal during generation
- Hide the browser's back button
- Use generic "Loading..." messages without context
- Forget to save state (users WILL navigate away)
- Lie about time estimates (be conservative)
- Skip error states ("it'll work, trust me")
- Make users wait without progress indicators

✅ **Do:**
- Allow navigation with saved state
- Show specific stage progress
- Give accurate time estimates (add buffer!)
- Save state to LocalStorage frequently
- Handle network errors gracefully
- Provide visual feedback at every stage
- Let users know they can leave safely

---

## Customization Guide

### 1. Change Number of Stages
```javascript
// Just update the stages array
const stages = [
  { id: 1, name: 'Your Stage', icon: '🎯', estimatedTime: '30s' },
  // Add more...
];
```

### 2. Change Visual Theme
```css
/* Update color scheme */
:root {
  --primary: #3b82f6;      /* blue-600 */
  --primary-dark: #1d4ed8; /* blue-700 */
  --success: #16a34a;      /* green-600 */
  --error: #dc2626;        /* red-600 */
}
```

### 3. Add Stage Timing
```javascript
function updateStageStatus(stageId, status) {
  if (status === 'in_progress') {
    stages[stageId - 1].startTime = Date.now();
  } else if (status === 'completed') {
    const elapsed = Date.now() - stages[stageId - 1].startTime;
    console.log(`Stage ${stageId} took ${elapsed}ms`);
  }
}
```

---

## Testing Recommendations

1. **Test with real AI calls** - Simulate production delays
2. **Test navigation** - Leave and return during generation
3. **Test errors** - Kill network mid-generation
4. **Test on mobile** - Ensure responsive design
5. **Test accessibility** - Screen reader navigation
6. **Test recovery** - Page refresh during generation
7. **Load test** - Multiple concurrent users

---

## References

- See `/research` page for production implementation
- See `public/static/research.js` for full client-side code
- See `src/components/research-form.tsx` for server-side JSX
- See `CLAUDE.md` for overall architecture

---

**Last Updated**: 2025-11-01
**Maintainer**: Claude Code Template
**Version**: 1.0.0
