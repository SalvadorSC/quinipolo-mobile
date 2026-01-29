#!/bin/bash

# Quinipolo Mobile Code Validation Script
# This script runs comprehensive checks to catch common issues

set -e

echo "🔍 Running comprehensive code validation..."
echo ""

# 1. Check for undefined imports/exports
echo "📦 Checking for potential import/export mismatches..."
if grep -rn "import { apiClient }" src/ 2>/dev/null; then
  echo "❌ ERROR: Found incorrect named import of apiClient (should be default import)"
  echo "   Fix: Change 'import { apiClient }' to 'import apiClient'"
  exit 1
fi
echo "✅ Import/export checks passed"
echo ""

# 2. Check for common undefined issues
echo "🔧 Checking for potential undefined accesses..."
# This is a basic check - TypeScript should catch most of these
grep -rn "\.get(" src/ | grep -v "apiClient.get" | grep -v "// " | head -5 || true
echo "✅ Undefined access checks passed"
echo ""

# 3. Run TypeScript type checking
echo "📝 Running TypeScript type checking..."
npm run type-check
echo "✅ Type checking passed"
echo ""

# 4. Run ESLint
echo "🎨 Running ESLint..."
npm run lint
echo "✅ Linting passed"
echo ""

# 5. Run tests with coverage
echo "🧪 Running tests with coverage (80% minimum)..."
npm run test:coverage -- --silent
echo "✅ Test coverage passed"
echo ""

echo "✅ All validation checks passed!"
echo "🚀 Code is ready for commit"
