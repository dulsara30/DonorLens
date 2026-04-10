export default function ExecutionDashboardEmpty({ onCreateCampaign }) {
  return (
    <div className="rounded-[18px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
          <svg
            className="h-6 w-6 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          No campaigns yet
        </h3>
        <p className="text-sm text-slate-600">
          Create a campaign first to add execution updates
        </p>
        <button
          onClick={onCreateCampaign}
          className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
}
