import type { Env } from "../../index";
import { getDb, run } from "../../lib/db";
import { error, json } from "../../lib/responses";
import type { AnalysisAnalyzeRequest, AnalysisAnalyzeResponse } from "../../types/api";

const PHASH_RE_STRICT = /^[a-f0-9]{16}$/;

export async function handleAnalysisAnalyze(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
  let body: AnalysisAnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }

  if (!body.imageUrl && !body.imageBase64) {
    return error("INVALID_INPUT", "Provide imageUrl or imageBase64", 400);
  }
  if (body.pHash) {
    const ph = String(body.pHash).toLowerCase();
    if (!PHASH_RE_STRICT.test(ph)) {
      return error("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
    }
    body.pHash = ph;
  }

  const db = getDb(env);

  // Idempotency key (soft) — dedupe enqueue window via analysis_records and image_signatures
  const analysisId = crypto.randomUUID();
  const nowIso = new Date().toISOString();
  const pHash = (body.pHash || "unknown").toLowerCase();

  await run(
    db,
    `INSERT OR IGNORE INTO image_signatures (phash, first_seen_at) VALUES (?, ?);`,
    [pHash, nowIso]
  );

  await run(
    db,
    `INSERT OR IGNORE INTO analysis_records (analysis_id, phash, status, summary, etag, created_at, updated_at)
     VALUES (?, ?, 'queued', NULL, NULL, ?, ?)`,
    [analysisId, pHash, nowIso, nowIso]
  );

  // Enqueue job (worker is idempotent on analysis_id)
  const job = {
    analysisId,
    pHash,
    image: body.imageUrl ? { url: body.imageUrl } : { base64Size: body.imageBase64?.length ?? 0 },
  };
  await env.ANALYSIS_QUEUE.send(job);

  const resp: AnalysisAnalyzeResponse = {
    analysisId,
    status: "queued",
    jobId: analysisId,
    retryAfterSeconds: 3,
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  return res;
}