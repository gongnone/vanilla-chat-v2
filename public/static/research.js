// Market Research Form - Client-side Logic

let currentStep = 1;
const totalSteps = 3;
// Multi-stage generation is now the default and only option

// Step navigation
function nextStep(step) {
  if (!validateCurrentStep()) {
    return;
  }

  currentStep = step;
  updateStepDisplay();
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
  currentStep = step;
  updateStepDisplay();
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepDisplay() {
  // Hide all steps
  document.querySelectorAll('.wizard-step').forEach(step => {
    step.classList.add('hidden');
  });

  // Show current step
  document.getElementById(`step-${currentStep}`).classList.remove('hidden');
}

function updateProgressBar() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Validation
function validateCurrentStep() {
  const currentStepEl = document.getElementById(`step-${currentStep}`);
  const requiredFields = currentStepEl.querySelectorAll('[required]');

  const warnings = [];

  for (const field of requiredFields) {
    const value = field.value.trim();

    if (!value) {
      warnings.push(`"${field.previousElementSibling.textContent.replace(' *', '')}" is required`);
      field.classList.add('border-red-500');
    } else {
      field.classList.remove('border-red-500');
    }

    // Additional validation for textareas
    if (field.tagName === 'TEXTAREA' && value && value.length < 50) {
      warnings.push(`"${field.previousElementSibling.textContent.replace(' *', '')}" needs more detail (at least 50 characters)`);
      field.classList.add('border-yellow-500');
    }
  }

  if (warnings.length > 0) {
    alert('Please address these issues:\n\n' + warnings.map((w, i) => `${i + 1}. ${w}`).join('\n'));
    return false;
  }

  return true;
}

// Quality checks before submission
function checkContextQuality(context) {
  const warnings = [];

  // Check description length
  if (context.current_offer_description.length < 100) {
    warnings.push('⚠️ Offer description is short. Adding more detail will improve results.');
  }

  // Check demographics specificity
  if (!context.target_demographics.toLowerCase().includes('income')) {
    warnings.push('⚠️ Consider adding income range to demographics for better targeting.');
  }

  // Check pain point depth
  if (context.biggest_customer_pain_point.length < 50) {
    warnings.push('⚠️ Describe the pain point in more detail for better insights.');
  }

  // Check unique mechanism
  if (context.unique_mechanism.length < 50) {
    warnings.push('⚠️ Explain your unique mechanism in more detail - this is critical!');
  }

  if (warnings.length > 0) {
    const proceed = confirm(
      'Quality suggestions:\n\n' +
      warnings.join('\n') +
      '\n\nYou can continue, but more detail = better report.\n\nContinue anyway?'
    );
    return proceed;
  }

  return true;
}

// Multi-stage progress tracking
const stages = [
  { id: 1, name: 'Market Analysis', status: 'pending', icon: '📊' },
  { id: 2, name: 'Buyer Psychology', status: 'pending', icon: '🧠' },
  { id: 3, name: 'Competitive Analysis', status: 'pending', icon: '🎯' },
  { id: 4, name: 'Avatar Creation', status: 'pending', icon: '👤' },
  { id: 5, name: 'Offer Design', status: 'pending', icon: '💎' },
  { id: 6, name: 'Report Synthesis', status: 'pending', icon: '📝' },
];

function updateStageStatus(stageId, status) {
  const stage = stages.find(s => s.id === stageId);
  if (stage) {
    stage.status = status;
  }

  const stageEl = document.getElementById(`stage-${stageId}`);
  if (!stageEl) return;

  // Update icon based on status
  const iconEl = stageEl.querySelector('.stage-icon');
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
}

function createStageProgressUI() {
  const loadingState = document.getElementById('loading-state');
  const loadingText = loadingState.querySelector('p');

  // Create multi-stage progress display
  const progressHTML = `
    <div class="mt-6 space-y-2">
      <div class="text-sm font-semibold mb-3">Generation Progress:</div>
      ${stages.map(stage => `
        <div id="stage-${stage.id}" class="flex items-center gap-2 text-sm">
          <span class="stage-icon">${stage.icon}</span>
          <span>${stage.name}</span>
          <span class="ml-auto text-xs text-gray-500 stage-time"></span>
        </div>
      `).join('')}
      <div class="mt-4 pt-4 border-t border-gray-300">
        <div class="text-xs text-gray-600">
          <strong>Total Estimated Time:</strong> 15-20 minutes<br>
          <strong>Quality:</strong> Complete data, no placeholders ✨
        </div>
      </div>
    </div>
  `;

  // Insert after loading text
  const progressContainer = document.createElement('div');
  progressContainer.innerHTML = progressHTML;
  loadingText.insertAdjacentElement('afterend', progressContainer);
}

// Multi-stage generation function
async function generateMultiStageReport(businessContext) {
  // Create progress UI
  createStageProgressUI();

  try {
    const stageStartTime = Date.now();

    // Stage 1: Market Analysis (No dependencies)
    updateStageStatus(1, 'in_progress');
    const stage1Response = await fetch('/api/research/stage/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessContext)
    });

    if (!stage1Response.ok) {
      throw new Error(`Stage 1 failed: ${stage1Response.status}`);
    }

    const stage1 = await stage1Response.json();
    updateStageStatus(1, 'completed');

    // Stage 2: Buyer Psychology (Depends on Stage 1)
    updateStageStatus(2, 'in_progress');
    const stage2Response = await fetch('/api/research/stage/2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: businessContext, stage1 })
    });

    if (!stage2Response.ok) {
      throw new Error(`Stage 2 failed: ${stage2Response.status}`);
    }

    const stage2 = await stage2Response.json();
    updateStageStatus(2, 'completed');

    // Stage 3: Competitive Analysis (Depends on Stages 1-2)
    updateStageStatus(3, 'in_progress');
    const stage3Response = await fetch('/api/research/stage/3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: businessContext, stage1, stage2 })
    });

    if (!stage3Response.ok) {
      throw new Error(`Stage 3 failed: ${stage3Response.status}`);
    }

    const stage3 = await stage3Response.json();
    updateStageStatus(3, 'completed');

    // Stage 4: Avatar Creation (Depends on Stages 1-3)
    updateStageStatus(4, 'in_progress');
    const stage4Response = await fetch('/api/research/stage/4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: businessContext, stage1, stage2, stage3 })
    });

    if (!stage4Response.ok) {
      throw new Error(`Stage 4 failed: ${stage4Response.status}`);
    }

    const stage4 = await stage4Response.json();
    updateStageStatus(4, 'completed');

    // Stage 5: Offer Design (Depends on Stages 1-4)
    updateStageStatus(5, 'in_progress');
    const stage5Response = await fetch('/api/research/stage/5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: businessContext, stage1, stage2, stage3, stage4 })
    });

    if (!stage5Response.ok) {
      throw new Error(`Stage 5 failed: ${stage5Response.status}`);
    }

    const stage5 = await stage5Response.json();
    updateStageStatus(5, 'completed');

    // Compile complete research data
    const researchData = {
      stage1_market_analysis: stage1,
      stage2_buyer_psychology: stage2,
      stage3_competitive_analysis: stage3,
      stage4_avatar_creation: stage4,
      stage5_offer_design: stage5
    };

    const stage5Time = Math.round((Date.now() - stageStartTime) / 1000);
    console.log(`✅ Stages 1-5 complete in ${stage5Time}s`);

    // Stage 6: Report Synthesis (streaming)
    updateStageStatus(6, 'in_progress');

    // Hide loading, show output
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('research-output').classList.remove('hidden');

    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<div class="text-gray-500 italic">Synthesizing final report... Almost done!</div>';

    const synthesisResponse = await fetch('/api/research/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: businessContext,
        researchData: researchData
      })
    });

    if (!synthesisResponse.ok) {
      throw new Error(`Synthesis failed: ${synthesisResponse.status}`);
    }

    // Stream the final report
    const reader = synthesisResponse.body.pipeThrough(new TextDecoderStream()).getReader();
    let fullReport = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fullReport += value;

      // Render markdown
      if (window.markdownit) {
        reportContent.innerHTML = window.markdownit({
          html: true,
          breaks: true,
          linkify: true
        }).render(fullReport);
      } else {
        reportContent.innerHTML = fullReport
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }

      reportContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    updateStageStatus(6, 'completed');

    const totalTime = Math.round((Date.now() - stageStartTime) / 1000);
    console.log(`🎉 Multi-stage generation complete in ${totalTime}s (${(totalTime / 60).toFixed(1)} minutes)`);

    // Save final report
    localStorage.setItem('last-research-report', fullReport);
    localStorage.setItem('last-research-data', JSON.stringify(researchData));

    return fullReport;

  } catch (error) {
    console.error('Multi-stage generation error:', error);

    // Mark current stage as error
    const currentStage = stages.find(s => s.status === 'in_progress');
    if (currentStage) {
      updateStageStatus(currentStage.id, 'error');
    }

    throw error;
  }
}

