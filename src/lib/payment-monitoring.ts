/**
 * Payment Validation Monitoring
 * Tracks payment attempts, successes, failures, and abandonment
 */

import { createClient } from './supabase/browser';

export interface PaymentMetrics {
  paymentAttempts: number;
  successfulPayments: number;
  failedPayments: number;
  abandonedPayments: number;
  paymentConversionRate: number;
  revenuePerUser: number;
  averageExportValue: number;
}

/**
 * Get payment metrics
 */
export async function getPaymentMetrics(): Promise<PaymentMetrics> {
  try {
    const supabase = createClient();

    // Total payment attempts
    const { count: paymentAttempts } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    // Successful payments
    const { count: successfulPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Failed payments
    const { count: failedPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    // Abandoned payments (pending for more than 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { count: abandonedPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', thirtyMinutesAgo);

    // Total revenue
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    const totalRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const userCount = totalUsers || 1;

    // Average export value
    const exportCount = successfulPayments || 1;
    const averageExportValue = totalRevenue / exportCount;

    const attempts = paymentAttempts || 1;
    const paymentConversionRate = ((successfulPayments || 0) / attempts) * 100;

    return {
      paymentAttempts: paymentAttempts || 0,
      successfulPayments: successfulPayments || 0,
      failedPayments: failedPayments || 0,
      abandonedPayments: abandonedPayments || 0,
      paymentConversionRate,
      revenuePerUser: totalRevenue / userCount,
      averageExportValue,
    };
  } catch (error) {
    console.error('Error fetching payment metrics:', error);
    return {
      paymentAttempts: 0,
      successfulPayments: 0,
      failedPayments: 0,
      abandonedPayments: 0,
      paymentConversionRate: 0,
      revenuePerUser: 0,
      averageExportValue: 0,
    };
  }
}

/**
 * Track payment attempt
 */
export async function trackPaymentAttempt(amount: number, reportId?: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'payment_started',
      event_category: 'revenue',
      event_name: 'payment_started',
      properties: {
        amount,
        report_id: reportId,
      },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment attempt:', error);
  }
}

/**
 * Track payment completion
 */
export async function trackPaymentCompletion(amount: number, reference: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'payment_completed',
      event_category: 'revenue',
      event_name: 'payment_completed',
      properties: {
        amount,
        reference,
      },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment completion:', error);
  }
}

/**
 * Track payment failure
 */
export async function trackPaymentFailure(amount: number, reason: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'payment_failed',
      event_category: 'revenue',
      event_name: 'payment_failed',
      properties: {
        amount,
        reason,
      },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment failure:', error);
  }
}
