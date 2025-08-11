#!/bin/bash

# LabelSlayer Backend - Setup Verification Script
# This script verifies that all Cloudflare resources and secrets are properly configured

set -e

echo "✅ Verifying LabelSlayer backend setup..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

# Function to check and report status
check_status() {
    local check_name="$1"
    local command="$2"
    local success_message="$3"
    local failure_message="$4"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -n "Checking $check_name... "
    
    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✅ $success_message${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ $failure_message${NC}"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
        return 1
    fi
}

# Check if wrangler is available
echo "🔧 Checking prerequisites..."
check_status "Wrangler CLI" \
    "command -v npx wrangler" \
    "Wrangler CLI is available" \
    "Wrangler CLI not found - run: npm install wrangler"

# Check Cloudflare authentication
check_status "Cloudflare Authentication" \
    "npx wrangler whoami" \
    "Authenticated with Cloudflare" \
    "Not authenticated - run: npx wrangler login"

echo ""
echo "📊 Checking Cloudflare resources..."

# Check D1 Database
check_status "D1 Database" \
    "npx wrangler d1 list | grep -q 'LABELSLAYER_D1'" \
    "D1 database 'LABELSLAYER_D1' exists" \
    "D1 database not found - run: npx wrangler d1 create LABELSLAYER_D1"

# Check R2 Bucket
check_status "R2 Storage Bucket" \
    "npx wrangler r2 bucket list | grep -q 'labelslyr-images-tmp'" \
    "R2 bucket 'labelslyr-images-tmp' exists" \
    "R2 bucket not found - run: npx wrangler r2 bucket create labelslyr-images-tmp"

# Check Queues
check_status "Analysis Jobs Queue" \
    "npx wrangler queues list | grep -q 'analysis-jobs'" \
    "Queue 'analysis-jobs' exists" \
    "Queue not found - run: npx wrangler queues create analysis-jobs"

check_status "Dead Letter Queue" \
    "npx wrangler queues list | grep -q 'analysis-jobs-dlq'" \
    "Dead letter queue 'analysis-jobs-dlq' exists" \
    "Dead letter queue not found - run: npx wrangler queues create analysis-jobs-dlq"

# Check Vectorize Index
check_status "Vectorize Index" \
    "npx wrangler vectorize list | grep -q 'labelslyr-index'" \
    "Vectorize index 'labelslyr-index' exists" \
    "Vectorize index not found - run: npx wrangler vectorize create labelslyr-index --dimension 1536"

echo ""
echo "🔐 Checking secrets..."

# Check secrets
check_status "OpenAI API Key Secret" \
    "npx wrangler secret list | grep -q 'OPENAI_API_KEY'" \
    "OPENAI_API_KEY secret is set" \
    "OPENAI_API_KEY secret not set - run: npx wrangler secret put OPENAI_API_KEY"

check_status "ETag Salt Secret" \
    "npx wrangler secret list | grep -q 'ETAG_SALT'" \
    "ETAG_SALT secret is set" \
    "ETAG_SALT secret not set - run: npx wrangler secret put ETAG_SALT"

echo ""
echo "📋 Checking configuration files..."

# Check wrangler.toml exists
check_status "Wrangler Configuration" \
    "[ -f wrangler.toml ]" \
    "wrangler.toml exists" \
    "wrangler.toml not found"

# Check .dev.vars exists
check_status "Development Variables" \
    "[ -f .dev.vars ]" \
    ".dev.vars file exists" \
    ".dev.vars file not found"

# Check package.json exists
check_status "Package Configuration" \
    "[ -f package.json ]" \
    "package.json exists" \
    "package.json not found"

echo ""
echo "🔍 Testing application startup..."

# Test TypeScript compilation
check_status "TypeScript Compilation" \
    "npm run check" \
    "TypeScript compilation successful" \
    "TypeScript compilation failed - check your code"

echo ""
echo "📊 Setup Verification Summary"
echo "=============================="
echo -e "Total checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Your setup is ready.${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start the development server: npm run dev"
    echo "   2. Test the health endpoint: curl http://127.0.0.1:8787/health"
    echo "   3. Begin developing your application!"
    echo ""
    echo "🔗 Useful commands:"
    echo "   - View logs: npx wrangler tail"
    echo "   - Run migrations: npm run migrate"
    echo "   - Deploy to production: npm run publish"
else
    echo ""
    echo -e "${RED}❌ Setup verification failed. Please resolve the issues above.${NC}"
    echo ""
    echo "💡 Common solutions:"
    echo "   - Run: ./scripts/setup-cloudflare-resources.sh"
    echo "   - Run: ./scripts/setup-secrets.sh"
    echo "   - Check your Cloudflare account permissions"
    echo "   - Verify your wrangler.toml configuration"
    exit 1
fi