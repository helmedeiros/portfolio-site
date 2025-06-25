#!/bin/bash

# Pre-push hook to run tests and build before pushing
# This catches build errors locally before they reach CI

echo "🔍 Running pre-push checks..."

# Run tests first
echo "🧪 Running tests..."
npm run test:run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix them before pushing."
    exit 1
fi

# Run build to catch any build errors
echo "🏗️  Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors before pushing."
    exit 1
fi

echo "✅ All checks passed! Safe to push."
exit 0
