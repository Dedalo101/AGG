#!/usr/bin/env node

/**
 * Setup validation script for Playwright tests
 * Checks if the environment is properly configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating Playwright test setup...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function check(name, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      console.log(`✅ ${name}`);
      checks.passed++;
    } else if (result === 'warning') {
      console.log(`⚠️  ${name}`);
      checks.warnings++;
    } else {
      console.log(`❌ ${name}`);
      checks.failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    checks.failed++;
  }
}

// Check Node.js version
check('Node.js version >= 16', () => {
  const version = process.version.match(/^v(\d+)\./)[1];
  if (parseInt(version) < 16) {
    throw new Error(`Node.js ${version} found, but >= 16 required`);
  }
});

// Check package.json exists
check('package.json exists', () => {
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }
});

// Check Playwright dependencies
check('@playwright/test is installed', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.devDependencies || !pkg.devDependencies['@playwright/test']) {
    throw new Error('Run: npm install');
  }
});

// Check if node_modules exists
check('node_modules directory exists', () => {
  if (!fs.existsSync('node_modules')) {
    throw new Error('Run: npm install');
  }
});

// Check Playwright config
check('playwright.config.ts exists', () => {
  if (!fs.existsSync('playwright.config.ts')) {
    throw new Error('playwright.config.ts not found');
  }
});

// Check tests directory
check('tests directory exists', () => {
  if (!fs.existsSync('tests')) {
    throw new Error('tests directory not found');
  }
});

// Check test files
check('Test files exist', () => {
  const testFiles = [
    'tests/multi-language.spec.ts',
    'tests/seo-metadata.spec.ts',
    'tests/language-switcher.spec.ts',
    'tests/accessibility-responsive.spec.ts'
  ];
  
  const missing = testFiles.filter(f => !fs.existsSync(f));
  if (missing.length > 0) {
    throw new Error(`Missing: ${missing.join(', ')}`);
  }
});

// Check language versions exist
check('Language versions exist', () => {
  const langFiles = [
    'index.html',
    'en/index.html',
    'es/index.html',
    'nl/index.html'
  ];
  
  const missing = langFiles.filter(f => !fs.existsSync(f));
  if (missing.length > 0) {
    return 'warning';
  }
});

// Check Python availability
check('Python 3 is available', () => {
  try {
    const version = execSync('python3 --version', { encoding: 'utf8' });
    if (!version.includes('Python 3')) {
      return 'warning';
    }
  } catch (error) {
    return 'warning';
  }
});

// Check if browsers are installed
check('Playwright browsers installed', () => {
  const browserDir = path.join(
    require('os').homedir(),
    '.cache',
    'ms-playwright'
  );
  
  if (!fs.existsSync(browserDir)) {
    console.log('   ℹ️  Run: npm run test:install');
    return 'warning';
  }
  
  const browsers = fs.readdirSync(browserDir);
  const hasChromium = browsers.some(b => b.includes('chromium'));
  
  if (!hasChromium) {
    console.log('   ℹ️  Run: npm run test:install');
    return 'warning';
  }
});

// Check .gitignore
check('.gitignore configured', () => {
  if (!fs.existsSync('.gitignore')) {
    return 'warning';
  }
  
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const required = ['test-results/', 'playwright-report/'];
  const missing = required.filter(r => !gitignore.includes(r));
  
  if (missing.length > 0) {
    return 'warning';
  }
});

// Check GitHub Actions workflow
check('GitHub Actions workflow exists', () => {
  if (!fs.existsSync('.github/workflows/playwright.yml')) {
    return 'warning';
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('Summary:');
console.log(`  ✅ Passed: ${checks.passed}`);
console.log(`  ⚠️  Warnings: ${checks.warnings}`);
console.log(`  ❌ Failed: ${checks.failed}`);
console.log('='.repeat(50) + '\n');

if (checks.failed > 0) {
  console.log('❌ Setup validation failed!');
  console.log('   Please fix the errors above before running tests.\n');
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('⚠️  Setup has warnings.');
  console.log('   The setup should work, but consider addressing warnings.\n');
  
  console.log('💡 Quick fixes:');
  console.log('   • Install browsers: npm run test:install');
  console.log('   • Install Python 3: apt-get install python3 (or brew install python3)\n');
  
  console.log('✨ You can run tests with: npm test\n');
} else {
  console.log('✅ All checks passed!');
  console.log('   Your Playwright test setup is ready.\n');
  
  console.log('💡 Next steps:');
  console.log('   • Run tests: npm test');
  console.log('   • Interactive mode: npm run test:ui');
  console.log('   • View this guide: cat TESTING.md\n');
}
