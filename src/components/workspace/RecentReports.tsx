'use client';

import { motion } from 'framer-motion';
import { DocumentsIcon, OrganizationIcon, ArrowRightIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import MobileProgressBar from '@/components/mobile/MobileProgressBar';

interface Report {
  id: string;
  name: string;
  institution: string;
  organization: string;
  progress: number;
  lastEdited: string;
  status: 'Draft' | 'In Progress' | 'Ready for Review';
}

interface RecentReportsProps {
  reports: Report[];
  onViewReport: (id: string) => void;
  onViewAll: () => void;
}

const statusColors = {
  'Draft': 'bg-tertiary/10 text-tertiary',
  'In Progress': 'bg-success/10 text-success',
  'Ready for Review': 'bg-success/10 text-success',
};

export default function RecentReports({ reports, onViewReport, onViewAll }: RecentReportsProps) {
  const displayReports = reports.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-primary">Recent Reports</h3>
        {reports.length > 3 && (
          <Button onClick={onViewAll} variant="ghost" size="sm">
            View All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayReports.map((report) => (
          <div
            key={report.id}
            onClick={() => onViewReport(report.id)}
            className="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:bg-elevated transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary mb-1">{report.name}</h4>
                <div className="flex items-center gap-2 text-xs text-tertiary">
                  <OrganizationIcon size={12} />
                  <span>{report.institution}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                {report.status}
              </span>
            </div>

            <MobileProgressBar progress={report.progress} showLabel={false} />

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-tertiary">Edited: {report.lastEdited}</span>
              <ArrowRightIcon size={16} className="text-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
