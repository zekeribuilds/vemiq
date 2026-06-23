'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { EmptyState } from '@/design-system/components/EmptyState';
import { Container, Stack, Grid } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import ReportCard from '@/components/dashboard/ReportCard';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.report_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container size="lg">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl }}>
        <div>
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '30px',
            fontWeight: '700',
            color: colors.primary,
            marginBottom: spacing.sm,
          }}>
            Reports
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            Manage your industrial training reports.
          </p>
        </div>
        <Link
          href="/dashboard/reports/create"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.primary,
            color: colors.text.primary,
            borderRadius: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.primary}CC`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          <div style={{ color: colors.text.primary }}>
            <VemiqIcon category="action" name="create" size={20} />
          </div>
          Create Report
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <div style={{ position: 'relative', width: '384px' }}>
          <div style={{ position: 'absolute', left: spacing.sm, top: '50%', transform: 'translateY(-50%)', color: colors.text.secondary }}>
            <VemiqIcon category="action" name="search" size={20} />
          </div>
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: spacing.xl }}
          />
        </div>
        <Button
          variant="ghost"
          size="md"
          icon="edit"
          iconPosition="left"
        >
          Filter
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: spacing['3xl'] }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `4px solid ${colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
            marginBottom: spacing.md,
          }} />
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            Loading reports...
          </p>
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon="no_reports"
          title={searchQuery ? 'No reports match your search' : 'No reports yet'}
          description={searchQuery ? 'Try a different search term' : 'Create your first report to get started'}
          actionLabel={!searchQuery ? 'Create Report' : undefined}
          onAction={!searchQuery ? () => router.push('/dashboard/reports/create') : undefined}
        />
      ) : (
        <Grid columns={3} gap="lg">
          {filteredReports.map((report) => (
            <Link key={report.id} href={`/dashboard/reports/${report.id}`} style={{ textDecoration: 'none' }}>
              <ReportCard
                title={report.title}
                type={report.report_type}
                progress={report.status === 'completed' ? 100 : report.status === 'generating' ? 50 : 25}
                lastEdited={new Date(report.created_at).toLocaleDateString()}
              />
            </Link>
          ))}
        </Grid>
      )}
    </Container>
  );
}
