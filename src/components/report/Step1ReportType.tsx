'use client';

import { DocumentsIcon, BriefcaseIcon, SparklesIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { useReportStore } from '@/store/reportStore';

export default function Step1ReportType() {
  const { setReportType, setStep, reportType } = useReportStore();

  const handleSelect = (type: 'SWEP' | 'SIWES') => {
    setReportType(type);
    setStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <SparklesIcon size={16} />
          <span>Step 1 of 7</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Select Report Type</h2>
        <p className="text-muted-foreground">Choose the type of industrial training report you want to create.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          onClick={() => handleSelect('SWEP')}
          variant="secondary"
          size="lg"
          className={`p-8 border-2 rounded-3xl transition-all duration-300 ${
            reportType === 'SWEP'
              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
              : 'border-border hover:border-primary'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-all ${
              reportType === 'SWEP'
                ? 'bg-gradient-to-br from-primary to-accent shadow-lg'
                : 'bg-primary/10'
            }`}>
              <BriefcaseIcon className={reportType === 'SWEP' ? 'text-white' : 'text-primary'} size={36} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">SWEP Report</h3>
            <p className="text-muted-foreground text-sm">
              Short-term industrial work experience program report
            </p>
          </div>
        </Button>

        <Button
          onClick={() => handleSelect('SIWES')}
          variant="secondary"
          size="lg"
          className={`p-8 border-2 rounded-3xl transition-all duration-300 ${
            reportType === 'SIWES'
              ? 'border-success bg-success/10 shadow-lg shadow-success/20'
              : 'border-border hover:border-success'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transition-all ${
              reportType === 'SIWES'
                ? 'bg-gradient-to-br from-success to-emerald-600 shadow-lg'
                : 'bg-success/10'
            }`}>
              <DocumentsIcon className={reportType === 'SIWES' ? 'text-white' : 'text-success'} size={36} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">SIWES Report</h3>
            <p className="text-muted-foreground text-sm">
              Students industrial work experience scheme report
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
