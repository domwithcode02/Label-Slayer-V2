# LabelSlayer — Cloudflare Workers Backend (Scaffold)

Stack: Cloudflare Workers + D1 + R2 + Queues + Vectorize. This is a minimal, runnable scaffold with mock-safe behavior, MCP stubs, and GPT‑4o vision stub. It does not modify the mobile UI.

## Features in this scaffold

- Router and endpoints
  - GET /health
  - POST /analysis/by-hash
  - POST /analysis/analyze
  - GET /analysis/by-product-id
  - GET /search
  - POST /history
- Job worker
  - Queue consumer for analysis-jobs with idempotency and status checks
  - Deterministic mock pipeline if secrets/endpoints are not configured
- Libraries
  - db: D1 helpers (query/run)
  - r2: signed URL helper with dev fallback
  - vectorize: upsert/query wrappers (no-op if unconfigured)
  - etag: deterministic ETag
  - rateLimit: in-memory per-IP (dev only) with headers
  - mcp: context7 and sequential-thinking stubs with optional remote calls
  - openai: GPT-4o vision call stubbed when OPENAI_API_KEY is unset
  - responses: JSON/error helpers with CORS
- Types
  - API request/response contracts (subset aligned to spec for scaffold)
- Migrations
  - 0001_init.sql: products, image_signatures, analysis_records, user_history, telemetry_events, indices, and view v_latest_analysis_by_phash

## Prerequisites

- Node 18+ (for tooling)
- Cloudflare Wrangler (installed via devDependencies)
- Cloudflare account (for creating resources)

## Setup

```bash
cd ./backend
npm i
npx wrangler login

# Create resources
npx wrangler d1 create LABELSLAYER_D1
npx wrangler r2 bucket create labelslyr-images-tmp
npx wrangler queues create analysis-jobs
npx wrangler queues create analysis-jobs-dlq
npx wrangler vectorize create labelslyr-index --dimension 1536

# Apply migrations
npx wrangler d1 migrations apply LABELSLAYER_D1

# Configure secrets
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ETAG_SALT

# (Optional) configure MCP endpoints if you have them
# npx wrangler secret put MCP_CONTEXT7_ENDPOINT
# npx wrangler secret put MCP_SEQUENTIAL_ENDPOINT

# Start dev server
npm run dev
```

## Environment configuration

- Wrangler bindings are defined in `wrangler.toml`.
- Non-secret defaults can be set in `.dev.vars` during local dev.
- Secrets must be set with `wrangler secret put`.

Important variables:
- API_VERSION, SCHEMA_VERSION
- ANALYSIS_QUEUE_NAME
- SIGNED_URL_TTL_SECONDS
- RATE_LIMIT_MAX_MINUTE
- LOG_SAMPLE_RATE
- MCP_CONTEXT7_ENDPOINT, MCP_SEQUENTIAL_ENDPOINT (optional for remote MCP)
- OPENAI_BASE_URL (optional)
- VECTORIZE_DIMENSION
- CORS_ALLOW_ORIGIN

### .env.sample and mapping to wrangler
- See [`backend/.env.sample`](backend/.env.sample) for documented non-secret defaults and descriptions.
- For local dev, copy to `.dev.vars`:
  ```bash
  cp backend/.env.sample backend/.dev.vars
  ```
- Wrangler reads `[vars]` and `[env.production.vars]` in [`backend/wrangler.toml`](backend/wrangler.toml) for non-secrets, and `wrangler secret` for secrets.

### Secrets via Wrangler
Set secrets (never commit):
```bash
cd ./backend
npx wrangler secret put OPENAI_API_KEY   # OpenAI key
npx wrangler secret put ETAG_SALT        # Random string used in ETag derivation
```

### Production recommendations
- API_BASE_URL: Use a custom domain/route on Cloudflare, e.g. `https://api.labelslayer.yourdomain.com`
- CORS_ALLOW_ORIGIN: Set to your app origins only (no `*`):
  ```toml
  [vars]
  CORS_ALLOW_ORIGIN = "http://127.0.0.1:19006" # dev Expo origin

  [env.production.vars]
  CORS_ALLOW_ORIGIN = "https://app.yourdomain.com"
  API_VERSION = "0.1.0"
  SCHEMA_VERSION = "0001"
  OPENAI_BASE_URL = "https://api.openai.com/v1"
  ```
- Keep `[vars]` for dev-safe defaults and override in `[env.production.vars]`.

## Endpoints

- GET /health
  - Returns service version, schemaVersion, and time.

- POST /analysis/by-hash
  - Body: `{ "pHash": "..." }`
  - Validates pHash, checks latest analysis view; returns 200 with record/product and ETag, or 304 if If-None-Match matches, or 202 and enqueues a job if miss.

- POST /analysis/analyze
  - Body: `{ imageUrl? , imageBase64?, mimeType?, pHash? }`
  - Inserts placeholder image signature (if new), creates analysis record with status `queued`, enqueues job, returns 202.

- GET /analysis/by-product-id?productId=...
  - Fetches latest analysis by productId; supports If-None-Match for 304.

- GET /search?q=...&limit=10
  - LIKE-based search over products; returns simple scores.

- POST /history
  - Body: `{ events: [...] }`
  - Inserts events into user_history; returns accepted count.

