type RateHeaders = {
  "RateLimit-Limit": number;
  "RateLimit-Remaining": number;
  "RateLimit-Reset": number;
};

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: Request): string {
  // Trust cf-connecting-ip when present, fallback to remote addr (not available in Workers), else UA hash
  const ip = req.headers.get("cf-connecting-ip") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";
  return `${ip}:${ua.slice(0, 32)}`;
}

export async function withRateLimit(
  req: Request,
  env: { RATE_LIMIT_MAX_MINUTE?: number },
  next: (headers: RateHeaders) => Promise<Response>
): Promise<Response> {
  const limit = Number(env.RATE_LIMIT_MAX_MINUTE ?? 120);
  const key = getClientKey(req);
  const now = Date.now();
  const minute = 60 * 1000;

  let bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + minute };
    memoryBuckets.set(key, bucket);
  }

  if (bucket.count >= limit) {
    const headers: RateHeaders = {
      "RateLimit-Limit": limit,
      "RateLimit-Remaining": Math.max(0, limit - bucket.count),
      "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1000),
    };
    return new Response(
      JSON.stringify({
        error: {
          code: "RATE_LIMITED",
          message: "Too Many Requests",
          details: {},
        },
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "RateLimit-Limit": String(headers["RateLimit-Limit"]),
          "RateLimit-Remaining": String(headers["RateLimit-Remaining"]),
          "RateLimit-Reset": String(headers["RateLimit-Reset"]),
        },
      }
    );
  }

  bucket.count += 1;
  const headers: RateHeaders = {
    "RateLimit-Limit": limit,
    "RateLimit-Remaining": Math.max(0, limit - bucket.count),
    "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1000),
  };
  return next(headers);
}

// TODO: Production-grade rate limiting via Durable Object or KV; keep in-memory for dev only.