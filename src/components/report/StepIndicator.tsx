import { CheckIcon } from '@/design-system';
import { reportWorkflowSteps } from '@/lib/report-workflow';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {reportWorkflowSteps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = step.id;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-md flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#22C55E] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#22C55E] text-white shadow-sm scale-110'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckIcon size={20} /> : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium transition-colors ${
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < reportWorkflowSteps.slice(0, totalSteps).length - 1 && (
                <div
                  className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-[#22C55E]' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
