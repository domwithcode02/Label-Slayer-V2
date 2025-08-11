import type { Env } from "../index";

type MCPResult = {
  ok: boolean;
  data: unknown;
  source: "stub" | "remote";
};

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function callSequential(env: Env, prompt: string, timeoutMs = 3000): Promise<MCPResult> {
  const endpoint = env.MCP_SEQUENTIAL_ENDPOINT;
  if (!endpoint) {
    // Deterministic stub
    return {
      ok: true,
      data: {
        chain: ["think:analyze", "think:plan", "think:result"],
        result: `Mock sequential plan for: ${prompt}`,
      },
      source: "stub",
    };
  }
  try {
    const res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }, timeoutMs);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data, source: "remote" };
  } catch (e) {
    return { ok: false, data: { error: String(e) }, source: "remote" };
  }
}

export async function callContext7(env: Env, query: { library: string; topic?: string }, timeoutMs = 3000): Promise<MCPResult> {
  const endpoint = env.MCP_CONTEXT7_ENDPOINT;
  if (!endpoint) {
    // Deterministic stub
    return {
      ok: true,
      data: {
        library: query.library,
        topic: query.topic ?? "general",
        snippets: [
          { id: "stub-1", text: `Example for ${query.library}:${query.topic ?? "general"}` },
        ],
      },
      source: "stub",
    };
  }
  try {
    const res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    }, timeoutMs);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data, source: "remote" };
  } catch (e) {
    return { ok: false, data: { error: String(e) }, source: "remote" };
  }
}