import { VemiqIcon } from '@/components/VemiqIcon';
import { reportWorkflowSteps } from '@/lib/report-workflow';
import { colors, spacing } from '@/design-system/tokens/index';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div style={{ width: '100%', marginBottom: spacing.xl }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {reportWorkflowSteps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = step.id;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backgroundColor: isCompleted || isCurrent ? colors.success : colors.background.elevated,
                    color: isCompleted || isCurrent ? colors.text.primary : colors.text.muted,
                    boxShadow: isCompleted || isCurrent ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {isCompleted ? (
                    <div style={{ color: colors.text.primary }}>
                      <VemiqIcon category="status" name="completed" size={20} />
                    </div>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    marginTop: spacing.xs,
                    textAlign: 'center',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                    color: isCurrent ? colors.primary : colors.text.muted,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {index < reportWorkflowSteps.slice(0, totalSteps).length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    margin: `0 ${spacing.sm}`,
                    borderRadius: '9999px',
                    transition: 'all 0.3s ease',
                    backgroundColor: isCompleted ? colors.success : colors.background.elevated,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
