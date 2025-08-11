import { handleHealth } from "./handlers/health";
import { handleAnalysisByHash } from "./handlers/analysis/byHash";
import { handleAnalysisAnalyze } from "./handlers/analysis/analyze";
import { handleAnalysisByProductId } from "./handlers/analysis/byProductId";
import { handleSearch } from "./handlers/search";
import { handleHistory } from "./handlers/history";
import { withRateLimit } from "./lib/rateLimit";
import { json, error } from "./lib/responses";

export interface Env {
  LABELSLAYER_D1: D1Database;
  R2_BUCKET: R2Bucket;
  VECT_INDEX?: VectorizeIndex;
  ANALYSIS_QUEUE: Queue;
  // Vars
  API_VERSION: string;
  SCHEMA_VERSION: string;
  ANALYSIS_QUEUE_NAME: string;
  SIGNED_URL_TTL_SECONDS: number;
  RATE_LIMIT_MAX_MINUTE: number;
  LOG_SAMPLE_RATE?: number;
  MCP_CONTEXT7_ENDPOINT?: string;
  MCP_SEQUENTIAL_ENDPOINT?: string;
  OPENAI_BASE_URL?: string;
  VECTORIZE_DIMENSION?: number;
  CORS_ALLOW_ORIGIN?: string;
  // Secrets (set via wrangler secret)
  OPENAI_API_KEY?: string;
  ETAG_SALT?: string;
}

function addCorsHeaders(resp: Response, env: Env): Response {
  const headers = new Headers(resp.headers);
  const allowOrigin = env.CORS_ALLOW_ORIGIN || "*";
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,If-None-Match,Idempotency-Key");
  headers.set("Access-Control-Expose-Headers", "ETag,RateLimit-Limit,RateLimit-Remaining,RateLimit-Reset,X-Schema-Version");
  // Add schema version for visibility on 200/202 responses
  if (!headers.has("X-Schema-Version") && env.SCHEMA_VERSION) {
    headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  }
  return new Response(resp.body, { status: resp.status, headers });
}

function okJson(data: unknown, env: Env, init?: ResponseInit): Response {
  return addCorsHeaders(json(data, init), env);
}

function errJson(code: string, message: string, status = 400, env?: Env, details?: Record<string, unknown>): Response {
  const resp = error(code, message, status, details);
  return env ? addCorsHeaders(resp, env) : resp;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return addCorsHeaders(new Response(null, { status: 204 }), env);
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    // Apply rate limiting per route
    const rateLimited = async (handler: () => Promise<Response>) => {
      return withRateLimit(request, env, async (rateHeaders: { [k: string]: number }) => {
        const res = await handler();
        const headers = new Headers(res.headers);
        for (const [k, v] of Object.entries(rateHeaders)) {
          headers.set(k, String(v));
        }
        // Ensure schema version visibility on responses that didn't set it
        if (!headers.has("X-Schema-Version") && env.SCHEMA_VERSION) {
          headers.set("X-Schema-Version", env.SCHEMA_VERSION);
        }
        return new Response(res.body, { status: res.status, headers });
      });
    };

    try {
      // Routing
      if (method === "GET" && path === "/health") {
        return rateLimited(async () => addCorsHeaders(await handleHealth(request, env), env));
      }

      if (path === "/analysis/by-hash" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByHash(request, env, ctx), env));
      }

      if (path === "/analysis/analyze" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisAnalyze(request, env, ctx), env));
      }

      if (path === "/analysis/by-product-id" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByProductId(request, env), env));
      }

      if (path === "/search" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleSearch(request, env), env));
      }

      if (path === "/history" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleHistory(request, env), env));
      }

      return addCorsHeaders(
        errJson("NOT_FOUND", `Route ${method} ${path} not found`, 404, env),
        env
      );
    } catch (e: any) {
      const msg = (e && e.message) ? e.message : "Unexpected error";
      const resp = errJson("INTERNAL_ERROR", msg, 500, env);
      return addCorsHeaders(resp, env);
    }
  },

  // Queue consumer (analysis jobs)
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext): Promise<void> {
    // Lazy import to avoid cold-start cost on fetch-only
    const { processAnalysisJob } = await import("./jobs/analysisWorker");
    for (const msg of batch.messages) {
      try {
        await processAnalysisJob(msg, env, ctx);
        msg.ack();
      } catch (err) {
        // Rely on queue retry policy from wrangler.toml
        msg.retry();
      }
    }
  },
};