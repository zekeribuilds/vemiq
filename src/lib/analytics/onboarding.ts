/**
 * Onboarding Optimization
 * Measures Time to First Value (TTFV) and onboarding scorecard
 */

import { createClient } from '../supabase/browser';

export interface TTFVMetrics {
  averageTTFV: number; // in minutes
  medianTTFV: number;
  p95TTFV: number;
  goalMet: boolean; // goal: under 10 minutes
}

export interface OnboardingScorecard {
  profileCompletionRate: number;
  logbookCreationRate: number;
  firstEntryRate: number;
  firstUploadRate: number;
  firstAISummaryRate: number;
  overallScore: number;
}

/**
 * Get Time to First Value metrics
 */
export async function getTTFVMetrics(): Promise<TTFVMetrics> {
  try {
    const supabase = createClient();

    // Get users who signed up in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: users } = await supabase
      .from('profiles')
      .select('id, created_at')
      .gte('created_at', thirtyDaysAgo);

    if (!users || users.length === 0) {
      return {
        averageTTFV: 0,
        medianTTFV: 0,
        p95TTFV: 0,
        goalMet: false,
      };
    }

    const ttfvTimes: number[] = [];

    for (const user of users) {
      // Get first useful action after signup
      const { data: firstAction } = await supabase
        .from('activity_events')
        .select('created_at')
        .eq('user_id', user.id)
        .in('action', ['create_logbook', 'create_log_entry', 'upload_activity_evidence', 'generate_ai_summary'])
        .gte('created_at', user.created_at)
        .order('created_at', { ascending: true })
        .limit(1);

      if (firstAction && firstAction.length > 0) {
        const signupTime = new Date(user.created_at).getTime();
        const actionTime = new Date(firstAction[0].created_at).getTime();
        const ttfvMinutes = (actionTime - signupTime) / (1000 * 60);
        ttfvTimes.push(ttfvMinutes);
      }
    }

    if (ttfvTimes.length === 0) {
      return {
        averageTTFV: 0,
        medianTTFV: 0,
        p95TTFV: 0,
        goalMet: false,
      };
    }

    ttfvTimes.sort((a, b) => a - b);

    const average = ttfvTimes.reduce((sum, t) => sum + t, 0) / ttfvTimes.length;
    const median = ttfvTimes[Math.floor(ttfvTimes.length / 2)];
    const p95 = ttfvTimes[Math.floor(ttfvTimes.length * 0.95)];

    return {
      averageTTFV: average,
      medianTTFV: median,
      p95TTFV: p95,
      goalMet: average < 10,
    };
  } catch (error) {
    console.error('Error fetching TTFV metrics:', error);
    return {
      averageTTFV: 0,
      medianTTFV: 0,
      p95TTFV: 0,
      goalMet: false,
    };
  }
}

/**
 * Get onboarding scorecard
 */
export async function getOnboardingScorecard(): Promise<OnboardingScorecard> {
  try {
    const supabase = createClient();

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const userCount = totalUsers || 1;

    // Profile completion rate
    const { count: completeProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('full_name', 'is', null)
      .not('matric_number', 'is', null)
      .not('institution_id', 'is', null);

    // Logbook creation rate
    const { count: usersWithLogbooks } = await supabase
      .from('logbooks')
      .select('user_id', { count: 'exact', head: true });

    // First entry rate
    const { count: usersWithEntries } = await supabase
      .from('logbook_entries')
      .select('user_id', { count: 'exact', head: true });

    // First upload rate
    const { count: usersWithUploads } = await supabase
      .from('uploads')
      .select('user_id', { count: 'exact', head: true });

    // First AI summary rate
    const { count: usersWithSummaries } = await supabase
      .from('weekly_logs')
      .select('user_id', { count: 'exact', head: true })
      .not('ai_summary', 'is', null);

    const profileCompletionRate = ((completeProfiles || 0) / userCount) * 100;
    const logbookCreationRate = ((usersWithLogbooks || 0) / userCount) * 100;
    const firstEntryRate = ((usersWithEntries || 0) / userCount) * 100;
    const firstUploadRate = ((usersWithUploads || 0) / userCount) * 100;
    const firstAISummaryRate = ((usersWithSummaries || 0) / userCount) * 100;

    const overallScore = (
      profileCompletionRate +
      logbookCreationRate +
      firstEntryRate +
      firstUploadRate +
      firstAISummaryRate
    ) / 5;

    return {
      profileCompletionRate,
      logbookCreationRate,
      firstEntryRate,
      firstUploadRate,
      firstAISummaryRate,
      overallScore,
    };
  } catch (error) {
    console.error('Error fetching onboarding scorecard:', error);
    return {
      profileCompletionRate: 0,
      logbookCreationRate: 0,
      firstEntryRate: 0,
      firstUploadRate: 0,
      firstAISummaryRate: 0,
      overallScore: 0,
    };
  }
}

/**
 * Track onboarding step
 */
export async function trackOnboardingStep(step: string, timeSpent: number) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: step,
      event_category: 'onboarding',
      event_name: step,
      properties: { timeSpent },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking onboarding step:', error);
  }
}
