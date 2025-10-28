/**
 * Form Co-Pilot Sidebar Component
 *
 * Interactive AI assistant sidebar for helping users fill out the market research form.
 * Provides context-aware help, jargon explanations, and content drafting.
 *
 * Responsive Design:
 * - Desktop (>1024px): 380px sidebar on right
 * - Tablet (768-1024px): 60% width overlay
 * - Mobile (<768px): Full-screen modal from bottom
 */

export const FormCoPilotSidebar = () => (
  <div id="copilot-sidebar" className="copilot-sidebar hidden">
    {/* Header */}
    <div className="copilot-header">
      <div className="flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h3 className="text-lg font-semibold text-white">Form Assistant</h3>
      </div>
      <button
        onclick="closeCoPilot()"
        className="copilot-close-btn"
        aria-label="Close assistant"
      >
        ×
      </button>
    </div>

    {/* Messages Container */}
    <div id="copilot-messages" className="copilot-messages">
      {/* Messages will be appended here by JavaScript */}
      <div className="copilot-welcome">
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-sm">
            Click 💬 Need help? on any field to get started
          </p>
        </div>
      </div>
    </div>

    {/* Typing Indicator */}
    <div id="copilot-typing" className="copilot-typing" style="display: none;">
      <div className="copilot-message copilot-message-assistant">
        <div className="copilot-message-bubble">
          <div className="copilot-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    {/* Input Area */}
    <div className="copilot-input-area">
      <form onsubmit="event.preventDefault(); handleSendMessage();" className="flex gap-2">
        <input
          type="text"
          id="copilot-input"
          placeholder="Ask me anything about this field..."
          className="copilot-input"
          autocomplete="off"
        />
        <button
          type="submit"
          className="copilot-send-btn"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
      <div className="copilot-input-hint">
        Tip: Try "What does this mean?" or "Can you write this for me?"
      </div>
    </div>
  </div>
);
