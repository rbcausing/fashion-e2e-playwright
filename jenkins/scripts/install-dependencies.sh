#!/bin/bash

# Jenkins Dependency Installation Script
# This script installs all required dependencies for the Demoblaze E2E Testing Framework

set -e  # Exit on any error

echo "🔧 Starting dependency installation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm ci --silent

if [ $? -eq 0 ]; then
    echo "✅ npm dependencies installed successfully"
else
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

if [ $? -eq 0 ]; then
    echo "✅ Playwright browsers installed successfully"
else
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

# Verify Playwright installation
echo "🔍 Verifying Playwright installation..."
npx playwright --version

if [ $? -eq 0 ]; then
    echo "✅ Playwright verification successful"
else
    echo "❌ Playwright verification failed"
    exit 1
fi

# Create test-results directory if it doesn't exist
mkdir -p test-results
echo "✅ Created test-results directory"

# Create playwright-report directory if it doesn't exist
mkdir -p playwright-report
echo "✅ Created playwright-report directory"

echo "🎉 All dependencies installed successfully!"
echo "📊 Ready to run tests"
