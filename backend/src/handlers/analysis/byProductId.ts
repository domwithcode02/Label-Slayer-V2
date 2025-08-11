import type { Env } from "../../index";
import { getDb, query } from "../../lib/db";
import { error, json, notModified } from "../../lib/responses";
import { makeEtag } from "../../lib/etag";
import type { AnalysisByProductIdResponse, AnalysisRecordDTO, ProductAnalysisData } from "../../types/api";

export async function handleAnalysisByProductId(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return error("INVALID_INPUT", "productId is required", 400);
  }

  const db = getDb(env);
  const rows = await query<any>(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, updated_at, analysis_data_json
     FROM analysis_records
     WHERE product_id = ?
     ORDER BY updated_at DESC
     LIMIT 1`,
    [productId]
  );

  if (!rows.length) {
    return error("NOT_FOUND", "No analysis found for productId", 404);
  }

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

  const resp: AnalysisByProductIdResponse = { 
    hit: true, 
    record: { 
      ...record, 
      analysisData 
    }, 
    etag 
  };
  const res = json(resp, { status: 200 });
  res.headers.set("ETag", etag);
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  return res;
}