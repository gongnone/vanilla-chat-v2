// Strategic Offer Design - Client-side Logic

// Character counter for primary transformation
document.addEventListener('DOMContentLoaded', () => {
  const transformationInput = document.querySelector('[name="primary_transformation"]');
  const charCount = document.getElementById('transformation-count');

  if (transformationInput && charCount) {
    transformationInput.addEventListener('input', () => {
      const count = transformationInput.value.length;
      charCount.textContent = `${count} characters`;
      charCount.className = count >= 100 ? 'mt-1 text-xs text-green-600' : 'mt-1 text-xs text-gray-400';
    });
  }

  // Check for research data on page load
  checkPrerequisites();
});

// Check if research data exists
function checkPrerequisites() {
  const researchData = localStorage.getItem('lastResearchReport');
  const notice = document.getElementById('prerequisites-notice');

  if (!researchData && notice) {
    notice.classList.add('border-red-400', 'bg-red-50');
    notice.querySelector('p').innerHTML = '<strong>⚠️ RESEARCH REQUIRED:</strong> You must complete market research first. <a href="/research" class="underline font-bold">Go to Research →</a>';
  } else if (notice) {
    notice.classList.remove('border-red-400', 'bg-red-50');
    notice.classList.add('border-green-400', 'bg-green-50');
    notice.querySelector('p').innerHTML = '<strong>✅ Research Loaded:</strong> Ready to generate offer design';
  }
}

// Collect offer preferences from form
function collectOfferPreferences() {
  const form = document.getElementById('offer-design-form');

  // Strategic priorities (multi-select checkboxes)
  const prioritiesCheckboxes = form.querySelectorAll('[name="strategic_priorities"]:checked');
  const strategic_priorities = Array.from(prioritiesCheckboxes).map(cb => cb.value);

  // Primary transformation
  const primary_transformation = form.querySelector('[name="primary_transformation"]').value.trim();

  // Proof assets
  const proof_assets_available = {
    testimonials: form.querySelector('[name="proof_testimonials"]').checked,
    case_studies: form.querySelector('[name="proof_case_studies"]').checked,
    before_after: form.querySelector('[name="proof_before_after"]').checked,
    certifications: form.querySelector('[name="proof_certifications"]').checked,
    media_mentions: form.querySelector('[name="proof_media_mentions"]').checked,
  };

  // Pricing strategy
  const pricing_strategy = form.querySelector('[name="pricing_strategy"]').value;

  // Price range
  const comfortable_price_range = {
    min: parseInt(form.querySelector('[name="price_range_min"]').value, 10),
    max: parseInt(form.querySelector('[name="price_range_max"]').value, 10),
  };

  // Unique assets
  const proprietary_frameworks = form.querySelector('[name="proprietary_frameworks"]').value.trim();
  const unique_tools_resources = form.querySelector('[name="unique_tools_resources"]').value.trim();
  const exclusive_access = form.querySelector('[name="exclusive_access"]').value.trim();

  // Guarantee
  const guarantee_risk_tolerance = form.querySelector('[name="guarantee_risk_tolerance"]').value;

  // Emphasize components
  const emphasizeCheckboxes = form.querySelectorAll('[name="emphasize_components"]:checked');
  const emphasize_components = Array.from(emphasizeCheckboxes).map(cb => cb.value);

  // Voice preferences (optional)
  const voice_tone = form.querySelector('[name="voice_tone"]').value;
  const avoid_words = form.querySelector('[name="avoid_words"]').value.trim();
  const must_include_concepts = form.querySelector('[name="must_include_concepts"]').value.trim();

  let voice_preferences = undefined;
  if (voice_tone || avoid_words || must_include_concepts) {
    voice_preferences = {
      tone: voice_tone || 'professional',
      avoid_words,
      must_include_concepts,
    };
  }

  return {
    strategic_priorities,
    primary_transformation,
    proof_assets_available,
    pricing_strategy,
    comfortable_price_range,
    proprietary_frameworks,
    unique_tools_resources,
    exclusive_access,
    guarantee_risk_tolerance,
    emphasize_components,
    voice_preferences,
  };
}

