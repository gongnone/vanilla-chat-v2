export const ContentStrategyPage = () => (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6 relative">
          <button
            type="button"
            onclick="fillTestData()"
            className="absolute top-4 right-4 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors"
            title="Auto-fill with test data for quick testing"
          >
            🧪 Fill Test Data
          </button>
          <h1 className="text-3xl font-bold text-white">Content Strategy Generator</h1>
          <p className="mt-2 text-indigo-100">
            Create 3-5 strategic content pillars in 3-4 minutes
          </p>
          <p className="mt-2 text-xs text-indigo-200">
            ✨ AI-powered using your research insights and offer positioning
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
              <p className="text-sm text-yellow-700" id="prerequisites-text">
                <strong>Prerequisites:</strong> Complete <a href="/offer-design" className="underline font-semibold">Offer Design</a> first for best results
              </p>
            </div>
          </div>
        </div>

        {/* Info Panel - What Are Content Pillars? */}
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-b-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">📚</span>
            What Are Content Pillars?
          </h2>
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              Content pillars are the <strong>3-5 core themes</strong> that all your content revolves around. They provide structure, establish authority, and align your content with business goals.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-indigo-900 mb-2">✅ Benefits</h3>
                <ul className="text-sm space-y-1">
                  <li>• Establish topical authority</li>
                  <li>• Provide consistent structure</li>
                  <li>• Align with buyer psychology</li>
                  <li>• Differentiate from competitors</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-indigo-900 mb-2">📊 What You'll Get</h3>
                <ul className="text-sm space-y-1">
                  <li>• 3-5 strategic content themes</li>
                  <li>• 10-15 topic ideas per pillar</li>
                  <li>• Content mix recommendations</li>
                  <li>• Posting frequency guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Section */}
        <div id="generate-section" className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Your Content Strategy</h2>
            <p className="text-gray-600 mb-6">
              Click below to analyze your research data and create strategic content pillars
            </p>
            <button
              onclick="generatePillars()"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
            >
              🎯 Generate Content Pillars
            </button>
            <p className="mt-3 text-sm text-gray-500">
              ⏱️ Estimated time: 3-4 minutes
            </p>
          </div>
        </div>

        {/* Loading State */}
        <div id="loading-state" className="hidden p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Analyzing your research data...</p>
            <p className="mt-2 text-gray-600">Generating strategic content pillars</p>
            <p className="mt-1 text-sm text-gray-500">⏱️ This takes 3-4 minutes</p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-900 font-medium mb-2">What's happening:</p>
                <ul className="text-xs text-indigo-700 space-y-1 text-left">
                  <li>• Extracting buyer psychology insights</li>
                  <li>• Analyzing market positioning data</li>
                  <li>• Mapping content themes to business goals</li>
                  <li>• Generating 40-75 specific topic ideas</li>
                  <li>• Calculating optimal content distribution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div id="results-section" className="hidden p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Content Pillar Strategy</h2>
            <button
              onclick="regeneratePillars()"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Regenerate
            </button>
          </div>

          {/* Pillars will be dynamically inserted here by JavaScript */}
          <div id="pillars-container" className="space-y-4 mb-8">
            {/* Dynamic content */}
          </div>

          {/* Content Mix Framework */}
          <div id="content-mix-section" className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Content Mix Framework</h3>
            <div id="content-mix-bars" className="space-y-3 mb-6">
              {/* Dynamic bars will be inserted here */}
            </div>
            <p className="text-sm text-gray-600 italic">
              This distribution balances value delivery with business goals for optimal results.
            </p>
          </div>

          {/* Strategic Rationale */}
          <div id="strategic-rationale-section" className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">🎯 Strategic Rationale</h3>
            <p id="strategic-rationale-text" className="text-gray-700 leading-relaxed">
              {/* Dynamic content */}
            </p>
          </div>

          {/* Competitive Differentiation */}
          <div id="competitive-diff-section" className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">⚡ Competitive Differentiation</h3>
            <p id="competitive-diff-text" className="text-gray-700 leading-relaxed">
              {/* Dynamic content */}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onclick="savePillarsToStorage()"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              💾 Save Strategy
            </button>
            <button
              onclick="exportPillarsToJSON()"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              📥 Export JSON
            </button>
          </div>
        </div>

        {/* Error State */}
        <div id="error-state" className="hidden p-8">
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Generation Failed</h3>
                <p id="error-message" className="text-red-700 mb-4">
                  {/* Dynamic error message */}
                </p>
                <button
                  onclick="retryGeneration()"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>💡 Tip:</strong> Use the "Edit" button on each pillar to refine topics and descriptions based on your unique insights.
            </p>
            <p>
              <strong>📚 Learn More:</strong> Content pillars follow the "Accordion Method" - start with high volume to learn what resonates, then compress effort into proven winners.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Client-side JavaScript */}
    <script src="/static/content-strategy.js"></script>
  </div>
);
