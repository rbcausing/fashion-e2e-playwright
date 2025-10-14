#!/bin/bash

# Jenkins Cleanup Script
# This script cleans up test artifacts and temporary files after build completion

set -e  # Exit on any error

echo "🧹 Starting cleanup process..."

# Function to safely remove directory
cleanup_directory() {
    local dir="$1"
    if [ -d "$dir" ]; then
        echo "🗑️  Removing directory: $dir"
        rm -rf "$dir"
        echo "✅ Removed: $dir"
    else
        echo "ℹ️  Directory not found: $dir (skipping)"
    fi
}

# Function to safely remove file
cleanup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "🗑️  Removing file: $file"
        rm -f "$file"
        echo "✅ Removed: $file"
    else
        echo "ℹ️  File not found: $file (skipping)"
    fi
}

# Clean up test results (keep only if build failed for debugging)
if [ "${BUILD_STATUS:-success}" = "success" ]; then
    echo "✅ Build successful - cleaning up test artifacts"
    cleanup_directory "test-results"
    cleanup_directory "playwright-report"
else
    echo "❌ Build failed - preserving test artifacts for debugging"
fi

# Clean up temporary files
echo "🧹 Cleaning up temporary files..."

# Node.js cache
cleanup_directory "node_modules/.cache"

# npm cache (if exists)
if [ -d "$HOME/.npm" ]; then
    echo "🗑️  Cleaning npm cache..."
    npm cache clean --force 2>/dev/null || true
fi

# Playwright cache
cleanup_directory "~/.cache/ms-playwright"

# Temporary files
cleanup_file "*.tmp"
cleanup_file "*.log"
cleanup_file ".DS_Store"

# Clean up any remaining Playwright processes
echo "🔍 Checking for running Playwright processes..."
PLAYWRIGHT_PIDS=$(pgrep -f "playwright" 2>/dev/null || true)
if [ ! -z "$PLAYWRIGHT_PIDS" ]; then
    echo "🛑 Found running Playwright processes, terminating..."
    echo "$PLAYWRIGHT_PIDS" | xargs kill -9 2>/dev/null || true
    echo "✅ Terminated Playwright processes"
else
    echo "ℹ️  No running Playwright processes found"
fi

# Clean up browser processes (Chrome, Firefox, Safari)
echo "🔍 Checking for browser processes..."
BROWSER_PIDS=$(pgrep -f "chrome\|firefox\|safari" 2>/dev/null || true)
if [ ! -z "$BROWSER_PIDS" ]; then
    echo "🛑 Found running browser processes, terminating..."
    echo "$BROWSER_PIDS" | xargs kill -9 2>/dev/null || true
    echo "✅ Terminated browser processes"
else
    echo "ℹ️  No running browser processes found"
fi

# Clean up workspace if specified
if [ "${CLEANUP_WORKSPACE:-false}" = "true" ]; then
    echo "🧹 Cleaning up workspace..."
    cleanup_directory "node_modules"
    cleanup_file "package-lock.json"
    echo "⚠️  Workspace cleaned - dependencies will need to be reinstalled"
fi

# Display disk usage after cleanup
echo "📊 Disk usage after cleanup:"
df -h . 2>/dev/null || du -sh . 2>/dev/null || echo "Unable to display disk usage"

# Final cleanup summary
echo "🎉 Cleanup completed successfully!"
echo "📋 Cleanup summary:"
echo "   ✅ Removed test artifacts (if build successful)"
echo "   ✅ Cleaned temporary files"
echo "   ✅ Terminated browser processes"
echo "   ✅ Cleared caches"
echo "   📊 Workspace ready for next build"
