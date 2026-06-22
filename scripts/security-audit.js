/**
 * Phase 4B.14 - Security Hardening Stress Tests
 * Purpose: Test security vulnerabilities and attempt unauthorized access
 * 
 * Usage:
 * node scripts/security-audit.js
 */

const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test results
const results = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  vulnerabilities: [],
};

/**
 * Make HTTP request
 */
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Security test scenarios
 */
const securityTests = [
  {
    name: 'Unauthorized Report Access',
    description: 'Attempt to access report without authentication',
    severity: 'CRITICAL',
    test: async () => {
      try {
        const response = await makeRequest('/api/reports/test-id');
        if (response.statusCode === 401) {
          return { passed: true, message: 'Correctly returned 401' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
  {
    name: 'Unauthorized Upload Attempt',
    description: 'Attempt upload without authentication',
    severity: 'CRITICAL',
    test: async () => {
      try {
        const response = await makeRequest('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'data' }),
        });
        if (response.statusCode === 401) {
          return { passed: true, message: 'Correctly returned 401' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
  {
    name: 'Payment Bypass Attempt',
    description: 'Attempt export without payment',
    severity: 'CRITICAL',
    test: async () => {
      try {
        const response = await makeRequest('/api/export/test-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skipPayment: true }),
        });
        if (response.statusCode === 401 || response.statusCode === 403) {
          return { passed: true, message: 'Payment bypass blocked' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
  {
    name: 'RLS Policy Bypass',
    description: 'Attempt cross-user data access',
    severity: 'CRITICAL',
    test: async () => {
      try {
        const response = await makeRequest('/api/profiles/all');
        if (response.statusCode === 401 || response.statusCode === 403) {
          return { passed: true, message: 'RLS protection active' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
  {
    name: 'SQL Injection',
    description: 'Attempt SQL injection',
    severity: 'CRITICAL',
    test: async () => {
      try {
        const payload = { email: "test' OR '1'='1", password: 'test' };
        const response = await makeRequest('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.statusCode === 401 || response.statusCode === 400) {
          return { passed: true, message: 'SQL injection blocked' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
  {
    name: 'XSS Attempt',
    description: 'Attempt XSS attack',
    severity: 'HIGH',
    test: async () => {
      try {
        const payload = { message: '<script>alert(1)</script>' };
        const response = await makeRequest('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.statusCode === 401 || response.statusCode === 400) {
          return { passed: true, message: 'XSS blocked' };
        }
        return { passed: false, message: `Returned ${response.statusCode}` };
      } catch (error) {
        return { passed: false, message: error.message };
      }
    },
  },
];

/**
 * Run security tests
 */
async function runSecurityTests() {
  console.log('=== Security Hardening Stress Tests ===\n');
  console.log(`Testing: ${BASE_URL}\n`);

  for (const test of securityTests) {
    results.totalTests++;
    console.log(`Testing: ${test.name} [${test.severity}]`);
    console.log(`Description: ${test.description}`);
    
    const result = await test.test();
    
    if (result.passed) {
      results.passedTests++;
      console.log(`✅ PASS: ${result.message}\n`);
    } else {
      results.failedTests++;
      results.vulnerabilities.push({
        name: test.name,
        severity: test.severity,
        message: result.message,
      });
      console.log(`❌ FAIL: ${result.message}\n`);
    }
  }

  printResults();
}

/**
 * Print results
 */
function printResults() {
  console.log('\n=== Security Audit Results ===');
  console.log(`Total Tests: ${results.totalTests}`);
  console.log(`Passed: ${results.passedTests}`);
  console.log(`Failed: ${results.failedTests}`);
  
  if (results.vulnerabilities.length > 0) {
    console.log('\n--- Vulnerabilities Found ---');
    results.vulnerabilities.forEach(vuln => {
      console.log(`[${vuln.severity}] ${vuln.name}: ${vuln.message}`);
    });
  }

  console.log('\n--- Success Criteria ---');
  console.log(`0 payment bypasses: ${results.vulnerabilities.filter(v => v.name.includes('Payment')).length === 0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`0 critical RLS vulnerabilities: ${results.vulnerabilities.filter(v => v.severity === 'CRITICAL').length === 0 ? '✅ PASS' : '❌ FAIL'}`);
}

// Run tests
runSecurityTests().catch(console.error);
