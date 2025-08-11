const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Phase 4 Validation');
console.log('===========================');

try {
  // Run backend tests
  console.log('Running backend tests...');
  execSync('npm test', { stdio: 'inherit' });

  // Run frontend tests
  console.log('Running frontend tests...');
  const frontendDir = path.join(__dirname, '../LabelSlayer');
  execSync('npm run validate:phase4', { cwd: frontendDir, stdio: 'inherit' });

  // Run integration tests
  console.log('Running integration tests...');
  const integrationTestFile = path.join(__dirname, './tests/integration-tests.js');
  if (fs.existsSync(integrationTestFile)) {
    execSync(`tsx ${integrationTestFile}`, { stdio: 'inherit' });
  } else {
    console.log('⚠️ Integration tests not found');
  }

  console.log('✅ All Phase 4 tests passed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Phase 4 validation failed');
  process.exit(1);
}