function StepBadge({ step, label, active, completed }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${completed
          ? 'bg-teal-600 text-white'
          : active
            ? 'bg-teal-600 text-white ring-4 ring-teal-100'
            : 'bg-slate-200 text-slate-500'
          }`}
      >
        {completed ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span
        className={`text-sm font-medium hidden sm:block ${active ? 'text-teal-700' : completed ? 'text-teal-600' : 'text-slate-400'
          }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepConnector({ completed }) {
  return (
    <div
      className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${completed ? 'bg-teal-500' : 'bg-slate-200'
        }`}
    />
  );
}

export default function DonateStepIndicator({ currentStep }) {
  return (
    <div className="flex items-center mb-10 px-2">
      <StepBadge step={1} label="Choose Amount" active={currentStep === 1} completed={currentStep > 1} />
      <StepConnector completed={currentStep > 1} />
      <StepBadge step={2} label="Your Details" active={currentStep === 2} completed={currentStep > 2} />
      <StepConnector completed={currentStep > 2} />
      <StepBadge step={3} label="Review & Pay" active={currentStep === 3} completed={false} />
    </div>
  );
}
