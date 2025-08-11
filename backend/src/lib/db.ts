import type { Env } from "../index";

export type Row = Record<string, unknown>;

export function getDb(env: Env): D1Database {
  return env.LABELSLAYER_D1;
}

export async function query<T = Row>(db: D1Database, sql: string, params: any[] = []): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const res = await bound.all<T>();
  return res.results || [];
}

export async function run(db: D1Database, sql: string, params: any[] = []): Promise<void> {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  await bound.run();
}