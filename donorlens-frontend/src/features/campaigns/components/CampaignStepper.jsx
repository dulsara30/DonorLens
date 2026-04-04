const steps = [
  "Basic Information",
  "Media & Documents",
  "Financial Breakdown",
  "Review & Submit",
];

export default function CampaignStepper({ currentStep }) {
  return (
    <div className="mb-8 flex w-full items-center gap-4 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div
            key={step}
            className="flex min-w-[220px] flex-1 items-center gap-3"
          >
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold ${
                isCompleted || isActive
                  ? "bg-teal-600 text-white ring-4 ring-teal-100"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isCompleted ? "✓" : stepNumber}
            </div>

            <span className="whitespace-nowrap text-base font-semibold text-slate-800">
              {step}
            </span>

            {index < steps.length - 1 && (
              <div
                className={`ml-2 h-1 flex-1 rounded-full ${
                  currentStep > stepNumber ? "bg-teal-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}