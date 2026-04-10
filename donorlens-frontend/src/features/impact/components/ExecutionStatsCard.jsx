import { DollarSign, FileText, ListChecks, Target } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function calculateProgress(fundsUsed, totalPlannedCost) {
  if (!totalPlannedCost || fundsUsed === undefined || fundsUsed === null) {
    return 0;
  }
  return Math.min((fundsUsed / totalPlannedCost) * 100, 100);
}

export default function ExecutionStatsCard({ campaign, summary, executionsCount }) {
  if (!campaign) return null;

  // Calculate progress based on funds used vs total planned cost
  const progress = calculateProgress(summary?.totalFundsUsed || 0, campaign?.totalPlannedCost || 0);

  return (
    <div className="mb-6 rounded-[18px] border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{campaign.title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Completion Percentage */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-50">
            <div className="text-center">
              <div className="text-xl font-bold text-teal-600">
                {Math.round(progress)}%
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
            <DollarSign size={24} className="text-emerald-600" />
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
            <FileText size={24} className="text-blue-600" />
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
            <Target size={24} className="text-purple-600" />
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
