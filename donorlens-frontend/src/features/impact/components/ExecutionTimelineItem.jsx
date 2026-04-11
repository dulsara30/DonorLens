/**
 * ExecutionTimelineItem Component
 * Shared timeline item used in both NGO dashboard and donor side
 */

import { FileText, Trash2, Eye, Lock } from "lucide-react";
import { formatCurrency, formatDate, canEditExecution, extractPhotoUrl, extractFileInfo } from "../utils/executionUtils";

function ExecutionTimelineItem({
  execution,
  progressPercentage,
  onEdit,
  onDelete,
  variant = "compact",
  showActions = false,
  campaignId,
  setSelectedImage,
}) {
  const isFull = variant === "full";

  // NGO Dashboard variant - with edit/delete actions
  if (isFull) {
    return (
      <div className="relative flex gap-6 pb-8">
        {/* Timeline Circle and Line */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-slate-200 bg-teal-600 font-semibold text-white">
            {Math.round(progressPercentage)}%
          </div>
          <div className="mt-4 h-12 w-1 bg-slate-200"></div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{execution.title}</h3>
              <p className="text-sm text-slate-500">{formatDate(execution.date)}</p>
            </div>

            {/* Actions */}
            {showActions && !execution.isDefault && (
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
                      onClick={() => onDelete?.(execution._id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Delete execution"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
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

          {/* Evidence and Funds */}
          <div className="mt-4 flex items-end justify-between gap-4">
            {/* Photos */}
            {execution.evidencePhotos?.length > 0 && (
              <div className="flex gap-2">
                {execution.evidencePhotos.slice(0, 3).map((photo, index) => (
                  <img
                    key={`${photo.public_id || index}`}
                    src={extractPhotoUrl(photo)}
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

            {/* Funds */}
            <p className="text-right text-lg font-semibold text-teal-600">
              {formatCurrency(execution.fundsUsed || 0)} used
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Donor side variant - compact timeline view
  return (
    <div className="mb-8 relative">
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-sm shadow-lg z-20">
        <span className="text-center leading-tight">{Math.round(progressPercentage)}%</span>
      </div>

      {/* Content card */}
      <div className="ml-20 rounded-lg bg-slate-50 p-6 border border-slate-200">
        {/* Title and Date */}
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <h4 className="font-bold text-slate-900 text-lg">{execution.title}</h4>
          <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(execution.date)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{execution.description}</p>

        {/* Funds Used Badge */}
        <p className="text-sm font-semibold text-teal-700 mb-4">
          {formatCurrency(execution.fundsUsed)} used
        </p>

        {/* Photos and Documents Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Evidence Photos */}
          {execution.evidencePhotos && execution.evidencePhotos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Photos ({execution.evidencePhotos.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {execution.evidencePhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer w-20 h-20 rounded-lg border-2 border-slate-200 hover:border-teal-600 transition overflow-hidden hover:shadow-md"
                    onClick={() => setSelectedImage?.(extractPhotoUrl(photo))}
                    style={{
                      backgroundImage: `url('${extractPhotoUrl(photo)}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#e2e8f0",
                    }}
                    title="Click to view full size"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Receipts/Documents */}
          {execution.receipts && execution.receipts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Documents ({execution.receipts.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {execution.receipts.map((receipt, index) => {
                  const { fileUrl, fileName } = extractFileInfo(receipt);
                  if (!fileUrl) return null;

                  return (
                    <a
                      key={index}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition hover:shadow-md"
                      title={fileName}
                    >
                      <FileText size={16} className="shrink-0" />
                      <span className="truncate max-w-40">{fileName}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExecutionTimelineItem;
