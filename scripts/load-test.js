/**
 * Phase 4B.14 - Load Testing Scripts
 * Purpose: Simulate 50, 100, and 250 concurrent users to test system performance
 * 
 * Usage:
 * node scripts/load-test.js 50    # Test with 50 users
 * node scripts/load-test.js 100   # Test with 100 users
 * node scripts/load-test.js 250   # Test with 250 users
 */

const http = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.argv[2]) || 50;
const REQUESTS_PER_USER = 10;
const TOTAL_REQUESTS = CONCURRENT_USERS * REQUESTS_PER_USER;

// Metrics tracking
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  startTime: null,
  endTime: null,
};

// Test scenarios
const scenarios = [
  {
    name: 'Dashboard Load',
    path: '/dashboard',
    method: 'GET',
    weight: 0.3, // 30% of traffic
  },
  {
    name: 'Reports List',
    path: '/dashboard/reports',
    method: 'GET',
    weight: 0.2, // 20% of traffic
  },
  {
    name: 'Logbook List',
    path: '/dashboard/logbook',
    method: 'GET',
    weight: 0.2, // 20% of traffic
  },
  {
    name: 'Profile View',
    path: '/dashboard/settings',
    method: 'GET',
    weight: 0.15, // 15% of traffic
  },
  {
    name: 'API - Reports',
    path: '/api/reports',
    method: 'GET',
    weight: 0.1, // 10% of traffic
  },
  {
    name: 'API - Logbooks',
    path: '/api/logbooks',
    method: 'GET',
    weight: 0.05, // 5% of traffic
  },
];

/**
 * Make HTTP request
 */
function makeRequest(scenario) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const url = new URL(scenario.path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: scenario.method,
      headers: {
        'User-Agent': 'Vemiq-LoadTest/1.0',
        'Accept': 'application/json',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        metrics.totalRequests++;
        metrics.responseTimes.push(responseTime);

        if (res.statusCode >= 200 && res.statusCode < 400) {
          metrics.successfulRequests++;
        } else {
          metrics.failedRequests++;
          metrics.errors.push({
            scenario: scenario.name,
            statusCode: res.statusCode,
            responseTime,
          });
        }

        resolve({
          success: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          responseTime,
        });
      });
    });

    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      metrics.totalRequests++;
      metrics.responseTimes.push(responseTime);
      metrics.failedRequests++;
      metrics.errors.push({
        scenario: scenario.name,
        error: error.message,
        responseTime,
      });

      resolve({
        success: false,
        error: error.message,
        responseTime,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      metrics.totalRequests++;
      metrics.responseTimes.push(responseTime);
      metrics.failedRequests++;
      metrics.errors.push({
        scenario: scenario.name,
        error: 'Timeout',
        responseTime,
      });

      resolve({
        success: false,
        error: 'Timeout',
        responseTime,
      });
    });

    req.end();
  });
}

/**
 * Select random scenario based on weights
 */
function selectScenario() {
  const random = Math.random();
  let cumulative = 0;
  
  for (const scenario of scenarios) {
    cumulative += scenario.weight;
    if (random <= cumulative) {
      return scenario;
    }
  }
  
  return scenarios[0];
}

/**
 * Simulate user behavior
 */
async function simulateUser(userId) {
  const userMetrics = {
    userId,
    requests: 0,
    successful: 0,
    failed: 0,
    totalTime: 0,
  };

  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const scenario = selectScenario();
    const result = await makeRequest(scenario);
    
    userMetrics.requests++;
    userMetrics.totalTime += result.responseTime;
    
    if (result.success) {
      userMetrics.successful++;
    } else {
      userMetrics.failed++;
    }

    // Random delay between requests (100-1000ms)
    await new Promise(resolve => 
      setTimeout(resolve, 100 + Math.random() * 900)
    );
  }

  return userMetrics;
}

/**
 * Calculate statistics
 */
function calculateStats() {
  const responseTimes = metrics.responseTimes.sort((a, b) => a - b);
  const total = responseTimes.length;
  
  if (total === 0) {
    return {
      avg: 0,
      median: 0,
      p95: 0,
      p99: 0,
      min: 0,
      max: 0,
    };
  }

  const sum = responseTimes.reduce((a, b) => a + b, 0);
  const avg = sum / total;
  const median = responseTimes[Math.floor(total / 2)];
  const p95 = responseTimes[Math.floor(total * 0.95)];
  const p99 = responseTimes[Math.floor(total * 0.99)];
  const min = responseTimes[0];
  const max = responseTimes[total - 1];

  return { avg, median, p95, p99, min, max };
}

/**
 * Print results
 */
function printResults() {
  const duration = (metrics.endTime - metrics.startTime) / 1000; // seconds
  const stats = calculateStats();
  const successRate = (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(2);
  const errorRate = (metrics.failedRequests / metrics.totalRequests * 100).toFixed(2);
  const requestsPerSecond = (metrics.totalRequests / duration).toFixed(2);

  console.log('\n=== Load Test Results ===');
  console.log(`Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`Total Requests: ${metrics.totalRequests}`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Requests/Second: ${requestsPerSecond}`);
  console.log('\n--- Success Rate ---');
  console.log(`Successful: ${metrics.successfulRequests} (${successRate}%)`);
  console.log(`Failed: ${metrics.failedRequests} (${errorRate}%)`);
  console.log('\n--- Response Times (ms) ---');
  console.log(`Average: ${stats.avg.toFixed(2)}`);
  console.log(`Median: ${stats.median.toFixed(2)}`);
  console.log(`P95: ${stats.p95.toFixed(2)}`);
  console.log(`P99: ${stats.p99.toFixed(2)}`);
  console.log(`Min: ${stats.min.toFixed(2)}`);
  console.log(`Max: ${stats.max.toFixed(2)}`);
  
  if (metrics.errors.length > 0) {
    console.log('\n--- Top Errors ---');
    const errorCounts = {};
    metrics.errors.forEach(error => {
      const key = error.error || error.statusCode;
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    });
    
    Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([error, count]) => {
        console.log(`${error}: ${count} occurrences`);
      });
  }

  console.log('\n--- Success Criteria ---');
  console.log(`Dashboard Load < 2s: ${stats.avg < 2000 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Error Rate < 5%: ${errorRate < 5 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`P95 Response < 5s: ${stats.p95 < 5000 ? '✅ PASS' : '❌ FAIL'}`);
}

/**
 * Main execution
 */
async function main() {
  console.log(`Starting load test with ${CONCURRENT_USERS} concurrent users...`);
  console.log(`Total requests: ${TOTAL_REQUESTS}`);
  console.log(`Requests per user: ${REQUESTS_PER_USER}\n`);

  metrics.startTime = performance.now();

  // Create user simulation promises
  const userPromises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }

  // Wait for all users to complete
  await Promise.all(userPromises);

  metrics.endTime = performance.now();

  printResults();
}

// Run the test
main().catch(console.error);