// Setup report export and new report buttons
function setupReportButtons(fullReport) {
  document.getElementById('copy-btn').onclick = () => {
    navigator.clipboard.writeText(fullReport).then(() => {
      const btn = document.getElementById('copy-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copied!';
      btn.classList.add('bg-green-700');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-700');
      }, 2000);
    }).catch(err => {
      alert('Failed to copy. Please select and copy manually.');
      console.error('Copy failed:', err);
    });
  };

  document.getElementById('new-report-btn').onclick = () => {
    if (confirm('Start a new report? Current form data will be cleared.')) {
      location.reload();
    }
  };

  // Navigate to offer design
  document.getElementById('design-offer-btn').onclick = () => {
    console.log('📊 Navigating to Offer Design with saved research data');
    window.location.href = '/offer-design';
  };
}

// Form submission - Always uses multi-stage generation
document.getElementById('research-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  // Collect form data
  const formData = new FormData(e.target);
  const businessContext = {};

  for (const [key, value] of formData.entries()) {
    businessContext[key] = value;
  }

  // Quality check
  if (!checkContextQuality(businessContext)) {
    return;
  }

  // Hide form, show loading
  document.getElementById('research-form').classList.add('hidden');
  document.getElementById('loading-state').classList.remove('hidden');

  // Save context to localStorage
  localStorage.setItem('last-business-context', JSON.stringify(businessContext));

  // Clean up deprecated localStorage keys
  localStorage.removeItem('use-multi-stage');

  try {
    // Generate report using multi-stage approach
    const fullReport = await generateMultiStageReport(businessContext);

    // Setup export and new report buttons
    setupReportButtons(fullReport);

  } catch (error) {
    console.error('Error generating report:', error);
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('research-form').classList.remove('hidden');
    alert('Error generating report. Please try again or check your connection.');
  }
});

