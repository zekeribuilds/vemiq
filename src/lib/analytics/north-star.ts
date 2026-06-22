/**
 * North Star Metric Tracking
 * Primary Metric: Weekly Active SIWES Students Who Create Logs
 */

import { createClient } from '../supabase/browser';

export interface NorthStarMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  activeLogbooks: number;
  logsCreated: number;
  uploadsAdded: number;
  aiSummariesGenerated: number;
  reportsExported: number;
  northStarMetric: number; // Weekly Active SIWES Students Who Create Logs
}

/**
 * Get North Star Metrics
 */
export async function getNorthStarMetrics(): Promise<NorthStarMetrics> {
  try {
    const supabase = createClient();

    // Daily active users (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: dailyActiveUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo);

    // Weekly active users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: weeklyActiveUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // Monthly active users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: monthlyActiveUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo);

    // Active logbooks (logbooks with activity in last 7 days)
    const { count: activeLogbooks } = await supabase
      .from('logbooks')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', sevenDaysAgo);

    // Logs created this week
    const { count: logsCreated } = await supabase
      .from('logbook_entries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // Uploads added this week
    const { count: uploadsAdded } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // AI summaries generated this week
    const { count: aiSummariesGenerated } = await supabase
      .from('weekly_logs')
      .select('*', { count: 'exact', head: true })
      .not('ai_summary', 'is', null)
      .gte('updated_at', sevenDaysAgo);

    // Reports exported this week
    const { count: reportsExported } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    // North Star Metric: Weekly Active SIWES Students Who Create Logs
    // Count unique users who created logs in the last 7 days
    const { data: logCreators } = await supabase
      .from('logbook_entries')
      .select('user_id')
      .gte('created_at', sevenDaysAgo);
    
    const uniqueLogCreators = new Set(logCreators?.map(l => l.user_id) || []);
    const northStarMetric = uniqueLogCreators.size;

    return {
      dailyActiveUsers: dailyActiveUsers || 0,
      weeklyActiveUsers: weeklyActiveUsers || 0,
      monthlyActiveUsers: monthlyActiveUsers || 0,
      activeLogbooks: activeLogbooks || 0,
      logsCreated: logsCreated || 0,
      uploadsAdded: uploadsAdded || 0,
      aiSummariesGenerated: aiSummariesGenerated || 0,
      reportsExported: reportsExported || 0,
      northStarMetric,
    };
  } catch (error) {
    console.error('Error fetching north star metrics:', error);
    return {
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0,
      activeLogbooks: 0,
      logsCreated: 0,
      uploadsAdded: 0,
      aiSummariesGenerated: 0,
      reportsExported: 0,
      northStarMetric: 0,
    };
  }
}

/**
 * Track north star metric event
 */
export async function trackNorthStarEvent(action: 'log_created' | 'upload_added' | 'ai_summary' | 'report_exported') {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: action,
      event_category: 'north_star',
      event_name: action,
      properties: {},
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking north star event:', error);
  }
}
