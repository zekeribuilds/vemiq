/**
 * Success Scorecard
 * Tracks activation, retention, payment, export, upload, AI, and report satisfaction
 */

import { createClient } from '../supabase/browser';

export interface ScorecardMetric {
  name: string;
  value: number;
  target: number;
  status: 'green' | 'yellow' | 'red';
}

export interface SuccessScorecard {
  activationRate: ScorecardMetric;
  retentionRate: ScorecardMetric;
  paymentConversion: ScorecardMetric;
  exportSuccessRate: ScorecardMetric;
  uploadSuccessRate: ScorecardMetric;
  aiSatisfaction: ScorecardMetric;
  reportSatisfaction: ScorecardMetric;
  overallScore: number;
  overallStatus: 'green' | 'yellow' | 'red';
}

/**
 * Get success scorecard
 */
export async function getSuccessScorecard(): Promise<SuccessScorecard> {
  try {
    const supabase = createClient();

    // Activation Rate (users who created at least one logbook)
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: usersWithLogbooks } = await supabase
      .from('logbooks')
      .select('user_id', { count: 'exact', head: true });

    const activationRate = totalUsers ? ((usersWithLogbooks || 0) / totalUsers) * 100 : 0;

    // Retention Rate (users who returned within 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: returningUsers } = await supabase
      .from('activity_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo);

    const retentionRate = totalUsers ? ((returningUsers || 0) / totalUsers) * 100 : 0;

    // Payment Conversion (users who paid / users who exported)
    const { count: exports } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true });

    const { count: payingUsers } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const paymentConversion = exports ? ((payingUsers || 0) / exports) * 100 : 0;

    // Export Success Rate
    const { count: failedExports } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'export_failed');

    const exportSuccessRate = exports ? ((exports - (failedExports || 0)) / exports) * 100 : 0;

    // Upload Success Rate
    const { count: totalUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true });

    const { count: failedUploads } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    const uploadSuccessRate = totalUploads ? ((totalUploads - (failedUploads || 0)) / totalUploads) * 100 : 0;

    // AI Satisfaction (from report quality)
    const { data: aiSummaries } = await supabase
      .from('weekly_logs')
      .select('ai_summary')
      .not('ai_summary', 'is', null);

    const aiSatisfaction = aiSummaries && aiSummaries.length > 0 ? 85 : 0; // Placeholder - needs actual satisfaction tracking

    // Report Satisfaction
    const { data: reportQuality } = await supabase
      .from('report_quality')
      .select('satisfaction_score');

    const satisfactionScores = reportQuality
      ?.map(q => q.satisfaction_score)
      .filter((s): s is number => s !== null && s !== undefined) || [];

    const reportSatisfaction = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum, s) => sum + s, 0) / satisfactionScores.length
      : 0;

    // Calculate status for each metric
    const activationRateMetric = createMetric('Activation Rate', activationRate, 60);
    const retentionRateMetric = createMetric('Retention Rate', retentionRate, 25);
    const paymentConversionMetric = createMetric('Payment Conversion', paymentConversion, 10);
    const exportSuccessRateMetric = createMetric('Export Success Rate', exportSuccessRate, 95);
    const uploadSuccessRateMetric = createMetric('Upload Success Rate', uploadSuccessRate, 95);
    const aiSatisfactionMetric = createMetric('AI Satisfaction', aiSatisfaction, 80);
    const reportSatisfactionMetric = createMetric('Report Satisfaction', reportSatisfaction, 80);

    // Calculate overall score
    const metrics = [
      activationRateMetric,
      retentionRateMetric,
      paymentConversionMetric,
      exportSuccessRateMetric,
      uploadSuccessRateMetric,
      aiSatisfactionMetric,
      reportSatisfactionMetric,
    ];

    const overallScore = metrics.reduce((sum, m) => sum + (m.value / m.target) * 100, 0) / metrics.length;

    const overallStatus = overallScore >= 80 ? 'green' : overallScore >= 60 ? 'yellow' : 'red';

    return {
      activationRate: activationRateMetric,
      retentionRate: retentionRateMetric,
      paymentConversion: paymentConversionMetric,
      exportSuccessRate: exportSuccessRateMetric,
      uploadSuccessRate: uploadSuccessRateMetric,
      aiSatisfaction: aiSatisfactionMetric,
      reportSatisfaction: reportSatisfactionMetric,
      overallScore,
      overallStatus,
    };
  } catch (error) {
    console.error('Error fetching success scorecard:', error);
    return {
      activationRate: createMetric('Activation Rate', 0, 60),
      retentionRate: createMetric('Retention Rate', 0, 25),
      paymentConversion: createMetric('Payment Conversion', 0, 10),
      exportSuccessRate: createMetric('Export Success Rate', 0, 95),
      uploadSuccessRate: createMetric('Upload Success Rate', 0, 95),
      aiSatisfaction: createMetric('AI Satisfaction', 0, 80),
      reportSatisfaction: createMetric('Report Satisfaction', 0, 80),
      overallScore: 0,
      overallStatus: 'red',
    };
  }
}

function createMetric(name: string, value: number, target: number): ScorecardMetric {
  const percentage = (value / target) * 100;
  const status = percentage >= 100 ? 'green' : percentage >= 70 ? 'yellow' : 'red';

  return {
    name,
    value,
    target,
    status,
  };
}
