function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ExecutionStatsCard({ campaign, summary, executionsCount }) {
  if (!campaign) return null;

  return (
    <div className="mb-6 rounded-[18px] border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{campaign.title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Completion Percentage */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-50">
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">
                {Math.round(campaign.completion || summary?.completion || 0)}%
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">COMPLETION</p>
            <p className="text-sm font-semibold text-slate-900">In Progress</p>
          </div>
        </div>

        {/* Total Funds Used */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.16 5a.75.75 0 00-.712 1.05l1.25 3.5H3.75a.75.75 0 000 1.5h4.528l1.335 3.734a.75.75 0 001.406-.504l-1.25-3.5h3.272l1.335 3.734a.75.75 0 001.406-.504l-1.25-3.5H16.25a.75.75 0 000-1.5h-4.528l-1.335-3.734A.75.75 0 0010 5H8.16z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">FUNDS USED</p>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(summary?.totalFundsUsed || 0)}
            </p>
          </div>
        </div>

        {/* Number of Updates */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">UPDATES</p>
            <p className="text-sm font-semibold text-slate-900">
              {executionsCount} update{executionsCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Target Amount */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-50">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">TARGET AMOUNT</p>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(campaign?.totalPlannedCost || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
