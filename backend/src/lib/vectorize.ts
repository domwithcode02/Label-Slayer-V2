import type { Env } from "../index";

export async function upsertVectors(env: Env, items: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void> {
  if (!env.VECT_INDEX) {
    // Vectorize not configured; noop for dev
    return;
  }
  await env.VECT_INDEX.upsert(items);
}

export async function queryVectors(
  env: Env,
  vector: number[],
  topK = 5,
  filter?: Record<string, unknown>
): Promise<Array<{ id: string; score: number; metadata?: Record<string, unknown> }>> {
  if (!env.VECT_INDEX) {
    // Stub deterministic results in dev
    return [];
  }
  const { matches } = await env.VECT_INDEX.query({ vector, topK, filter });
  return matches ?? [];
}