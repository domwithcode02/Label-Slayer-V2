#!/bin/bash

# LabelSlayer Backend - Secrets Setup Script
# This script guides you through setting up required secrets for the LabelSlayer backend

set -e

echo "🔐 Setting up secrets for LabelSlayer backend..."
echo "=============================================="

# Check if wrangler is available
if ! command -v npx wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found. Please install it first:"
    echo "   npm install wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! npx wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please log in first:"
    echo "   npx wrangler login"
    exit 1
fi

echo "✅ Cloudflare authentication confirmed"

# Function to generate a random salt
generate_salt() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 32
    else
        # Fallback for systems without openssl
        head -c 32 /dev/urandom | base64 | tr -d '=+/' | cut -c1-64
    fi
}

echo ""
echo "📋 This script will help you set up two required secrets:"
echo "   1. OPENAI_API_KEY - Required for AI-powered nutrition analysis"
echo "   2. ETAG_SALT - Required for secure cache validation"
echo ""

# Setup OpenAI API Key
echo "🤖 Setting up OpenAI API Key..."
echo "================================"
echo ""
echo "You have two options:"
echo "   1. Use a real OpenAI API key for full functionality"
echo "   2. Use a dummy key for development with mock responses"
echo ""

while true; do
    read -p "Do you have a real OpenAI API key? (y/n): " yn
    case $yn in
        [Yy]* )
            echo ""
            echo "🔑 Please get your OpenAI API key from: https://platform.openai.com/api-keys"
            echo "⚠️  The key should start with 'sk-proj-' or 'sk-'"
            echo ""
            echo "Setting OPENAI_API_KEY secret..."
            npx wrangler secret put OPENAI_API_KEY
            echo "✅ OPENAI_API_KEY secret set successfully"
            break
            ;;
        [Nn]* )
            echo ""
            echo "🔧 Setting up dummy OpenAI API key for development..."
            echo "ℹ️  This will enable mock responses for testing"
            echo "dummy-key-for-development" | npx wrangler secret put OPENAI_API_KEY
            echo "✅ Dummy OPENAI_API_KEY secret set successfully"
            break
            ;;
        * ) echo "Please answer yes or no.";;
    esac
done

# Setup ETag Salt
echo ""
echo "🧂 Setting up ETag Salt..."
echo "========================="
echo ""
echo "Generating a secure random salt for ETag validation..."

# Generate salt
ETAG_SALT=$(generate_salt)
echo "Generated salt: $ETAG_SALT"
echo ""
echo "Setting ETAG_SALT secret..."
echo "$ETAG_SALT" | npx wrangler secret put ETAG_SALT
echo "✅ ETAG_SALT secret set successfully"

echo ""
echo "🎉 Secrets setup complete!"
echo "=========================="
echo ""
echo "📝 Secrets configured:"
echo "   ✅ OPENAI_API_KEY - Set and ready"
echo "   ✅ ETAG_SALT - Set and ready"
echo ""
echo "🔍 You can verify secrets are set with:"
echo "   npx wrangler secret list"
echo ""
echo "🚀 Next steps:"
echo "   1. Test your configuration: npm run dev"
echo "   2. Verify health endpoint: curl http://127.0.0.1:8787/health"
echo "   3. Start developing your application!"