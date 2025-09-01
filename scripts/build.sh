#!/bin/bash

# Build script with enhanced error handling for Privy warnings
echo "🚀 Starting build process..."

# Set environment variables
export NODE_ENV=production
export CI=false

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run TypeScript compilation
echo "🔧 Compiling TypeScript..."
npx tsc --noEmit

# Run linting
echo "🔍 Running linter..."
npm run lint || echo "⚠️  Lint warnings detected, but build will continue."

# Build with Vite (warnings will be suppressed by our config)
echo "🏗️  Building with Vite..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully!"
  
  # Copy index.html to 404.html for GitHub Pages fallback
  if [ -f "dist/index.html" ]; then
    cp dist/index.html dist/404.html
    echo "📄 Created 404.html for GitHub Pages"
  fi
  
  echo "📁 Build output available in dist/ directory"
else
  echo "❌ Build failed!"
  exit 1
fi