// Validate offer preferences
function validateOfferPreferences(preferences) {
  const errors = [];

  // Minimum 1 strategic priority
  if (preferences.strategic_priorities.length === 0) {
    errors.push('Please select at least 1 strategic priority');
  }

  // Primary transformation minimum length
  if (preferences.primary_transformation.length < 50) {
    errors.push('Primary transformation needs more detail (at least 50 characters)');
  }

  // Pricing strategy required
  if (!preferences.pricing_strategy) {
    errors.push('Please select a pricing strategy');
  }

  // Price range validation
  if (preferences.comfortable_price_range.min <= 0) {
    errors.push('Minimum price must be greater than $0');
  }

  if (preferences.comfortable_price_range.max <= preferences.comfortable_price_range.min) {
    errors.push('Maximum price must be greater than minimum price');
  }

  // Unique assets required
  if (!preferences.proprietary_frameworks) {
    errors.push('Please describe your proprietary frameworks/methods');
  }

  if (!preferences.unique_tools_resources) {
    errors.push('Please describe your unique tools & resources');
  }

  if (!preferences.exclusive_access) {
    errors.push('Please describe exclusive access/community');
  }

  // Guarantee required
  if (!preferences.guarantee_risk_tolerance) {
    errors.push('Please select guarantee risk tolerance');
  }

  if (errors.length > 0) {
    alert('Please fix these errors:\n\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n'));
    return false;
  }

  return true;
}

// Form submission handler
document.getElementById('offer-design-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect preferences
  const preferences = collectOfferPreferences();

  // Validate
  if (!validateOfferPreferences(preferences)) {
    return;
  }

  // Check for research data - REQUIRED
  const researchDataString = localStorage.getItem('lastResearchReport');
  if (!researchDataString) {
    alert(
      '⚠️ MARKET RESEARCH REQUIRED\n\n' +
      'Strategic Offer Design requires market research data to create high-quality offers.\n\n' +
      'You will be redirected to the research page to complete this step first.\n\n' +
      'This takes 15-20 minutes but dramatically improves offer quality.'
    );
    window.location.href = '/research';
    return;
  }

  // Save preferences
  localStorage.setItem('lastOfferPreferences', JSON.stringify(preferences));

  // Start generation
  generateStrategicOffer(preferences, researchDataString ? JSON.parse(researchDataString) : null);
});

// Main offer generation function
async function generateStrategicOffer(preferences, researchData) {
  // Hide form, show loading
  document.getElementById('offer-design-form').classList.add('hidden');
  document.getElementById('offer-loading-state').classList.remove('hidden');

  // Create progress UI
  createOfferProgressUI();

  // Build context
  const context = {
    business_context: researchData?.context || {},
    research_data: researchData?.researchData || {},
    user_preferences: preferences,
  };

  try {
    // Stage 7: Offer Rationale
    updateOfferStageStatus(7, 'in_progress');
    const stage7 = await fetchOfferStage(7, context);
    updateOfferStageStatus(7, 'completed');

    // Stage 8: Value Stack
    updateOfferStageStatus(8, 'in_progress');
    const stage8 = await fetchOfferStage(8, context);
    updateOfferStageStatus(8, 'completed');

    // Stage 9: Pricing Framework
    updateOfferStageStatus(9, 'in_progress');
    const stage9 = await fetchOfferStage(9, context);
    updateOfferStageStatus(9, 'completed');

    // Stage 10: Payment Plans
    updateOfferStageStatus(10, 'in_progress');
    const stage10 = await fetchOfferStage(10, context);
    updateOfferStageStatus(10, 'completed');

    // Stage 11: Premium Bonuses
    updateOfferStageStatus(11, 'in_progress');
    const stage11 = await fetchOfferStage(11, context);
    updateOfferStageStatus(11, 'completed');

    // Stage 12: Power Guarantee
    updateOfferStageStatus(12, 'in_progress');
    const stage12 = await fetchOfferStage(12, context);
    updateOfferStageStatus(12, 'completed');

    // Stage 13: Scarcity & Upsells
    updateOfferStageStatus(13, 'in_progress');
    const stage13 = await fetchOfferStage(13, context);
    updateOfferStageStatus(13, 'completed');

    // Save complete offer
    const completeOffer = {
      context,
      stages: { stage7, stage8, stage9, stage10, stage11, stage12, stage13 },
      generated_at: new Date().toISOString(),
    };

    localStorage.setItem('lastOfferDesign', JSON.stringify(completeOffer));

    // Display results
    displayOfferResults(completeOffer);

  } catch (error) {
    console.error('Offer generation error:', error);
    alert(`Generation failed: ${error.message}\n\nPlease try again or check the console for details.`);

    // Reset UI
    document.getElementById('offer-loading-state').classList.add('hidden');
    document.getElementById('offer-design-form').classList.remove('hidden');
  }
}

