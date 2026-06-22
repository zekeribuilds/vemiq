/**
 * User Validation Scorecard
 * Metrics to validate product assumptions
 */

import { createClient } from './supabase/browser';

export interface ValidationMetrics {
  percentUsersCreatingLogbooks: number;
  percentUsersAddingEntries: number;
  percentUsersUploadingFiles: number;
  percentUsersGeneratingReports: number;
  percentUsersPaying: number;
  percentUsersReturning: number;
}

export interface SuccessThresholds {
  profileCompletion: number;
  logbookCreation: number;
  entryAddition: number;
  reportGeneration: number;
  reportExport: number;
  returnRate: number;
}

const SUCCESS_THRESHOLDS: SuccessThresholds = {
  profileCompletion: 70,
  logbookCreation: 60,
  entryAddition: 50,
  reportGeneration: 30,
  reportExport: 10,
  returnRate: 25,
};

/**
 * Get validation metrics
 */
export async function getValidationMetrics(): Promise<ValidationMetrics> {
  try {
    const supabase = createClient();

    // Total users
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const userCount = totalUsers || 1;

    // Users with logbooks
    const { count: usersWithLogbooks } = await supabase
      .from('logbooks')
      .select('user_id', { count: 'exact', head: true });

    // Users with entries
    const { count: usersWithEntries } = await supabase
      .from('logbook_entries')
      .select('user_id', { count: 'exact', head: true });

    // Users with uploads
    const { count: usersWithUploads } = await supabase
      .from('uploads')
      .select('user_id', { count: 'exact', head: true });

    // Users with reports
    const { count: usersWithReports } = await supabase
      .from('reports')
      .select('user_id', { count: 'exact', head: true });

    // Users who paid
    const { count: usersWhoPaid } = await supabase
      .from('payments')
      .select('user_id', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Users returning within 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: returningUsers } = await supabase
      .from('activity_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    return {
      percentUsersCreatingLogbooks: ((usersWithLogbooks || 0) / userCount) * 100,
      percentUsersAddingEntries: ((usersWithEntries || 0) / userCount) * 100,
      percentUsersUploadingFiles: ((usersWithUploads || 0) / userCount) * 100,
      percentUsersGeneratingReports: ((usersWithReports || 0) / userCount) * 100,
      percentUsersPaying: ((usersWhoPaid || 0) / userCount) * 100,
      percentUsersReturning: ((returningUsers || 0) / userCount) * 100,
    };
  } catch (error) {
    console.error('Error fetching validation metrics:', error);
    return {
      percentUsersCreatingLogbooks: 0,
      percentUsersAddingEntries: 0,
      percentUsersUploadingFiles: 0,
      percentUsersGeneratingReports: 0,
      percentUsersPaying: 0,
      percentUsersReturning: 0,
    };
  }
}

/**
 * Check if metrics meet success thresholds
 */
export async function checkSuccessThresholds(): Promise<{
  metrics: ValidationMetrics;
  thresholds: SuccessThresholds;
  passed: Record<keyof SuccessThresholds, boolean>;
  overall: boolean;
}> {
  const metrics = await getValidationMetrics();

  const passed = {
    profileCompletion: metrics.percentUsersReturning >= SUCCESS_THRESHOLDS.profileCompletion, // Using return rate as proxy
    logbookCreation: metrics.percentUsersCreatingLogbooks >= SUCCESS_THRESHOLDS.logbookCreation,
    entryAddition: metrics.percentUsersAddingEntries >= SUCCESS_THRESHOLDS.entryAddition,
    reportGeneration: metrics.percentUsersGeneratingReports >= SUCCESS_THRESHOLDS.reportGeneration,
    reportExport: metrics.percentUsersPaying >= SUCCESS_THRESHOLDS.reportExport, // Using payment as proxy for export
    returnRate: metrics.percentUsersReturning >= SUCCESS_THRESHOLDS.returnRate,
  };

  const overall = Object.values(passed).every(Boolean);

  return {
    metrics,
    thresholds: SUCCESS_THRESHOLDS,
    passed,
    overall,
  };
}

/**
 * Get success thresholds
 */
export function getSuccessThresholds(): SuccessThresholds {
  return { ...SUCCESS_THRESHOLDS };
}
