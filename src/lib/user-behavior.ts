/**
 * User Behavior Recording and Summary Queries
 * Tracks and analyzes user behavior patterns
 */

import { createClient } from './supabase/browser';

export interface UserBehaviorMetrics {
  mostUsedFeatures: { feature: string; count: number }[];
  leastUsedFeatures: { feature: string; count: number }[];
  averageLogbookEntriesPerUser: number;
  averageUploadsPerUser: number;
  averageReportsPerUser: number;
  averageWeeklyLogsPerUser: number;
}

/**
 * Get user behavior metrics
 */
export async function getUserBehaviorMetrics(): Promise<UserBehaviorMetrics> {
  try {
    const supabase = createClient();

    // Get feature usage from analytics_events
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_name')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const featureCounts: Record<string, number> = {};
    events?.forEach(event => {
      featureCounts[event.event_name] = (featureCounts[event.event_name] || 0) + 1;
    });

    const sortedFeatures = Object.entries(featureCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([feature, count]) => ({ feature, count }));

    const mostUsedFeatures = sortedFeatures.slice(0, 5);
    const leastUsedFeatures = sortedFeatures.slice(-5).reverse();

    // Calculate averages
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalLogbookEntries } = await supabase.from('logbook_entries').select('*', { count: 'exact', head: true });
    const { count: totalUploads } = await supabase.from('uploads').select('*', { count: 'exact', head: true });
    const { count: totalReports } = await supabase.from('reports').select('*', { count: 'exact', head: true });
    const { count: totalWeeklyLogs } = await supabase.from('weekly_logs').select('*', { count: 'exact', head: true });

    const userCount = totalUsers || 1;

    return {
      mostUsedFeatures,
      leastUsedFeatures,
      averageLogbookEntriesPerUser: (totalLogbookEntries || 0) / userCount,
      averageUploadsPerUser: (totalUploads || 0) / userCount,
      averageReportsPerUser: (totalReports || 0) / userCount,
      averageWeeklyLogsPerUser: (totalWeeklyLogs || 0) / userCount,
    };
  } catch (error) {
    console.error('Error fetching user behavior metrics:', error);
    return {
      mostUsedFeatures: [],
      leastUsedFeatures: [],
      averageLogbookEntriesPerUser: 0,
      averageUploadsPerUser: 0,
      averageReportsPerUser: 0,
      averageWeeklyLogsPerUser: 0,
    };
  }
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(feature: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: feature,
      event_category: 'usage',
      event_name: feature,
      properties: {},
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}

/**
 * Get user funnel metrics
 */
export async function getFunnelMetrics() {
  try {
    const supabase = createClient();

    const metrics = {
      visitors: 0,
      signups: 0,
      profileCompletions: 0,
      logbookCreations: 0,
      weekCreations: 0,
      dailyEntries: 0,
      reportCreations: 0,
      reportGenerations: 0,
      payments: 0,
      exports: 0,
    };

    const { count: visitors } = await supabase.from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'landing_viewed');

    const { count: signups } = await supabase.from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: profileCompletions } = await supabase.from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('full_name', 'is', null)
      .not('matric_number', 'is', null)
      .not('institution_id', 'is', null);

    const { count: logbookCreations } = await supabase.from('logbooks')
      .select('*', { count: 'exact', head: true });

    const { count: weekCreations } = await supabase.from('weekly_logs')
      .select('*', { count: 'exact', head: true });

    const { count: dailyEntries } = await supabase.from('logbook_entries')
      .select('*', { count: 'exact', head: true });

    const { count: reportCreations } = await supabase.from('reports')
      .select('*', { count: 'exact', head: true });

    const { count: reportGenerations } = await supabase.from('report_sections')
      .select('*', { count: 'exact', head: true });

    const { count: payments } = await supabase.from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: exports } = await supabase.from('report_versions')
      .select('*', { count: 'exact', head: true });

    return {
      ...metrics,
      visitors: visitors || 0,
      signups: signups || 0,
      profileCompletions: profileCompletions || 0,
      logbookCreations: logbookCreations || 0,
      weekCreations: weekCreations || 0,
      dailyEntries: dailyEntries || 0,
      reportCreations: reportCreations || 0,
      reportGenerations: reportGenerations || 0,
      payments: payments || 0,
      exports: exports || 0,
    };
  } catch (error) {
    console.error('Error fetching funnel metrics:', error);
    return {
      visitors: 0,
      signups: 0,
      profileCompletions: 0,
      logbookCreations: 0,
      weekCreations: 0,
      dailyEntries: 0,
      reportCreations: 0,
      reportGenerations: 0,
      payments: 0,
      exports: 0,
    };
  }
}
