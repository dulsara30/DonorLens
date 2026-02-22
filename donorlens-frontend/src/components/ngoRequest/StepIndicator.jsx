// Modern step indicator component showing progress through the 4-step NGO request process
// Displays circular numbered steps with labels and a connecting progress bar

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Intent & Terms' },
    { number: 2, label: 'Basic Info' },
    { number: 3, label: 'Documents' },
    { number: 4, label: 'Review' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Mobile: Vertical step indicator */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-3">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-3">
              {/* Step circle */}
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.number === currentStep
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 scale-110'
                    : step.number < currentStep
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step.number < currentStep ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>

              {/* Step label */}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors ${
                    step.number === currentStep
                      ? 'text-teal-700'
                      : step.number < currentStep
                      ? 'text-teal-600'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Step <span className="font-semibold text-teal-600">{currentStep}</span> of{' '}
            {steps.length}
          </p>
        </div>
      </div>

      {/* Desktop: Horizontal step indicator */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full">
            {/* Active progress bar */}
            <div
              className="absolute top-0 left-0 h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    step.number === currentStep
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 scale-110 shadow-lg'
                      : step.number < currentStep
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-white text-slate-500 border-2 border-slate-200'
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step label */}
                <p
                  className={`mt-3 text-sm font-medium transition-colors ${
                    step.number === currentStep
                      ? 'text-teal-700'
                      : step.number < currentStep
                      ? 'text-teal-600'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Step <span className="font-semibold text-teal-600">{currentStep}</span> of{' '}
            {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
