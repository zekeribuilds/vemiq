/**
 * Payment Validation Metrics
 * Tracks payment attempts, successes, failures, abandonment
 */

import { createClient } from '../supabase/browser';

export interface PaymentMetrics {
  paymentAttempts: number;
  successfulPayments: number;
  failedPayments: number;
  abandonedPayments: number;
  exportConversionRate: number;
  paymentSuccessRate: number;
  averageRevenuePerUser: number;
  averageRevenuePerPayingUser: number;
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
    const payingUserCount = successfulPayments || 1;

    const attempts = paymentAttempts || 1;
    const paymentSuccessRate = ((successfulPayments || 0) / attempts) * 100;

    // Export conversion rate (reports created vs exports)
    const { count: reportsCreated } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    const { count: exports } = await supabase
      .from('report_versions')
      .select('*', { count: 'exact', head: true });

    const exportConversionRate = reportsCreated ? ((exports || 0) / reportsCreated) * 100 : 0;

    return {
      paymentAttempts: paymentAttempts || 0,
      successfulPayments: successfulPayments || 0,
      failedPayments: failedPayments || 0,
      abandonedPayments: abandonedPayments || 0,
      exportConversionRate,
      paymentSuccessRate,
      averageRevenuePerUser: totalRevenue / userCount,
      averageRevenuePerPayingUser: totalRevenue / payingUserCount,
    };
  } catch (error) {
    console.error('Error fetching payment metrics:', error);
    return {
      paymentAttempts: 0,
      successfulPayments: 0,
      failedPayments: 0,
      abandonedPayments: 0,
      exportConversionRate: 0,
      paymentSuccessRate: 0,
      averageRevenuePerUser: 0,
      averageRevenuePerPayingUser: 0,
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
      event_type: 'payment_attempt',
      event_category: 'revenue',
      event_name: 'payment_attempt',
      properties: { amount, reportId },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment attempt:', error);
  }
}

/**
 * Track payment success
 */
export async function trackPaymentSuccess(amount: number, reference: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'payment_success',
      event_category: 'revenue',
      event_name: 'payment_success',
      properties: { amount, reference },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment success:', error);
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
      event_type: 'payment_failure',
      event_category: 'revenue',
      event_name: 'payment_failure',
      properties: { amount, reason },
      page: window.location.pathname,
    });
  } catch (error) {
    console.error('Error tracking payment failure:', error);
  }
}
