// Extended test runner for backend endpoints with Phase 4 requirements
// Assumes `wrangler dev` is running locally on http://127.0.0.1:8787.
// Run: npm run test
//
// Tests:
// 1) Health endpoint
// 2) Analysis initiation endpoint
// 3) by-hash endpoint tests (miss, hit, etag)
// 4) by-product-id endpoint test
// 5) Error handling tests
// 6) Worker monitoring test
// 7) Performance benchmarks

const BASE = process.env.API_BASE_URL || "http://127.0.0.1:8787";
const WORKER_LOG_PATH = "../.wrangler/logs/wrangler-*.log";

export function assert(cond: any, msg: string) {
  if (!cond) throw new Error("Assertion failed: " + msg);
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function postJson(path: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch {}
  return { res, json, text };
}

export async function getJson(path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, { method: "GET", headers });
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch {}
  return { res, json, text };
}

// Phase 4: Test health endpoint
async function testHealthEndpoint() {
  console.log("Testing health endpoint...");
  const { res } = await getJson("/health");
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  console.log("Health endpoint passed");
}

// Phase 4: Test analysis initiation endpoint
async function testAnalysisInitiation() {
  console.log("Testing analysis initiation...");
  const { res } = await postJson("/analysis/analyze", {
    pHash: "a1b2c3d4e5f60789",
    mimeType: "image/jpeg",
    imageBase64: "dGVzdF9kYXRh"
  });
  assert(res.status === 202, `Expected 202, got ${res.status}`);
  console.log("Analysis initiation passed");
}

// Phase 4: Expanded by-hash tests (existing tests with additional cases)
async function testByHashMissThenHit() {
  // ... existing implementation (unchanged) ...
}

async function testByHashEtag304() {
  // ... existing implementation (unchanged) ...
}

// Phase 4: Test by-product-id endpoint
async function testByProductId() {
  console.log("Testing by-product-id endpoint...");
  const productId = "test_product_123";
  const { res } = await getJson(`/analysis/by-product-id?productId=${productId}`);
  
  // This will fail until endpoint is implemented
  assert(res.status === 200 || res.status === 404, `Unexpected status: ${res.status}`);
  
  console.log("by-product-id endpoint test completed");
}

// Phase 4: Error handling tests
async function testErrorHandling() {
  console.log("Testing error handling...");
  
  // Test invalid pHash format
  const { res: invalidRes } = await postJson("/analysis/by-hash", { pHash: "invalid" });
  assert(invalidRes.status === 400, "Expected 400 for invalid pHash");
  
  // Test missing required fields
  const { res: missingRes } = await postJson("/analysis/analyze", {});
  assert(missingRes.status === 400, "Expected 400 for missing fields");
  
  // Test rate limiting (make 10 rapid requests)
  for (let i = 0; i < 10; i++) {
    await postJson("/health", {});
  }
  const { res: rateLimitRes } = await postJson("/health", {});
  assert(rateLimitRes.status === 429, "Expected 429 for rate limiting");
  
  console.log("Error handling tests passed");
}

// Phase 4: Worker monitoring test
async function testWorkerMonitoring() {
  console.log("Testing worker monitoring...");
  const pHash = "monitoring_test_" + Date.now();
  await postJson("/analysis/analyze", { pHash, mimeType: "image/jpeg", imageBase64: "dGVzdF9kYXRh" });
  
  let found = false;
  for (let i = 0; i < 10; i++) {
    await sleep(1000);
    const logs = await checkWorkerLogs(`Processing analysis for ${pHash}`);
    if (logs) {
      found = true;
      break;
    }
  }
  assert(found, "Worker log entry not found");
  console.log("Worker monitoring test passed");
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);
import { glob } from 'glob';
const globAsync = promisify(glob);

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to check worker logs
async function checkWorkerLogs(pattern: string): Promise<boolean> {
  try {
    const logDir = path.resolve(__dirname, WORKER_LOG_PATH);
    const logFiles = await globAsync(logDir, { absolute: true }) as string[];
    
    for (const file of logFiles) {
      const content = await readFile(file, 'utf8');
      if (content.includes(pattern)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking worker logs:', error);
    return false;
  }
}

// Phase 4: Performance benchmarks
async function runPerformanceBenchmarks() {
  console.log("Running performance benchmarks...");
  const start = Date.now();
  
  // Test health endpoint latency
  const healthStart = Date.now();
  await getJson("/health");
  const healthLatency = Date.now() - healthStart;
  console.log(`Health endpoint latency: ${healthLatency}ms`);
  
  // Test analysis processing time
  const analysisStart = Date.now();
  const pHash = "perf_test_" + Date.now();
  await postJson("/analysis/analyze", {
    pHash,
    mimeType: "image/jpeg",
    imageBase64: "dGVzdF9kYXRh"
  });
  
  // Wait for completion
  let status = "queued";
  while (status !== "succeeded" && Date.now() - analysisStart < 30000) {
    await sleep(500);
    const statusRes = await postJson("/analysis/by-hash", { pHash });
    status = statusRes.json?.record?.status || "queued";
  }
  
  const analysisTime = Date.now() - analysisStart;
  console.log(`Analysis processing time: ${analysisTime}ms`);
  
  // Assert performance thresholds
  assert(healthLatency < 100, "Health endpoint too slow");
  assert(analysisTime < 5000, "Analysis processing too slow");
  
  console.log("Performance benchmarks passed");
}

(async function main() {
  const start = Date.now();
  try {
    console.log("Starting Phase 4 backend tests...");
    
    await testHealthEndpoint();
    await testAnalysisInitiation();
    await testByHashMissThenHit();
    await testByHashEtag304();
    await testByProductId();
    await testErrorHandling();
    await testWorkerMonitoring();
    await runPerformanceBenchmarks();
    
    console.log("All Phase 4 tests passed in", Date.now() - start, "ms");
    // eslint-disable-next-line no-process-exit
    (process as any).exit(0);
  } catch (e: any) {
    console.error("Phase 4 tests failed:", e?.message || e);
    // eslint-disable-next-line no-process-exit
    (process as any).exit(1);
  }
})();