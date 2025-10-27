export const ResearchFormPage = () => (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 relative">
          <button
            type="button"
            onclick="fillTestData()"
            className="absolute top-4 right-4 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
            title="Auto-fill form with test data for quick testing"
          >
            🧪 Fill Test Data
          </button>
          <h1 className="text-3xl font-bold text-white">Market Intelligence Generator</h1>
          <p className="mt-2 text-blue-100">
            Get a comprehensive Market Intelligence Report with complete data in 15-20 minutes
          </p>
          <p className="mt-2 text-xs text-blue-200">
            ✨ 6-stage AI analysis for complete, professional reports with no placeholders
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div id="progress-bar" className="bg-blue-600 h-2 transition-all duration-300" style="width: 33.33%"></div>
        </div>

        {/* Form Container */}
        <form id="research-form" className="p-8">
          {/* Step 1: Business Foundation */}
          <div className="wizard-step" id="step-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Business Foundation</h2>
            <p className="text-gray-600 mb-6">Tell us about your business and what you currently offer</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="business_name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Conscious Parenting Coaching"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Offer Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="current_offer_description"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do you sell? How is it delivered? What transformation does it provide? Be detailed - this helps generate better insights."
                />
                <p className="mt-1 text-sm text-gray-500">Aim for at least 100 words for best results</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Niche/Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="niche"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Prenatal & parenting coaching with trauma-informed approach"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Specialization Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="specialization_keywords"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., trauma-informed, holistic, generational healing, somatic"
                />
                <p className="mt-1 text-sm text-gray-500">What makes your approach unique?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Business Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="business_stage"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select stage...</option>
                    <option value="startup">Startup (0-2 years, validating market fit)</option>
                    <option value="growth">Growth (2-5 years, scaling operations)</option>
                    <option value="scaling">Scaling (5+ years, optimizing systems)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Annual Revenue Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="revenue_range"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select range...</option>
                    <option value="<10k">Less than $10K</option>
                    <option value="10k-50k">$10K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k-500k">$100K - $500K</option>
                    <option value="500k+">$500K+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Primary Market Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferred_market_category"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  <option value="health">Health (physical/mental wellness)</option>
                  <option value="wealth">Wealth (financial success)</option>
                  <option value="relationships">Relationships (connection/family)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onclick="nextStep(2)"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Target Market →
              </button>
            </div>
          </div>

          {/* Step 2: Target Market Context */}
          <div className="wizard-step hidden" id="step-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Target Market Context</h2>
            <p className="text-gray-600 mb-6">Who are you trying to reach?</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Market Hypothesis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="target_market_hypothesis"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., High-income women 30-45 trying to conceive or pregnant"
                />
                <p className="mt-1 text-sm text-gray-500">Your initial guess about who your ideal customer is</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Demographics <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="target_demographics"
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age range, gender, income, education, location, family status... Be specific!"
                />
                <p className="mt-1 text-sm text-gray-500">Include: age, gender, income, education, location, family status</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Target Psychographics <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="target_psychographics"
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What do they value? What beliefs drive their decisions? What's their lifestyle like?"
                />
                <p className="mt-1 text-sm text-gray-500">Values, beliefs, lifestyle patterns, priorities</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Customers (Optional)
                </label>
                <textarea
                  name="current_customers_description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="If you already have customers, describe them. What patterns do you see?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Their Biggest Pain Point <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="biggest_customer_pain_point"
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What keeps them up at night? What are they most frustrated about? Use their words if possible."
                />
                <p className="mt-1 text-sm text-gray-500">Be specific - this is critical for quality insights</p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onclick="prevStep(1)"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onclick="nextStep(3)"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Offer Details →
              </button>
            </div>
          </div>

          {/* Step 3: Offer Context */}
          <div className="wizard-step hidden" id="step-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Offer Context</h2>
            <p className="text-gray-600 mb-6">Tell us about your service/product details</p>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_type"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="coaching">Coaching (transformation-focused)</option>
                    <option value="consulting">Consulting (strategy/advice)</option>
                    <option value="product">Product (software/physical)</option>
                    <option value="hybrid">Hybrid (multiple formats)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Delivery Format <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="delivery_format"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select format...</option>
                    <option value="1:1">1:1 (individual sessions)</option>
                    <option value="group">Group (cohort/community)</option>
                    <option value="self-study">Self-Study (course/program)</option>
                    <option value="hybrid">Hybrid (combination)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Current Price Point <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price_point_current"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $5,000 for 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Desired Price Point (Optional)
                  </label>
                  <input
                    type="text"
                    name="desired_price_point"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $15,000 for 6 months"
                  />
                  <p className="mt-1 text-sm text-gray-500">If upgrading your offer</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Offer Duration/Timeline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="offer_duration"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 6 months, 12 weeks, lifetime access"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Unique Mechanism <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="unique_mechanism"
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's your secret sauce? Your proprietary method or framework? What makes your approach different?"
                />
                <p className="mt-1 text-sm text-gray-500">This is critical - be specific about your unique approach</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Competitors' Offers (Optional)
                </label>
                <textarea
                  name="competitors_offers"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What alternatives do your customers consider? Include names and price points if known."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onclick="prevStep(2)"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors shadow-lg"
              >
                Generate Research Report
              </button>
            </div>
          </div>
        </form>

        {/* Loading State */}
        <div id="loading-state" className="hidden p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Research Report...</h3>
          <p className="text-gray-600">This will take 15-20 minutes for a comprehensive ~6,000 word report with complete data. Please don't close this window.</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Stage-based generation ensures complete, detailed analysis...</p>
            <p className="mt-2 text-xs italic">6 sequential AI calls for maximum quality</p>
          </div>
        </div>

        {/* Results Container */}
        <div id="research-output" className="hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Your Market Intelligence Report</h2>
            <p className="mt-2 text-green-100">Professional market analysis and strategic recommendations complete!</p>
          </div>

          <div className="p-8">
            <div id="report-content" className="prose prose-lg max-w-none"></div>

            {/* Next Step Banner */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚀</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">
                    ✅ Research Complete! Ready for Next Step?
                  </h3>
                  <p className="text-purple-800 mb-4">
                    Now that you have deep market intelligence, use it to design a conversion-optimized
                    strategic offer with pricing, bonuses, guarantees, order bumps, and upsells.
                  </p>
                  <button
                    id="design-offer-btn"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    → Design Your Strategic Offer (8-12 min)
                  </button>
                  <p className="text-xs text-purple-600 mt-3">
                    💡 Your research data is automatically saved and will be used to create your offer
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="mt-6 flex gap-4">
              <button
                id="copy-btn"
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                📋 Copy Report
              </button>
              <button
                id="edit-data-btn"
                className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                title="Edit the 15 critical fields that directly impact offer quality"
              >
                📝 Edit Research Data
              </button>
              <button
                id="new-report-btn"
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                ✨ New Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tips for Best Results:</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• <strong>Be detailed:</strong> The more context you provide, the better your report will be</li>
          <li>• <strong>Use specific language:</strong> Include exact phrases your customers use</li>
          <li>• <strong>Be honest about stage:</strong> This helps tailor recommendations to your situation</li>
          <li>• <strong>Include competitors:</strong> Helps identify gaps and differentiation opportunities</li>
          <li>• <strong>Save your report:</strong> Copy to a doc when done - it's valuable reference material</li>
        </ul>
      </div>
    </div>

    <script src="/static/research.js"></script>
    <script src="/static/research-editor.js"></script>
  </div>
);