// Fetch individual offer stage
async function fetchOfferStage(stageNumber, context) {
  const response = await fetch(`/api/offer/stage/${stageNumber}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Stage ${stageNumber} failed with status ${response.status}`);
  }

  return await response.json();
}

// Progress tracking
const offerStages = [
  { id: 7, name: 'Offer Rationale', status: 'pending', icon: '🎯' },
  { id: 8, name: 'Value Stack', status: 'pending', icon: '💎' },
  { id: 9, name: 'Pricing Framework', status: 'pending', icon: '💰' },
  { id: 10, name: 'Payment Plans', status: 'pending', icon: '💳' },
  { id: 11, name: 'Premium Bonuses', status: 'pending', icon: '🎁' },
  { id: 12, name: 'Power Guarantee', status: 'pending', icon: '🛡️' },
  { id: 13, name: 'Scarcity & Upsells', status: 'pending', icon: '⚡' },
];

function createOfferProgressUI() {
  const loadingState = document.getElementById('offer-loading-state');

  const progressHTML = `
    <div class="mt-6 space-y-2">
      <div class="text-sm font-semibold mb-3">Generation Progress:</div>
      ${offerStages.map(stage => `
        <div id="offer-stage-${stage.id}" class="flex items-center gap-2 text-sm">
          <span class="stage-icon">${stage.icon}</span>
          <span>${stage.name}</span>
          <span class="ml-auto text-xs text-gray-500 stage-time"></span>
        </div>
      `).join('')}
      <div class="mt-4 pt-4 border-t border-gray-300">
        <div class="text-xs text-gray-600">
          <strong>Total Estimated Time:</strong> 8-12 minutes<br>
          <strong>Quality:</strong> Complete data with 3 order bumps + 2 upsells ✨
        </div>
      </div>
    </div>
  `;

  const progressContainer = document.createElement('div');
  progressContainer.innerHTML = progressHTML;
  loadingState.appendChild(progressContainer);
}

function updateOfferStageStatus(stageId, status) {
  const stage = offerStages.find(s => s.id === stageId);
  if (stage) {
    stage.status = status;
  }

  const stageEl = document.getElementById(`offer-stage-${stageId}`);
  if (!stageEl) return;

  const iconEl = stageEl.querySelector('.stage-icon');
  if (status === 'in_progress') {
    iconEl.textContent = '⏳';
    stageEl.classList.add('text-purple-600', 'font-semibold');
  } else if (status === 'completed') {
    iconEl.textContent = '✅';
    stageEl.classList.remove('text-purple-600');
    stageEl.classList.add('text-green-600');
  } else if (status === 'error') {
    iconEl.textContent = '❌';
    stageEl.classList.remove('text-purple-600');
    stageEl.classList.add('text-red-600');
  }
}

