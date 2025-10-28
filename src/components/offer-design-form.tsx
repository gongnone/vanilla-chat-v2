export const OfferDesignPage = () => (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6 relative">
          <button
            type="button"
            onclick="fillOfferTestData()"
            className="absolute top-4 right-4 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
            title="Auto-fill form with test data for quick testing"
          >
            🧪 Fill Test Data
          </button>
          <h1 className="text-3xl font-bold text-white">Strategic Offer Design Generator</h1>
          <p className="mt-2 text-purple-100">
            Design an irresistible offer with complete pricing structure in 8-12 minutes
          </p>
          <p className="mt-2 text-xs text-purple-200">
            ✨ 7-stage AI design using your market research insights + order bumps & upsells
          </p>
        </div>

        {/* Prerequisites Check Notice */}
        <div id="prerequisites-notice" className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Prerequisites:</strong> Complete <a href="/research" className="underline font-semibold">Market Research</a> first for best results
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form id="offer-design-form" className="p-8">
          {/* Section: Strategic Priorities */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategic Priorities</h2>
            <p className="text-gray-600 mb-6">Select 3-5 priorities for your offer design (guides AI recommendations)</p>

            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="maximize_conversion_rate"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Maximize Conversion Rate</span>
                  <p className="text-sm text-gray-600">Optimize every element to convert more prospects into buyers</p>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="maximize_average_order_value"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Maximize Average Order Value</span>
                  <p className="text-sm text-gray-600">Increase revenue per customer with strategic upsells and order bumps</p>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="maximize_lifetime_value"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Maximize Lifetime Value</span>
                  <p className="text-sm text-gray-600">Design for repeat purchases and long-term customer relationships</p>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="build_trust_authority"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Build Trust & Authority</span>
                  <p className="text-sm text-gray-600">Position as premium expert with proof-heavy, credibility-focused offer</p>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="create_urgency_scarcity"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Create Urgency & Scarcity</span>
                  <p className="text-sm text-gray-600">Drive immediate action with genuine scarcity and deadline mechanisms</p>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="strategic_priorities"
                  value="differentiate_from_competitors"
                  className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-900">Differentiate from Competitors</span>
                  <p className="text-sm text-gray-600">Stand out with unique positioning and value propositions</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Primary Transformation */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Transformation</h2>
            <p className="text-gray-600 mb-6">What is THE main outcome buyers want to achieve?</p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Primary Transformation <span className="text-red-500">*</span>
              </label>
              <textarea
                name="primary_transformation"
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Achieve work-life balance and peak performance without sacrificing career growth or family time"
              />
              <p className="mt-1 text-sm text-gray-500">Be specific - this guides all offer elements (aim for 100+ characters)</p>
              <p className="mt-1 text-xs text-gray-400" id="transformation-count">0 characters</p>
            </div>
          </div>

          {/* Section: Proof Assets */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Proof Assets</h2>
            <p className="text-gray-600 mb-6">What proof elements can you reference in your offer?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="proof_testimonials" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-900">Client Testimonials</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="proof_case_studies" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-900">Case Studies / Success Stories</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="proof_before_after" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-900">Before/After Examples</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="proof_certifications" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-900">Certifications / Credentials</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" name="proof_media_mentions" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-900">Media Mentions / Press</span>
              </label>
            </div>
          </div>

          {/* Section: Pricing Strategy */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Strategy</h2>
            <p className="text-gray-600 mb-6">How do you want to position your pricing?</p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pricing Approach <span className="text-red-500">*</span>
              </label>
              <select
                name="pricing_strategy"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select strategy...</option>
                <option value="value-based">Value-Based (price based on transformation value)</option>
                <option value="premium-positioning">Premium Positioning (top 10-20% of market)</option>
                <option value="market-competitive">Market Competitive (match competitor pricing)</option>
              </select>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Minimum Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    name="price_range_min"
                    required
                    min="0"
                    step="1"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Lowest price you're comfortable charging</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Maximum Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    name="price_range_max"
                    required
                    min="0"
                    step="1"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Premium tier ceiling</p>
              </div>
            </div>
          </div>

          {/* Section: Unique Assets */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Unique Assets</h2>
            <p className="text-gray-600 mb-6">What proprietary IP, tools, and resources can you leverage?</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Proprietary Frameworks / Methods <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="proprietary_frameworks"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Time Mastery System™, 3-Phase Breakthrough Method"
                />
                <p className="mt-1 text-sm text-gray-500">Your signature system or methodology (use ™ or ® if applicable)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Unique Tools & Resources <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="unique_tools_resources"
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Custom assessment tool, implementation templates, weekly workbooks, video library"
                />
                <p className="mt-1 text-sm text-gray-500">What deliverables, tools, or resources make your offer unique?</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Exclusive Access / Community <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="exclusive_access"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Private Slack community, bi-weekly group coaching calls, lifetime updates"
                />
                <p className="mt-1 text-sm text-gray-500">What ongoing support or community access is included?</p>
              </div>
            </div>
          </div>

          {/* Section: Guarantee & Emphasis */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Reversal & Emphasis</h2>
            <p className="text-gray-600 mb-6">How aggressive should your guarantee be?</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guarantee Risk Tolerance <span className="text-red-500">*</span>
              </label>
              <select
                name="guarantee_risk_tolerance"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select risk level...</option>
                <option value="conservative">Conservative (e.g., 30-day money-back)</option>
                <option value="moderate">Moderate (e.g., 90-day outcome-based)</option>
                <option value="aggressive">Aggressive (e.g., results guarantee or keep working free)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emphasize These Components (select multiple)
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="premium_bonuses" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Premium Bonuses (value stack)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="payment_flexibility" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Payment Flexibility (multiple plan options)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="fast_action_rewards" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Fast Action Rewards (deadline bonuses)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="money_back_guarantee" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Money-Back Guarantee</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="results_guarantee" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Results Guarantee</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="emphasize_components" value="done_with_you_support" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-900">Done-With-You Support</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Voice Preferences (Optional) */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice & Tone (Optional)</h2>
            <p className="text-gray-600 mb-6">Customize copywriting voice and messaging</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Preferred Tone
                </label>
                <select
                  name="voice_tone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Use research insights (default)</option>
                  <option value="professional">Professional (formal, business-focused)</option>
                  <option value="conversational">Conversational (friendly, approachable)</option>
                  <option value="inspiring">Inspiring (motivational, aspirational)</option>
                  <option value="direct">Direct (no-nonsense, results-focused)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Words/Phrases to Avoid
                </label>
                <input
                  type="text"
                  name="avoid_words"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., hack, guru, crushing it, unicorn"
                />
                <p className="mt-1 text-sm text-gray-500">Comma-separated list of words to exclude from copy</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Concepts to Emphasize
                </label>
                <input
                  type="text"
                  name="must_include_concepts"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., sustainable growth, evidence-based, proven framework"
                />
                <p className="mt-1 text-sm text-gray-500">Key themes to emphasize in all messaging</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg"
            >
              Generate Strategic Offer Design
            </button>
            <p className="mt-3 text-center text-sm text-gray-500">
              ⏱️ Estimated time: 8-12 minutes | 7 AI-powered design stages
            </p>
          </div>
        </form>

        {/* Loading State */}
        <div id="offer-loading-state" className="hidden p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Designing Your Strategic Offer...</h3>
          <p className="text-gray-600">This will take 8-12 minutes. Please don't close this window.</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Analyzing research insights and applying your strategic priorities...</p>
          </div>
        </div>

        {/* Results Container */}
        <div id="offer-output" className="hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Your Strategic Offer Design</h2>
            <p className="mt-2 text-purple-100">Complete offer with pricing, bonuses, guarantees, and upsells!</p>
          </div>

          <div className="p-8">
            <div id="offer-content" className="prose prose-lg max-w-none"></div>

            <div className="mt-8 flex gap-4">
              <button
                id="copy-offer-btn"
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                📋 Copy to Clipboard
              </button>
              <button
                id="new-offer-btn"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                ✨ Generate New Offer
              </button>
            </div>

            {/* Next Step: Content Strategy */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-bold text-blue-900">✅ Offer Design Complete!</h3>
                  <p className="mt-2 text-sm text-blue-800">
                    Next step: Generate your content strategy to build authority and drive traffic to this offer.
                  </p>
                  <a
                    href="/content-strategy"
                    className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    🎯 Generate Content Strategy →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">💡 How This Works:</h3>
        <ul className="text-sm text-purple-800 space-y-2">
          <li>• <strong>7 Sequential Stages:</strong> Rationale, value stack, pricing, payments, bonuses, guarantee, upsells</li>
          <li>• <strong>Research-Driven:</strong> Uses insights from your market research (Stages 1-6)</li>
          <li>• <strong>Complete Output:</strong> 3 order bumps ($27-$47) + 2 upsells ($97-$997)</li>
          <li>• <strong>Ready to Implement:</strong> No placeholder text - everything specific to your business</li>
          <li>• <strong>Save Your Design:</strong> Copy when done - it's valuable implementation material</li>
        </ul>
      </div>
    </div>

    <script src="/static/offer-design.js"></script>
  </div>
);
