'use client';

import { useState } from 'react';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
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
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        AI Generation
      </h2>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
      }}>
        Our AI will transform your weekly logs into a professional academic report.
      </p>

      {!isGenerating && Object.keys(generatedSections).length === 0 && (
        <Card style={{ padding: spacing.xl, textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: `${colors.primary}10`,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.md} auto`,
          }}>
            <div style={{ color: colors.primary }}>
              <VemiqIcon category="status" name="loading" size={32} />
            </div>
          </div>
          <h3 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            Ready to Generate Your Report
          </h3>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: colors.text.secondary,
            marginBottom: spacing.lg,
          }}>
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
        <Card style={{ padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: `4px solid ${colors.primary}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '600',
              color: colors.text.primary,
            }}>
              Generating Report...
            </span>
          </div>

          <Stack spacing="md">
            {steps.map((step, index) => (
              <div
                key={step.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: '16px',
                  backgroundColor: colors.background.elevated,
                }}
              >
                {index < generationProgress / 12.5 ? (
                  <div style={{ color: colors.success }}>
                    <VemiqIcon category="status" name="completed" size={20} />
                  </div>
                ) : index === Math.floor(generationProgress / 12.5) ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${colors.primary}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                ) : (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '50%',
                  }} />
                )}
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                }}>
                  {step.name}
                </span>
              </div>
            ))}
          </Stack>

          <div style={{ marginTop: spacing.xl }}>
            <div style={{
              width: '100%',
              backgroundColor: colors.background.elevated,
              borderRadius: '9999px',
              height: '8px',
            }}>
              <div
                style={{
                  backgroundColor: colors.primary,
                  height: '8px',
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                  width: `${generationProgress}%`,
                }}
              />
            </div>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: colors.text.secondary,
              marginTop: spacing.sm,
              textAlign: 'center',
            }}>
              {Math.round(generationProgress)}% Complete
            </p>
          </div>
        </Card>
      )}

      {!isGenerating && Object.keys(generatedSections).length > 0 && (
        <Card style={{ padding: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl }}>
            <div style={{ color: colors.success }}>
              <VemiqIcon category="status" name="success" size={24} />
            </div>
            <h3 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              color: colors.text.primary,
            }}>
              Report Generated Successfully!
            </h3>
          </div>

          <Stack spacing="md" style={{ marginBottom: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
              <div style={{ color: colors.success }}>
                <VemiqIcon category="status" name="completed" size={18} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>Introduction generated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
              <div style={{ color: colors.success }}>
                <VemiqIcon category="status" name="completed" size={18} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>Company Overview generated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
              <div style={{ color: colors.success }}>
                <VemiqIcon category="status" name="completed" size={18} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>Activities generated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
              <div style={{ color: colors.success }}>
                <VemiqIcon category="status" name="completed" size={18} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>Challenges generated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}>
              <div style={{ color: colors.success }}>
                <VemiqIcon category="status" name="completed" size={18} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px' }}>Conclusion generated</span>
            </div>
          </Stack>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
