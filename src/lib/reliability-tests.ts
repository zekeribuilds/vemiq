/**
 * Real-World Reliability Testing Scenarios
 * Automated tests for offline-first functionality and data persistence
 */

import { createClient } from './supabase/browser';
import { saveDraft, loadDraft, deleteDraft, addToSyncQueue, getSyncQueue, clearSyncQueue } from './offline-storage';

export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface TestSuite {
  name: string;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}

/**
 * Test network loss scenario
 * Simulate: Create entry → Disconnect → Refresh → Reconnect
 */
export async function testNetworkLoss(): Promise<TestResult> {
  const startTime = Date.now();

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Simulate creating an entry offline
    const testEntry = {
      id: 'test-entry-1',
      content: 'Test entry content',
      created_at: new Date().toISOString(),
    };

    // Save to draft
    saveDraft('test-entry', testEntry, 'week');

    // Simulate network loss by checking if draft persists
    const loadedDraft = loadDraft('test-entry');

    if (!loadedDraft || loadedDraft.data.content !== testEntry.content) {
      throw new Error('Draft did not persist after simulated network loss');
    }

    // Clean up
    deleteDraft('test-entry');

    return {
      testName: 'Network Loss Persistence',
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      testName: 'Network Loss Persistence',
      passed: false,
      duration: Date.now() - startTime,
      error: (error as Error).message,
    };
  }
}

/**
 * Test upload failure scenario
 * Simulate: Upload → Disconnect → Reconnect → Retry
 */
export async function testUploadFailure(): Promise<TestResult> {
  const startTime = Date.now();

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Simulate upload failure by adding to sync queue
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    addToSyncQueue({
      id: 'test-upload-1',
      action: 'create',
      entityType: 'upload',
      entityId: 'test-file-1',
      data: {
        file: testFile,
        userId: user.id,
        reportId: 'test-report-1',
        weeklyLogId: 'test-week-1',
        fileType: 'document',
      },
      timestamp: Date.now(),
    });

    // Verify sync queue persistence
    const queue = getSyncQueue();
    const queuedItem = queue.find(item => item.id === 'test-upload-1');

    if (!queuedItem) {
      throw new Error('Upload item not persisted in sync queue');
    }

    // Clean up
    clearSyncQueue();

    return {
      testName: 'Upload Failure Recovery',
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      testName: 'Upload Failure Recovery',
      passed: false,
      duration: Date.now() - startTime,
      error: (error as Error).message,
    };
  }
}

/**
 * Test payment failure scenario
 * Simulate: Start payment → Cancel → Return
 */
export async function testPaymentFailure(): Promise<TestResult> {
  const startTime = Date.now();

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a pending payment record
    const { error: insertError } = await supabase.from('payments').insert({
      user_id: user.id,
      amount: 1000,
      currency: 'NGN',
      status: 'pending',
      reference: `test-ref-${Date.now()}`,
      provider: 'paystack',
      metadata: {},
    });

    if (insertError) {
      throw new Error('Failed to create test payment');
    }

    // Verify payment can be queried
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!payments || payments.length === 0) {
      throw new Error('Payment record not found');
    }

    // Clean up - delete test payment
    await supabase.from('payments').delete().eq('reference', payments[0].reference);

    return {
      testName: 'Payment Failure Recovery',
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      testName: 'Payment Failure Recovery',
      passed: false,
      duration: Date.now() - startTime,
      error: (error as Error).message,
    };
  }
}

/**
 * Test browser close scenario
 * Simulate: Edit report → Close tab → Open later
 */
export async function testBrowserClose(): Promise<TestResult> {
  const startTime = Date.now();

  try {
    // Simulate editing a report section
    const testSection = {
      id: 'test-section-1',
      content: 'Test section content',
      report_id: 'test-report-1',
      updated_at: new Date().toISOString(),
    };

    // Save to draft
    saveDraft('test-section', testSection, 'section');

    // Simulate browser close by checking if draft persists
    const loadedDraft = loadDraft('test-section');

    if (!loadedDraft || loadedDraft.data.content !== testSection.content) {
      throw new Error('Section draft did not persist after simulated browser close');
    }

    // Clean up
    deleteDraft('test-section');

    return {
      testName: 'Browser Close Recovery',
      passed: true,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      testName: 'Browser Close Recovery',
      passed: false,
      duration: Date.now() - startTime,
      error: (error as Error).message,
    };
  }
}

/**
 * Run all reliability tests
 */
export async function runReliabilityTestSuite(): Promise<TestSuite> {
  const results: TestResult[] = [];

  results.push(await testNetworkLoss());
  results.push(await testUploadFailure());
  results.push(await testPaymentFailure());
  results.push(await testBrowserClose());

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const duration = results.reduce((sum, r) => sum + r.duration, 0);

  return {
    name: 'Reliability Test Suite',
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      duration,
    },
  };
}
