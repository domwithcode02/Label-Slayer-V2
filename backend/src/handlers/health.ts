import { json } from "../lib/responses";
import type { Env } from "../index";

export async function handleHealth(_req: Request, env: Env): Promise<Response> {
  const body = {
    ok: true,
    service: "labelslayer-backend",
    version: env.API_VERSION || "0.0.0",
    schemaVersion: env.SCHEMA_VERSION || "0000",
    time: new Date().toISOString(),
  };
  return json(body, { status: 200 });
}