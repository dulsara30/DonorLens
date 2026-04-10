export default function ExecutionDashboardError({ error, onRetry }) {
  return (
    <div className="rounded-[18px] border-2 border-rose-300 bg-rose-50 px-6 py-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-200 shrink-0">
            <svg
              className="h-4 w-4 text-rose-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-rose-900">
              Failed to load campaigns
            </h3>
            <p className="mt-1 text-sm text-rose-700">{error}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-fit rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
