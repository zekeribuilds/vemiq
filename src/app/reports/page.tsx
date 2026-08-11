'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Skeleton, CardSkeleton, ListSkeleton } from '@/design-system/components/Skeleton';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setReports(reportsData || []);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Reports" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF]">Reports</h1>
            <p className="text-xs text-[#898989] mt-0.5">
              {reports.length} {reports.length === 1 ? 'report' : 'reports'}
            </p>
          </div>
          <Button
            className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-lg px-4 py-2"
            leftIcon={<VemiqIcon category="action" name="create" size={16} />}
          >
            <span className="text-sm font-medium">Generate</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <ListSkeleton count={3} />
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl text-center">
            <VemiqIcon category="empty" name="no_reports" size={40} className="mx-auto mb-3 text-[#898989]" />
            <h2 className="text-lg font-semibold text-[#FFFFFF] mb-2">No Reports Yet</h2>
            <p className="text-sm text-[#898989] mb-4">Generate reports from your evidence</p>
            <Button
              className="bg-[#6C63FF] hover:bg-[#5A52D5]"
              leftIcon={<VemiqIcon category="action" name="create" size={16} />}
            >
              <span className="text-sm font-medium">Generate Report</span>
            </Button>
          </Card>
        ) : (
          <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                    <VemiqIcon category="data" name="report" size={18} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#FFFFFF]">{report.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        report.status === 'completed' 
                          ? 'bg-[#22C55E]/20 text-[#22C55E]' 
                          : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#898989] mt-0.5">
                      {report.page_count} pages • {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg px-3 py-2"
                    leftIcon={<VemiqIcon category="action" name="download" size={14} />}
                  >
                    <span className="text-xs font-medium">Download</span>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
