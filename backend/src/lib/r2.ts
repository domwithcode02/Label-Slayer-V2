import type { Env } from "../index";

export async function getSignedUrl(env: Env, key: string, ttlSeconds?: number): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + (ttlSeconds ?? Number(env.SIGNED_URL_TTL_SECONDS ?? 900));
  if (typeof env.R2_BUCKET.createSignedUrl === "function") {
    const signed = await env.R2_BUCKET.createSignedUrl!(key, { method: "GET", expires });
    return signed.url;
  }
  // Dev fallback (not actually signed)
  const url = new URL(`https://r2.example/${encodeURIComponent(key)}`);
  url.searchParams.set("exp", String(expires));
  return url.toString();
}