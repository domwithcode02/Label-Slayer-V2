#!/bin/bash

# LabelSlayer Backend - Cloudflare Resources Setup Script
# This script creates all required Cloudflare resources for the LabelSlayer backend

set -e

echo "🚀 Setting up Cloudflare resources for LabelSlayer backend..."
echo "========================================================"

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

# Function to check if resource exists
check_d1_exists() {
    npx wrangler d1 list | grep -q "LABELSLAYER_D1" || return 1
}

check_r2_exists() {
    npx wrangler r2 bucket list | grep -q "labelslyr-images-tmp" || return 1
}

check_queue_exists() {
    local queue_name=$1
    npx wrangler queues list | grep -q "$queue_name" || return 1
}

check_vectorize_exists() {
    npx wrangler vectorize list | grep -q "labelslyr-index" || return 1
}

# Create D1 Database
echo ""
echo "📊 Setting up D1 Database..."
if check_d1_exists; then
    echo "✅ D1 database 'LABELSLAYER_D1' already exists"
else
    echo "🔨 Creating D1 database..."
    npx wrangler d1 create LABELSLAYER_D1
    echo "✅ D1 database created successfully"
    echo "⚠️  IMPORTANT: Copy the database_id from above and update it in wrangler.toml"
fi

# Create R2 Storage Bucket
echo ""
echo "🪣 Setting up R2 Storage Bucket..."
if check_r2_exists; then
    echo "✅ R2 bucket 'labelslyr-images-tmp' already exists"
else
    echo "🔨 Creating R2 bucket..."
    npx wrangler r2 bucket create labelslyr-images-tmp
    echo "✅ R2 bucket created successfully"
fi

# Create Queues
echo ""
echo "🔄 Setting up Cloudflare Queues..."
if check_queue_exists "analysis-jobs"; then
    echo "✅ Queue 'analysis-jobs' already exists"
else
    echo "🔨 Creating analysis jobs queue..."
    npx wrangler queues create analysis-jobs
    echo "✅ Analysis jobs queue created successfully"
fi

if check_queue_exists "analysis-jobs-dlq"; then
    echo "✅ Dead letter queue 'analysis-jobs-dlq' already exists"
else
    echo "🔨 Creating dead letter queue..."
    npx wrangler queues create analysis-jobs-dlq
    echo "✅ Dead letter queue created successfully"
fi

# Create Vectorize Index (optional)
echo ""
echo "🔍 Setting up Vectorize Index (optional)..."
if check_vectorize_exists; then
    echo "✅ Vectorize index 'labelslyr-index' already exists"
else
    echo "🔨 Creating vectorize index..."
    npx wrangler vectorize create labelslyr-index --dimension 1536
    echo "✅ Vectorize index created successfully"
fi

# Apply database migrations
echo ""
echo "📋 Applying database migrations..."
echo "🔨 Running migrations..."
npx wrangler d1 migrations apply LABELSLAYER_D1
echo "✅ Database migrations applied successfully"

echo ""
echo "🎉 Cloudflare resources setup complete!"
echo "======================================="
echo ""
echo "📝 Next steps:"
echo "   1. Update database_id in wrangler.toml if you created a new D1 database"
echo "   2. Run the secrets setup script: ./scripts/setup-secrets.sh"
echo "   3. Test your configuration: npm run dev"
echo ""
echo "🔍 Verify resources were created:"
echo "   npx wrangler d1 list"
echo "   npx wrangler r2 bucket list"
echo "   npx wrangler queues list"
echo "   npx wrangler vectorize list"