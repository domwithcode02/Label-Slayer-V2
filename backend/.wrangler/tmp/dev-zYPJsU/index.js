var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-FBAqQq/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-FBAqQq/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// src/lib/db.ts
function getDb(env) {
  return env.LABELSLAYER_D1;
}
async function query(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const res = await bound.all();
  return res.results || [];
}
async function run(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  await bound.run();
}
var init_db = __esm({
  "src/lib/db.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    __name(getDb, "getDb");
    __name(query, "query");
    __name(run, "run");
  }
});

// src/lib/etag.ts
async function makeEtag(obj, salt) {
  const enc = new TextEncoder();
  const input = JSON.stringify(obj ?? {}) + String(salt ?? "");
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `"W/${hex.slice(0, 32)}"`;
}
var init_etag = __esm({
  "src/lib/etag.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    __name(makeEtag, "makeEtag");
  }
});

// src/lib/openai.ts
async function requestGpt4oVision(env, input, timeoutMs = 5e3) {
  if (!env.OPENAI_API_KEY) {
    const marker = "imageUrl" in input ? input.imageUrl : input.imageBase64.slice(0, 16);
    const pHash = "pHash" in input && input.pHash ? input.pHash : "unknown";
    return {
      ok: true,
      summary: `Mock analysis for ${pHash}`,
      tags: ["mock", "label", "nutrition"],
      confidence: 0.42,
      source: "stub"
    };
  }
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
            "imageUrl" in input ? { type: "image_url", image_url: input.imageUrl } : { type: "image", image_base64: input.imageBase64, mime_type: input.mimeType ?? "image/jpeg" }
          ]
        }
      ]
    };
    const res = await fetch((env.OPENAI_BASE_URL ?? "https://api.openai.com/v1") + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const json2 = await res.json().catch(() => ({}));
    const text = json2?.choices?.[0]?.message?.content || json2?.choices?.[0]?.message?.text || "No content from OpenAI";
    return {
      ok: res.ok,
      summary: String(text).slice(0, 512),
      tags: [],
      confidence: res.ok ? 0.9 : 0,
      source: "openai"
    };
  } catch (_e) {
    return {
      ok: false,
      summary: "OpenAI request failed",
      tags: [],
      confidence: 0,
      source: "openai"
    };
  } finally {
    clearTimeout(id);
  }
}
var init_openai = __esm({
  "src/lib/openai.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    __name(requestGpt4oVision, "requestGpt4oVision");
  }
});

