'use client';

import { useReportStore } from '@/store/reportStore';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Input } from '@/design-system/components/Input';
import { Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import { VemiqIcon } from '@/components/VemiqIcon';

export default function Step3ReportStructure() {
  const { reportStructure, setReportStructure, setStep } = useReportStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
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
        Report Structure
      </h2>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
      }}>
        Customize the sections you want in your report.
      </p>

      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <Card style={{ padding: spacing.xl }}>
            <label style={{
              display: 'block',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Number of Chapters
            </label>
            <select
              value={reportStructure.numberOfChapters}
              onChange={(e) => setReportStructure({ numberOfChapters: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.primary,
                backgroundColor: colors.background.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <option value={3}>3 Chapters</option>
              <option value={4}>4 Chapters</option>
              <option value={5}>5 Chapters</option>
              <option value={6}>6 Chapters</option>
            </select>
          </Card>

          <div>
            <h3 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
              Include Sections
            </h3>

            <Stack spacing="sm">
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.surface;
              }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: reportStructure.includeDedication ? colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                  onClick={() => setReportStructure({ includeDedication: !reportStructure.includeDedication })}
                >
                  {reportStructure.includeDedication && (
                    <div style={{ color: colors.text.primary }}>
                      <VemiqIcon category="status" name="completed" size={12} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                }}>
                  Dedication
                </span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.surface;
              }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: reportStructure.includeAcknowledgement ? colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                  onClick={() => setReportStructure({ includeAcknowledgement: !reportStructure.includeAcknowledgement })}
                >
                  {reportStructure.includeAcknowledgement && (
                    <div style={{ color: colors.text.primary }}>
                      <VemiqIcon category="status" name="completed" size={12} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                }}>
                  Acknowledgement
                </span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.surface;
              }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: reportStructure.includeAbstract ? colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                  onClick={() => setReportStructure({ includeAbstract: !reportStructure.includeAbstract })}
                >
                  {reportStructure.includeAbstract && (
                    <div style={{ color: colors.text.primary }}>
                      <VemiqIcon category="status" name="completed" size={12} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                }}>
                  Abstract
                </span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.surface;
              }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: reportStructure.includeTableOfContents ? colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                  onClick={() => setReportStructure({ includeTableOfContents: !reportStructure.includeTableOfContents })}
                >
                  {reportStructure.includeTableOfContents && (
                    <div style={{ color: colors.text.primary }}>
                      <VemiqIcon category="status" name="completed" size={12} />
                    </div>
                  )}
                </div>
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                }}>
                  Table of Contents
                </span>
              </label>
            </Stack>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="button"
              onClick={() => setStep(2)}
              variant="ghost"
              size="md"
            >
              Back
            </Button>
            <Button
              type="submit"
              size="md"
            >
              Continue
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}
