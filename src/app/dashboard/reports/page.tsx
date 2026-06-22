'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { CreateIcon, SearchIcon, EditIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { EmptyState } from '@/design-system/components/EmptyState';
import ReportCard from '@/components/dashboard/ReportCard';
import PageContainer from '@/components/layout/PageContainer';

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
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Reports</h1>
          <p className="text-muted-foreground">Manage your industrial training reports.</p>
        </div>
        <Link
          href="/dashboard/reports/create"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-16 hover:bg-accent-dark transition-colors"
        >
          <CreateIcon size={20} />
          Create Report
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        <Button
          variant="ghost"
          size="md"
          leftIcon={<EditIcon size={20} />}
        >
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={<CreateIcon size={32} />}
          title={searchQuery ? 'No reports match your search' : 'No reports yet'}
          description={searchQuery ? 'Try a different search term' : 'Create your first report to get started'}
          actionLabel={!searchQuery ? 'Create Report' : undefined}
          onAction={!searchQuery ? () => router.push('/dashboard/reports/create') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Link key={report.id} href={`/dashboard/reports/${report.id}`}>
              <ReportCard
                title={report.title}
                type={report.report_type}
                progress={report.status === 'completed' ? 100 : report.status === 'generating' ? 50 : 25}
                lastEdited={new Date(report.created_at).toLocaleDateString()}
              />
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
