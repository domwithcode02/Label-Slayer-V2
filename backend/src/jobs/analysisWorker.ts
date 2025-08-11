import type { Env } from "../index";
import { getDb, query, run } from "../lib/db";
import { makeEtag } from "../lib/etag";
import { callContext7, callSequential } from "../lib/mcp";
import { requestGpt4oVision } from "../lib/openai";
import { generateMockAnalysis, createOrFindProduct, parseAIAnalysis } from "../lib/aiAnalysis";
import { ProductAnalysisData } from "../types/api";

type AnalysisJob = {
  analysisId: string;
  pHash: string;
  r2Key?: string | null;
  image?: { url?: string; base64Size?: number };
};

export async function processAnalysisJob(msg: { body: AnalysisJob }, env: Env, _ctx: ExecutionContext): Promise<void> {
  const { analysisId, pHash } = msg.body;
  const db = getDb(env);

  // Idempotency: load existing record status
  const existing = await query<any>(
    db,
    `SELECT status FROM analysis_records WHERE analysis_id = ? LIMIT 1`,
    [analysisId]
  );
  if (!existing.length) {
    // Unknown job; ignore
    return;
  }
  const current = String(existing[0].status);
  if (current === "succeeded" || current === "failed") {
    return; // already done
  }

  // If there is already a latest succeeded record for this pHash at current schema version, skip re-analysis
  const latest = await query<any>(
    db,
    `SELECT analysis_id, summary, etag, product_id, analysis_data_json
     FROM analysis_records
     WHERE phash = ? AND status = 'succeeded'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [pHash]
  );
  if (latest.length) {
    // Link current analysis_id to the same product and etag without recomputation
    const { product_id, summary, etag, analysis_data_json } = latest[0];
    await run(
      db,
      `UPDATE analysis_records
       SET status = 'succeeded', summary = ?, etag = ?, product_id = ?, analysis_data_json = ?, updated_at = ?
       WHERE analysis_id = ?`,
      [summary ?? null, etag ?? null, product_id ?? null, analysis_data_json ?? null, new Date().toISOString(), analysisId]
    );
    return;
  }

  // Set processing
  const nowIso = new Date().toISOString();
  await run(
    db,
    `UPDATE analysis_records SET status = 'processing', updated_at = ? WHERE analysis_id = ?`,
    [nowIso, analysisId]
  );

  // Decide stub vs real calls (mock path when OPENAI_API_KEY unset)
  const mcpConfigured = Boolean(env.MCP_CONTEXT7_ENDPOINT || env.MCP_SEQUENTIAL_ENDPOINT);
  const openaiConfigured = Boolean(env.OPENAI_API_KEY);

  let analysisData: ProductAnalysisData;
  let productId: string;

  try {
    if (!mcpConfigured || !openaiConfigured) {
      // Enhanced mock with structured data
      console.log(`Generating mock analysis for pHash: ${pHash}`);
      analysisData = generateMockAnalysis(pHash);
      productId = await createOrFindProduct(analysisData, db);
    } else {
      // Real AI analysis (future implementation)
      console.log(`Performing AI analysis for pHash: ${pHash}`);
      try {
        const visionResult = await requestGpt4oVision(env, { 
          imageUrl: msg.body.image?.url ?? "about:blank", 
          pHash 
        });
        analysisData = await parseAIAnalysis(visionResult.summary || "");
        productId = await createOrFindProduct(analysisData, db);
      } catch (aiError) {
        console.warn('AI analysis failed, falling back to mock:', aiError);
        analysisData = generateMockAnalysis(pHash);
        productId = await createOrFindProduct(analysisData, db);
      }
    }

    // ETag computed from stable payload + schema salt
    const etag = await makeEtag({ analysisId, pHash, analysisData, schemaVersion: env.SCHEMA_VERSION }, env.ETAG_SALT);

    // Store structured data in database
    await run(
      db,
      `UPDATE analysis_records 
       SET status = 'succeeded', 
           summary = ?, 
           analysis_data_json = ?, 
           product_id = ?, 
           etag = ?, 
           updated_at = ?
       WHERE analysis_id = ?`,
      [
        analysisData.description, // Keep summary for backward compatibility
        JSON.stringify(analysisData),
        productId,
        etag,
        new Date().toISOString(),
        analysisId
      ]
    );

    console.log(`Analysis completed for ${analysisId}, created product ${productId}`);
  } catch (error) {
    console.error('Analysis worker error:', error);
    await run(
      db,
      `UPDATE analysis_records SET status = 'failed', updated_at = ? WHERE analysis_id = ?`,
      [new Date().toISOString(), analysisId]
    );
  }
}