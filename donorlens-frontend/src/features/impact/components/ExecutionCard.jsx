import { Trash2 } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const ExecutionCard = ({ execution, onDelete, onEdit, campaign }) => {
  // Calculate progress based on funds used vs total planned cost
  let progressPercentage = 0;
  
  console.log("🔍 ExecutionCard Debug:", {
    executionFundsUsed: execution.fundsUsed,
    campaignTotalPlannedCost: campaign?.totalPlannedCost,
    executionProgress: execution.progress,
  });
  
  if (campaign?.totalPlannedCost && execution.fundsUsed !== undefined && execution.fundsUsed !== null) {
    // Calculate progress based on funds used vs total planned cost
    progressPercentage = Math.min(
      (execution.fundsUsed / campaign.totalPlannedCost) * 100,
      100
    );
  } else {
    progressPercentage = execution.progress || execution.progressPercentage || 0;
  }

  return (
    <div className="relative flex gap-6 pb-8">
      {/* Timeline Circle and Line */}
      <div className="flex flex-col items-center">
        {/* Progress Circle */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-slate-200 bg-teal-600 font-semibold text-white">
          {Math.round(progressPercentage)}%
        </div>
        {/* Timeline Line */}
        <div className="mt-4 h-12 w-1 bg-slate-200"></div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        {/* Header with Title and Date */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{execution.title}</h3>
            <p className="text-sm text-slate-500">
              {new Date(execution.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>

          {/* Delete Button - Only show for real executions, not default launch */}
          {!execution.isDefault && (
            <button
              onClick={() => onDelete(execution._id)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              title="Delete execution"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="mt-2 text-slate-600">{execution.description}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Funds and Images Container */}
        <div className="mt-4 flex items-end justify-between gap-4">
          {/* Evidence Photos */}
          {execution.evidencePhotos?.length > 0 && (
            <div className="flex gap-2">
              {execution.evidencePhotos.slice(0, 3).map((photo, index) => (
                <img
                  key={`${photo.public_id || index}`}
                  src={photo.secure_url}
                  alt={`Evidence ${index + 1}`}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                />
              ))}
              {execution.evidencePhotos.length > 3 && (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-medium text-slate-600">
                  +{execution.evidencePhotos.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Funds Used Amount */}
          <p className="text-right text-lg font-semibold text-teal-600">
            {formatCurrency(execution.fundsUsed || 0)} used
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutionCard;