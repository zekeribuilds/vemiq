/**
 * Failure Detection System
 * Automatically detects upload, AI, payment, sync, and export failures
 */

import { createClient } from '../supabase/browser';

export interface FailureMetric {
  feature: string;
  totalAttempts: number;
  failures: number;
  failureRate: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface HealthDashboard {
  overallHealth: 'healthy' | 'warning' | 'critical';
  failureMetrics: FailureMetric[];
  criticalFailures: FailureMetric[];
}

/**
 * Get failure detection metrics
 */
export async function getFailureMetrics(): Promise<HealthDashboard> {
  try {
    const supabase = createClient();
    const failureMetrics: FailureMetric[] = [];

    // Upload failures
    const { count: totalUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true });

    const { count: failedUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    const uploadFailureRate = totalUploads ? (failedUploads || 0) / totalUploads * 100 : 0;

    failureMetrics.push({
      feature: 'Uploads',
      totalAttempts: totalUploads || 0,
      failures: failedUploads || 0,
      failureRate: uploadFailureRate,
      status: uploadFailureRate < 5 ? 'healthy' : uploadFailureRate < 15 ? 'warning' : 'critical',
    });

    // AI failures (from analytics events)
    const { count: totalAIRequests } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'ai_used');

    const { count: failedAIRequests } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'ai_failed');

    const aiFailureRate = totalAIRequests ? (failedAIRequests || 0) / totalAIRequests * 100 : 0;

    failureMetrics.push({
      feature: 'AI Generation',
      totalAttempts: totalAIRequests || 0,
      failures: failedAIRequests || 0,
      failureRate: aiFailureRate,
      status: aiFailureRate < 5 ? 'healthy' : aiFailureRate < 15 ? 'warning' : 'critical',
    });

    // Payment failures
    const { count: totalPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    const { count: failedPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    const paymentFailureRate = totalPayments ? (failedPayments || 0) / totalPayments * 100 : 0;

    failureMetrics.push({
      feature: 'Payments',
      totalAttempts: totalPayments || 0,
      failures: failedPayments || 0,
      failureRate: paymentFailureRate,
      status: paymentFailureRate < 5 ? 'healthy' : paymentFailureRate < 15 ? 'warning' : 'critical',
    });

    // Sync failures (from analytics events)
    const { count: totalSyncRequests } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'sync_attempt');

    const { count: failedSyncRequests } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'sync_failed');

    const syncFailureRate = totalSyncRequests ? (failedSyncRequests || 0) / totalSyncRequests * 100 : 0;

    failureMetrics.push({
      feature: 'Offline Sync',
      totalAttempts: totalSyncRequests || 0,
      failures: failedSyncRequests || 0,
      failureRate: syncFailureRate,
      status: syncFailureRate < 5 ? 'healthy' : syncFailureRate < 15 ? 'warning' : 'critical',
    });

    // Export failures
    const { count: totalExports } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true });

    const { count: failedExports } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'export_failed');

    const exportFailureRate = totalExports ? (failedExports || 0) / totalExports * 100 : 0;

    failureMetrics.push({
      feature: 'Exports',
      totalAttempts: totalExports || 0,
      failures: failedExports || 0,
      failureRate: exportFailureRate,
      status: exportFailureRate < 5 ? 'healthy' : exportFailureRate < 15 ? 'warning' : 'critical',
    });

    // Determine overall health
    const criticalCount = failureMetrics.filter(f => f.status === 'critical').length;
    const warningCount = failureMetrics.filter(f => f.status === 'warning').length;

    const overallHealth = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy';

    const criticalFailures = failureMetrics.filter(f => f.status === 'critical');

    return {
      overallHealth,
      failureMetrics,
      criticalFailures,
    };
  } catch (error) {
    console.error('Error fetching failure metrics:', error);
    return {
      overallHealth: 'warning',
      failureMetrics: [],
      criticalFailures: [],
    };
  }
}

/**
 * Track failure event
 */
export async function trackFailure(feature: string, error: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: `${feature.toLowerCase()}_failed`,
      event_category: 'failure',
      event_name: `${feature}_failed`,
      properties: { error },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking failure:', error);
  }
}
