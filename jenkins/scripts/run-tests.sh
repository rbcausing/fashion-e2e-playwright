#!/bin/bash

# Jenkins Test Execution Script
# This script runs Playwright tests with Jenkins-friendly configuration

set -e  # Exit on any error

# Default values
BROWSER="chromium"
TEST_TYPE="smoke"
REPORTER="html,junit"
RETRIES=2
WORKERS=1

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --browser)
            BROWSER="$2"
            shift 2
            ;;
        --test-type)
            TEST_TYPE="$2"
            shift 2
            ;;
        --reporter)
            REPORTER="$2"
            shift 2
            ;;
        --retries)
            RETRIES="$2"
            shift 2
            ;;
        --workers)
            WORKERS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --browser BROWSER     Browser to use (chromium, firefox, webkit, mobile-chrome)"
            echo "  --test-type TYPE      Test type (smoke, full, regression)"
            echo "  --reporter REPORTER   Reporter format (html,junit,json)"
            echo "  --retries NUM         Number of retries for failed tests"
            echo "  --workers NUM         Number of parallel workers"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🧪 Starting test execution..."
echo "📊 Configuration:"
echo "   Browser: $BROWSER"
echo "   Test Type: $TEST_TYPE"
echo "   Reporter: $REPORTER"
echo "   Retries: $RETRIES"
echo "   Workers: $WORKERS"

# Set environment variables
export CI=true
export BASE_URL=${BASE_URL:-"https://www.demoblaze.com"}
export HEADLESS=true
export TIMEOUT=${TIMEOUT:-30000}

echo "🌐 Base URL: $BASE_URL"

# Build the Playwright command
PLAYWRIGHT_CMD="npx playwright test"

# Add project (browser) if specified
if [ "$BROWSER" != "all" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --project=$BROWSER"
fi

# Add test type filter
case $TEST_TYPE in
    smoke)
        PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --grep=@smoke"
        ;;
    regression)
        PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --grep=@regression"
        ;;
    full)
        # No filter for full tests
        ;;
    demoblaze)
        PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD tests/demoblaze/"
        ;;
    *)
        echo "❌ Unknown test type: $TEST_TYPE"
        exit 1
        ;;
esac

# Add reporter
PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --reporter=$REPORTER"

# Add retries
PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --retries=$RETRIES"

# Add workers (only if not in CI or if explicitly set)
if [ "$CI" != "true" ] || [ "$WORKERS" != "1" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --workers=$WORKERS"
fi

echo "🚀 Executing command: $PLAYWRIGHT_CMD"

# Execute the tests
eval $PLAYWRIGHT_CMD

# Check exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed successfully!"
    
    # Generate additional reports if HTML reporter is used
    if [[ "$REPORTER" == *"html"* ]]; then
        echo "📊 Generating HTML report..."
        npx playwright show-report --host 0.0.0.0 --port 8080 &
        REPORT_PID=$!
        echo "📈 HTML report available at http://localhost:8080 (PID: $REPORT_PID)"
    fi
else
    echo "❌ Some tests failed (Exit code: $EXIT_CODE)"
    
    # Show failed test details
    echo "🔍 Failed test details:"
    if [ -f "test-results/results.json" ]; then
        echo "📄 Test results available in test-results/results.json"
    fi
    
    if [ -d "test-results" ]; then
        echo "📸 Screenshots and videos available in test-results/"
        ls -la test-results/
    fi
fi

# Cleanup
if [ ! -z "$REPORT_PID" ]; then
    kill $REPORT_PID 2>/dev/null || true
fi

echo "🏁 Test execution completed"
exit $EXIT_CODE
