/**
 * Form Co-Pilot Client-Side State Management
 *
 * Manages conversation history, field context, and AI interactions for the
 * market research form assistance system.
 *
 * LocalStorage Keys:
 * - form-copilot-session-id: Unique session identifier
 * - form-copilot-conversation: Conversation history (pruned to last 6 messages)
 * - form-copilot-fields-assisted: Array of field names that received help
 */

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

const CoPilotState = {
  isOpen: false,
  isTyping: false,
  currentField: null,
  conversation: [],
  sessionId: null,
  fieldsAssistedWith: [],

  // Initialize state
  init() {
    this.sessionId = this.getOrCreateSessionId();
    this.conversation = this.loadConversation();
    this.fieldsAssistedWith = this.loadFieldsAssisted();
    console.log('🎯 Co-Pilot initialized', {
      sessionId: this.sessionId,
      conversationLength: this.conversation.length,
    });
  },

  // Get or create session ID
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('form-copilot-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('form-copilot-session-id', sessionId);
    }
    return sessionId;
  },

  // Load conversation from localStorage
  loadConversation() {
    try {
      const stored = localStorage.getItem('form-copilot-conversation');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load conversation:', e);
      return [];
    }
  },

  // Save conversation to localStorage (pruned to last 6 messages)
  saveConversation() {
    try {
      // Keep only last 6 messages to manage storage size
      const pruned = this.conversation.slice(-6);
      localStorage.setItem('form-copilot-conversation', JSON.stringify(pruned));
      this.conversation = pruned;
    } catch (e) {
      console.error('Failed to save conversation:', e);
    }
  },

  // Load fields assisted from localStorage
  loadFieldsAssisted() {
    try {
      const stored = localStorage.getItem('form-copilot-fields-assisted');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load fields assisted:', e);
      return [];
    }
  },

  // Save fields assisted to localStorage
  saveFieldsAssisted() {
    try {
      localStorage.setItem('form-copilot-fields-assisted', JSON.stringify(this.fieldsAssistedWith));
    } catch (e) {
      console.error('Failed to save fields assisted:', e);
    }
  },

  // Add message to conversation
  addMessage(role, content, fieldContext) {
    const message = {
      role,
      content,
      timestamp: Date.now(),
      fieldContext: fieldContext || this.currentField?.name,
    };
    this.conversation.push(message);
    this.saveConversation();
    return message;
  },

  // Track field assistance
  trackFieldAssistance(fieldName) {
    if (!this.fieldsAssistedWith.includes(fieldName)) {
      this.fieldsAssistedWith.push(fieldName);
      this.saveFieldsAssisted();
    }
  },

  // Clear session data (on form submission)
  clearSession() {
    localStorage.removeItem('form-copilot-session-id');
    localStorage.removeItem('form-copilot-conversation');
    localStorage.removeItem('form-copilot-fields-assisted');
    this.conversation = [];
    this.fieldsAssistedWith = [];
    this.sessionId = this.getOrCreateSessionId();
  },
};

// =============================================================================
// FIELD METADATA EXTRACTION
// =============================================================================

/**
 * Extract field metadata from form element
 */
function extractFieldMetadata(fieldName) {
  const form = document.getElementById('research-form');
  if (!form) return null;

  const field = form.elements[fieldName];
  if (!field) return null;

  // Find label
  const label = form.querySelector(`label[for="${fieldName}"], label:has(+ [name="${fieldName}"])`);
  const labelText = label ? label.textContent.replace('*', '').trim() : fieldName;

  // Get placeholder and helper text
  const placeholder = field.placeholder || '';
  const helperElement = field.parentElement?.querySelector('.text-gray-500, .text-sm.text-gray-500');
  const helperText = helperElement ? helperElement.textContent.trim() : '';

  // Determine field type
  let fieldType = 'input';
  if (field.tagName === 'TEXTAREA') fieldType = 'textarea';
  if (field.tagName === 'SELECT') fieldType = 'select';

  // Get current step (1, 2, or 3)
  const step = field.closest('[id^="step-"]')?.id?.match(/\d+/)?.[0] || '1';

  return {
    name: fieldName,
    label: labelText,
    placeholder,
    helperText,
    type: fieldType,
    required: field.required,
    currentValue: field.value || '',
    step: parseInt(step),
  };
}

