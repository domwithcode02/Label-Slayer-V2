import type { Env } from "../../index";
import { getDb, query, run } from "../../lib/db";
import { error, json, notModified } from "../../lib/responses";
import { makeEtag } from "../../lib/etag";
import { getSignedUrl } from "../../lib/r2";
import type { AnalysisByHashRequest, AnalysisByHashResponse, AnalysisRecordDTO, ProductDTO, ProductAnalysisData } from "../../types/api";

const PHASH_RE_STRICT = /^[a-f0-9]{16}$/; // exactly 64-bit hex, lowercase enforced below
const IDEM_TTL_SECONDS = 15 * 60;

async function getIdemKey(db: D1Database, key: string) {
  const rows = await query<any>(db, `SELECT key, response_status, response_body, last_seen_at FROM idempotency_keys WHERE key = ? LIMIT 1`, [key]);
  return rows[0] || null;
}
async function upsertIdemKey(db: D1Database, key: string, method: string, route: string, status?: number, body?: any) {
  const now = new Date().toISOString();
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body ?? null);
  await run(db, `INSERT INTO idempotency_keys (key, method, route, first_seen_at, last_seen_at, response_status, response_body)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET last_seen_at=excluded.last_seen_at, response_status=COALESCE(excluded.response_status, idempotency_keys.response_status), response_body=COALESCE(excluded.response_body, idempotency_keys.response_body)`,
    [key, method, route, now, now, status ?? null, bodyStr ?? null]);
}

export async function handleAnalysisByHash(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let body: AnalysisByHashRequest;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }
  const raw = String(body?.pHash || "");
  const pHash = raw.toLowerCase();
  if (!PHASH_RE_STRICT.test(pHash)) {
    return error("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
  }

  const db = getDb(env);

  // Cache-first: attempt to serve existing record with ETag/304
  const rows = await query<any>(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, image_key, product_name, product_brand, product_upc, updated_at, analysis_data_json
     FROM v_latest_analysis_by_phash WHERE phash = ? LIMIT 1`,
    [pHash]
  );

  if (rows.length) {
    const r = rows[0];
    
    // Parse structured analysis data if available
    let analysisData: ProductAnalysisData | undefined;
    if (r.analysis_data_json) {
      try {
        analysisData = JSON.parse(r.analysis_data_json);
      } catch (parseError) {
        console.warn('Failed to parse analysis_data_json:', parseError);
        analysisData = undefined;
      }
    }

    const record: AnalysisRecordDTO = {
      analysisId: String(r.analysis_id),
      productId: r.product_id ? String(r.product_id) : null,
      pHash: String(r.phash),
      status: String(r.status) as any,
      summary: r.summary ?? null,
      etag: r.etag ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: r.updated_at ? String(r.updated_at) : new Date().toISOString(),
    };
    const etag = r.etag || (await makeEtag(record, env.ETAG_SALT));
    const ifNone = req.headers.get("If-None-Match");
    if (ifNone && ifNone === etag) {
      return notModified(etag);
    }

    let signedImageUrl: string | undefined;
    if (r.image_key) {
      signedImageUrl = await getSignedUrl(env, String(r.image_key), Number(env.SIGNED_URL_TTL_SECONDS ?? 900));
    }

    const product: ProductDTO | null = r.product_id
      ? {
          id: String(r.product_id),
          name: analysisData?.name || String(r.product_name ?? "Unknown"),
          brand: r.product_brand ?? null,
          upc: r.product_upc ?? null,
          imageKey: r.image_key ?? null,
        }
      : null;

    const resp: AnalysisByHashResponse = {
      hit: true,
      record: { 
        ...record, 
        etag,
        analysisData // Add structured data to response
      },
      product: product ? {
        ...product,
        name: analysisData?.name || product.name || "Unknown Product"
      } : null,
      signedImageUrl: signedImageUrl ?? null,
    };
    const res = json(resp, { status: 200 });
    res.headers.set("ETag", etag);
    res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
    return res;
  }

  // Miss: honor Idempotency-Key to avoid duplicate enqueues within short window
  const idem = req.headers.get("Idempotency-Key") || undefined;
  if (idem) {
    const existing = await getIdemKey(db, idem);
    if (existing) {
      const ageSec = Math.floor((Date.now() - Date.parse(existing.last_seen_at)) / 1000);
      if (ageSec < IDEM_TTL_SECONDS && existing.response_status) {
        // Replay previous response
        const replayBody = existing.response_body ? JSON.parse(existing.response_body) : {};
        const res = json(replayBody, { status: Number(existing.response_status) });
        res.headers.set("X-Idempotent-Replay", "1");
        res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
        return res;
      }
    }
  }

  // Ensure image signature exists
  const analysisId = crypto.randomUUID();
  const nowIso = new Date().toISOString();

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

  const job = { analysisId, pHash, r2Key: null as string | null };
  await env.ANALYSIS_QUEUE.send(job);

  const resp: AnalysisByHashResponse = {
    hit: false,
    jobId: analysisId,
    retryAfterSeconds: 3,
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);

  if (idem) {
    await upsertIdemKey(db, idem, "POST", "/analysis/by-hash", 202, resp);
  }
  return res;
}