'use client';

import { useState } from 'react';
import { SparklesIcon, SuccessIcon, WarningIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { useReportStore } from '@/store/reportStore';
import { getGenerationSteps } from '@/lib/report-workflow';

export default function Step5AIGeneration() {
  const { studentInfo, reportType, reportStructure, weeklyLogs, setStep } = useReportStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSections, setGeneratedSections] = useState<any>({});
  const [steps, setSteps] = useState(getGenerationSteps());

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInfo,
          reportType,
          reportStructure,
          weeklyLogs,
        }),
      });

      const data = await response.json();

      // Simulate progress updates
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }

      setGeneratedSections(data.sections || {
        introduction: 'Generated introduction content...',
        companyOverview: 'Generated company overview...',
        activities: 'Generated activities content...',
        challenges: 'Generated challenges content...',
        conclusion: 'Generated conclusion content...',
      });
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    setStep(6);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">AI Generation</h2>
      <p className="text-muted-foreground mb-8">
        Our AI will transform your weekly logs into a professional academic report.
      </p>

      {!isGenerating && Object.keys(generatedSections).length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="text-primary" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to Generate Your Report
          </h3>
          <p className="text-muted-foreground mb-6">
            This will process your {weeklyLogs.length} weekly logs and generate
            {reportStructure.includeDedication ? ' dedication,' : ''}
            {reportStructure.includeAcknowledgement ? ' acknowledgement,' : ''}
            {reportStructure.includeAbstract ? ' abstract,' : ''}
            and all {reportStructure.numberOfChapters} chapters.
          </p>
          <Button
            onClick={handleGenerate}
            size="md"
          >
            Start AI Generation
          </Button>
        </Card>
      )}

      {isGenerating && (
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold text-foreground">Generating Report...</span>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.name}
                className="flex items-center gap-3 p-3 rounded-2xl bg-muted"
              >
                {index < generationProgress / 12.5 ? (
                  <SuccessIcon className="text-success" size={20} />
                ) : index === Math.floor(generationProgress / 12.5) ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-5 h-5 border-2 border-border rounded-full" />
                )}
                <span className="text-muted-foreground">{step.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {Math.round(generationProgress)}% Complete
            </p>
          </div>
        </Card>
      )}

      {!isGenerating && Object.keys(generatedSections).length > 0 && (
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SuccessIcon className="text-success" size={24} />
            <h3 className="text-lg font-semibold text-foreground">
              Report Generated Successfully!
            </h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Introduction generated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Company Overview generated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Activities generated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Challenges generated</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <SuccessIcon className="text-success" size={18} />
              <span>Conclusion generated</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handleGenerate}
              variant="ghost"
              size="md"
            >
              Regenerate
            </Button>
            <Button
              onClick={handleContinue}
              size="md"
            >
              Continue to Preview
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
