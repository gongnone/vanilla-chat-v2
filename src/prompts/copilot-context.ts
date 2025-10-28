/**
 * Context Management Utilities for Form Co-Pilot
 *
 * Handles conversation history, form context, and prompt assembly with token budget management.
 * Token Budget: ~3K input tokens total (system: 450, field: 150, form: 800, history: 600, enhancement: 250, user: 200, buffer: 550)
 */

import { COPILOT_SYSTEM_PROMPT } from './copilot-system';
import { getFieldEnhancement } from './copilot-fields';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  fieldContext?: string;
}

export interface FieldMetadata {
  name: string;
  label: string;
  placeholder: string;
  helperText: string;
  type: 'input' | 'textarea' | 'select';
  required: boolean;
  currentValue: string;
  step: number;
}

export interface CoPilotState {
  formData: Record<string, string>;
  currentField: FieldMetadata | null;
  conversation: Message[];
  sessionId: string;
}

/**
 * Format field name from snake_case to readable format
 */
export function formatFieldName(fieldName: string): string {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate long text to save tokens
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format conversation history for prompt
 */
export function formatConversationHistory(messages: Message[], limit: number): string {
  if (!messages || messages.length === 0) return '(No previous conversation)';

  return messages
    .slice(-limit)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
}

/**
 * Prune conversation history to keep only most relevant messages
 * Keeps first greeting + last 4 messages to manage token budget
 */
export function pruneConversationHistory(messages: Message[]): Message[] {
  if (!messages || messages.length <= 5) return messages;

  const firstGreeting = messages[0];
  const recentMessages = messages.slice(-4);

  // If first message isn't in recent, prepend it for context
  if (recentMessages[0]?.timestamp !== firstGreeting?.timestamp) {
    return [firstGreeting, ...recentMessages];
  }

  return recentMessages;
}

/**
 * Build form context summary with priority field selection
 * Only includes most relevant fields to save tokens
 */
export function buildFormContextSummary(formData: Record<string, string>): string {
  // Priority order: Most important fields for context
  const PRIORITY_FIELDS = [
    'business_name',
    'niche',
    'current_offer_description',
    'target_market_hypothesis',
    'service_type',
  ];

  const otherFilledFields = Object.keys(formData).filter(
    key => !PRIORITY_FIELDS.includes(key) && formData[key]
  );

  // Include all priority fields + up to 3 other filled fields
  const fieldsToInclude = [
    ...PRIORITY_FIELDS.filter(key => formData[key]),
    ...otherFilledFields.slice(0, 3)
  ];

  if (fieldsToInclude.length === 0) {
    return '(No fields filled yet)';
  }

  return fieldsToInclude
    .map(key => `- ${formatFieldName(key)}: "${truncate(formData[key], 150)}"`)
    .join('\n');
}

/**
 * Build context prompt with current field and form state
 */
export function buildContextPrompt(state: CoPilotState): string {
  const { formData, currentField, conversation } = state;

  if (!currentField) {
    return '## Context\nNo specific field selected.';
  }

  const filledFields = buildFormContextSummary(formData);
  const recentConversation = formatConversationHistory(conversation, 4);

  return `
## User's Business Context (from form so far):
${filledFields}

## Current Field User Needs Help With:
- Field Name: "${currentField.label}"
- Field Type: ${currentField.type}
- Helper Text: "${currentField.helperText}"
- Placeholder Example: "${currentField.placeholder}"
- Current Value: "${currentField.currentValue || '(empty)'}"
- Required: ${currentField.required ? 'Yes' : 'No'}

## Recent Conversation:
${recentConversation}

## User's Question:
`;
}

/**
 * Build complete prompt for AI with system prompt, context, and field enhancement
 */
export function buildCompleteCoPilotPrompt(
  userMessage: string,
  state: CoPilotState
): string {
  const systemPrompt = COPILOT_SYSTEM_PROMPT;
  const contextPrompt = buildContextPrompt(state);

  // Add field-specific enhancement if applicable
  let fieldEnhancement = '';
  if (state.currentField) {
    fieldEnhancement = getFieldEnhancement(state.currentField.name);
  }

  // Assemble complete prompt
  const parts = [systemPrompt, contextPrompt];

  if (fieldEnhancement) {
    parts.push(fieldEnhancement);
  }

  parts.push(userMessage);

  return parts.join('\n\n');
}

/**
 * Calculate estimated token count (rough estimation: 1 token ≈ 3.5 characters)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}
