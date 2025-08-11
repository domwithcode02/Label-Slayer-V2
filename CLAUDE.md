# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack nutrition label analyzer application called "LabelSlayer" with two main components:

1. **React Native Frontend** (`LabelSlayer/`) - Expo-based mobile app for scanning and analyzing nutrition labels
2. **Cloudflare Workers Backend** (`backend/`) - TypeScript API with D1 database, R2 storage, Queues, and Vectorize

### Frontend Architecture
- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation with bottom tabs (Home, History, About) and stack navigation
- **State Management**: React hooks with custom `useAnalysis` hook for API interactions
- **Styling**: StyleSheet with dark theme using custom color constants
- **Services**: Modular service layer (`services/`) for API calls, image handling, and caching

### Backend Architecture
- **Runtime**: Cloudflare Workers with TypeScript
- **Database**: D1 (SQLite) with migrations in `migrations/`
- **Storage**: R2 bucket for image storage with signed URLs
- **Queue System**: Cloudflare Queues for async analysis jobs
- **Vector Search**: Vectorize for product search functionality
- **AI Integration**: OpenAI GPT-4o vision API for label analysis

## Common Development Commands

### Frontend (LabelSlayer/)
```bash
# Development
npm start                    # Start Expo development server
npm run android             # Run on Android emulator
npm run ios                 # Run on iOS simulator
npm run web                 # Run web version

# No specific lint/test commands configured
```

### Backend (backend/)
```bash
# Development
npm run dev                 # Start local development server with wrangler
npm run check              # TypeScript type checking
npm run build              # TypeScript compilation check
npm run test               # Run tests with tsx

# Database
npm run migrate            # Apply D1 migrations

# Deployment
npm run publish           # Deploy to Cloudflare Workers
```

### Backend Development Setup
```bash
cd backend
npm install
npx wrangler login

# Create Cloudflare resources
npx wrangler d1 create LABELSLAYER_D1
npx wrangler r2 bucket create labelslyr-images-tmp
npx wrangler queues create analysis-jobs
npx wrangler queues create analysis-jobs-dlq
npx wrangler vectorize create labelslyr-index --dimension 1536

# Apply database migrations
npx wrangler d1 migrations apply LABELSLAYER_D1

# Set secrets
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ETAG_SALT
```

## Key Code Patterns

### Frontend Service Layer
- `services/analysis.ts` - Main API service with async operations
- `services/api.ts` - HTTP client wrapper
- `services/cache.ts` - Local caching layer
- `services/image.ts` - Image handling utilities

### Backend Request Handling
- All endpoints use rate limiting via `withRateLimit` wrapper
- CORS headers added to all responses via `addCorsHeaders`
- Error responses use standardized `errJson` format
- ETag support for caching with `If-None-Match` headers

### Backend Job Processing
- Analysis jobs processed asynchronously via Cloudflare Queues
- Queue consumer in `jobs/analysisWorker.ts`
- Idempotency keys prevent duplicate processing
- Deterministic mock responses when external services unavailable

## Environment Configuration

### Backend Environment Variables
- Required secrets: `OPENAI_API_KEY`, `ETAG_SALT`
- Configuration in `wrangler.toml` with dev/production overrides
- Non-secret defaults can be set in `.dev.vars` for local development

### API Endpoints
- Health check: `GET /health`
- Analysis by hash: `POST /analysis/by-hash`
- Start analysis: `POST /analysis/analyze`
- Get analysis: `GET /analysis/by-product-id`
- Search products: `GET /search`
- User history: `POST /history`

## Database Schema
- Main tables: `products`, `image_signatures`, `analysis_records`, `user_history`, `telemetry_events`
- Key view: `v_latest_analysis_by_phash` for efficient analysis lookups
- Migrations located in `backend/migrations/`

## Development Workflow
- Backend uses TypeScript with strict mode and `noUncheckedIndexedAccess`
- Frontend uses TypeScript with Expo's base configuration
- No specific linting configuration in frontend package.json
- Backend includes basic test setup using `tsx`

## Security Notes
- Never commit secrets - use `wrangler secret put` for sensitive values
- CORS configured per environment (`*` for dev, specific origins for production)
- Rate limiting implemented (120 requests/minute default)
- No secrets exposed to mobile client - only `API_BASE_URL` is public