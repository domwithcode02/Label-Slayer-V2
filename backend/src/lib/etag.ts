export async function makeEtag(obj: unknown, salt: string | undefined): Promise<string> {
  const enc = new TextEncoder();
  const input = JSON.stringify(obj ?? {}) + String(salt ?? "");
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `"W/${hex.slice(0, 32)}"`; // weak ETag
}