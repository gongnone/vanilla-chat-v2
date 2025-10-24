// Market Research Form - Client-side Logic

let currentStep = 1;
const totalSteps = 3;

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

// Form submission
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

  try {
    // Stream response from API
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessContext)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Show output area
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('research-output').classList.remove('hidden');

    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '<div class="text-gray-500 italic">Streaming report... This may take 5-10 minutes.</div>';

    // Stream and render markdown
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let fullReport = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fullReport += value;

      // Render markdown (using markdown-it loaded from chat page)
      if (window.markdownit) {
        reportContent.innerHTML = window.markdownit({
          html: true,
          breaks: true,
          linkify: true
        }).render(fullReport);
      } else {
        // Fallback to plain text with basic formatting
        reportContent.innerHTML = fullReport
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }

      // Auto-scroll to bottom as content arrives
      reportContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Save final report
    localStorage.setItem('last-research-report', fullReport);

    // Setup export button
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

    // Setup new report button
    document.getElementById('new-report-btn').onclick = () => {
      if (confirm('Start a new report? Current form data will be cleared.')) {
        location.reload();
      }
    };

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