All endpoints include basic CORS and rate limiting headers.

## Job worker

- Consumes messages from `analysis-jobs`.
- Sets status `processing`.
- If OpenAI/MCP are not configured, writes a deterministic mock (`"Mock analysis for {pHash}"`) and sets status `succeeded`, with a computed ETag.
- If configured, outlines call flow: context7 → sequential-thinking → OpenAI vision → persist.

## Development notes

- TypeScript is configured for Workers (ESNext modules, bundler resolution).
- Ambient types in `src/types/workers.d.ts` are provided for a smooth editor experience; for full runtime types, install `@cloudflare/workers-types`.
- Rate limiting is in-memory for dev only. For production, replace with Durable Object/KV-backed implementation.

## Scripts

- `npm run dev` → `wrangler dev`
- `npm run migrate` → `wrangler d1 migrations apply LABELSLAYER_D1`
- `npm run publish` → `wrangler deploy`
- `npm run test` → runs lightweight backend-only tests using tsx (expects dev server running)

## Runbook

### Bootstrap (first time)
```bash
cd ./backend
npm i
npx wrangler login

# Create/bind resources
npx wrangler d1 create LABELSLAYER_D1
npx wrangler r2 bucket create labelslyr-images-tmp
npx wrangler queues create analysis-jobs
npx wrangler queues create analysis-jobs-dlq
npx wrangler vectorize create labelslyr-index --dimension 1536

# Apply migrations
npx wrangler d1 migrations apply LABELSLAYER_D1

# Non-secrets
cp backend/.env.sample backend/.dev.vars

# Secrets
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ETAG_SALT
```

### Local run and logs
```bash
npm run dev
# Tail logs in another terminal
npx wrangler tail
```

Test endpoints:
```bash
# Health
curl -s http://127.0.0.1:8787/health | jq

# Kick off analysis (mock path when secrets not set)
curl -s -X POST http://127.0.0.1:8787/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{"pHash":"abc123", "mimeType":"image/jpeg"}' | jq
```

### Deploy (dev/prod)
```bash
# Deploy current config (uses [vars])
npm run publish

# Deploy production overrides (requires [env.production.*] configured)
npx wrangler deploy --env production
```

Bindings in production:
- Ensure `[[d1_databases]]`, `[[r2_buckets]]`, `[[queues.*]]`, `[[vectorize]]` and `[env.production.vars]` exist in [`backend/wrangler.toml`](backend/wrangler.toml) and match your created resources.

### Rotate secrets and verify
```bash
# Rotate
npx wrangler secret put ETAG_SALT
npx wrangler secret put OPENAI_API_KEY

# Verify active by calling the endpoints and checking behavior/logs
curl -i http://127.0.0.1:8787/health
npx wrangler tail | grep "OpenAI"  # ensure real path used (when configured)
```

## Verification checklist

- Cache-miss path:
  1. POST /analysis/analyze with a new `pHash` → expect 202.
  2. GET /analysis/by-product-id?productId=<id> soon after → may see status `processing` until job completes.
- Cache-hit path:
  1. Repeat the same image flow (same pHash/product) → expect 200 with identical ETag, or 304 if `If-None-Match` sent.
- Observe 202→completion:
  - Poll GET /analysis/by-product-id until status `succeeded`.
  - Or watch queue processing logs via `wrangler tail`.

Example curls:
```bash
# First time (miss → 202)
curl -i -X POST http://127.0.0.1:8787/analysis/analyze -H "Content-Type: application/json" -d '{"pHash":"abc123"}'

# Poll by productId
curl -s "http://127.0.0.1:8787/analysis/by-product-id?productId=demo-1" | jq

# Repeat (hit → 200/304 depending on If-None-Match)
ETAG=$(curl -s -X POST http://127.0.0.1:8787/analysis/by-hash -H "Content-Type: application/json" -d '{"pHash":"abc123"}' | jq -r '.etag // .ETag // empty')
curl -i -X POST http://127.0.0.1:8787/analysis/by-hash -H "Content-Type: application/json" -H "If-None-Match: $ETAG" -d '{"pHash":"abc123"}'
```

## CI outline (GitHub Actions)

Minimal workflow:
- Install deps
- Type-check with `tsc --noEmit`
- Deploy on pushes to `main` using `wrangler deploy` with `CF_API_TOKEN` and `CF_ACCOUNT_ID` stored as GitHub Secrets.

Example `.github/workflows/backend.yml` (pseudocode):
```yaml
name: backend
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install
        run: npm ci
        working-directory: ./backend
      - name: Typecheck
        run: npx tsc --noEmit
        working-directory: ./backend
      - name: Publish (dev)
        if: github.ref == 'refs/heads/main'
        env:
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
        run: npx wrangler deploy
        working-directory: ./backend
```
Store secrets under Repo → Settings → Secrets and variables → Actions.

## Security notes

- No secrets in mobile bundle; only `API_BASE_URL` is public.
- Backend:
  - Use `wrangler secret` for `OPENAI_API_KEY` and `ETAG_SALT`.
  - Do not log secrets; current code avoids logging secret values.
- Rate limits:
  - Default `RATE_LIMIT_MAX_MINUTE=120` suitable for dev.
  - In production, increase cautiously and replace in-memory limiter with DO/KV-backed solution.
