'use client';

import StepIndicator from '@/components/report/StepIndicator';
import Step1ReportType from '@/components/report/Step1ReportType';
import Step2StudentInfo from '@/components/report/Step2StudentInfo';
import Step3ReportStructure from '@/components/report/Step3ReportStructure';
import Step4WeeklyLogs from '@/components/report/Step4WeeklyLogs';
import Step5AIGeneration from '@/components/report/Step5AIGeneration';
import Step6Preview from '@/components/report/Step6Preview';
import Step7Export from '@/components/report/Step7Export';
import { useReportStore } from '@/store/reportStore';
import PageContainer from '@/components/layout/PageContainer';

const TOTAL_STEPS = 7;

export default function CreateReportPage() {
  const { currentStep } = useReportStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ReportType />;
      case 2:
        return <Step2StudentInfo />;
      case 3:
        return <Step3ReportStructure />;
      case 4:
        return <Step4WeeklyLogs />;
      case 5:
        return <Step5AIGeneration />;
      case 6:
        return <Step6Preview />;
      case 7:
        return <Step7Export />;
      default:
        return <Step1ReportType />;
    }
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Create Report</h1>
        <p className="text-muted-foreground">Follow the steps to create your industrial training report.</p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {renderStep()}
    </PageContainer>
  );
}