// src/lib/aiAnalysis.ts
function generateMockAnalysis(pHash) {
  const hashNum = parseInt(pHash.substring(0, 4), 16);
  const rating = 40 + hashNum % 50;
  const productTypes = ["Organic Milk", "Whole Grain Bread", "Greek Yogurt", "Almond Butter", "Protein Bar"];
  const productIndex = hashNum % productTypes.length;
  const baseProduct = productTypes[productIndex] || "Generic Product";
  return {
    name: `${baseProduct} ${pHash.substring(0, 6)}`,
    description: `Analyzed ${baseProduct.toLowerCase()} product with pHash ${pHash}. ${rating >= 70 ? "High quality ingredients with minimal processing." : rating >= 50 ? "Good quality with some processed ingredients." : "Highly processed with multiple additives."}`,
    rating,
    ratingColor: rating >= 70 ? "#4caf50" : rating >= 50 ? "#ff9800" : "#f44336",
    ingredients: generateMockIngredients(rating, productIndex),
    concerns: rating < 60 ? generateMockConcerns(rating) : []
  };
}
function generateMockIngredients(rating, productType) {
  const baseIngredients = [
    {
      name: "Water",
      rating: "neutral",
      description: "Primary ingredient in most food products, provides hydration",
      benefits: ["Hydration", "Solvent for nutrients"],
      concerns: []
    }
  ];
  if (rating >= 70) {
    baseIngredients.push({
      name: "Organic Oats",
      rating: "good",
      description: "Whole grain oats rich in fiber and protein",
      benefits: ["Heart Health", "Fiber", "Sustained Energy"],
      concerns: []
    });
    baseIngredients.push({
      name: "Natural Vanilla Extract",
      rating: "good",
      description: "Pure vanilla extract from vanilla beans",
      benefits: ["Natural Flavoring", "Antioxidants"],
      concerns: []
    });
  } else if (rating >= 50) {
    baseIngredients.push({
      name: "Enriched Flour",
      rating: "neutral",
      description: "Wheat flour with added vitamins and minerals",
      benefits: ["Fortified Nutrients", "Energy"],
      concerns: ["Processed Grain"]
    });
    baseIngredients.push({
      name: "Natural Flavors",
      rating: "neutral",
      description: "Flavor compounds derived from natural sources",
      benefits: ["Taste Enhancement"],
      concerns: ["Vague Labeling"]
    });
  } else {
    baseIngredients.push({
      name: "High Fructose Corn Syrup",
      rating: "bad",
      description: "Processed sweetener linked to health concerns",
      benefits: ["Sweetness", "Preservation"],
      concerns: ["Blood Sugar Spikes", "Linked to Obesity"]
    });
    baseIngredients.push({
      name: "Artificial Colors",
      rating: "bad",
      description: "Synthetic food coloring agents",
      benefits: ["Visual Appeal"],
      concerns: ["Hyperactivity in Children", "Artificial Additives"]
    });
  }
  return baseIngredients;
}
function generateMockConcerns(rating) {
  const concerns = [];
  if (rating < 40) {
    concerns.push("High in artificial additives and preservatives");
    concerns.push("Contains multiple processed ingredients");
    concerns.push("High sugar content (>15g per serving)");
  } else if (rating < 60) {
    concerns.push("Contains some processed ingredients");
    concerns.push("Moderate sugar content");
  }
  return concerns;
}
async function createOrFindProduct(analysisData, db) {
  const productId = `prod-${crypto.randomUUID()}`;
  try {
    await run(
      db,
      `INSERT OR IGNORE INTO products (id, name, brand, analysis_generated, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId,
        analysisData.name,
        null,
        // Extract from AI if available in future
        true,
        (/* @__PURE__ */ new Date()).toISOString(),
        (/* @__PURE__ */ new Date()).toISOString()
      ]
    );
    return productId;
  } catch (error2) {
    console.error("Error creating product:", error2);
    throw new Error("Failed to create product record");
  }
}
async function parseAIAnalysis(visionResult) {
  return generateMockAnalysis(Math.random().toString(36).substring(7));
}
var init_aiAnalysis = __esm({
  "src/lib/aiAnalysis.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_db();
    __name(generateMockAnalysis, "generateMockAnalysis");
    __name(generateMockIngredients, "generateMockIngredients");
    __name(generateMockConcerns, "generateMockConcerns");
    __name(createOrFindProduct, "createOrFindProduct");
    __name(parseAIAnalysis, "parseAIAnalysis");
  }
});

// src/jobs/analysisWorker.ts
var analysisWorker_exports = {};
__export(analysisWorker_exports, {
  processAnalysisJob: () => processAnalysisJob
});
async function processAnalysisJob(msg, env, _ctx) {
  const { analysisId, pHash } = msg.body;
  const db = getDb(env);
  const existing = await query(
    db,
    `SELECT status FROM analysis_records WHERE analysis_id = ? LIMIT 1`,
    [analysisId]
  );
  if (!existing.length) {
    return;
  }
  const current = String(existing[0].status);
  if (current === "succeeded" || current === "failed") {
    return;
  }
  const latest = await query(
    db,
    `SELECT analysis_id, summary, etag, product_id, analysis_data_json
     FROM analysis_records
     WHERE phash = ? AND status = 'succeeded'
     ORDER BY updated_at DESC
     LIMIT 1`,
    [pHash]
  );
  if (latest.length) {
    const { product_id, summary, etag, analysis_data_json } = latest[0];
    await run(
      db,
      `UPDATE analysis_records
       SET status = 'succeeded', summary = ?, etag = ?, product_id = ?, analysis_data_json = ?, updated_at = ?
       WHERE analysis_id = ?`,
      [summary ?? null, etag ?? null, product_id ?? null, analysis_data_json ?? null, (/* @__PURE__ */ new Date()).toISOString(), analysisId]
    );
    return;
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await run(
    db,
    `UPDATE analysis_records SET status = 'processing', updated_at = ? WHERE analysis_id = ?`,
    [nowIso, analysisId]
  );
  const mcpConfigured = Boolean(env.MCP_CONTEXT7_ENDPOINT || env.MCP_SEQUENTIAL_ENDPOINT);
  const openaiConfigured = Boolean(env.OPENAI_API_KEY);
  let analysisData;
  let productId;
  try {
    if (!mcpConfigured || !openaiConfigured) {
      console.log(`Generating mock analysis for pHash: ${pHash}`);
      analysisData = generateMockAnalysis(pHash);
      productId = await createOrFindProduct(analysisData, db);
    } else {
      console.log(`Performing AI analysis for pHash: ${pHash}`);
      try {
        const visionResult = await requestGpt4oVision(env, {
          imageUrl: msg.body.image?.url ?? "about:blank",
          pHash
        });
        analysisData = await parseAIAnalysis(visionResult.summary || "");
        productId = await createOrFindProduct(analysisData, db);
      } catch (aiError) {
        console.warn("AI analysis failed, falling back to mock:", aiError);
        analysisData = generateMockAnalysis(pHash);
        productId = await createOrFindProduct(analysisData, db);
      }
    }
    const etag = await makeEtag({ analysisId, pHash, analysisData, schemaVersion: env.SCHEMA_VERSION }, env.ETAG_SALT);
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
        analysisData.description,
        // Keep summary for backward compatibility
        JSON.stringify(analysisData),
        productId,
        etag,
        (/* @__PURE__ */ new Date()).toISOString(),
        analysisId
      ]
    );
    console.log(`Analysis completed for ${analysisId}, created product ${productId}`);
  } catch (error2) {
    console.error("Analysis worker error:", error2);
    await run(
      db,
      `UPDATE analysis_records SET status = 'failed', updated_at = ? WHERE analysis_id = ?`,
      [(/* @__PURE__ */ new Date()).toISOString(), analysisId]
    );
  }
}
var init_analysisWorker = __esm({
  "src/jobs/analysisWorker.ts"() {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    init_db();
    init_etag();
    init_openai();
    init_aiAnalysis();
    __name(processAnalysisJob, "processAnalysisJob");
  }
});

// .wrangler/tmp/bundle-FBAqQq/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-FBAqQq/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.ts
init_checked_fetch();
init_modules_watch_stub();

// src/handlers/health.ts
init_checked_fetch();
init_modules_watch_stub();

// src/lib/responses.ts
init_checked_fetch();
init_modules_watch_stub();
function json(data, init) {
  const body = JSON.stringify(data);
  const headers = new Headers(init?.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(body, { status: init?.status ?? 200, headers });
}
__name(json, "json");
function error(code, message, status = 400, details) {
  return json(
    {
      error: {
        code,
        message,
        details: details || {}
      }
    },
    { status }
  );
}
__name(error, "error");
function notModified(etag) {
  const headers = new Headers();
  headers.set("ETag", etag);
  return new Response(null, { status: 304, headers });
}
__name(notModified, "notModified");

// src/handlers/health.ts
async function handleHealth(_req, env) {
  const body = {
    ok: true,
    service: "labelslayer-backend",
    version: env.API_VERSION || "0.0.0",
    schemaVersion: env.SCHEMA_VERSION || "0000",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  return json(body, { status: 200 });
}
__name(handleHealth, "handleHealth");

// src/handlers/analysis/byHash.ts
init_checked_fetch();
init_modules_watch_stub();
init_db();
init_etag();

// src/lib/r2.ts
init_checked_fetch();
init_modules_watch_stub();
async function getSignedUrl(env, key, ttlSeconds) {
  const expires = Math.floor(Date.now() / 1e3) + (ttlSeconds ?? Number(env.SIGNED_URL_TTL_SECONDS ?? 900));
  if (typeof env.R2_BUCKET.createSignedUrl === "function") {
    const signed = await env.R2_BUCKET.createSignedUrl(key, { method: "GET", expires });
    return signed.url;
  }
  const url = new URL(`https://r2.example/${encodeURIComponent(key)}`);
  url.searchParams.set("exp", String(expires));
  return url.toString();
}
__name(getSignedUrl, "getSignedUrl");

// src/handlers/analysis/byHash.ts
var PHASH_RE_STRICT = /^[a-f0-9]{16}$/;
var IDEM_TTL_SECONDS = 15 * 60;
async function getIdemKey(db, key) {
  const rows = await query(db, `SELECT key, response_status, response_body, last_seen_at FROM idempotency_keys WHERE key = ? LIMIT 1`, [key]);
  return rows[0] || null;
}
__name(getIdemKey, "getIdemKey");
async function upsertIdemKey(db, key, method, route, status, body) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body ?? null);
  await run(
    db,
    `INSERT INTO idempotency_keys (key, method, route, first_seen_at, last_seen_at, response_status, response_body)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET last_seen_at=excluded.last_seen_at, response_status=COALESCE(excluded.response_status, idempotency_keys.response_status), response_body=COALESCE(excluded.response_body, idempotency_keys.response_body)`,
    [key, method, route, now, now, status ?? null, bodyStr ?? null]
  );
}
__name(upsertIdemKey, "upsertIdemKey");
async function handleAnalysisByHash(req, env, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }
  const raw = String(body?.pHash || "");
  const pHash = raw.toLowerCase();
  if (!PHASH_RE_STRICT.test(pHash)) {
    return error("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
  }
  const db = getDb(env);
  const rows = await query(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, image_key, product_name, product_brand, product_upc, updated_at, analysis_data_json
     FROM v_latest_analysis_by_phash WHERE phash = ? LIMIT 1`,
    [pHash]
  );
  if (rows.length) {
    const r = rows[0];
    let analysisData;
    if (r.analysis_data_json) {
      try {
        analysisData = JSON.parse(r.analysis_data_json);
      } catch (parseError) {
        console.warn("Failed to parse analysis_data_json:", parseError);
        analysisData = void 0;
      }
    }
    const record = {
      analysisId: String(r.analysis_id),
      productId: r.product_id ? String(r.product_id) : null,
      pHash: String(r.phash),
      status: String(r.status),
      summary: r.summary ?? null,
      etag: r.etag ?? null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: r.updated_at ? String(r.updated_at) : (/* @__PURE__ */ new Date()).toISOString()
    };
    const etag = r.etag || await makeEtag(record, env.ETAG_SALT);
    const ifNone = req.headers.get("If-None-Match");
    if (ifNone && ifNone === etag) {
      return notModified(etag);
    }
    let signedImageUrl;
    if (r.image_key) {
      signedImageUrl = await getSignedUrl(env, String(r.image_key), Number(env.SIGNED_URL_TTL_SECONDS ?? 900));
    }
    const product = r.product_id ? {
      id: String(r.product_id),
      name: analysisData?.name || String(r.product_name ?? "Unknown"),
      brand: r.product_brand ?? null,
      upc: r.product_upc ?? null,
      imageKey: r.image_key ?? null
    } : null;
    const resp2 = {
      hit: true,
      record: {
        ...record,
        etag,
        analysisData
        // Add structured data to response
      },
      product: product ? {
        ...product,
        name: analysisData?.name || product.name || "Unknown Product"
      } : null,
      signedImageUrl: signedImageUrl ?? null
    };
    const res2 = json(resp2, { status: 200 });
    res2.headers.set("ETag", etag);
    res2.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
    return res2;
  }
  const idem = req.headers.get("Idempotency-Key") || void 0;
  if (idem) {
    const existing = await getIdemKey(db, idem);
    if (existing) {
      const ageSec = Math.floor((Date.now() - Date.parse(existing.last_seen_at)) / 1e3);
      if (ageSec < IDEM_TTL_SECONDS && existing.response_status) {
        const replayBody = existing.response_body ? JSON.parse(existing.response_body) : {};
        const res2 = json(replayBody, { status: Number(existing.response_status) });
        res2.headers.set("X-Idempotent-Replay", "1");
        res2.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
        return res2;
      }
    }
  }
  const analysisId = crypto.randomUUID();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await run(
    db,
    `INSERT OR IGNORE INTO image_signatures (phash, first_seen_at) VALUES (?, ?);`,
    [pHash, nowIso]
  );
  await run(
    db,
    `INSERT OR IGNORE INTO analysis_records (analysis_id, phash, status, summary, etag, created_at, updated_at)
     VALUES (?, ?, 'queued', NULL, NULL, ?, ?)`,
    [analysisId, pHash, nowIso, nowIso]
  );
  const job = { analysisId, pHash, r2Key: null };
  await env.ANALYSIS_QUEUE.send(job);
  const resp = {
    hit: false,
    jobId: analysisId,
    retryAfterSeconds: 3
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  if (idem) {
    await upsertIdemKey(db, idem, "POST", "/analysis/by-hash", 202, resp);
  }
  return res;
}
__name(handleAnalysisByHash, "handleAnalysisByHash");

// src/handlers/analysis/analyze.ts
init_checked_fetch();
init_modules_watch_stub();
init_db();
var PHASH_RE_STRICT2 = /^[a-f0-9]{16}$/;
async function handleAnalysisAnalyze(req, env, _ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }
  if (!body.imageUrl && !body.imageBase64) {
    return error("INVALID_INPUT", "Provide imageUrl or imageBase64", 400);
  }
  if (body.pHash) {
    const ph = String(body.pHash).toLowerCase();
    if (!PHASH_RE_STRICT2.test(ph)) {
      return error("INVALID_PHASH", "pHash must be exactly 16 lowercase hex chars", 400);
    }
    body.pHash = ph;
  }
  const db = getDb(env);
  const analysisId = crypto.randomUUID();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const pHash = (body.pHash || "unknown").toLowerCase();
  await run(
    db,
    `INSERT OR IGNORE INTO image_signatures (phash, first_seen_at) VALUES (?, ?);`,
    [pHash, nowIso]
  );
  await run(
    db,
    `INSERT OR IGNORE INTO analysis_records (analysis_id, phash, status, summary, etag, created_at, updated_at)
     VALUES (?, ?, 'queued', NULL, NULL, ?, ?)`,
    [analysisId, pHash, nowIso, nowIso]
  );
  const job = {
    analysisId,
    pHash,
    image: body.imageUrl ? { url: body.imageUrl } : { base64Size: body.imageBase64?.length ?? 0 }
  };
  await env.ANALYSIS_QUEUE.send(job);
  const resp = {
    analysisId,
    status: "queued",
    jobId: analysisId,
    retryAfterSeconds: 3
  };
  const res = json(resp, { status: 202 });
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  return res;
}
__name(handleAnalysisAnalyze, "handleAnalysisAnalyze");

// src/handlers/analysis/byProductId.ts
init_checked_fetch();
init_modules_watch_stub();
init_db();
init_etag();
async function handleAnalysisByProductId(req, env) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return error("INVALID_INPUT", "productId is required", 400);
  }
  const db = getDb(env);
  const rows = await query(
    db,
    `SELECT analysis_id, product_id, phash, status, summary, etag, updated_at, analysis_data_json
     FROM analysis_records
     WHERE product_id = ?
     ORDER BY updated_at DESC
     LIMIT 1`,
    [productId]
  );
  if (!rows.length) {
    return error("NOT_FOUND", "No analysis found for productId", 404);
  }
  const r = rows[0];
  let analysisData;
  if (r.analysis_data_json) {
    try {
      analysisData = JSON.parse(r.analysis_data_json);
    } catch (parseError) {
      console.warn("Failed to parse analysis_data_json:", parseError);
      analysisData = void 0;
    }
  }
  const record = {
    analysisId: String(r.analysis_id),
    productId: r.product_id ? String(r.product_id) : null,
    pHash: String(r.phash),
    status: String(r.status),
    summary: r.summary ?? null,
    etag: r.etag ?? null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: r.updated_at ? String(r.updated_at) : (/* @__PURE__ */ new Date()).toISOString()
  };
  const etag = r.etag || await makeEtag(record, env.ETAG_SALT);
  const ifNone = req.headers.get("If-None-Match");
  if (ifNone && ifNone === etag) {
    return notModified(etag);
  }
  const resp = {
    hit: true,
    record: {
      ...record,
      analysisData
    },
    etag
  };
  const res = json(resp, { status: 200 });
  res.headers.set("ETag", etag);
  res.headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  return res;
}
__name(handleAnalysisByProductId, "handleAnalysisByProductId");

// src/handlers/search.ts
init_checked_fetch();
init_modules_watch_stub();
init_db();
async function handleSearch(req, env) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 10), 50);
  if (!q) {
    return json({ results: [] }, { status: 200 });
  }
  const like = `%${q.replace(/%/g, "").replace(/_/g, "")}%`;
  const rows = await query(
    getDb(env),
    `SELECT id, name, brand, upc, image_key
     FROM products
     WHERE name LIKE ? OR brand LIKE ? OR upc LIKE ?
     LIMIT ?`,
    [like, like, like, limit]
  );
  const results = rows.map((r) => ({
    product: {
      id: String(r.id),
      name: String(r.name),
      brand: r.brand ?? null,
      upc: r.upc ?? null,
      imageKey: r.image_key ?? null
    },
    score: 0.5
    // simple placeholder score for LIKE-based search
  }));
  return json({ results }, { status: 200 });
}
__name(handleSearch, "handleSearch");

// src/handlers/history.ts
init_checked_fetch();
init_modules_watch_stub();
init_db();
async function handleHistory(req, env) {
  let body;
  try {
    body = await req.json();
  } catch {
    return error("BAD_JSON", "Invalid JSON body", 400);
  }
  const events = Array.isArray(body?.events) ? body.events : [];
  if (!events.length) {
    return json({ accepted: 0 }, { status: 202 });
  }
  const db = getDb(env);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
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
          nowIso
        ]
      );
      accepted += 1;
    } catch {
    }
  }
  return json({ accepted }, { status: 202 });
}
__name(handleHistory, "handleHistory");

// src/lib/rateLimit.ts
init_checked_fetch();
init_modules_watch_stub();
var memoryBuckets = /* @__PURE__ */ new Map();
function getClientKey(req) {
  const ip = req.headers.get("cf-connecting-ip") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";
  return `${ip}:${ua.slice(0, 32)}`;
}
__name(getClientKey, "getClientKey");
async function withRateLimit(req, env, next) {
  const limit = Number(env.RATE_LIMIT_MAX_MINUTE ?? 120);
  const key = getClientKey(req);
  const now = Date.now();
  const minute = 60 * 1e3;
  let bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + minute };
    memoryBuckets.set(key, bucket);
  }
  if (bucket.count >= limit) {
    const headers2 = {
      "RateLimit-Limit": limit,
      "RateLimit-Remaining": Math.max(0, limit - bucket.count),
      "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1e3)
    };
    return new Response(
      JSON.stringify({
        error: {
          code: "RATE_LIMITED",
          message: "Too Many Requests",
          details: {}
        }
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "RateLimit-Limit": String(headers2["RateLimit-Limit"]),
          "RateLimit-Remaining": String(headers2["RateLimit-Remaining"]),
          "RateLimit-Reset": String(headers2["RateLimit-Reset"])
        }
      }
    );
  }
  bucket.count += 1;
  const headers = {
    "RateLimit-Limit": limit,
    "RateLimit-Remaining": Math.max(0, limit - bucket.count),
    "RateLimit-Reset": Math.ceil((bucket.resetAt - now) / 1e3)
  };
  return next(headers);
}
__name(withRateLimit, "withRateLimit");

// src/index.ts
function addCorsHeaders(resp, env) {
  const headers = new Headers(resp.headers);
  const allowOrigin = env.CORS_ALLOW_ORIGIN || "*";
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,If-None-Match,Idempotency-Key");
  headers.set("Access-Control-Expose-Headers", "ETag,RateLimit-Limit,RateLimit-Remaining,RateLimit-Reset,X-Schema-Version");
  if (!headers.has("X-Schema-Version") && env.SCHEMA_VERSION) {
    headers.set("X-Schema-Version", env.SCHEMA_VERSION);
  }
  return new Response(resp.body, { status: resp.status, headers });
}
__name(addCorsHeaders, "addCorsHeaders");
function errJson(code, message, status = 400, env, details) {
  const resp = error(code, message, status, details);
  return env ? addCorsHeaders(resp, env) : resp;
}
__name(errJson, "errJson");
var src_default = {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return addCorsHeaders(new Response(null, { status: 204 }), env);
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    const rateLimited = /* @__PURE__ */ __name(async (handler) => {
      return withRateLimit(request, env, async (rateHeaders) => {
        const res = await handler();
        const headers = new Headers(res.headers);
        for (const [k, v] of Object.entries(rateHeaders)) {
          headers.set(k, String(v));
        }
        if (!headers.has("X-Schema-Version") && env.SCHEMA_VERSION) {
          headers.set("X-Schema-Version", env.SCHEMA_VERSION);
        }
        return new Response(res.body, { status: res.status, headers });
      });
    }, "rateLimited");
    try {
      if (method === "GET" && path === "/health") {
        return rateLimited(async () => addCorsHeaders(await handleHealth(request, env), env));
      }
      if (path === "/analysis/by-hash" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByHash(request, env, ctx), env));
      }
      if (path === "/analysis/analyze" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisAnalyze(request, env, ctx), env));
      }
      if (path === "/analysis/by-product-id" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleAnalysisByProductId(request, env), env));
      }
      if (path === "/search" && method === "GET") {
        return rateLimited(async () => addCorsHeaders(await handleSearch(request, env), env));
      }
      if (path === "/history" && method === "POST") {
        return rateLimited(async () => addCorsHeaders(await handleHistory(request, env), env));
      }
      return addCorsHeaders(
        errJson("NOT_FOUND", `Route ${method} ${path} not found`, 404, env),
        env
      );
    } catch (e) {
      const msg = e && e.message ? e.message : "Unexpected error";
      const resp = errJson("INTERNAL_ERROR", msg, 500, env);
      return addCorsHeaders(resp, env);
    }
  },
  // Queue consumer (analysis jobs)
  async queue(batch, env, ctx) {
    const { processAnalysisJob: processAnalysisJob2 } = await Promise.resolve().then(() => (init_analysisWorker(), analysisWorker_exports));
    for (const msg of batch.messages) {
      try {
        await processAnalysisJob2(msg, env, ctx);
        msg.ack();
      } catch (err) {
        msg.retry();
      }
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-FBAqQq/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-FBAqQq/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
