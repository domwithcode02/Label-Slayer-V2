import type { Env } from "../index";
import { getDb, run } from "../lib/db";
import { error, json } from "../lib/responses";
import type { HistoryRequest, HistoryResponse } from "../types/api";

export async function handleHistory(req: Request, env: Env): Promise<Response> {
  let body: HistoryRequest;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }
  const events = Array.isArray(body?.events) ? body.events : [];
  if (!events.length) {
    return json({ accepted: 0 } as HistoryResponse, { status: 202 });
  }

  const db = getDb(env);
  const nowIso = new Date().toISOString();
  let accepted = 0;
  for (const ev of events) {
    try {
      await run(
        db,
        `INSERT INTO user_history (user_id, type, product_id, analysis_id, metadata_json, occurred_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ev.userId ?? null,
          String(ev.type || "unknown"),
          ev.productId ?? null,
          ev.analysisId ?? null,
          JSON.stringify(ev.metadata ?? {}),
          ev.occurredAt ?? nowIso,
          nowIso,
        ]
      );
      accepted += 1;
    } catch {
      // swallow individual errors to keep ingestion resilient
    }
  }

  return json({ accepted } as HistoryResponse, { status: 202 });
}