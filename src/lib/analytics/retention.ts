/**
 * Retention Cohorts System
 * Tracks user retention at Day 1, 3, 7, 14, 30
 */

import { createClient } from '../supabase/browser';

export interface RetentionCohort {
  day: number;
  users: number;
  retentionRate: number;
  newLogsCreated: number;
  continuingUsers: number;
  reportsCreated: number;
}

export interface RetentionMetrics {
  cohorts: RetentionCohort[];
  averageRetention: number;
  bestRetentionDay: number;
  worstRetentionDay: number;
}

/**
 * Get retention metrics
 */
export async function getRetentionMetrics(): Promise<RetentionMetrics> {
  try {
    const supabase = createClient();
    const cohorts: RetentionCohort[] = [];

    // Get all users with their signup date
    const { data: users } = await supabase
      .from('profiles')
      .select('id, created_at');

    if (!users || users.length === 0) {
      return {
        cohorts: [],
        averageRetention: 0,
        bestRetentionDay: 0,
        worstRetentionDay: 0,
      };
    }

    const days = [1, 3, 7, 14, 30];

    for (const day of days) {
      const dayAgo = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
      const cutoffDate = new Date(Date.now() - (day + 1) * 24 * 60 * 60 * 1000);

      // Users who signed up between cutoffDate and dayAgo
      const cohortUsers = users.filter(u => {
        const createdAt = new Date(u.created_at);
        return createdAt >= cutoffDate && createdAt <= dayAgo;
      });

      if (cohortUsers.length === 0) continue;

      const cohortUserIds = cohortUsers.map(u => u.id);

      // Users who returned (had activity after signup + day)
      const { data: returningUsers } = await supabase
        .from('activity_events')
        .select('user_id')
        .in('user_id', cohortUserIds);

      const returningUserIds = new Set(returningUsers?.map(u => u.user_id) || []);
      const retentionCount = returningUserIds.size;

      // New logs created by cohort
      const { count: newLogsCreated } = await supabase
        .from('logbook_entries')
        .select('*', { count: 'exact', head: true })
        .in('user_id', cohortUserIds);

      // Users continuing with same logbook
      const { count: continuingUsers } = await supabase
        .from('logbook_entries')
        .select('*', { count: 'exact', head: true })
        .in('user_id', cohortUserIds);

      // Reports created by cohort
      const { count: reportsCreated } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .in('user_id', cohortUserIds);

      cohorts.push({
        day,
        users: cohortUsers.length,
        retentionRate: (retentionCount / cohortUsers.length) * 100,
        newLogsCreated: newLogsCreated || 0,
        continuingUsers: continuingUsers || 0,
        reportsCreated: reportsCreated || 0,
      });
    }

    const averageRetention = cohorts.length > 0
      ? cohorts.reduce((sum, c) => sum + c.retentionRate, 0) / cohorts.length
      : 0;

    const bestRetentionDay = cohorts.length > 0
      ? cohorts.reduce((max, c) => c.retentionRate > max.retentionRate ? c : max, cohorts[0]).day
      : 0;

    const worstRetentionDay = cohorts.length > 0
      ? cohorts.reduce((min, c) => c.retentionRate < min.retentionRate ? c : min, cohorts[0]).day
      : 0;

    return {
      cohorts,
      averageRetention,
      bestRetentionDay,
      worstRetentionDay,
    };
  } catch (error) {
    console.error('Error fetching retention metrics:', error);
    return {
      cohorts: [],
      averageRetention: 0,
      bestRetentionDay: 0,
      worstRetentionDay: 0,
    };
  }
}

/**
 * Track retention event
 */
export async function trackRetentionEvent(day: number, action: 'returned' | 'new_log' | 'same_logbook' | 'report_created') {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: `retention_day_${day}`,
      event_category: 'retention',
      event_name: action,
      properties: { day, action },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking retention event:', error);
  }
}
