// Content Strategy - Client-side Logic

let currentStrategy = null; // Stores the generated content pillar strategy
let originalStrategy = null; // Stores the original for reset functionality

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  checkPrerequisites();
  loadSavedStrategy();
});

// ============================================================================
// PREREQUISITES CHECK
// ============================================================================

function checkPrerequisites() {
  const researchData = localStorage.getItem('last-research-data');
  const offerData = localStorage.getItem('last-offer-data');
  const notice = document.getElementById('prerequisites-notice');
  const prerequisitesText = document.getElementById('prerequisites-text');

  if (!notice) return;

  if (!researchData) {
    notice.classList.remove('bg-yellow-50', 'border-yellow-400');
    notice.classList.add('bg-red-50', 'border-red-400');
    prerequisitesText.innerHTML = '<strong>⚠️ RESEARCH REQUIRED:</strong> You must complete <a href="/research" class="underline font-bold">Market Research</a> first.';
    return;
  }

  if (!offerData) {
    notice.classList.remove('bg-green-50', 'border-green-400');
    notice.classList.add('bg-yellow-50', 'border-yellow-400');
    prerequisitesText.innerHTML = '<strong>⚠️ OFFER DESIGN RECOMMENDED:</strong> Complete <a href="/offer-design" class="underline font-bold">Offer Design</a> for best results. <button onclick="generatePillars()" class="ml-2 underline font-bold text-yellow-800">Continue Anyway →</button>';
    return;
  }

  // All prerequisites met
  notice.classList.remove('bg-yellow-50', 'border-yellow-400', 'bg-red-50', 'border-red-400');
  notice.classList.add('bg-green-50', 'border-green-400');
  prerequisitesText.innerHTML = '<strong>✅ Ready:</strong> Research and Offer Design complete. Ready to generate content strategy!';
}

// ============================================================================
// LOAD SAVED STRATEGY
// ============================================================================

function loadSavedStrategy() {
  const saved = localStorage.getItem('content-pillar-strategy');
  if (saved) {
    try {
      currentStrategy = JSON.parse(saved);
      originalStrategy = JSON.parse(saved); // Store original
      displayPillars(currentStrategy);

      // Hide generate section, show results
      document.getElementById('generate-section').classList.add('hidden');
      document.getElementById('results-section').classList.remove('hidden');
    } catch (error) {
      console.error('Failed to load saved strategy:', error);
    }
  }
}

// ============================================================================
// GENERATE PILLARS - Main Function
// ============================================================================