// Display results
function displayOfferResults(completeOffer) {
  document.getElementById('offer-loading-state').classList.add('hidden');
  document.getElementById('offer-output').classList.remove('hidden');

  const content = document.getElementById('offer-content');
  const { stages } = completeOffer;

  let html = '<div class="space-y-8">';

  // Stage 7: Offer Rationale (3 options)
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        🎯 Offer Rationale
      </h2>
      <div class="space-y-4">
        ${renderOfferRationaleOption('Option 1', stages.stage7.option_1, stages.stage7.recommended_option === 'option_1')}
        ${renderOfferRationaleOption('Option 2', stages.stage7.option_2, stages.stage7.recommended_option === 'option_2')}
        ${renderOfferRationaleOption('Option 3', stages.stage7.option_3, stages.stage7.recommended_option === 'option_3')}
        <div class="bg-blue-50 p-4 rounded-lg mt-4">
          <p class="text-sm font-semibold text-blue-900">Recommendation:</p>
          <p class="text-sm text-blue-800 mt-1">${stages.stage7.recommendation_rationale || 'N/A'}</p>
        </div>
      </div>
    </section>
  `;

  // Stage 8: Value Stack
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        💎 Value Stack
      </h2>
      <div class="space-y-3">
        ${(stages.stage8.core_components || []).map((comp, i) => `
          <div class="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r">
            <p class="font-bold text-purple-900">${i + 1}. ${comp.component_name}</p>
            <p class="text-sm text-gray-700 mt-1"><strong>What it is:</strong> ${comp.what_it_is}</p>
            <p class="text-sm text-gray-700 mt-1"><strong>What it does:</strong> ${comp.what_it_does}</p>
            <p class="text-sm text-gray-600 mt-1"><em>Addresses: ${comp.desire_addressed}</em></p>
            <p class="text-sm text-purple-700 mt-1"><strong>Value:</strong> $${comp.perceived_value}</p>
          </div>
        `).join('')}
        <div class="mt-4 p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border-2 border-purple-400">
          <p class="text-xl font-bold text-purple-900">
            Total Stacked Value: $${stages.stage8.total_perceived_value?.toLocaleString() || 'N/A'}
          </p>
          <p class="text-sm text-purple-800 mt-2">
            ${stages.stage8.value_stack_summary || ''}
          </p>
        </div>
      </div>
    </section>
  `;

  // Stage 9: Pricing Framework
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        💰 Pricing Framework
      </h2>
      <div class="bg-green-50 p-6 rounded-lg border-2 border-green-400">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600">Recommended Price</p>
            <p class="text-3xl font-bold text-green-700">$${stages.stage9.recommended_price?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Value-to-Price Ratio</p>
            <p class="text-3xl font-bold text-green-700">${stages.stage9.value_to_price_ratio || 'N/A'}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-green-200">
          <p class="text-sm font-semibold text-green-900 mb-2">Pricing Rationale:</p>
          <p class="text-sm text-gray-700 mb-3">${stages.stage9.pricing_rationale || 'N/A'}</p>
          <p class="text-sm font-semibold text-green-900 mb-2">Competitive Positioning:</p>
          <p class="text-sm text-gray-700">${stages.stage9.competitive_positioning || 'N/A'}</p>
        </div>
      </div>
    </section>
  `;

  // Stage 10: Payment Plans
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        💳 Payment Plans
      </h2>
      <div class="grid gap-4 md:grid-cols-3">
        ${(stages.stage10.payment_plans || []).map(plan => `
          <div class="bg-blue-50 p-4 rounded-lg border-2 ${plan.is_recommended ? 'border-blue-500 ring-2 ring-blue-300' : 'border-blue-200'}">
            ${plan.is_recommended ? '<div class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">RECOMMENDED</div>' : ''}
            <p class="font-bold text-lg text-blue-900">${plan.plan_name}</p>
            <p class="text-sm text-gray-700 mt-2">${plan.payment_structure}</p>
            <p class="text-sm text-blue-700 mt-2"><strong>Total:</strong> $${plan.total_price?.toLocaleString()}</p>
            <p class="text-sm text-blue-700 mt-1"><strong>Incentive:</strong> ${plan.incentive}</p>
            <p class="text-sm text-gray-700 mt-2"><strong>Best for:</strong> ${plan.best_for}</p>
            <p class="text-xs text-gray-600 mt-3">${plan.conversion_psychology}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Stage 11: Premium Bonuses
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        🎁 Premium Bonuses
      </h2>
      <div class="space-y-3">
        ${(stages.stage11.bonuses || []).map((bonus, i) => `
          <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p class="font-bold text-yellow-900">Bonus ${i + 1}: ${bonus.bonus_name}</p>
            <p class="text-sm text-gray-700 mt-1">${bonus.what_it_is}</p>
            <p class="text-sm text-yellow-700 mt-2">
              <strong>Value:</strong> ${bonus.perceived_value} |
              <strong>Delivery:</strong> ${bonus.delivery_timeline}
            </p>
            <p class="text-xs text-gray-600 mt-2"><em>${bonus.why_it_matters}</em></p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Stage 12: Power Guarantee (3 options)
  html += `
    <section class="border-b pb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        🛡️ Power Guarantee
      </h2>
      <div class="space-y-4">
        ${(stages.stage12.guarantee_options || []).map((option, i) => `
          <details class="bg-green-50 p-4 rounded-lg border-2 border-green-300">
            <summary class="font-bold text-green-900 cursor-pointer">
              Option ${i + 1}: ${option.guarantee_name || 'Guarantee ' + (i + 1)}
              ${option.is_recommended ? ' ⭐ RECOMMENDED' : ''}
            </summary>
            <div class="mt-3 space-y-2 text-sm">
              <p class="text-gray-700">${option.guarantee_statement || 'N/A'}</p>
              <p class="text-green-700"><strong>Why it works:</strong> ${option.why_it_works || 'N/A'}</p>
              <p class="text-gray-600"><strong>Terms:</strong> ${option.terms || 'N/A'}</p>
            </div>
          </details>
        `).join('')}
      </div>
    </section>
  `;

  // Stage 13: Order Bumps & Upsells
  html += `
    <section>
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        ⚡ Monetization Strategy
      </h2>

      <!-- Order Bumps -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-3 text-orange-700">Order Bumps (Add at Checkout)</h3>
        <div class="grid gap-3 md:grid-cols-3">
          ${(stages.stage13.order_bumps || []).map(bump => `
            <div class="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
              <p class="font-bold text-orange-900">${bump.bump_name}</p>
              <p class="text-2xl font-bold text-orange-700 my-2">$${bump.price}</p>
              <p class="text-xs text-gray-600 mb-2">${bump.what_it_is}</p>
              <p class="text-xs text-orange-700"><strong>Value:</strong> $${bump.perceived_value}</p>
              <div class="mt-3 pt-3 border-t border-orange-200">
                <p class="text-xs italic text-gray-700">"${bump.conversion_hook}"</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Upsells -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-3 text-purple-700">Upsells (Post-Purchase)</h3>
        <div class="grid gap-4 md:grid-cols-2">
          ${(stages.stage13.upsells || []).map(upsell => `
            <div class="bg-purple-50 p-5 rounded-lg border-2 border-purple-400">
              <p class="font-bold text-lg text-purple-900">${upsell.upsell_name}</p>
              <p class="text-3xl font-bold text-purple-700 my-3">$${upsell.price}</p>
              <p class="text-sm text-gray-700 mb-2">${upsell.what_it_is}</p>
              <p class="text-sm text-purple-700 mb-2"><strong>Why upgrade:</strong> ${upsell.why_upgrade}</p>
              <p class="text-xs text-gray-600"><strong>Perceived Value:</strong> $${upsell.perceived_value}</p>
              <div class="mt-3 pt-3 border-t border-purple-200">
                <p class="text-sm font-semibold text-purple-800">"${upsell.conversion_hook}"</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Scarcity Mechanisms -->
      <div class="bg-red-50 p-5 rounded-lg border-2 border-red-300">
        <h3 class="text-lg font-semibold mb-3 text-red-900">Scarcity Mechanisms</h3>
        <div class="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <p class="font-semibold text-red-800">Enrollment Scarcity:</p>
            <p class="text-gray-700">${stages.stage13.scarcity_mechanisms?.enrollment_scarcity || 'N/A'}</p>
          </div>
          <div>
            <p class="font-semibold text-red-800">Bonus Scarcity:</p>
            <p class="text-gray-700">${stages.stage13.scarcity_mechanisms?.bonus_scarcity || 'N/A'}</p>
          </div>
          <div>
            <p class="font-semibold text-red-800">Price Scarcity:</p>
            <p class="text-gray-700">${stages.stage13.scarcity_mechanisms?.price_scarcity || 'N/A'}</p>
          </div>
          <div>
            <p class="font-semibold text-red-800">Social Proof:</p>
            <p class="text-gray-700">${stages.stage13.scarcity_mechanisms?.social_proof_scarcity || 'N/A'}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-red-200">
          <p class="text-sm font-semibold text-red-900">Revenue Potential:</p>
          <p class="text-sm text-gray-700">
            Order Bumps: $${stages.stage13.total_order_bump_revenue_potential || 0} |
            Upsells: $${stages.stage13.total_upsell_revenue_potential || 0}
          </p>
        </div>
      </div>
    </section>
  `;

  html += '</div>';
  content.innerHTML = html;

  // Scroll to results
  document.getElementById('offer-output').scrollIntoView({ behavior: 'smooth' });
}

// Helper function to render offer rationale options
function renderOfferRationaleOption(label, option, isRecommended) {
  if (!option) return '<p class="text-red-600">Option data missing</p>';

  // Handle differentiation as array or string
  const differentiation = Array.isArray(option.differentiation)
    ? option.differentiation.join('; ')
    : (option.differentiation_strategy || option.differentiation || 'N/A');

  return `
    <details class="bg-blue-50 p-4 rounded-lg border-2 ${isRecommended ? 'border-blue-500' : 'border-blue-200'}" ${isRecommended ? 'open' : ''}>
      <summary class="font-bold text-blue-900 cursor-pointer">
        ${label}${isRecommended ? ' ⭐ RECOMMENDED' : ''}
      </summary>
      <div class="mt-3 space-y-2 text-sm">
        <p><strong class="text-blue-800">Big Promise:</strong> ${option.big_promise || 'N/A'}</p>
        <p><strong class="text-blue-800">Unique Mechanism:</strong> ${option.unique_mechanism_name || option.unique_mechanism || 'N/A'}</p>
        <p><strong class="text-blue-800">Who It's For:</strong> ${option.who_its_for || 'N/A'}</p>
        <p><strong class="text-blue-800">Why Now:</strong> ${option.why_now || 'N/A'}</p>
        <p><strong class="text-blue-800">Differentiation:</strong> ${differentiation}</p>
        <p class="text-xs text-gray-600 italic mt-2"><strong>Strategic Angle:</strong> ${option.strategic_angle || 'N/A'}</p>
      </div>
    </details>
  `;
}

// Copy to clipboard
document.getElementById('copy-offer-btn')?.addEventListener('click', () => {
  const content = document.getElementById('offer-content').innerText;
  navigator.clipboard.writeText(content).then(() => {
    alert('✅ Offer design copied to clipboard!');
  });
});

// New offer button
document.getElementById('new-offer-btn')?.addEventListener('click', () => {
  if (confirm('Start a new offer design? This will reset the form.')) {
    location.reload();
  }
});

// Fill test data function
window.fillOfferTestData = function() {
  const form = document.getElementById('offer-design-form');

  // IMPORTANT: Also load test research data into localStorage
  // This matches the Ashley Shaw Consulting report from test-research-report.md
  const testResearchData = {
    context: {
      business_name: "Ashley Shaw Consulting",
      current_offer_description: "Executive coaching for women in tech leadership",
      niche: "Leadership coaching for high-achieving women in tech",
      specialization_keywords: "executive presence, career advancement, C-suite transitions",
      business_stage: "growth",
      revenue_range: "50k-100k",
      preferred_market_category: "wealth",
      target_market_hypothesis: "Women tech leaders aged 40-45 in VP/Senior Manager roles",
      target_demographics: "Age 40-45, income $300K-$450K, STEM degrees",
      target_psychographics: "Value authenticity, growth, making impact",
      biggest_customer_pain_point: "Undervalued and overlooked for C-suite despite qualifications",
      service_type: "coaching",
      delivery_format: "1:1",
      price_point_current: "$24,997",
      offer_duration: "12 weeks",
      unique_mechanism: "Strategic Visibility Framework"
    },
    researchData: {
      stage1_market_analysis: {
        market_growth_rate: "10.2% annually",
        market_size_2024: "$4.2 billion",
        market_size_2025_projected: "$4.7 billion",
        bleeding_neck_problem: "Undervaluation, oversight, and underpromotion of women in tech leadership despite exceptional performance",
        purchasing_power: {
          average_household_income: "$275,000-$425,000",
          discretionary_spending: "$10,000-$20,000 per year"
        },
        targetability: {
          platform_fit: "Facebook and Instagram",
          targeting_interests: ["women in leadership", "tech careers"],
          targeting_behaviors: ["executives", "decision makers"],
          difficulty_score: 8
        },
        top_20_percent: {
          demographics: "Age 38-48, income $200K-$350K",
          psychographics: "Value personal growth, leadership development",
          characteristics: "Highly motivated, results-driven"
        },
        power_4_percent: {
          demographics: "Age 40-45, income $300K-$450K, VPs/Senior Managers in tech",
          psychographics: "Value authenticity, growth, impact",
          buying_frequency: "Every 12-18 months",
          lifetime_value: "$120,000-$200,000 over 5 years",
          differentiation: "Commitment to excellence and transformation"
        }
      },
      stage2_buyer_psychology: {
        top_fears: [
          { quote: "I'll never be taken seriously as a leader because of my gender", intensity: 9 },
          { quote: "I'll fail as a leader and let my team down", intensity: 8 }
        ],
        top_desires: [
          { aspirational_quote: "To be recognized as a leader and expert in my field", intensity: 10 },
          { aspirational_quote: "To have confidence and self-assurance to take on any challenge", intensity: 9 }
        ],
        buyer_language: [
          { exact_phrase: "hitting a glass ceiling" },
          { exact_phrase: "passed over for promotions" },
          { exact_phrase: "need more executive presence" }
        ],
        top_pain_points: [
          { quote: "Feeling like I'm constantly fighting an uphill battle" },
          { quote: "Lack of clear guidance on how to navigate my career" }
        ],
        price_justification: "Premium pricing of $15,000 represents 7-20x ROI within 12 months"
      },
      stage3_competitive_analysis: {
        unique_value_proposition: "Help women in tech achieve recognition through Strategic Visibility Framework - guaranteed results in 6-8 weeks",
        competitive_pricing_analysis: "Price gap between $1,500 mid-tier and $10,000+ high-end creates opportunity",
        positioning_gaps: ["Tailored to women in tech", "Proprietary framework", "Speed emphasis"],
        why_business_wins: "Only solution with outcome guarantee and 1:1 personalization for Power 4%"
      },
      stage4_avatar_creation: {
        avatar_name: "Ava Morales",
        demographics: {
          age_range: "42",
          household_income: "$325,000",
          location: "San Francisco Bay Area"
        },
        price_sensitivity: "medium",
        price_sensitivity_justification: "$325K income, won't blink at $10K-20K if believes it works",
        buying_triggers: {
          optimal_contact_days: ["Tuesday", "Thursday"],
          optimal_contact_times: ["7:00-8:00am", "8:00-9:00pm"],
          platform_preferences: ["LinkedIn", "Twitter"]
        },
        online_communities: [
          { platform: "LinkedIn", member_count: "15,000" }
        ]
      },
      stage5_offer_design: {
        core_offer: {
          offer_name: "Leadership Breakthrough Accelerator",
          target_outcome: "Recognition and confidence as a leader"
        },
        pricing_tiers: [
          { tier_name: "Foundation", price: "$9,997", is_recommended: false },
          { tier_name: "VIP Accelerator", price: "$24,997", is_recommended: true },
          { tier_name: "Done-With-You Platinum", price: "$49,997", is_recommended: false }
        ],
        guarantee: {
          why_it_works: "Complete program, implement framework - if no results in 6 months, continue at no cost or 100% refund"
        }
      }
    }
  };

  // Save to localStorage
  localStorage.setItem('lastResearchReport', JSON.stringify(testResearchData));
  console.log('✅ Test research data loaded into localStorage');

  // Update prerequisites notice
  checkPrerequisites();

  // Strategic priorities
  form.querySelectorAll('[name="strategic_priorities"]')[0].checked = true;
  form.querySelectorAll('[name="strategic_priorities"]')[1].checked = true;
  form.querySelectorAll('[name="strategic_priorities"]')[3].checked = true;

  // Primary transformation
  form.querySelector('[name="primary_transformation"]').value =
    'Achieve sustainable work-life balance and peak performance without sacrificing career growth or compromising family time';

  // Proof assets
  form.querySelector('[name="proof_testimonials"]').checked = true;
  form.querySelector('[name="proof_case_studies"]').checked = true;
  form.querySelector('[name="proof_certifications"]').checked = true;

  // Pricing
  form.querySelector('[name="pricing_strategy"]').value = 'value-based';
  form.querySelector('[name="price_range_min"]').value = '5000';
  form.querySelector('[name="price_range_max"]').value = '25000';

  // Unique assets
  form.querySelector('[name="proprietary_frameworks"]').value = 'Time Mastery System™, Executive Balance Framework';
  form.querySelector('[name="unique_tools_resources"]').value = 'Custom time audit tool, implementation templates, weekly accountability workbook, video library';
  form.querySelector('[name="exclusive_access"]').value = 'Private Slack community, bi-weekly group coaching calls, lifetime program updates';

  // Guarantee
  form.querySelector('[name="guarantee_risk_tolerance"]').value = 'moderate';

  // Emphasize
  form.querySelectorAll('[name="emphasize_components"]')[0].checked = true;
  form.querySelectorAll('[name="emphasize_components"]')[4].checked = true;

  // Trigger character counter update
  form.querySelector('[name="primary_transformation"]').dispatchEvent(new Event('input'));

  alert('✅ Test data filled! Review and submit when ready.');
};
