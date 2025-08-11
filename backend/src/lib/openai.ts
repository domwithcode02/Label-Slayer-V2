import type { Env } from "../index";

type VisionInput =
  | { imageUrl: string; pHash?: string }
  | { imageBase64: string; mimeType?: string; pHash?: string };

export type VisionResult = {
  ok: boolean;
  summary: string;
  tags: string[];
  confidence: number;
  source: "stub" | "openai";
};

export async function requestGpt4oVision(env: Env, input: VisionInput, timeoutMs = 5000): Promise<VisionResult> {
  if (!env.OPENAI_API_KEY) {
    const marker = "imageUrl" in input ? input.imageUrl : input.imageBase64.slice(0, 16);
    const pHash = "pHash" in input && input.pHash ? input.pHash : "unknown";
    return {
      ok: true,
      summary: `Mock analysis for ${pHash}`,
      tags: ["mock", "label", "nutrition"],
      confidence: 0.42,
      source: "stub",
    };
  }
  // Real call outline (kept behind key presence, avoid leaking secrets)
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this product label and summarize key nutrition and allergens." },
            "imageUrl" in input
              ? { type: "image_url", image_url: input.imageUrl }
              : { type: "image", image_base64: input.imageBase64, mime_type: input.mimeType ?? "image/jpeg" },
          ],
        },
      ],
    };
    const res = await fetch((env.OPENAI_BASE_URL ?? "https://api.openai.com/v1") + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    const text =
      json?.choices?.[0]?.message?.content ||
      json?.choices?.[0]?.message?.text ||
      "No content from OpenAI";
    return {
      ok: res.ok,
      summary: String(text).slice(0, 512),
      tags: [],
      confidence: res.ok ? 0.9 : 0.0,
      source: "openai",
    };
  } catch (_e) {
    return {
      ok: false,
      summary: "OpenAI request failed",
      tags: [],
      confidence: 0,
      source: "openai",
    };
  } finally {
    clearTimeout(id);
  }
}