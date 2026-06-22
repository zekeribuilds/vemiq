/**
 * Report Quality Validation Workflow
 * Tracks report satisfaction and edit levels after export
 */

import { createClient } from './supabase/browser';

export type EditLevel = 'no_edits' | 'minor_edits' | 'moderate_edits' | 'major_edits';

export interface ReportQualityMetrics {
  totalExports: number;
  noEdits: number;
  minorEdits: number;
  moderateEdits: number;
  majorEdits: number;
  averageSatisfactionScore: number;
  satisfactionGoalMet: boolean; // goal: >80% minor-or-no edits
}

/**
 * Submit report quality feedback
 */
export async function submitReportQuality(
  reportVersionId: string,
  editLevel: EditLevel,
  satisfactionScore?: number,
  feedbackText?: string
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'User not authenticated' };

    const { error } = await supabase.from('report_quality').insert({
      user_id: user.id,
      report_version_id: reportVersionId,
      edit_level: editLevel,
      satisfaction_score: satisfactionScore,
      feedback_text: feedbackText,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error submitting report quality:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get report quality metrics
 */
export async function getReportQualityMetrics(): Promise<ReportQualityMetrics> {
  try {
    const supabase = createClient();

    // Total exports
    const { count: totalExports } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true });

    // Quality feedback
    const { data: qualityData } = await supabase
      .from('report_quality')
      .select('edit_level, satisfaction_score');

    if (!qualityData || qualityData.length === 0) {
      return {
        totalExports: totalExports || 0,
        noEdits: 0,
        minorEdits: 0,
        moderateEdits: 0,
        majorEdits: 0,
        averageSatisfactionScore: 0,
        satisfactionGoalMet: false,
      };
    }

    const noEdits = qualityData.filter((q: any) => q.edit_level === 'no_edits').length;
    const minorEdits = qualityData.filter((q: any) => q.edit_level === 'minor_edits').length;
    const moderateEdits = qualityData.filter((q: any) => q.edit_level === 'moderate_edits').length;
    const majorEdits = qualityData.filter((q: any) => q.edit_level === 'major_edits').length;

    const satisfactionScores = qualityData
      .map((q: any) => q.satisfaction_score)
      .filter((s: any): s is number => s !== null && s !== undefined);

    const averageSatisfactionScore = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum: number, s: number) => sum + s, 0) / satisfactionScores.length
      : 0;

    // Goal: >80% minor-or-no edits
    const minorOrNoEdits = noEdits + minorEdits;
    const satisfactionGoalMet = qualityData.length > 0
      ? (minorOrNoEdits / qualityData.length) * 100 > 80
      : false;

    return {
      totalExports: totalExports || 0,
      noEdits,
      minorEdits,
      moderateEdits,
      majorEdits,
      averageSatisfactionScore,
      satisfactionGoalMet,
    };
  } catch (error) {
    console.error('Error fetching report quality metrics:', error);
    return {
      totalExports: 0,
      noEdits: 0,
      minorEdits: 0,
      moderateEdits: 0,
      majorEdits: 0,
      averageSatisfactionScore: 0,
      satisfactionGoalMet: false,
    };
  }
}
