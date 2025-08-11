// Import helper functions from run-tests
import { 
  postJson as backendPostJson, 
  getJson as backendGetJson, 
  assert as backendAssert, 
  sleep as backendSleep 
} from './run-tests';

const BASE = process.env.API_BASE_URL || "http://127.0.0.1:8787";

// Wrapper functions that work with current module system
const postJson = backendPostJson as (path: string, body: any, headers?: Record<string, string>) => Promise<any>;
const getJson = backendGetJson as (path: string, headers?: Record<string, string>) => Promise<any>;
const assert = backendAssert as (cond: any, msg: string) => void;
const sleep = backendSleep as (ms: number) => Promise<void>;

// Phase 4: Integration tests
async function runIntegrationTests() {
  console.log("Starting Phase 4 integration tests...");
  
  // Test 1: Complete pipeline functionality
  console.log("Testing complete pipeline...");
  const pHash = "integration_test_" + Date.now();
  const productId = "test_product_" + Date.now();
  
  // Initiate analysis
  const { res: analyzeRes, json: analyzeJson } = await postJson("/analysis/analyze", {
    pHash,
    mimeType: "image/jpeg",
    imageBase64: "dGVzdF9kYXRh",
    productId
  });
  assert(analyzeRes.status === 202, `Expected 202, got ${analyzeRes.status}`);
  
  // Wait for processing
  let status = "queued";
  let record: any;
  const startTime = Date.now();
  while (status !== "succeeded" && Date.now() - startTime < 30000) {
    await sleep(500);
    const { json } = await postJson("/analysis/by-hash", { pHash });
    status = json?.record?.status || "queued";
    record = json?.record;
  }
  
  assert(status === "succeeded", "Analysis processing failed");
  
  // Test 2: Data consistency across endpoints
  console.log("Testing data consistency...");
  
  // Verify by-hash endpoint
  const { json: byHashJson } = await postJson("/analysis/by-hash", { pHash });
  assert(byHashJson.record?.id === record.id, "Record ID mismatch");
  
  // Verify by-product-id endpoint
  const { json: byProductIdJson } = await getJson(`/analysis/by-product-id?productId=${productId}`);
  assert(byProductIdJson.record?.id === record.id, "Record ID mismatch");
  
  // Test 3: System behavior under load
  console.log("Testing under load...");
  const requests = Array(10).fill(0).map((_, i) => 
    postJson("/analysis/analyze", {
      pHash: `load_test_${i}_${Date.now()}`,
      mimeType: "image/jpeg",
      imageBase64: "dGVzdF9kYXRh"
    })
  );
  
  const results = await Promise.all(requests);
  const successCount = results.filter(result => result.res.status === 202).length;
  assert(successCount >= 8, `Only ${successCount}/10 requests succeeded`);
  
  // Test 4: Cache behavior
  console.log("Testing cache behavior...");
  
  // First request (should miss cache)
  const cacheStart = Date.now();
  const { res: firstRes } = await postJson("/analysis/by-hash", { pHash });
  const firstTime = Date.now() - cacheStart;
  assert(firstRes.status === 200, "First request failed");
  
  // Second request (should hit cache)
  const cacheStart2 = Date.now();
  const { res: secondRes } = await postJson("/analysis/by-hash", { pHash });
  const secondTime = Date.now() - cacheStart2;
  assert(secondRes.status === 200, "Second request failed");
  
  // Verify cache hit is faster
  assert(secondTime < firstTime * 0.5, `Cache not effective (${secondTime}ms vs ${firstTime}ms)`);
  
  console.log("✅ All integration tests passed");
}

(async function() {
  try {
    await runIntegrationTests();
    process.exit(0);
  } catch (e: any) {
    console.error("Integration tests failed:", e?.message || e);
    process.exit(1);
  }
})();