async function generatePillars(userFeedback = null) {
  try {
    // Get research and offer data from localStorage
    const researchDataStr = localStorage.getItem('last-research-data');
    const offerDataStr = localStorage.getItem('last-offer-data');
    const businessContextStr = localStorage.getItem('last-business-context');

    if (!researchDataStr) {
      showError('Missing research data. Please complete Market Research first.', '/research');
      return;
    }

    if (!businessContextStr) {
      showError('Missing business context. Please complete Market Research first.', '/research');
      return;
    }

    const researchData = JSON.parse(researchDataStr);
    const businessContext = JSON.parse(businessContextStr);
    const offerData = offerDataStr ? JSON.parse(offerDataStr) : null;

    // Show loading state
    document.getElementById('generate-section').classList.add('hidden');
    document.getElementById('loading-state').classList.remove('hidden');
    document.getElementById('error-state').classList.add('hidden');

    // Prepare API request payload
    const payload = {
      context: businessContext,
      stage1: researchData.stage1_market_analysis,
      stage2: researchData.stage2_buyer_psychology,
    };

    // Add offer data if available
    if (offerData) {
      payload.stage7 = offerData.stage7_offer_rationale;
      payload.stage8 = offerData.stage8_value_stack;
    }

    // Add user feedback if provided (for regeneration)
    if (userFeedback) {
      payload.userFeedback = userFeedback;
      console.log('📝 Including user feedback:', userFeedback);
    }

    console.log('🚀 Calling Stage 17: Content Pillars API...');
    const startTime = Date.now();

    // Call API
    const response = await fetch('/api/content/stage/17', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const strategy = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Stage 17 complete in ${duration}s`);

    // Validate response
    if (!strategy || !strategy.pillars || strategy.pillars.length === 0) {
      throw new Error('Invalid response: No pillars generated');
    }

    // Save to localStorage
    currentStrategy = strategy;
    originalStrategy = JSON.parse(JSON.stringify(strategy)); // Deep copy
    localStorage.setItem('content-pillar-strategy', JSON.stringify(strategy));
    localStorage.setItem('content-pillar-strategy-original', JSON.stringify(strategy));

    // Display results
    displayPillars(strategy);

    // Hide loading, show results
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');

    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('❌ Generation failed:', error);
    showError(error.message || 'Failed to generate content pillars. Please try again.', null);

    // Show error state
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('error-state').classList.remove('hidden');
    document.getElementById('error-message').textContent = error.message || 'Unknown error occurred';
  }
}

// ============================================================================
// DISPLAY PILLARS - Render UI
// ============================================================================

function displayPillars(strategy) {
  if (!strategy) return;

  // Display pillars
  const container = document.getElementById('pillars-container');
  container.innerHTML = strategy.pillars.map((pillar, index) => `
    <div class="pillar-item bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="pillar-header px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 cursor-pointer flex justify-between items-center" onclick="togglePillar(${index})">
        <h3 class="text-lg font-bold text-gray-900">
          ${getPillarIcon(index)} Pillar ${index + 1}: ${escapeHtml(pillar.pillar_name)}
          <span class="text-sm font-normal text-indigo-600">(${pillar.post_frequency_percentage}%)</span>
        </h3>
        <span class="expand-icon text-2xl text-gray-400" id="icon-${index}">▼</span>
      </div>
      <div class="pillar-content px-6 py-4 space-y-4 hidden" id="pillar-${index}">
        <div class="pillar-field border-b border-gray-100 pb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Description:</label>
          <p class="text-gray-600" id="desc-${index}">${escapeHtml(pillar.pillar_description)}</p>
        </div>
        <div class="pillar-field border-b border-gray-100 pb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Why Audience Cares:</label>
          <p class="text-gray-600" id="value-${index}">${escapeHtml(pillar.audience_value_proposition)}</p>
        </div>
        <div class="pillar-field border-b border-gray-100 pb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Business Goal:</label>
          <p class="text-gray-600" id="goal-${index}">${escapeHtml(pillar.business_goal)}</p>
        </div>
        <div class="pillar-field border-b border-gray-100 pb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Buyer Psychology Tie:</label>
          <p class="text-gray-600" id="psychology-${index}">${escapeHtml(pillar.buyer_psychology_tie)}</p>
        </div>
        <div class="pillar-field">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Example Topics (${pillar.example_topics.length}):</label>
          <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm" id="topics-${index}">
            ${pillar.example_topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}
          </ul>
        </div>
        <div class="mt-4 flex gap-2">
          <button onclick="editPillar(${index})" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            ✏️ Edit This Pillar
          </button>
          <button onclick="expandTopics(${index})" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            💡 Expand Topics
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Display content mix framework
  displayContentMix(strategy.content_mix_framework);

  // Display strategic rationale
  document.getElementById('strategic-rationale-text').textContent = strategy.strategic_rationale;

  // Display competitive differentiation
  document.getElementById('competitive-diff-text').textContent = strategy.competitive_differentiation;
}

// ============================================================================
// UI HELPERS
// ============================================================================

function togglePillar(index) {
  const content = document.getElementById(`pillar-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.textContent = '▲';
  } else {
    content.classList.add('hidden');
    icon.textContent = '▼';
  }
}

function getPillarIcon(index) {
  const icons = ['📊', '🎯', '💡', '🚀', '⭐'];
  return icons[index] || '📌';
}

function displayContentMix(contentMix) {
  const container = document.getElementById('content-mix-bars');
  const types = [
    { key: 'educational', label: 'Educational', color: 'bg-blue-500' },
    { key: 'entertaining', label: 'Entertaining', color: 'bg-green-500' },
    { key: 'promotional', label: 'Promotional', color: 'bg-purple-500' },
    { key: 'engagement', label: 'Engagement', color: 'bg-orange-500' },
  ];

  container.innerHTML = types.map(type => `
    <div class="bar ${type.color} text-white px-4 py-2 rounded-lg text-sm font-semibold" style="width: ${contentMix[type.key]}%">
      ${type.label}: ${contentMix[type.key]}%
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// EDIT PILLAR - Inline Editing
// ============================================================================

function editPillar(index) {
  const pillar = currentStrategy.pillars[index];
  const contentEl = document.getElementById(`pillar-${index}`);

  // Build edit form
  const editForm = `
    <div class="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Pillar Name:</label>
        <input type="text" id="edit-name-${index}" value="${escapeHtml(pillar.pillar_name)}"
               class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" maxlength="50">
        <p class="char-count text-xs text-gray-500 mt-1"><span id="name-count-${index}">${pillar.pillar_name.length}</span>/50</p>
      </div>

      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Description:</label>
        <textarea id="edit-desc-${index}" rows="2" class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" maxlength="200">${escapeHtml(pillar.pillar_description)}</textarea>
        <p class="char-count text-xs text-gray-500 mt-1"><span id="desc-count-${index}">${pillar.pillar_description.length}</span>/200</p>
      </div>

      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Audience Value Proposition:</label>
        <textarea id="edit-value-${index}" rows="2" class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" maxlength="150">${escapeHtml(pillar.audience_value_proposition)}</textarea>
        <p class="char-count text-xs text-gray-500 mt-1"><span id="value-count-${index}">${pillar.audience_value_proposition.length}</span>/150</p>
      </div>

      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Business Goal:</label>
        <textarea id="edit-goal-${index}" rows="2" class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" maxlength="150">${escapeHtml(pillar.business_goal)}</textarea>
        <p class="char-count text-xs text-gray-500 mt-1"><span id="goal-count-${index}">${pillar.business_goal.length}</span>/150</p>
      </div>

      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Buyer Psychology Tie:</label>
        <textarea id="edit-psychology-${index}" rows="2" class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" maxlength="150">${escapeHtml(pillar.buyer_psychology_tie)}</textarea>
        <p class="char-count text-xs text-gray-500 mt-1"><span id="psychology-count-${index}">${pillar.buyer_psychology_tie.length}</span>/150</p>
      </div>

      <div class="edit-field">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Frequency Percentage:</label>
        <input type="number" id="edit-freq-${index}" value="${pillar.post_frequency_percentage}"
               class="w-full px-3 py-2 border-2 border-purple-300 rounded-lg" min="0" max="100">
        <p class="text-xs text-gray-500 mt-1">Must sum to 100% across all pillars</p>
      </div>

      <div class="flex gap-2 mt-4">
        <button onclick="saveEditedPillar(${index})" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
          💾 Save Changes
        </button>
        <button onclick="cancelEdit(${index})" class="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium">
          ✖️ Cancel
        </button>
      </div>
    </div>
  `;

  contentEl.innerHTML = editForm;

  // Add character counters
  ['name', 'desc', 'value', 'goal', 'psychology'].forEach(field => {
    const input = document.getElementById(`edit-${field}-${index}`);
    const counter = document.getElementById(`${field}-count-${index}`);
    if (input && counter) {
      input.addEventListener('input', () => {
        counter.textContent = input.value.length;
      });
    }
  });
}

function saveEditedPillar(index) {
  const pillar = currentStrategy.pillars[index];

  // Get new values
  pillar.pillar_name = document.getElementById(`edit-name-${index}`).value.trim();
  pillar.pillar_description = document.getElementById(`edit-desc-${index}`).value.trim();
  pillar.audience_value_proposition = document.getElementById(`edit-value-${index}`).value.trim();
  pillar.business_goal = document.getElementById(`edit-goal-${index}`).value.trim();
  pillar.buyer_psychology_tie = document.getElementById(`edit-psychology-${index}`).value.trim();
  pillar.post_frequency_percentage = parseInt(document.getElementById(`edit-freq-${index}`).value, 10);

  // Validate
  if (!pillar.pillar_name || pillar.pillar_name.length < 3) {
    alert('Pillar name must be at least 3 characters');
    return;
  }

  // Save to localStorage
  localStorage.setItem('content-pillar-strategy', JSON.stringify(currentStrategy));
  localStorage.setItem('content-pillar-strategy-modified', 'true');

  // Re-render
  displayPillars(currentStrategy);

  // Re-expand this pillar
  togglePillar(index);

  // Show success toast
  showToast('✅ Pillar saved successfully!', 'success');
}

function cancelEdit(index) {
  displayPillars(currentStrategy);
  togglePillar(index);
}

// ============================================================================
// ADDITIONAL FUNCTIONS
// ============================================================================

function expandTopics(index) {
  alert('Topic expansion feature coming soon! This will generate 10-15 additional topic variations for this pillar.');
}

function regeneratePillars() {
  // Create custom feedback modal
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
      <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">
        🔄 Regenerate Content Strategy
      </h3>
      <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
        Help the AI improve your strategy by describing what you'd like to change:
      </p>
      <textarea
        id="feedback-input"
        placeholder="Example: Make topics more tactical, add more transformation stories, less corporate tone, I want 5 pillars instead of 4..."
        style="width: 100%; min-height: 100px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical;"
      ></textarea>
      <div style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
        💡 <strong>Tip:</strong> Be specific about what you want to improve. Leave blank to generate without guidance.
      </div>
      <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: flex-end;">
        <button
          id="cancel-btn"
          style="padding: 10px 20px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
        >
          Cancel
        </button>
        <button
          id="regenerate-btn"
          style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;"
        >
          🔄 Regenerate
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Focus the textarea
  const textarea = document.getElementById('feedback-input');
  textarea.focus();

  // Handle cancel
  document.getElementById('cancel-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Handle regenerate
  document.getElementById('regenerate-btn').addEventListener('click', () => {
    const feedback = textarea.value.trim();
    document.body.removeChild(modal);

    if (feedback) {
      console.log('🎯 Regenerating with user feedback');
    } else {
      console.log('🎯 Regenerating without specific feedback');
    }

    generatePillars(feedback || null);
  });

  // Close on escape
  const handleEscape = (e) => {
    if (e.key === 'Escape' && document.body.contains(modal)) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function savePillarsToStorage() {
  localStorage.setItem('content-pillar-strategy', JSON.stringify(currentStrategy));
  showToast('💾 Strategy saved to browser storage!', 'success');
}

function exportPillarsToJSON() {
  const dataStr = JSON.stringify(currentStrategy, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content-pillar-strategy.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 JSON file downloaded!', 'success');
}

function retryGeneration() {
  document.getElementById('error-state').classList.add('hidden');
  document.getElementById('generate-section').classList.remove('hidden');
}

// ============================================================================
// TEST DATA
// ============================================================================

function fillTestData() {
  // Step 1: Load test business context
  const testBusinessContext = {
    business_name: "Ashley Shaw Consulting",
    current_offer_description: "Executive coaching for women in tech leadership roles",
    niche: "Executive coaching for women in tech leadership",
    specialization_keywords: "leadership development, executive presence, career acceleration",
    business_stage: "growth",
    revenue_range: "100k-500k",
    preferred_market_category: "wealth",
    target_market_hypothesis: "High-achieving women in tech aged 35-50",
    target_demographics: "Women aged 35-50, earning $150K-$300K in tech",
    target_psychographics: "High achievers driven by impact and legacy",
    biggest_customer_pain_point: "Hit a career ceiling despite exceptional performance",
    service_type: "coaching",
    delivery_format: "1:1",
    price_point_current: "$15,000",
    offer_duration: "6 months",
    unique_mechanism: "Leadership Breakthrough Accelerator"
  };

  // Step 2: Load test research data (Stages 1-2 required)
  const testResearchData = {
    stage1_market_analysis: {
      market_growth_rate: "10.2% annually",
      market_size_2024: "$4.2 billion",
      market_size_2025_projected: "$4.7 billion",
      bleeding_neck_problem: "Undervalued, overlooked, and underpromoted women in tech leadership despite exceptional performance",
      purchasing_power: {
        average_household_income: "$275,000-$425,000",
        discretionary_spending: "$10,000-$20,000 per year"
      },
      targetability: {
        platform_fit: "Facebook and Instagram",
        targeting_interests: ["leadership development", "career advancement", "women in tech"],
        targeting_behaviors: ["high-income professionals", "continuous learners"],
        difficulty_score: 8
      },
      top_20_percent: {
        demographics: "Women aged 38-48, Directors/VPs in tech",
        psychographics: "Value personal growth, leadership development, career advancement",
        characteristics: "Highly motivated, results-driven, invested in careers"
      },
      power_4_percent: {
        demographics: "Women aged 40-45, earning $300K-$450K, VPs/Senior Managers in top tech companies",
        psychographics: "Driven by impact and legacy, value authenticity and continuous growth",
        buying_frequency: "Every 12-24 months for high-ticket coaching",
        lifetime_value: "$50,000-$100,000",
        differentiation: "Willing to invest in themselves, see coaching as strategic career investment"
      }
    },
    stage2_buyer_psychology: {
      top_fears: [
        { name: "Being Found Out", quote: "I'm terrified someone will realize I don't belong here" },
        { name: "Hitting Ceiling", quote: "I've done everything right but keep getting passed over" },
        { name: "Burning Out", quote: "I can't keep working this hard to prove myself" }
      ],
      top_desires: [
        { name: "Recognition & Respect", aspirational_quote: "I want my contributions valued and voice heard in the room" },
        { name: "C-Suite Role", aspirational_quote: "I'm ready for the VP or C-suite role I've been working toward" },
        { name: "Authentic Leadership", aspirational_quote: "I want to lead powerfully without sacrificing who I am" }
      ],
      buyer_language: [
        { exact_phrase: "I feel like I'm working twice as hard to get half the credit" },
        { exact_phrase: "They told me I need more 'executive presence' but won't tell me what that means" },
        { exact_phrase: "I'm tired of watching less qualified men get promoted over me" },
        { exact_phrase: "I know I'm ready for the next level but don't know how to get there" },
        { exact_phrase: "Imposter syndrome is holding me back from taking big swings" },
        { exact_phrase: "I want to lead without burning out" },
        { exact_phrase: "I need a clear roadmap to the C-suite" }
      ]
    }
  };

  // Step 3: Load test offer data (Stages 7-8 optional but recommended)
  const testOfferData = {
    stage7_offer_rationale: {
      recommended_unique_mechanism: {
        mechanism_name: "Leadership Breakthrough Accelerator",
        core_promise: "Break through career ceiling to C-suite in 6-12 months without burnout",
        positioning_angle: "The only coaching program designed specifically for women in tech who've hit the invisible ceiling",
        why_it_works: "Combines strategic career planning with executive presence development"
      }
    },
    stage8_value_stack: {
      value_components: [
        { component_name: "1:1 Executive Coaching", perceived_value: "$18,000" },
        { component_name: "Group Mastermind Access", perceived_value: "$6,000" },
        { component_name: "Career Acceleration Playbook", perceived_value: "$2,000" },
        { component_name: "Executive Presence Framework", perceived_value: "$3,000" }
      ],
      total_perceived_value: "$29,000"
    }
  };

  // Step 4: Save all test data to localStorage
  localStorage.setItem('last-business-context', JSON.stringify(testBusinessContext));
  localStorage.setItem('last-research-data', JSON.stringify(testResearchData));
  localStorage.setItem('last-offer-data', JSON.stringify(testOfferData));

  // Step 5: Update prerequisites check (will show green now)
  checkPrerequisites();

  // Step 6: Create and display mock content strategy
  const testStrategy = {
    pillar_count: 4,
    pillars: [
      {
        pillar_name: "Authority Building",
        pillar_description: "Establish thought leadership through proven frameworks and industry insights",
        audience_value_proposition: "Learn from an expert with 10+ years and 200+ client success stories",
        business_goal: "Position as premium authority to command higher prices and attract Power 4% clients",
        buyer_psychology_tie: "Addresses Fear #1: 'Wasting money on unproven advice'. Promises validation and respect.",
        example_topics: [
          "3 frameworks that transformed 50+ engineering leaders in 6 months",
          "Why most leadership advice fails tech professionals (and what actually works)",
          "The hidden skill that separates mediocre leaders from exceptional ones",
          "How I turned 32 failed tech leaders into top performers using this system",
          "5 myths about leadership that are costing you promotions",
          "The truth about imposter syndrome that no one talks about",
          "Behind the scenes: How we help leaders 10x their impact in 90 days",
          "Case study: From burnout to breakthrough in 8 weeks",
          "3 questions that reveal if you're ready for executive coaching",
          "The biggest mistake tech leaders make (and how to avoid it)",
          "My contrarian take on work-life balance for tech executives",
          "7 signs you need a leadership coach (based on 200+ assessments)",
          "The framework Fortune 500 companies use for leadership development",
          "Why senior engineers struggle with leadership (psychological breakdown)",
          "How to know if you're 'management material' as an engineer"
        ],
        post_frequency_percentage: 30
      },
      {
        pillar_name: "Transformation Stories",
        pillar_description: "Real client success stories and case studies demonstrating proven results",
        audience_value_proposition: "See yourself in others who've achieved what you want",
        business_goal: "Build social proof and demonstrate ROI to justify premium pricing",
        buyer_psychology_tie: "Addresses Desire #1: 'Recognition and respect from peers'. Shows tangible outcomes.",
        example_topics: [
          "From imposter syndrome to director in 90 days: Sarah's story",
          "How a burned-out engineer became a confident VP",
          "The CTO who tripled his team's productivity in 6 months",
          "Why this tech leader quit after 2 sessions (and came back stronger)",
          "Before & after: 5 engineers who transformed their leadership",
          "The manager who went from hated to hero in 12 weeks",
          "How we helped a founder scale from 5 to 50 people",
          "The quiet engineer who became the most influential leader",
          "3 leaders share what they wish they'd known sooner",
          "The surprising result when we coached 10 engineering managers",
          "How one framework changed this leader's entire career",
          "The leader who 10x'd their impact without working more hours",
          "Why this executive credits coaching for their $200K promotion",
          "The team that went from chaos to cohesion in 8 weeks",
          "5 transformation stories that will inspire your leadership journey"
        ],
        post_frequency_percentage: 25
      },
      {
        pillar_name: "Practical Strategies",
        pillar_description: "Actionable how-to content, frameworks, and tactical advice for immediate implementation",
        audience_value_proposition: "Get proven strategies you can apply today to see results tomorrow",
        business_goal: "Demonstrate expertise and provide value that builds trust before asking for the sale",
        buyer_psychology_tie: "Addresses Pain Point #1: 'Feeling overwhelmed with information'. Provides clear, actionable steps.",
        example_topics: [
          "5-minute daily practice that improved 47 leaders' effectiveness",
          "The 3-question framework for better 1-on-1 meetings",
          "How to give feedback that actually improves performance",
          "My exact system for prioritizing when everything feels urgent",
          "The communication template that saved 50+ difficult conversations",
          "7 tactics to build trust with a skeptical team",
          "How to delegate without losing control (step-by-step guide)",
          "The meeting structure that cut wasted time by 60%",
          "3 ways to handle imposter syndrome in the moment",
          "The career planning worksheet I use with all my clients",
          "How to ask for a promotion (with email template)",
          "5 books that will change how you think about leadership",
          "The time-blocking method that works for tech leaders",
          "How to recover from a major leadership mistake",
          "My favorite tools for staying organized as a leader"
        ],
        post_frequency_percentage: 25
      },
      {
        pillar_name: "Industry Insights",
        pillar_description: "Trends, hot takes, and thought leadership on the future of tech leadership",
        audience_value_proposition: "Stay ahead of industry changes and understand what's coming next",
        business_goal: "Position as forward-thinking expert who understands industry evolution",
        buyer_psychology_tie: "Addresses Desire #2: 'Being seen as innovative and ahead of the curve'. Builds authority.",
        example_topics: [
          "Why remote leadership requires completely different skills",
          "The leadership crisis no one is talking about in tech",
          "3 trends that will define tech leadership in 2025",
          "Why AI won't replace leaders (but it will change everything)",
          "The death of the 'technical manager' role",
          "What Big Tech gets wrong about leadership development",
          "The generational shift happening in engineering management",
          "Why most leadership training fails tech professionals",
          "The hidden cost of promoting your best engineer",
          "What unicorn startups know about leadership that you don't",
          "The future of tech leadership: my predictions for 2030",
          "Why 'servant leadership' doesn't work in high-growth tech",
          "The leadership model that's replacing command-and-control",
          "What I learned from coaching 200+ tech leaders",
          "The uncomfortable truth about leadership in tech"
        ],
        post_frequency_percentage: 20
      }
    ],
    content_mix_framework: {
      educational: 45,
      entertaining: 25,
      promotional: 20,
      engagement: 10
    },
    strategic_rationale: "These 4 pillars work together to establish authority (Pillar 1), demonstrate transformation (Pillar 2), provide practical value (Pillar 3), and position as forward-thinking (Pillar 4). The mix heavily favors educational content (45%) to build trust, with entertainment (25%) to humanize the brand. Promotional content (20%) is strategically placed after value delivery.",
    competitive_differentiation: "Unlike generic business coaches who post motivational quotes, this strategy focuses on tech-specific leadership challenges with concrete frameworks and real client results. The emphasis on transformation stories and practical strategies sets this apart from theory-heavy competitors."
  };

  currentStrategy = testStrategy;
  originalStrategy = JSON.parse(JSON.stringify(testStrategy));
  localStorage.setItem('content-pillar-strategy', JSON.stringify(testStrategy));

  displayPillars(testStrategy);

  document.getElementById('generate-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');

  showToast('🧪 Test data loaded! Research + Offer prerequisites now met (green status)', 'success');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showError(message, redirectUrl) {
  alert(`ERROR: ${message}${redirectUrl ? `\n\nClick OK to go to ${redirectUrl}` : ''}`);
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}

function showToast(message, type = 'info') {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
