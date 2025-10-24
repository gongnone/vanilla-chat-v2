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

// Make functions globally available for inline onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
