import type { Env } from "../index";
import { getDb, query } from "../lib/db";
import { json } from "../lib/responses";
import type { SearchResponse } from "../types/api";

export async function handleSearch(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 10), 50);

  if (!q) {
    return json({ results: [] } as SearchResponse, { status: 200 });
  }

  const like = `%${q.replace(/%/g, "").replace(/_/g, "")}%`;
  const rows = await query<any>(
    getDb(env),
    `SELECT id, name, brand, upc, image_key
     FROM products
     WHERE name LIKE ? OR brand LIKE ? OR upc LIKE ?
     LIMIT ?`,
    [like, like, like, limit]
  );

  const results: SearchResponse["results"] = rows.map((r: any) => ({
    product: {
      id: String(r.id),
      name: String(r.name),
      brand: r.brand ?? null,
      upc: r.upc ?? null,
      imageKey: r.image_key ?? null,
    },
    score: 0.5, // simple placeholder score for LIKE-based search
  }));

  return json({ results } satisfies SearchResponse, { status: 200 });
}