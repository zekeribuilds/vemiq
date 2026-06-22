/**
 * Complete User Funnel Tracking
 * Tracks every step from visitor to payment with drop-off rates
 */

import { createClient } from '../supabase/browser';

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface FunnelMetrics {
  steps: FunnelStep[];
  biggestLeak: string;
  overallConversion: number;
}

const FUNNEL_STEPS = [
  'visitor',
  'signup',
  'email_verification',
  'profile_completion',
  'create_first_logbook',
  'create_first_week',
  'create_first_daily_entry',
  'upload_first_file',
  'generate_first_ai_summary',
  'create_first_report',
  'export_first_report',
  'pay_first_time',
] as const;

/**
 * Get complete funnel metrics
 */
export async function getFunnelMetrics(): Promise<FunnelMetrics> {
  try {
    const supabase = createClient();
    const steps: FunnelStep[] = [];

    // Visitor - landing page views
    const { count: visitors } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'landing_viewed');

    steps.push({
      name: 'Visitor',
      count: visitors || 0,
      conversionRate: 100,
      dropOffRate: 0,
    });

    // Signup - accounts created
    const { count: signups } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Signup',
      count: signups || 0,
      conversionRate: visitors ? ((signups || 0) / visitors) * 100 : 0,
      dropOffRate: visitors ? ((visitors - (signups || 0)) / visitors) * 100 : 0,
    });

    // Email verification - users with confirmed email
    const { data: verifiedData } = await supabase.auth.admin.listUsers();
    const verifiedCount = verifiedData.users.filter((u: any) => u.email_confirmed_at).length;

    steps.push({
      name: 'Email Verification',
      count: verifiedCount,
      conversionRate: signups ? (verifiedCount / signups) * 100 : 0,
      dropOffRate: signups ? ((signups - verifiedCount) / signups) * 100 : 0,
    });

    // Profile completion - users with complete profiles
    const { count: completeProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('full_name', 'is', null)
      .not('matric_number', 'is', null)
      .not('institution_id', 'is', null);

    steps.push({
      name: 'Profile Completion',
      count: completeProfiles || 0,
      conversionRate: signups ? ((completeProfiles || 0) / signups) * 100 : 0,
      dropOffRate: signups ? ((signups - (completeProfiles || 0)) / signups) * 100 : 0,
    });

    // First logbook
    const { count: firstLogbooks } = await supabase
      .from('logbooks')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Create First Logbook',
      count: firstLogbooks || 0,
      conversionRate: completeProfiles ? ((firstLogbooks || 0) / completeProfiles) * 100 : 0,
      dropOffRate: completeProfiles ? ((completeProfiles - (firstLogbooks || 0)) / completeProfiles) * 100 : 0,
    });

    // First week
    const { count: firstWeeks } = await supabase
      .from('weekly_logs')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Create First Week',
      count: firstWeeks || 0,
      conversionRate: firstLogbooks ? ((firstWeeks || 0) / firstLogbooks) * 100 : 0,
      dropOffRate: firstLogbooks ? ((firstLogbooks - (firstWeeks || 0)) / firstLogbooks) * 100 : 0,
    });

    // First daily entry
    const { count: firstEntries } = await supabase
      .from('logbook_entries')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Create First Daily Entry',
      count: firstEntries || 0,
      conversionRate: firstWeeks ? ((firstEntries || 0) / firstWeeks) * 100 : 0,
      dropOffRate: firstWeeks ? ((firstWeeks - (firstEntries || 0)) / firstWeeks) * 100 : 0,
    });

    // First upload
    const { count: firstUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Upload First File',
      count: firstUploads || 0,
      conversionRate: firstEntries ? ((firstUploads || 0) / firstEntries) * 100 : 0,
      dropOffRate: firstEntries ? ((firstEntries - (firstUploads || 0)) / firstEntries) * 100 : 0,
    });

    // First AI summary
    const { count: firstSummaries } = await supabase
      .from('weekly_logs')
      .select('*', { count: 'exact', head: true })
      .not('ai_summary', 'is', null);

    steps.push({
      name: 'Generate First AI Summary',
      count: firstSummaries || 0,
      conversionRate: firstUploads ? ((firstSummaries || 0) / firstUploads) * 100 : 0,
      dropOffRate: firstUploads ? ((firstUploads - (firstSummaries || 0)) / firstUploads) * 100 : 0,
    });

    // First report
    const { count: firstReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Create First Report',
      count: firstReports || 0,
      conversionRate: firstSummaries ? ((firstReports || 0) / firstSummaries) * 100 : 0,
      dropOffRate: firstSummaries ? ((firstSummaries - (firstReports || 0)) / firstSummaries) * 100 : 0,
    });

    // First export
    const { count: firstExports } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true });

    steps.push({
      name: 'Export First Report',
      count: firstExports || 0,
      conversionRate: firstReports ? ((firstExports || 0) / firstReports) * 100 : 0,
      dropOffRate: firstReports ? ((firstReports - (firstExports || 0)) / firstReports) * 100 : 0,
    });

    // First payment
    const { count: firstPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    steps.push({
      name: 'Pay First Time',
      count: firstPayments || 0,
      conversionRate: firstExports ? ((firstPayments || 0) / firstExports) * 100 : 0,
      dropOffRate: firstExports ? ((firstExports - (firstPayments || 0)) / firstExports) * 100 : 0,
    });

    // Find biggest leak
    const biggestLeak = steps.reduce((max, step) => 
      step.dropOffRate > max.dropOffRate ? step : max
    , steps[0]);

    // Overall conversion
    const overallConversion = visitors ? ((firstPayments || 0) / visitors) * 100 : 0;

    return {
      steps,
      biggestLeak: biggestLeak.name,
      overallConversion,
    };
  } catch (error) {
    console.error('Error fetching funnel metrics:', error);
    return {
      steps: [],
      biggestLeak: 'Unknown',
      overallConversion: 0,
    };
  }
}

/**
 * Track funnel step
 */
export async function trackFunnelStep(step: typeof FUNNEL_STEPS[number], properties?: Record<string, any>) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: step,
      event_category: 'funnel',
      event_name: step,
      properties: properties || {},
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking funnel step:', error);
  }
}
