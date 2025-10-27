// Research Data Editor - Critical Fields Only (Phase 1 MVP)
// Focused on the 15 fields that actually impact offer generation quality

/**
 * Critical Field Definitions
 * These are the exact fields extracted by extractEssentialResearchData()
 * Editing these has 10x more impact than editing other fields
 */
const CRITICAL_FIELDS = {
  buyer_psychology: {
    label: '🧠 Buyer Psychology',
    subtitle: 'HIGHEST IMPACT - These drive guarantee, bonuses, and all marketing copy',
    fields: [
      {
        path: 'stage2_buyer_psychology.fear_1',
        label: 'Top Fear #1',
        type: 'textarea',
        rows: 3,
        maxLength: 200,
        help: '💎 Used in: Stage 12 Power Guarantee Design',
        placeholder: 'Customer\'s #1 fear in their own words...'
      },
      {
        path: 'stage2_buyer_psychology.fear_2',
        label: 'Top Fear #2',
        type: 'textarea',
        rows: 3,
        maxLength: 200,
        help: '💎 Used in: Stage 12 Power Guarantee Design',
        placeholder: 'Customer\'s #2 fear in their own words...'
      },
      {
        path: 'stage2_buyer_psychology.desire_1',
        label: 'Top Desire #1',
        type: 'textarea',
        rows: 3,
        maxLength: 200,
        help: '💎 Used in: Stage 11 Premium Bonuses',
        placeholder: 'What they dream about achieving...'
      },
      {
        path: 'stage2_buyer_psychology.desire_2',
        label: 'Top Desire #2',
        type: 'textarea',
        rows: 3,
        maxLength: 200,
        help: '💎 Used in: Stage 11 Premium Bonuses',
        placeholder: 'Their aspirational outcome...'
      },
      {
        path: 'stage2_buyer_psychology.buyer_phrases.0',
        label: 'Buyer Language #1',
        type: 'text',
        maxLength: 100,
        help: '💎 Used in: ALL marketing copy and headlines',
        placeholder: 'Exact phrase customers use...'
      },
      {
        path: 'stage2_buyer_psychology.buyer_phrases.1',
        label: 'Buyer Language #2',
        type: 'text',
        maxLength: 100,
        help: '💎 Used in: ALL marketing copy and headlines',
        placeholder: 'Another phrase they say...'
      },
      {
        path: 'stage2_buyer_psychology.buyer_phrases.2',
        label: 'Buyer Language #3',
        type: 'text',
        maxLength: 100,
        help: '💎 Used in: ALL marketing copy and headlines',
        placeholder: 'Third common phrase...'
      },
      {
        path: 'stage2_buyer_psychology.pain_point_1_quote',
        label: 'Pain Point #1 Quote',
        type: 'textarea',
        rows: 2,
        maxLength: 150,
        help: '💎 Used in: Stage 8 Value Stack',
        placeholder: 'Their biggest frustration...'
      },
      {
        path: 'stage2_buyer_psychology.pain_point_2_quote',
        label: 'Pain Point #2 Quote',
        type: 'textarea',
        rows: 2,
        maxLength: 150,
        help: '💎 Used in: Stage 8 Value Stack',
        placeholder: 'Second major pain point...'
      },
      {
        path: 'stage2_buyer_psychology.price_justification',
        label: 'Price Justification',
        type: 'textarea',
        rows: 3,
        maxLength: 300,
        help: '💎 Used in: Stage 9 Pricing Framework',
        placeholder: 'Why customers will pay premium prices...'
      }
    ]
  },
  market_context: {
    label: '📊 Market Context',
    subtitle: 'Medium impact - Used for positioning and framing',
    fields: [
      {
        path: 'stage1_market_analysis.market_growth_rate',
        label: 'Market Growth Rate',
        type: 'text',
        maxLength: 50,
        help: 'Used for: Market opportunity framing',
        placeholder: 'e.g., "11.2% annually"'
      },
      {
        path: 'stage1_market_analysis.market_size_2024',
        label: 'Market Size 2024',
        type: 'text',
        maxLength: 50,
        help: 'Used for: TAM context',
        placeholder: 'e.g., "$4.8 billion"'
      },
      {
        path: 'stage1_market_analysis.bleeding_neck_problem',
        label: 'Bleeding Neck Problem',
        type: 'textarea',
        rows: 3,
        maxLength: 200,
        help: '💎 Used in: Stage 7 Offer Rationale, Stage 8 Value Stack',
        placeholder: 'The core problem that\'s urgent and painful...'
      },
      {
        path: 'stage1_market_analysis.power_4_percent.demographics',
        label: 'Power 4% Demographics',
        type: 'textarea',
        rows: 2,
        maxLength: 150,
        help: 'Used for: Ideal customer profiling',
        placeholder: 'Who are the top 4% most valuable customers...'
      },
      {
        path: 'stage1_market_analysis.power_4_percent.lifetime_value',
        label: 'Power 4% Lifetime Value',
        type: 'text',
        maxLength: 100,
        help: 'Used for: Pricing anchor',
        placeholder: 'e.g., "$50,000 - $100,000"'
      }
    ]
  }
};

