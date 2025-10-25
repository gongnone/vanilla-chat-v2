# Stage 6 Context Window Fix

## Problem
Stage 6 prompt exceeds 24K token context window by including:
1. Full JSON stringification of all 5 stages (~8K-12K tokens)
2. Massive 380-line template with detailed instructions (~4K-6K tokens)
3. Total: ~15K-20K input tokens, leaving only 4K-9K for output
4. When output generation starts, it exceeds the 24K limit and cuts off

## Solution
Replace JSON blobs with direct inline data extraction:

**Before:**
```
Stage 1: Market Analysis
\`\`\`json
${safeStringify(researchData.stage1_market_analysis)}
\`\`\`
```

**After:**
```
Market Size 2024: ${researchData.stage1_market_analysis.market_size_2024}
Market Size 2025: ${researchData.stage1_market_analysis.market_size_2025_projected}
Growth Rate: ${researchData.stage1_market_analysis.market_growth_rate}
...
```

## Benefits
- Reduces input tokens by 70-80% (from ~15K to ~3K-5K)
- Allows max_tokens of 18K-20K for comprehensive reports
- Eliminates context window errors
- Faster generation

## Implementation
Create condensed Stage 6 prompt that extracts only needed values inline.
