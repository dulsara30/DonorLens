import { X, Calendar, DollarSign, Zap } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/executionUtils";

export default function ExecutionDetailModal({ execution, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header with Background */}
        <div className="relative bg-linear-to-br from-teal-600 to-teal-700 px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
          >
            <X size={20} className="text-white" />
          </button>
          <h2 className="text-3xl font-bold">{execution.title}</h2>
          <div className="mt-3 flex items-center gap-2 text-teal-100">
            <Calendar size={16} />
            <span className="text-sm">
              {new Date(execution.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-linear-to-br from-teal-50 to-cyan-50 border border-teal-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-teal-100 p-2">
                  <DollarSign size={16} className="text-teal-600" />
                </div>
                <p className="text-xs font-semibold text-teal-700">FUNDS USED</p>
              </div>
              <p className="text-2xl font-bold text-teal-600">
                {formatCurrency(execution.fundsUsed || 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-emerald-100 p-2">
                  <Zap size={16} className="text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-emerald-700">PROGRESS</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {execution.progressPercentage || execution.progress || 0}%
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Description</h3>
            <div className="rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 p-5 border border-slate-200">
              <p className="text-base text-slate-700 leading-relaxed">{execution.description}</p>
            </div>
          </div>

          {/* Evidence Photos */}
          {execution.evidencePhotos?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Evidence Photos</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {execution.evidencePhotos.map((photo, index) => (
                  <a
                    key={`${photo.public_id || index}`}
                    href={photo.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 transition hover:border-teal-400"
                  >
                    <img
                      src={photo.secure_url}
                      alt={`Evidence ${index + 1}`}
                      className="h-40 w-full object-cover transition group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                      <div className="rounded-full bg-white/90 p-3 opacity-0 transition group-hover:opacity-100">
                        <svg
                          className="h-6 w-6 text-teal-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Receipts */}
          {execution.receipts?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Receipts</h3>
              <div className="space-y-3">
                {execution.receipts.map((receipt, index) => (
                  <a
                    key={`${receipt.public_id || index}`}
                    href={receipt.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 p-4 transition hover:border-teal-400 hover:from-teal-50 hover:to-cyan-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 transition group-hover:bg-teal-200">
                      <svg
                        className="h-6 w-6 text-slate-600 transition group-hover:text-teal-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Receipt {index + 1}</p>
                      <p className="text-xs text-slate-500">Click to view</p>
                    </div>
                    <svg
                      className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* No Media Message */}
          {(!execution.evidencePhotos?.length && !execution.receipts?.length) && (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-slate-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium text-slate-600">No evidence photos or receipts attached</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
