/**
 * Feedback Prioritization Engine
 * Automatically ranks feedback by impact and frequency
 */

import { createClient } from '../supabase/browser';

export interface FeedbackItem {
  id: string;
  user_id: string;
  type: string;
  message: string;
  page: string;
  status: string;
  impact_score: number;
  frequency_score: number;
  priority_score: number;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
}

export interface FeedbackSummary {
  topRequestedFeatures: FeedbackItem[];
  topComplaints: FeedbackItem[];
  mostFrequentBugs: FeedbackItem[];
  criticalIssues: FeedbackItem[];
}

/**
 * Get prioritized feedback summary
 */
export async function getFeedbackSummary(): Promise<FeedbackSummary> {
  try {
    const supabase = createClient();

    // Get all feedback
    const { data: feedback } = await supabase
      .from('feedback')
      .select('*')
      .order('priority_score', { ascending: false });

    if (!feedback) {
      return {
        topRequestedFeatures: [],
        topComplaints: [],
        mostFrequentBugs: [],
        criticalIssues: [],
      };
    }

    // Categorize feedback
    const topRequestedFeatures = feedback
      .filter(f => f.type === 'feature_request')
      .slice(0, 5);

    const topComplaints = feedback
      .filter(f => f.type === 'general_feedback' && f.message.toLowerCase().includes('problem') || f.message.toLowerCase().includes('issue'))
      .slice(0, 5);

    const mostFrequentBugs = feedback
      .filter(f => f.type === 'bug_report')
      .slice(0, 5);

    const criticalIssues = feedback
      .filter(f => f.priority_level === 'critical')
      .slice(0, 5);

    return {
      topRequestedFeatures,
      topComplaints,
      mostFrequentBugs,
      criticalIssues,
    };
  } catch (error) {
    console.error('Error fetching feedback summary:', error);
    return {
      topRequestedFeatures: [],
      topComplaints: [],
      mostFrequentBugs: [],
      criticalIssues: [],
    };
  }
}

/**
 * Update feedback priority scores
 */
export async function updateFeedbackPriority(feedbackId: string, impactScore: number, frequencyScore: number) {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('feedback')
      .update({
        impact_score: impactScore,
        frequency_score: frequencyScore,
      })
      .eq('id', feedbackId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating feedback priority:', error);
    return false;
  }
}

/**
 * Get feedback by priority level
 */
export async function getFeedbackByPriority(level: 'critical' | 'high' | 'medium' | 'low') {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('priority_level', level)
      .order('priority_score', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching feedback by priority:', error);
    return [];
  }
}
