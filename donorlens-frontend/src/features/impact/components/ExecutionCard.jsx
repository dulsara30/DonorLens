import { useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2, Eye, Lock } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

// Check if execution can be edited (must be within 24 hours of creation)
function canEditExecution(execution) {
  if (!execution.createdAt) return false;
  
  const createdTime = new Date(execution.createdAt).getTime();
  const now = new Date().getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
  
  return (now - createdTime) < twentyFourHoursInMs;
}

function getTimeRemainingToEdit(execution) {
  if (!execution.createdAt) return null;
  
  const createdTime = new Date(execution.createdAt).getTime();
  const now = new Date().getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
  const timeRemaining = twentyFourHoursInMs - (now - createdTime);
  
  if (timeRemaining <= 0) return "Expired";
  
  const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

const ExecutionCard = ({ execution, onDelete, onEdit, campaign, cumulativeFundsUsed }) => {
  const { campaignId } = useParams();
  
  // Calculate progress based on cumulative funds used vs total planned cost
  let progressPercentage = 0;
  
  // Use cumulative funds if provided, otherwise use individual execution funds
  const fundsToUse = cumulativeFundsUsed !== undefined ? cumulativeFundsUsed : execution.fundsUsed;
  
  console.log("🔍 ExecutionCard Debug:", {
    executionFundsUsed: execution.fundsUsed,
    cumulativeFundsUsed: cumulativeFundsUsed,
    campaignTotalPlannedCost: campaign?.totalPlannedCost,
    executionProgress: execution.progress,
  });
  
  if (campaign?.totalPlannedCost && fundsToUse !== undefined && fundsToUse !== null) {
    // Calculate progress based on funds used vs total planned cost
    progressPercentage = Math.min(
      (fundsToUse / campaign.totalPlannedCost) * 100,
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
            <div className="flex gap-2">
              {canEditExecution(execution) ? (
                <>
                  <a
                    href={`/admin/campaign-executions/${campaignId}/${execution._id}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-teal-50 hover:text-teal-600"
                    title="View & edit execution details"
                  >
                    <Eye size={18} />
                  </a>
                  <button
                    onClick={() => onDelete(execution._id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Delete execution"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600"
                  title="This update is locked - can only be edited within 24 hours of creation"
                >
                  <Lock size={16} />
                  <span>Locked</span>
                </div>
              )}
            </div>
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