/**
 * Get all current form data as object
 */
function getFormData() {
  const form = document.getElementById('research-form');
  if (!form) return {};

  const formData = {};
  const elements = form.elements;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.name && element.value) {
      formData[element.name] = element.value;
    }
  }

  return formData;
}

// =============================================================================
// API COMMUNICATION
// =============================================================================

/**
 * Send message to co-pilot API
 */
async function sendMessageToCoPilot(userMessage) {
  if (!CoPilotState.currentField) {
    console.error('No current field set');
    return null;
  }

  try {
    CoPilotState.isTyping = true;
    updateTypingIndicator(true);

    const payload = {
      userMessage,
      fieldContext: CoPilotState.currentField,
      formData: getFormData(),
      conversationHistory: CoPilotState.conversation.slice(-4), // Last 4 messages only
      sessionId: CoPilotState.sessionId,
    };

    console.log('📤 Sending to co-pilot API:', {
      field: CoPilotState.currentField.name,
      messageLength: userMessage.length,
    });

    const response = await fetch('/api/form-assist/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    console.log('📥 Co-Pilot response received:', {
      action: result.action,
      hasSuggestedContent: !!result.suggestedContent,
    });

    CoPilotState.isTyping = false;
    updateTypingIndicator(false);

    return result;

  } catch (error) {
    console.error('❌ Co-Pilot API error:', error);
    CoPilotState.isTyping = false;
    updateTypingIndicator(false);

    return {
      message: "I'm having trouble connecting. Please try again, or skip this field for now.",
      action: 'explain',
      error: error.message,
    };
  }
}

// =============================================================================
// UI MANAGEMENT
// =============================================================================

/**
 * Open co-pilot sidebar for specific field
 */
function openCoPilotForField(fieldName) {
  console.log('💬 Opening co-pilot for field:', fieldName);

  // Extract field metadata
  const fieldMetadata = extractFieldMetadata(fieldName);
  if (!fieldMetadata) {
    console.error('Could not extract field metadata for:', fieldName);
    return;
  }

  CoPilotState.currentField = fieldMetadata;
  CoPilotState.isOpen = true;
  CoPilotState.trackFieldAssistance(fieldName);

  // Show sidebar
  const sidebar = document.getElementById('copilot-sidebar');
  if (sidebar) {
    sidebar.classList.remove('hidden');
    sidebar.classList.add('copilot-slide-in');

    // If this is first message for this field, show greeting
    if (CoPilotState.conversation.length === 0 ||
        !CoPilotState.conversation.some(m => m.fieldContext === fieldName)) {
      showInitialGreeting();
    }
  }

  // Focus on input
  const input = document.getElementById('copilot-input');
  if (input) {
    setTimeout(() => input.focus(), 300);
  }

  // Track analytics
  trackCoPilotEvent('copilot_opened', { fieldName });
}

/**
 * Close co-pilot sidebar
 */
function closeCoPilot() {
  console.log('💬 Closing co-pilot');

  CoPilotState.isOpen = false;

  const sidebar = document.getElementById('copilot-sidebar');
  if (sidebar) {
    sidebar.classList.remove('copilot-slide-in');
    sidebar.classList.add('copilot-slide-out');

    // Hide after animation
    setTimeout(() => {
      sidebar.classList.add('hidden');
      sidebar.classList.remove('copilot-slide-out');
    }, 300);
  }

  trackCoPilotEvent('copilot_closed', {
    fieldName: CoPilotState.currentField?.name,
  });
}

/**
 * Show initial greeting message
 */
function showInitialGreeting() {
  const greeting = {
    role: 'assistant',
    content: `Hi! I'm here to help you with the "${CoPilotState.currentField.label}" field. Not sure what to write? Ask me to explain what it means, or I can draft something for you to edit. What would help?`,
    timestamp: Date.now(),
  };

  CoPilotState.addMessage(greeting.role, greeting.content);
  appendMessageToChat(greeting);
}

/**
 * Append message to chat UI
 */
