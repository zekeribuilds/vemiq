/**
 * Beta Access Control Library
 * Handles beta user status and access control
 */

import { createClient } from './supabase/browser';

export type BetaStatus = 'pending' | 'approved' | 'rejected' | 'onboarded';

export type OnboardingStep = 'waitlist' | 'approved' | 'account_created' | 'profile_completed' | 'logbook_created' | 'report_created' | 'exported';

export interface BetaUser {
  id: string;
  user_id: string;
  status: BetaStatus;
  onboarding_step: OnboardingStep;
  conversion_rate: number;
  waitlist_joined_at: string | null;
  account_created_at: string | null;
  profile_completed_at: string | null;
  first_logbook_created_at: string | null;
  first_report_created_at: string | null;
  first_export_at: string | null;
  invited_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
  department: string | null;
  institution: string | null;
  referral_source: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Check if user is approved for beta access
 */
export async function isBetaApproved(): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: betaUser } = await supabase
      .from('beta_users')
      .select('status')
      .eq('user_id', user.id)
      .single();

    return betaUser?.status === 'approved';
  } catch (error) {
    console.error('Beta access check error:', error);
    return false;
  }
}

/**
 * Get beta user status
 */
export async function getBetaStatus(): Promise<BetaStatus | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: betaUser } = await supabase
      .from('beta_users')
      .select('status')
      .eq('user_id', user.id)
      .single();

    return betaUser?.status || null;
  } catch (error) {
    console.error('Beta status check error:', error);
    return null;
  }
}

/**
 * Request beta access (for new users)
 */
export async function requestBetaAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if already has beta status
    const { data: existing } = await supabase
      .from('beta_users')
      .select('status')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return { success: false, error: 'Already requested beta access' };
    }

    // Create beta user request
    const { error } = await supabase.from('beta_users').insert({
      user_id: user.id,
      status: 'pending',
      invited_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Beta access request error:', error);
    return { success: false, error: 'Failed to request beta access' };
  }
}

/**
 * Admin: Approve beta user
 */
export async function approveBetaUser(userId: string, notes?: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
      .from('beta_users')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
        notes,
      })
      .eq('user_id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Beta approval error:', error);
    return false;
  }
}

/**
 * Admin: Reject beta user
 */
export async function rejectBetaUser(userId: string, notes?: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
      .from('beta_users')
      .update({
        status: 'rejected',
        notes,
      })
      .eq('user_id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Beta rejection error:', error);
    return false;
  }
}

/**
 * Admin: Get all beta users
 */
export async function getAllBetaUsers(): Promise<BetaUser[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('beta_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get beta users error:', error);
    return [];
  }
}

/**
 * Track onboarding event
 */
export async function trackOnboardingEvent(eventType: 'account_created' | 'profile_completed' | 'first_logbook_created' | 'first_report_created' | 'first_export'): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase.rpc('track_onboarding_event', {
      p_user_id: user.id,
      p_event_type: eventType
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Track onboarding event error:', error);
    return false;
  }
}

/**
 * Get onboarding funnel metrics
 */
export async function getOnboardingFunnelMetrics() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('beta_users')
      .select('onboarding_step, conversion_rate')
      .order('conversion_rate', { ascending: true });

    if (error) throw error;

    // Calculate funnel metrics
    const funnel = {
      waitlist: 0,
      approved: 0,
      account_created: 0,
      profile_completed: 0,
      logbook_created: 0,
      report_created: 0,
      exported: 0,
    };

    data?.forEach(user => {
      if (funnel[user.onboarding_step as keyof typeof funnel] !== undefined) {
        funnel[user.onboarding_step as keyof typeof funnel]++;
      }
    });

    return funnel;
  } catch (error) {
    console.error('Get onboarding funnel metrics error:', error);
    return null;
  }
}

/**
 * Update beta user metadata
 */
export async function updateBetaUserMetadata(metadata: { department?: string; institution?: string; referral_source?: string }): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
      .from('beta_users')
      .update(metadata)
      .eq('user_id', user.id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Update beta user metadata error:', error);
    return false;
  }
}
