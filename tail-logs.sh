#!/bin/bash
# Tail Cloudflare Pages deployment logs
# Usage: ./tail-logs.sh

echo "🪵 Tailing Cloudflare Pages deployment logs..."
echo "Press Ctrl+C to stop"
echo ""

npx wrangler pages deployment tail --format pretty
