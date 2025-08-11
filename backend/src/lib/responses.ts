export function withCorsHeaders(init?: ResponseInit, allowOrigin: string = "*"): Headers {
  const headers = new Headers(init?.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,If-None-Match");
  headers.set("Access-Control-Expose-Headers", "ETag,RateLimit-Limit,RateLimit-Remaining,RateLimit-Reset");
  return headers;
}

export function json(data: unknown, init?: ResponseInit): Response {
  const body = JSON.stringify(data);
  const headers = new Headers(init?.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(body, { status: init?.status ?? 200, headers });
}

export function error(code: string, message: string, status = 400, details?: Record<string, unknown>): Response {
  return json(
    {
      error: {
        code,
        message,
        details: details || {},
      },
    },
    { status }
  );
}

export function notModified(etag: string): Response {
  const headers = new Headers();
  headers.set("ETag", etag);
  return new Response(null, { status: 304, headers });
}