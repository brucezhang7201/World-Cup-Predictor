import type { AppStep } from '../types';

const STEPS: { id: AppStep; label: string }[] = [
  { id: 'intro', label: 'Start' },
  { id: 'groups', label: 'Group Stage' },
  { id: 'third-place', label: '3rd Place' },
  { id: 'bracket', label: 'Knockout' },
  { id: 'share', label: 'Share' },
];

interface Props {
  currentStep: AppStep;
}

export function ProgressBar({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-inner">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          return (
            <div key={step.id} style={{ display: 'contents' }}>
              <div className={`progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="progress-dot">
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="progress-label">{step.label}</div>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