// Load markdown-it library (same as chat page)
if (!window.markdownit) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js';
  document.head.appendChild(script);
}

// Initialize
updateStepDisplay();
updateProgressBar();

// Fill form with test data for quick testing
function fillTestData() {
  const form = document.getElementById('research-form');

  // Test data inspired by ashleyshaw.ca - executive coaching business
  const testData = {
    // Step 1: Business Foundation
    business_name: "Ashley Shaw Consulting",
    current_offer_description: `I provide executive coaching specifically for women in tech leadership roles who are ready to accelerate their careers and step into their full leadership potential. My signature program combines strategic career planning, executive presence development, and personalized leadership coaching delivered through a hybrid model of 1:1 sessions and group masterminds. Clients work with me for 6-12 months to overcome imposter syndrome, develop authentic leadership presence, negotiate for higher compensation, and position themselves for C-suite roles. The transformation includes both mindset shifts and tactical career acceleration strategies, with a focus on sustainable success without burnout.`,
    niche: "Executive coaching for women in tech leadership roles",
    specialization_keywords: "leadership development, executive presence, career acceleration, imposter syndrome, women in tech",
    business_stage: "growth",
    revenue_range: "100k-500k",
    preferred_market_category: "wealth",

    // Step 2: Target Market Context
    target_market_hypothesis: "High-achieving women in tech (Directors, VPs, Senior Managers) aged 35-50 who have hit a ceiling in their career progression and want to break through to executive leadership",
    target_demographics: `Women aged 35-50, currently earning $150K-$300K annually in tech companies (both startups and enterprise). Located primarily in major tech hubs (San Francisco, Seattle, New York, Austin, Toronto). Hold advanced degrees (80% have Master's or higher). In Director, VP, or Senior Manager roles at companies ranging from Series B startups to Fortune 500 tech companies. Many are parents balancing high-powered careers with family responsibilities. Above-average income households ($250K-$500K combined), progressive political leanings, value continuous learning and personal development.`,
    target_psychographics: `High achievers who are driven by impact and legacy, not just compensation. They value authenticity, continuous growth, and making a difference. Strong belief in meritocracy but increasingly aware of systemic barriers. Perfectionistic tendencies with fear of being "found out" as not good enough. Prioritize work-life integration over work-life balance. Read Harvard Business Review, listen to leadership podcasts, invest in professional development. Value strategic thinking, data-driven decisions, and efficient solutions. Want recognition for their contributions but uncomfortable with self-promotion. Deeply care about mentoring other women and creating inclusive cultures.`,
    current_customers_description: `My current clients are predominantly Directors and VPs at mid-to-large tech companies who have been in their current role for 2-3 years and feel ready for the next level but unsure how to get there. Common pattern: technically brilliant, promoted to leadership through individual contribution excellence, but struggling with the political and strategic aspects of executive leadership. Many have received feedback about "executive presence" or being "too in the weeds" without clear guidance on how to change. About 60% are in product/engineering leadership, 40% in other functions (marketing, operations, people ops). All are high performers who invest in themselves and see coaching as strategic career investment, not a remedial intervention.`,
    biggest_customer_pain_point: `They've hit a career ceiling and can't figure out why. Despite exceptional performance, strong results, and positive feedback, they keep getting passed over for VP and C-suite roles in favor of (often male) peers who seem less qualified. They've been told they need more "executive presence" or need to be "more strategic" but these feel like vague, subjective criticisms without actionable steps. They're exhausted from working twice as hard to prove themselves, dealing with imposter syndrome, and watching less qualified people get promoted. They want to advance without sacrificing their values or burning out, but don't have a clear roadmap. The fear of being "found out" as not good enough combined with the reality of gender bias creates constant anxiety and self-doubt that undermines their confidence in high-stakes situations.`,

    // Step 3: Offer Context
    service_type: "coaching",
    delivery_format: "hybrid",
    price_point_current: "$12,000 for 6 months (paid monthly at $2,000/mo)",
    desired_price_point: "$25,000 for 6 months (or $50,000 annual retainer for ongoing)",
    offer_duration: "6 months primary program, with option for quarterly renewals at $3,000/quarter",
    unique_mechanism: `My proprietary "Strategic Visibility Framework" combines three elements that other executive coaches miss: (1) The Career Architecture Blueprint - a systematic approach to mapping the hidden requirements for each leadership level and reverse-engineering promotion paths, (2) The Authentic Authority Method - developing executive presence that feels genuine rather than performative by aligning leadership style with personal values, and (3) The Strategic Visibility System - a specific methodology for making your impact visible to decision-makers without feeling salesy or self-promotional. Unlike general leadership coaching, this is specifically designed for the unique challenges women in tech face, informed by my 15 years in tech leadership and certification in both executive coaching and organizational psychology.`,
    competitors_offers: `BetterUp ($300-500/mo, app-based, not women-specific), Torch ($250-400/mo, corporate-focused), The Muse coaching marketplace ($200-400/session, variable quality), various independent executive coaches ($300-600/session, typically no structured program). Most competitors either offer generic executive coaching not tailored to tech or women, or focus only on tactical career advice without the leadership development component. Price points range from $2,400-$6,000 for 6-month engagements for general coaching, up to $15,000-$20,000 for established executive coaches with tech backgrounds.`
  };

  // Fill all form fields
  for (const [name, value] of Object.entries(testData)) {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.value = value;
      field.classList.remove('border-red-500', 'border-yellow-500');
    }
  }

  // Auto-advance to final step
  currentStep = 3;
  updateStepDisplay();
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Show confirmation
  setTimeout(() => {
    alert('✅ Test data loaded! Review the form and click "Generate Research Report" when ready.');
  }, 500);
}

// Make functions globally available for inline onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.fillTestData = fillTestData;
