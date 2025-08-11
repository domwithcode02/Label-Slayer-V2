# LabelSlayer Backend Setup Guide

This guide will help you set up the LabelSlayer backend with all required Cloudflare resources and configuration.

## Prerequisites

Before starting, ensure you have:

- Node.js (v18 or later)
- npm or yarn package manager
- A Cloudflare account
- Git (for version control)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 3. Run Automated Setup Scripts

We've provided automated scripts to streamline the setup process:

#### Option A: Complete Automated Setup (Recommended)

```bash
# Make scripts executable (Linux/Mac)
chmod +x scripts/*.sh

# 1. Create all Cloudflare resources
./scripts/setup-cloudflare-resources.sh

# 2. Set up required secrets
./scripts/setup-secrets.sh

# 3. Verify everything is configured correctly
./scripts/verify-setup.sh
```

#### Option B: Manual Setup

If you prefer to set things up manually, follow these steps:

## Manual Setup Process

### Step 1: Create Cloudflare Resources

Create the required Cloudflare resources:

```bash
# Create D1 Database
npx wrangler d1 create LABELSLAYER_D1

# Create R2 Storage Bucket
npx wrangler r2 bucket create labelslyr-images-tmp

# Create Queues for job processing
npx wrangler queues create analysis-jobs
npx wrangler queues create analysis-jobs-dlq

# Create Vectorize Index for search
npx wrangler vectorize create labelslyr-index --dimension 1536

# Apply database migrations
npx wrangler d1 migrations apply LABELSLAYER_D1
```

### Step 2: Update Configuration

If you created a new D1 database, update the `database_id` in `wrangler.toml` with the ID returned from the create command.

### Step 3: Set Up Secrets

Set up the required secrets:

```bash
# Set OpenAI API key (get from: https://platform.openai.com/api-keys)
npx wrangler secret put OPENAI_API_KEY

# Set ETag salt (generate with: openssl rand -hex 32)
npx wrangler secret put ETAG_SALT
```

For development without an OpenAI API key, you can use a dummy value:
```bash
echo "dummy-key-for-development" | npx wrangler secret put OPENAI_API_KEY
```

## Configuration Files

### Environment Variables (.dev.vars)

The `.dev.vars` file contains non-secret environment variables for local development:

```bash
# API Configuration
API_VERSION=0.1.0
SCHEMA_VERSION=0003
APP_ENV=dev
API_BASE_URL=http://127.0.0.1:8787

# Database & Storage
ANALYSIS_QUEUE_NAME=analysis-jobs
SIGNED_URL_TTL_SECONDS=900

# Rate Limiting
RATE_LIMIT_MAX_MINUTE=120

# Logging & Monitoring
LOG_SAMPLE_RATE=0.1

# AI Integration
OPENAI_BASE_URL=https://api.openai.com/v1

# Vector Search
VECTORIZE_DIMENSION=1536

# CORS Configuration
CORS_ALLOW_ORIGIN=*
```

### Wrangler Configuration (wrangler.toml)

The `wrangler.toml` file contains the Cloudflare Workers configuration with bindings for all services:

- **D1 Database**: `LABELSLAYER_D1` binding
- **R2 Storage**: `LABELSLAYER_R2` binding  
- **Queues**: `ANALYSIS_QUEUE` and `ANALYSIS_DLQ` bindings
- **Vectorize**: `LABELSLAYER_VECTORIZE` binding

## Development Workflow

### Start Development Server

```bash
npm run dev
```

The server will start on `http://127.0.0.1:8787`

### Test the Setup

Test the health endpoint:
```bash
curl http://127.0.0.1:8787/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "environment": "dev"
}
```

### Run Type Checking

```bash
npm run check
```

### Run Tests

```bash
npm run test
```

### Apply Database Migrations

```bash
npm run migrate
```

## Verification Commands

Verify your resources are created correctly:

```bash
# List D1 databases
npx wrangler d1 list

# List R2 buckets
npx wrangler r2 bucket list

# List queues
npx wrangler queues list

# List vectorize indexes
npx wrangler vectorize list

# List secrets
npx wrangler secret list
```

## Troubleshooting

### Common Issues

#### Authentication Problems
```bash
# If login fails, try logging out first
npx wrangler logout
npx wrangler login
```

#### Database Migration Errors
```bash
# Verify database exists
npx wrangler d1 list

# Check if migrations table exists
npx wrangler d1 execute LABELSLAYER_D1 --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### CORS Issues
- Verify `CORS_ALLOW_ORIGIN` is set correctly in wrangler.toml
- For mobile development, you may need to use your computer's IP address instead of localhost

#### Secret Issues
```bash
# Verify secrets are set
npx wrangler secret list

# Delete and recreate a secret if needed
npx wrangler secret delete SECRET_NAME
npx wrangler secret put SECRET_NAME
```

### Development vs Production

The configuration includes separate settings for development and production:

- **Development**: Uses localhost URLs, permissive CORS, higher rate limits
- **Production**: Uses production URLs, restrictive CORS, production-appropriate limits

Update the production URLs in `wrangler.toml` before deploying:
```toml
[env.production.vars]
API_BASE_URL = "https://api.labelslayer.yourdomain.com"
CORS_ALLOW_ORIGIN = "https://labelslayer.yourdomain.com"
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run publish
```

For production deployment:
```bash
npx wrangler deploy --env production
```

## Next Steps

Once setup is complete:

1. ✅ Backend configuration is ready
2. ✅ All Cloudflare resources are provisioned
3. ✅ Secrets are configured
4. 🚀 Ready for Phase 4 - Testing & Validation

## Support

If you encounter issues:

1. Run the verification script: `./scripts/verify-setup.sh`
2. Check the troubleshooting section above
3. Verify your Cloudflare account permissions
4. Check the Cloudflare Workers documentation