'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { getAllBetaUsers, approveBetaUser, rejectBetaUser, getOnboardingFunnelMetrics } from '@/lib/beta-access';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    logbooksCreated: 0,
    weeksCreated: 0,
    entriesCreated: 0,
    uploadsCreated: 0,
    reportsCreated: 0,
    reportsGenerated: 0,
    exports: 0,
    payments: 0,
    revenue: 0,
    openFeedback: 0,
    resolvedFeedback: 0,
    day1Retention: 0,
    day7Retention: 0,
    day30Retention: 0,
  });

  const [betaUsers, setBetaUsers] = useState<any[]>([]);
  const [onboardingFunnel, setOnboardingFunnel] = useState<any>(null);
  const [topErrors, setTopErrors] = useState<any[]>([]);
  const [topFeedback, setTopFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchBetaUsers();
    fetchOnboardingFunnel();
    fetchTopErrors();
    fetchTopFeedback();
  }, []);

  const fetchMetrics = async () => {
    try {
      const supabase = createClient();

      // Time calculations
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // User metrics
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: approvedUsers } = await supabase.from('beta_users').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      
      // Daily active users (last 24 hours)
      const { count: dailyActiveUsers } = await supabase.from('activity_events').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo);
      
      // Weekly active users (last 7 days)
      const { count: weeklyActiveUsers } = await supabase.from('activity_events').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo);

      // Product metrics
      const { count: logbooksCreated } = await supabase.from('logbooks').select('*', { count: 'exact', head: true });
      const { count: weeksCreated } = await supabase.from('weekly_logs').select('*', { count: 'exact', head: true });
      const { count: entriesCreated } = await supabase.from('logbook_entries').select('*', { count: 'exact', head: true });
      const { count: uploadsCreated } = await supabase.from('uploads').select('*', { count: 'exact', head: true });
      const { count: reportsCreated } = await supabase.from('reports').select('*', { count: 'exact', head: true });
      const { count: reportsGenerated } = await supabase.from('report_sections').select('*', { count: 'exact', head: true });

      // Revenue metrics
      const { count: exports } = await supabase.from('report_versions').select('*', { count: 'exact', head: true });
      const { count: payments } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'completed');
      const { data: paymentsData } = await supabase.from('payments').select('amount').eq('status', 'completed');
      const revenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Feedback metrics
      const { count: openFeedback } = await supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: resolvedFeedback } = await supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'resolved');

      // Retention metrics (simplified calculation)
      const { count: usersCreated1DayAgo } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo);
      const { count: usersCreated7DaysAgo } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo);
      const { count: usersCreated30DaysAgo } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo);

      const { count: active1Day } = await supabase.from('activity_events').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo);
      const { count: active7Day } = await supabase.from('activity_events').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo);
      const { count: active30Day } = await supabase.from('activity_events').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo);

      const day1Retention = usersCreated1DayAgo && usersCreated1DayAgo > 0 ? ((active1Day || 0) / usersCreated1DayAgo) * 100 : 0;
      const day7Retention = usersCreated7DaysAgo && usersCreated7DaysAgo > 0 ? ((active7Day || 0) / usersCreated7DaysAgo) * 100 : 0;
      const day30Retention = usersCreated30DaysAgo && usersCreated30DaysAgo > 0 ? ((active30Day || 0) / usersCreated30DaysAgo) * 100 : 0;

      setMetrics({
        totalUsers: totalUsers || 0,
        approvedUsers: approvedUsers || 0,
        dailyActiveUsers: dailyActiveUsers || 0,
        weeklyActiveUsers: weeklyActiveUsers || 0,
        logbooksCreated: logbooksCreated || 0,
        weeksCreated: weeksCreated || 0,
        entriesCreated: entriesCreated || 0,
        uploadsCreated: uploadsCreated || 0,
        reportsCreated: reportsCreated || 0,
        reportsGenerated: reportsGenerated || 0,
        exports: exports || 0,
        payments: payments || 0,
        revenue,
        openFeedback: openFeedback || 0,
        resolvedFeedback: resolvedFeedback || 0,
        day1Retention,
        day7Retention,
        day30Retention,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBetaUsers = async () => {
    const users = await getAllBetaUsers();
    setBetaUsers(users);
  };

  const fetchOnboardingFunnel = async () => {
    const funnel = await getOnboardingFunnelMetrics();
    setOnboardingFunnel(funnel);
  };

  const fetchTopErrors = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_name, event_type, properties')
        .eq('event_category', 'error')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTopErrors(data || []);
    } catch (error) {
      console.error('Error fetching top errors:', error);
    }
  };

  const fetchTopFeedback = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTopFeedback(data || []);
    } catch (error) {
      console.error('Error fetching top feedback:', error);
    }
  };

  const handleApprove = async (userId: string) => {
    await approveBetaUser(userId);
    fetchBetaUsers();
    fetchMetrics();
  };

  const handleReject = async (userId: string) => {
    await rejectBetaUser(userId);
    fetchBetaUsers();
    fetchMetrics();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        {/* User Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">User Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Users" value={metrics.totalUsers} />
            <MetricCard label="Approved Users" value={metrics.approvedUsers} />
            <MetricCard label="Daily Active" value={metrics.dailyActiveUsers} />
            <MetricCard label="Weekly Active" value={metrics.weeklyActiveUsers} />
          </div>
        </Card>

        {/* Product Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Product Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Logbooks" value={metrics.logbooksCreated} />
            <MetricCard label="Weeks" value={metrics.weeksCreated} />
            <MetricCard label="Entries" value={metrics.entriesCreated} />
            <MetricCard label="Uploads" value={metrics.uploadsCreated} />
            <MetricCard label="Reports Created" value={metrics.reportsCreated} />
            <MetricCard label="Reports Generated" value={metrics.reportsGenerated} />
          </div>
        </Card>

        {/* Revenue Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Exports" value={metrics.exports} />
            <MetricCard label="Payments" value={metrics.payments} />
            <MetricCard label="Revenue" value={`₦${metrics.revenue.toLocaleString()}`} />
          </div>
        </Card>

        {/* Feedback Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Feedback Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Open Feedback" value={metrics.openFeedback} />
            <MetricCard label="Resolved Feedback" value={metrics.resolvedFeedback} />
          </div>
        </Card>

        {/* Retention Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Retention Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Day 1 Retention" value={`${metrics.day1Retention.toFixed(1)}%`} />
            <MetricCard label="Day 7 Retention" value={`${metrics.day7Retention.toFixed(1)}%`} />
            <MetricCard label="Day 30 Retention" value={`${metrics.day30Retention.toFixed(1)}%`} />
          </div>
        </Card>

        {/* Onboarding Funnel */}
        {onboardingFunnel && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Onboarding Funnel</h2>
            <div className="space-y-3">
              <FunnelStep label="Waitlist" value={onboardingFunnel.waitlist} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Approved" value={onboardingFunnel.approved} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Account Created" value={onboardingFunnel.account_created} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Profile Completed" value={onboardingFunnel.profile_completed} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Logbook Created" value={onboardingFunnel.logbook_created} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Report Created" value={onboardingFunnel.report_created} total={onboardingFunnel.waitlist} />
              <FunnelStep label="Exported" value={onboardingFunnel.exported} total={onboardingFunnel.waitlist} />
            </div>
          </Card>
        )}

        {/* Top Errors */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Top Errors</h2>
          <div className="space-y-2">
            {topErrors.length > 0 ? (
              topErrors.map((error, index) => (
                <div key={index} className="p-3 bg-background-secondary rounded-lg">
                  <div className="text-foreground font-medium">{error.event_name}</div>
                  <div className="text-sm text-muted-foreground">{error.event_type}</div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No errors recorded</div>
            )}
          </div>
        </Card>

        {/* Top Feedback */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Top Feedback Requests</h2>
          <div className="space-y-2">
            {topFeedback.length > 0 ? (
              topFeedback.map((feedback, index) => (
                <div key={index} className="p-3 bg-background-secondary rounded-lg">
                  <div className="text-foreground font-medium">{feedback.type}</div>
                  <div className="text-sm text-muted-foreground">{feedback.message?.substring(0, 100)}...</div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No feedback recorded</div>
            )}
          </div>
        </Card>

        {/* Beta Users */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Beta Users</h2>
          <div className="space-y-2">
            {betaUsers.map((betaUser) => (
              <div key={betaUser.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div>
                  <div className="text-foreground font-medium">{betaUser.user_id}</div>
                  <div className="text-sm text-muted-foreground">
                    Status: <span className={`font-medium ${
                      betaUser.status === 'approved' ? 'text-[#22C55E]' :
                      betaUser.status === 'rejected' ? 'text-[#EF4444]' :
                      'text-[#F59E0B]'
                    }`}>{betaUser.status}</span>
                  </div>
                </div>
                {betaUser.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(betaUser.user_id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleReject(betaUser.user_id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-background-secondary rounded-lg">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FunnelStep({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  return (
    <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-foreground font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{value} users</div>
      </div>
      <div className="text-sm font-semibold text-primary">{percentage}%</div>
    </div>
  );
}