/**
 * Deep get/set utilities for nested JSON paths
 * Handles paths like "stage2_buyer_psychology.top_fears.0.quote"
 */
function getNestedValue(obj, path) {
  const keys = path.split(/[\.\[\]]+/).filter(Boolean);
  return keys.reduce((current, key) => {
    if (current === null || current === undefined) return undefined;
    return current[key];
  }, obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split(/[\.\[\]]+/).filter(Boolean);
  const lastKey = keys.pop();

  // Navigate to parent object, creating objects/arrays as needed
  const parent = keys.reduce((current, key, index) => {
    if (current[key] === undefined || current[key] === null) {
      // Check if next key is numeric to decide array vs object
      const nextKey = keys[index + 1] || lastKey;
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    return current[key];
  }, obj);

  parent[lastKey] = value;
}

/**
 * Main editor class
 */
class ResearchDataEditor {
  constructor() {
    this.originalData = null;
    this.modifiedData = null;
    this.editHistory = [];
    this.modal = null;
    this.isDirty = false;
  }

  /**
   * Open the editor modal with current research data
   */
  open() {
    // Load data from localStorage
    const savedData = localStorage.getItem('last-research-data');
    if (!savedData) {
      alert('⚠️ No research data found.\n\nPlease generate a research report first by:\n1. Going to /research\n2. Filling out the form (or click "🧪 Fill Test Data")\n3. Generating the report\n\nThen try opening the editor again.');
      return;
    }

    try {
      this.originalData = JSON.parse(savedData);

      // Validate data structure
      if (!this.originalData.stage1_market_analysis || !this.originalData.stage2_buyer_psychology) {
        console.error('Research Editor: Data structure validation failed - missing required stages');
        alert(
          '⚠️ Research data format is incompatible or incomplete.\n\n' +
          'This can happen if:\n' +
          '• You have old data from a previous version\n' +
          '• The report generation was interrupted\n\n' +
          'Please regenerate your research report and try again.'
        );
        return;
      }

      // Check if we have existing modifications
      const savedModified = localStorage.getItem('last-research-data-modified');
      const savedHistory = localStorage.getItem('last-research-data-edit-history');

      if (savedModified) {
        this.modifiedData = JSON.parse(savedModified);
      } else {
        // Deep clone original data
        this.modifiedData = JSON.parse(JSON.stringify(this.originalData));
      }

      if (savedHistory) {
        this.editHistory = JSON.parse(savedHistory);
      }

    } catch (error) {
      console.error('Research Editor: Error loading data:', error.message);
      alert(
        '⚠️ Error loading research data.\n\n' +
        'Error: ' + error.message + '\n\n' +
        'Please check the browser console for details, then regenerate your report.'
      );
      return;
    }

    this.createModal();
    this.renderFields();
    this.attachEventListeners();
    this.modal.classList.remove('hidden');
  }

  /**
   * Create modal structure
   */
  createModal() {
    // Remove existing modal if present
    const existing = document.getElementById('research-editor-modal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'research-editor-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';

    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">📝 Edit Critical Research Fields</h2>
            <p class="text-sm text-gray-600 mt-1">
              ⚠️ FOCUS: These 15 fields directly impact your offer quality
            </p>
          </div>
          <button id="close-editor" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ✕
          </button>
        </div>

        <!-- Content (scrollable) -->
        <div id="editor-content" class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Fields will be rendered here -->
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div class="flex items-center gap-4">
            <button id="reset-all-btn" class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-100">
              Reset All to AI Original
            </button>
            <span id="save-status" class="text-sm text-gray-500"></span>
          </div>
          <div class="flex items-center gap-3">
            <button id="cancel-btn" class="px-6 py-2 text-gray-700 hover:text-gray-900">
              Cancel
            </button>
            <button id="save-btn" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
              Save & Update Offer Context
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
  }

  /**
   * Render all field groups
   */
  renderFields() {
    const container = document.getElementById('editor-content');
    container.innerHTML = '';

    Object.entries(CRITICAL_FIELDS).forEach(([groupKey, group]) => {
      const section = this.createFieldGroup(groupKey, group);
      container.appendChild(section);
    });
  }

  /**
   * Create a field group (accordion section)
   */
  createFieldGroup(groupKey, group) {
    const section = document.createElement('div');
    section.className = 'mb-6';

    const isOpen = groupKey === 'buyer_psychology'; // Open buyer psychology by default

    section.innerHTML = `
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <!-- Accordion Header -->
        <button class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-between group"
                data-accordion-toggle="${groupKey}">
          <div class="text-left">
            <h3 class="text-lg font-semibold text-gray-900">${group.label}</h3>
            <p class="text-xs text-gray-600 mt-1">${group.subtitle}</p>
          </div>
          <svg class="w-5 h-5 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}"
               data-accordion-icon="${groupKey}"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <!-- Accordion Content -->
        <div class="accordion-content ${isOpen ? '' : 'hidden'}" data-accordion-content="${groupKey}">
          <div class="px-4 py-4 space-y-4 bg-white">
            ${group.fields.map(field => this.createFieldHtml(field)).join('')}
          </div>
        </div>
      </div>
    `;

    return section;
  }

  /**
   * Create HTML for a single field
   */
  createFieldHtml(field) {
    const currentValue = getNestedValue(this.modifiedData, field.path) || '';
    const originalValue = getNestedValue(this.originalData, field.path) || '';
    const isModified = currentValue !== originalValue;

    const charCount = currentValue.length;
    const charLimit = field.maxLength || 500;
    const isNearLimit = charCount / charLimit > 0.8;

    return `
      <div class="field-container" data-field-path="${field.path}">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ${field.label}
          ${isModified ? '<span class="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Modified</span>' : ''}
        </label>

        ${field.type === 'textarea' ? `
          <textarea
            name="${field.path}"
            rows="${field.rows || 3}"
            maxlength="${field.maxLength || 500}"
            placeholder="${field.placeholder || ''}"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y ${
              isModified ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
            }"
          >${currentValue}</textarea>
        ` : `
          <input
            type="text"
            name="${field.path}"
            maxlength="${field.maxLength || 200}"
            placeholder="${field.placeholder || ''}"
            value="${currentValue}"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isModified ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
            }"
          />
        `}

        <div class="mt-1 flex items-center justify-between text-xs">
          <span class="text-gray-600">${field.help}</span>
          <div class="flex items-center gap-3">
            <span class="char-count ${isNearLimit ? 'text-orange-600 font-semibold' : 'text-gray-500'}">
              ${charCount}/${charLimit}
            </span>
            ${isModified ? `
              <button type="button" class="reset-field-btn text-blue-600 hover:text-blue-800"
                      data-field-path="${field.path}">
                Reset to AI
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close button
    this.modal.querySelector('#close-editor').addEventListener('click', () => {
      if (this.isDirty) {
        if (confirm('You have unsaved changes. Discard them?')) {
          this.close();
        }
      } else {
        this.close();
      }
    });

    // Cancel button
    this.modal.querySelector('#cancel-btn').addEventListener('click', () => {
      if (this.isDirty) {
        if (confirm('Discard unsaved changes?')) {
          this.close();
        }
      } else {
        this.close();
      }
    });

    // Save button
    this.modal.querySelector('#save-btn').addEventListener('click', () => {
      this.save();
    });

    // Reset all button
    this.modal.querySelector('#reset-all-btn').addEventListener('click', () => {
      if (confirm('Reset ALL fields to AI original values? This cannot be undone.')) {
        this.resetAll();
      }
    });

    // Accordion toggles
    this.modal.querySelectorAll('[data-accordion-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupKey = btn.getAttribute('data-accordion-toggle');
        const content = this.modal.querySelector(`[data-accordion-content="${groupKey}"]`);
        const icon = this.modal.querySelector(`[data-accordion-icon="${groupKey}"]`);

        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
      });
    });

    // Field inputs - debounced auto-save
    let saveTimeout;
    this.modal.querySelectorAll('input[name], textarea[name]').forEach(input => {
      input.addEventListener('input', (e) => {
        const path = e.target.name;
        const value = e.target.value;

        // Update modified data
        setNestedValue(this.modifiedData, path, value);
        this.isDirty = true;

        // Update character count
        const container = e.target.closest('.field-container');
        const charCountEl = container.querySelector('.char-count');
        const maxLength = parseInt(e.target.getAttribute('maxlength') || '500');
        charCountEl.textContent = `${value.length}/${maxLength}`;

        if (value.length / maxLength > 0.8) {
          charCountEl.classList.add('text-orange-600', 'font-semibold');
          charCountEl.classList.remove('text-gray-500');
        } else {
          charCountEl.classList.remove('text-orange-600', 'font-semibold');
          charCountEl.classList.add('text-gray-500');
        }

        // Show modified indicator
        const originalValue = getNestedValue(this.originalData, path) || '';
        if (value !== originalValue) {
          e.target.classList.add('border-yellow-400', 'bg-yellow-50');
          e.target.classList.remove('border-gray-300');

          // Add "Modified" badge if not present
          const label = container.querySelector('label');
          if (!label.querySelector('.bg-yellow-200')) {
            const badge = document.createElement('span');
            badge.className = 'ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded';
            badge.textContent = 'Modified';
            label.appendChild(badge);
          }

          // Add reset button if not present
          const resetContainer = container.querySelector('.mt-1 > div:last-child');
          if (!resetContainer.querySelector('.reset-field-btn')) {
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.className = 'reset-field-btn text-blue-600 hover:text-blue-800 ml-3';
            resetBtn.setAttribute('data-field-path', path);
            resetBtn.textContent = 'Reset to AI';
            resetBtn.addEventListener('click', () => this.resetField(path));
            resetContainer.appendChild(resetBtn);
          }
        } else {
          e.target.classList.remove('border-yellow-400', 'bg-yellow-50');
          e.target.classList.add('border-gray-300');

          // Remove modified badge
          const badge = container.querySelector('.bg-yellow-200');
          if (badge) badge.remove();

          // Remove reset button
          const resetBtn = container.querySelector('.reset-field-btn');
          if (resetBtn) resetBtn.remove();
        }

        // Debounced auto-save to draft
        clearTimeout(saveTimeout);
        this.showSaveStatus('Typing...');
        saveTimeout = setTimeout(() => {
          this.saveToDraft();
        }, 500);
      });
    });

    // Reset field buttons (for initially modified fields)
    this.modal.querySelectorAll('.reset-field-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-field-path');
        this.resetField(path);
      });
    });

    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        if (this.isDirty) {
          if (confirm('You have unsaved changes. Discard them?')) {
            this.close();
          }
        } else {
          this.close();
        }
      }
    });
  }

  /**
   * Save draft to localStorage (auto-save)
   */
  saveToDraft() {
    localStorage.setItem('last-research-data-modified', JSON.stringify(this.modifiedData));
    this.showSaveStatus('✓ Auto-saved');
  }

  /**
   * Save changes permanently
   */
  save() {
    // Save modified data
    localStorage.setItem('last-research-data-modified', JSON.stringify(this.modifiedData));

    // Keep original for comparison
    localStorage.setItem('last-research-data-original', JSON.stringify(this.originalData));

    // Save edit history
    localStorage.setItem('last-research-data-edit-history', JSON.stringify(this.editHistory));

    // Update last-research-data to point to modified version
    localStorage.setItem('last-research-data', JSON.stringify(this.modifiedData));

    this.showSaveStatus('✅ Saved successfully!', 3000);
    this.isDirty = false;

    // Show success message and close
    setTimeout(() => {
      alert('✅ Research data saved! Your offer generation will now use these updated values.');
      this.close();
    }, 500);
  }

  /**
   * Reset a single field to AI original
   */
  resetField(path) {
    const originalValue = getNestedValue(this.originalData, path) || '';
    setNestedValue(this.modifiedData, path, originalValue);

    // Re-render fields to update UI
    this.renderFields();
    this.attachEventListeners();

    // Save draft
    this.saveToDraft();
  }

  /**
   * Reset all fields to AI original
   */
  resetAll() {
    // Deep clone original data
    this.modifiedData = JSON.parse(JSON.stringify(this.originalData));

    // Clear edit history
    this.editHistory = [];

    // Re-render
    this.renderFields();
    this.attachEventListeners();

    // Save
    this.saveToDraft();

    this.showSaveStatus('All fields reset');
  }

  /**
   * Show save status message
   */
  showSaveStatus(message, duration = 2000) {
    const statusEl = this.modal.querySelector('#save-status');
    statusEl.textContent = message;

    if (duration) {
      setTimeout(() => {
        statusEl.textContent = '';
      }, duration);
    }
  }

  /**
   * Close the modal
   */
  close() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    this.isDirty = false;
  }
}

// Global instance
window.researchDataEditor = new ResearchDataEditor();

// Global function to open editor (called from research.js)
window.openResearchDataEditor = function() {
  window.researchDataEditor.open();
};
