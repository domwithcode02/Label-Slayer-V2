#!/usr/bin/env node

/**
 * Phase 4 Configuration Validation - Backend Tests
 *
 * This script validates that the backend is properly configured and accessible
 * for Phase 4 integration with the frontend, including testing requirements.
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuration
const BACKEND_URL = 'http://127.0.0.1:8787';
const HEALTH_ENDPOINT = `${BACKEND_URL}/health`;
const TIMEOUT_MS = 10000;
const TEST_RUNNER_PATH = path.join(__dirname, '../tests/run-tests.ts');

// Test results tracking
let totalTests = 0;
let passedTests = 0;
const results = [];

function logResult(testName, passed, details = null, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`✅ ${testName}`);
  } else {
    console.log(`❌ ${testName}`);
    if (details) console.log(`   Details: ${details}`);
    if (error) console.log(`   Error: ${error.message}`);
  }
  
  results.push({
    test: testName,
    passed,
    details: details || (error ? error.message : null)
  });
}

function makeRequest(url, options = {}) {
  // ... existing implementation unchanged ...
}

// ... existing validation functions unchanged ...

// Phase 4: Run integration tests
async function runIntegrationTests() {
  try {
    console.log('Running Phase 4 integration tests...');
    execSync('npm run test', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    logResult('Phase 4 Integration Tests', true);
  } catch (error) {
    logResult('Phase 4 Integration Tests', false, 'Integration tests failed', error);
  }
}

// Phase 4: Worker monitoring test
async function testWorkerMonitoring() {
  try {
    // Trigger a test job
    await makeRequest(`${BACKEND_URL}/analysis/analyze`, {
      method: 'POST',
      body: JSON.stringify({
        pHash: "monitor_test_" + Date.now(),
        mimeType: "image/jpeg",
        imageBase64: "dGVzdF9kYXRh"
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Check worker logs for processing indication
    await new Promise(resolve => setTimeout(resolve, 2000));
    const logs = execSync('grep -r "Processing analysis" ../.wrangler/logs', { encoding: 'utf8' });
    
    if (logs.includes('Processing analysis')) {
      logResult('Worker Log Monitoring', true);
    } else {
      logResult('Worker Log Monitoring', false, 'Worker logs do not show processing activity');
    }
  } catch (error) {
    logResult('Worker Log Monitoring', false, 'Worker monitoring test failed', error);
  }
}

// Phase 4: Performance benchmark test
async function testPerformanceBenchmarks() {
  try {
    const start = Date.now();
    const { res } = await makeRequest(HEALTH_ENDPOINT, { method: 'GET' });
    const latency = Date.now() - start;
    
    if (latency < 100) {
      logResult('Performance Benchmark (Health)', true, `Latency: ${latency}ms`);
    } else {
      logResult('Performance Benchmark (Health)', false, `High latency: ${latency}ms`);
    }
  } catch (error) {
    logResult('Performance Benchmark (Health)', false, 'Performance test failed', error);
  }
}

async function main() {
  console.log('🔍 LabelSlayer Phase 4 Configuration Validation - Backend Tests');
  console.log('=' .repeat(70));
  console.log(`Testing backend at: ${BACKEND_URL}`);
  console.log(`Health endpoint: ${HEALTH_ENDPOINT}`);
  console.log('');
  
  // Core connectivity and health checks
  const healthResponse = await testBackendConnectivity();
  const healthData = await testHealthEndpointStructure(healthResponse);
  
  // CORS validation
  await testCORSHeaders(healthResponse);
  await testCORSPreflight();
  
  // Header validation
  await testRateLimitHeaders(healthResponse);
  await testSchemaVersionHeader(healthResponse);
  
  // API endpoint validation
  await testAPIEndpoints();
  
  // Error handling validation
  await testInvalidRoute();
  
  // Phase 4 specific tests
  await testWorkerMonitoring();
  await testPerformanceBenchmarks();
  await runIntegrationTests();
  
  // Summary
  console.log('');
  console.log('=' .repeat(70));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
  
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('');
    console.log('❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`   - ${test.test}`);
      if (test.details) console.log(`     ${test.details}`);
    });
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure backend is running: cd backend && npm run dev');
    console.log('   2. Check that backend is accessible at http://127.0.0.1:8787');
    console.log('   3. Verify wrangler.toml configuration');
    console.log('   4. Check that all required secrets are set');
    
    process.exit(1);
  } else {
    console.log('');
    console.log('✅ All backend validation tests passed!');
    console.log('');
    console.log('🎯 Backend Configuration Summary:');
    if (healthData) {
      console.log(`   - Service: ${healthData.service}`);
      console.log(`   - Version: ${healthData.version}`);
      console.log(`   - Schema: ${healthData.schemaVersion}`);
      console.log(`   - CORS: Enabled for development`);
      console.log(`   - Rate Limiting: Active`);
    }
    console.log('');
    console.log('➡️  Backend is ready for production!');
    console.log('    Run deployment: npm run deploy');
    
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

module.exports = { main, makeRequest, BACKEND_URL };