function appendMessageToChat(message) {
  const messagesContainer = document.getElementById('copilot-messages');
  if (!messagesContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `copilot-message copilot-message-${message.role}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'copilot-message-bubble';
  bubbleDiv.textContent = message.content;

  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Show suggested content with action buttons
 */
function showSuggestedContent(suggestedContent) {
  const messagesContainer = document.getElementById('copilot-messages');
  if (!messagesContainer) return;

  const suggestionDiv = document.createElement('div');
  suggestionDiv.className = 'copilot-suggestion-box';

  suggestionDiv.innerHTML = `
    <div class="copilot-suggestion-content">${suggestedContent}</div>
    <div class="copilot-suggestion-actions">
      <button onclick="acceptSuggestion('${escapeHtml(suggestedContent)}')" class="copilot-btn-primary">
        ✓ Use This
      </button>
      <button onclick="editSuggestion('${escapeHtml(suggestedContent)}')" class="copilot-btn-secondary">
        ✏️ Edit First
      </button>
    </div>
  `;

  messagesContainer.appendChild(suggestionDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Accept suggested content and fill field
 */
function acceptSuggestion(content) {
  if (!CoPilotState.currentField) return;

  const field = document.querySelector(`[name="${CoPilotState.currentField.name}"]`);
  if (field) {
    field.value = content;
    field.dispatchEvent(new Event('input', { bubbles: true }));

    // Show success message
    const successMsg = {
      role: 'assistant',
      content: '✅ Great! I filled that in for you. Feel free to edit it if you want to make changes.',
      timestamp: Date.now(),
    };
    CoPilotState.addMessage(successMsg.role, successMsg.content);
    appendMessageToChat(successMsg);

    trackCoPilotEvent('suggestion_accepted', {
      fieldName: CoPilotState.currentField.name,
      suggestionLength: content.length,
    });
  }
}

/**
 * Edit suggested content before accepting
 */
function editSuggestion(content) {
  if (!CoPilotState.currentField) return;

  const field = document.querySelector(`[name="${CoPilotState.currentField.name}"]`);
  if (field) {
    field.value = content;
    field.focus();
    field.dispatchEvent(new Event('input', { bubbles: true }));

    const msg = {
      role: 'assistant',
      content: 'I put it in the field for you to edit. Change whatever you like!',
      timestamp: Date.now(),
    };
    CoPilotState.addMessage(msg.role, msg.content);
    appendMessageToChat(msg);

    trackCoPilotEvent('suggestion_edit_requested', {
      fieldName: CoPilotState.currentField.name,
    });
  }
}

/**
 * Handle send message button click
 */
async function handleSendMessage() {
  const input = document.getElementById('copilot-input');
  if (!input) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Clear input
  input.value = '';

  // Add user message to chat
  const userMsg = CoPilotState.addMessage('user', userMessage);
  appendMessageToChat(userMsg);

  trackCoPilotEvent('message_sent', {
    fieldName: CoPilotState.currentField?.name,
    messageLength: userMessage.length,
  });

  // Get AI response
  const response = await sendMessageToCoPilot(userMessage);

  if (response) {
    // Add assistant message
    const assistantMsg = CoPilotState.addMessage('assistant', response.message);
    appendMessageToChat(assistantMsg);

    // Show suggested content if provided
    if (response.suggestedContent) {
      showSuggestedContent(response.suggestedContent);
    }
  }
}

/**
 * Update typing indicator
 */
function updateTypingIndicator(isTyping) {
  const indicator = document.getElementById('copilot-typing');
  if (indicator) {
    indicator.style.display = isTyping ? 'block' : 'none';
  }
}

/**
 * Track analytics event
 */
function trackCoPilotEvent(eventName, data) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...data,
      sessionId: CoPilotState.sessionId,
      timestamp: Date.now(),
    });
  }
  console.log('[CoPilot Analytics]', eventName, data);
}

/**
 * Escape HTML for safe insertion
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/'/g, '&#39;');
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    CoPilotState.init();
  });
} else {
  CoPilotState.init();
}

// Clear session on form submission
const researchForm = document.getElementById('research-form');
if (researchForm) {
  researchForm.addEventListener('submit', () => {
    trackCoPilotEvent('form_completed', {
      fieldsAssistedWith: CoPilotState.fieldsAssistedWith,
    });
    CoPilotState.clearSession();
  });
}

// Export functions for global access
window.openCoPilotForField = openCoPilotForField;
window.closeCoPilot = closeCoPilot;
window.handleSendMessage = handleSendMessage;
window.acceptSuggestion = acceptSuggestion;
window.editSuggestion = editSuggestion;
