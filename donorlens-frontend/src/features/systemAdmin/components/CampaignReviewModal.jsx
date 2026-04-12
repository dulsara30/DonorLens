// ============================================
// CAMPAIGN REVIEW MODAL
// ============================================
// Modal for reviewing campaign details and taking actions

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCampaignExecutionsAPI } from "../api";

/**
 * SDG GOALS DATA (same as parent component)
 */
const SDG_GOALS = [
  { number: 1, name: "No Poverty", color: "#E5243B" },
  { number: 2, name: "Zero Hunger", color: "#DDA63A" },
  { number: 3, name: "Good Health", color: "#4C9F38" },
  { number: 4, name: "Quality Education", color: "#C5192D" },
  { number: 5, name: "Gender Equality", color: "#FF3A21" },
  { number: 6, name: "Clean Water", color: "#26BDE2" },
  { number: 7, name: "Affordable Energy", color: "#FCC30B" },
  { number: 8, name: "Decent Work", color: "#A21942" },
  { number: 9, name: "Industry & Innovation", color: "#FD6925" },
  { number: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { number: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { number: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { number: 13, name: "Climate Action", color: "#3F7E44" },
  { number: 14, name: "Life Below Water", color: "#0A97D9" },
  { number: 15, name: "Life On Land", color: "#56C02B" },
  { number: 16, name: "Peace & Justice", color: "#00689D" },
  { number: 17, name: "Partnerships", color: "#19486A" },
];

/**
 * CampaignReviewModal Component
 * Features:
 * - View full campaign details
 * - View financial breakdown
 * - View execution updates
 * - Send warning email to NGO
 * - Deactivate campaign
 */
export default function CampaignReviewModal({ campaign, onClose }) {
  // State for active tab
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'financials', 'updates'

  const {
    data: executionsPayload,
    isLoading: isExecutionLoading,
    isError: isExecutionError,
    error: executionError,
  } = useQuery({
    queryKey: ["system-admin", "campaign-executions", campaign?._id],
    queryFn: () => fetchCampaignExecutionsAPI(campaign._id),
    enabled: activeTab === "updates" && Boolean(campaign?._id),
  });

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Calculate progress percentage
   */
  const calculateProgress = (raised, total) => {
    if (!total || total === 0) return 0;
    return Math.min((raised / total) * 100, 100);
  };

  const formatExecutionDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatLkr = (amount) => {
    return `LKR ${new Intl.NumberFormat("en-US").format(Number(amount) || 0)}`;
  };

  /**
   * Get SDG info
   */
  const getSDGInfo = (number) => {
    return SDG_GOALS.find((goal) => goal.number === number) || {};
  };

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const sdgInfo = getSDGInfo(campaign.sdgGoalNumber);
  const progress = calculateProgress(
    campaign.raisedAmount,
    campaign.totalPlannedCost,
  );

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
            <div className="flex items-center gap-4">
              <img
                src={campaign.coverImage?.secure_url || "/placeholder.jpg"}
                alt={campaign.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {campaign.title}
                </h2>
                <p className="text-sm text-slate-600">
                  {campaign.createdBy?.ngoDetails?.ngoName || "Unknown NGO"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}
              >
                {campaign.status}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-slate-200">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "details"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Campaign Details
              </button>
              <button
                onClick={() => setActiveTab("financials")}
                className={`py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "financials"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Financial Breakdown
              </button>
              <button
                onClick={() => setActiveTab("updates")}
                className={`py-3 border-b-2 font-medium transition-colors ${
                  activeTab === "updates"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Execution Updates
              </button>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <img
                    src={campaign.coverImage?.secure_url || "/placeholder.jpg"}
                    alt={campaign.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Description
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line">
                    {campaign.description}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Funding Progress
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between text-lg font-semibold mb-3">
                      <span className="text-emerald-600">
                        {formatCurrency(campaign.raisedAmount)} raised
                      </span>
                      <span className="text-slate-600">
                        of {formatCurrency(campaign.totalPlannedCost)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-slate-600 mt-2">
                      {progress.toFixed(1)}% completed
                    </div>
                  </div>
                </div>

                {/* SDG Goal */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Sustainable Development Goal
                  </h3>
                  <div
                    className="p-4 rounded-lg text-white"
                    style={{ backgroundColor: sdgInfo.color }}
                  >
                    <div className="text-2xl font-bold mb-1">
                      Goal {campaign.sdgGoalNumber}
                    </div>
                    <div className="text-lg">{sdgInfo.name}</div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Location
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-emerald-600 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium text-slate-900">
                          {campaign.location?.locationName ||
                            "Location not specified"}
                        </div>
                        <div className="text-sm text-slate-600">
                          Coordinates: {campaign.location?.latitude},{" "}
                          {campaign.location?.longitude}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Timeline
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(campaign.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">End Date:</span>
                      <span className="font-medium">
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <span className="font-medium">
                        {formatDate(campaign.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NGO Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Organization Information
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">NGO Name:</span>
                      <span className="font-medium">
                        {campaign.createdBy?.ngoDetails?.ngoName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Contact Email:</span>
                      <span className="font-medium">
                        {campaign.createdBy?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Registration No:</span>
                      <span className="font-medium">
                        {campaign.createdBy?.ngoDetails?.registrationNumber ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINANCIALS TAB */}
            {activeTab === "financials" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Budget Breakdown
                  </h3>

                  {/* TODO: Backend should populate financialBreakdown array */}
                  {campaign.financialBreakdown &&
                  campaign.financialBreakdown.length > 0 ? (
                    <div className="space-y-3">
                      {campaign.financialBreakdown.map((item, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 p-4 rounded-lg flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">
                              {item.itemName}
                            </div>
                            {item.description && (
                              <div className="text-sm text-slate-600 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-bold text-emerald-600 ml-4">
                            {formatCurrency(item.cost)}
                          </div>
                        </div>
                      ))}

                      {/* Total */}
                      <div className="bg-emerald-50 p-4 rounded-lg flex justify-between items-center border-2 border-emerald-200">
                        <div className="font-bold text-slate-900">
                          Total Planned Cost
                        </div>
                        <div className="text-xl font-bold text-emerald-600">
                          {formatCurrency(campaign.totalPlannedCost)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-600">
                      No financial breakdown available
                    </div>
                  )}
                </div>

                {/* Spending Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Spending Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">
                        Total Budget
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {formatCurrency(campaign.totalPlannedCost)}
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">
                        Amount Raised
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(campaign.raisedAmount)}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">
                        Remaining
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(
                          campaign.totalPlannedCost - campaign.raisedAmount,
                        )}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">
                        Completion
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {progress.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPDATES TAB */}
            {activeTab === "updates" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Execution Updates
                </h3>

                {isExecutionLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                  </div>
                ) : isExecutionError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    Failed to load execution updates:{" "}
                    {executionError?.message || "Unknown error"}
                  </div>
                ) : (executionsPayload?.executions || []).length === 0 ? (
                  <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-600">
                    <p className="font-medium mb-1">No execution updates yet</p>
                    <p className="text-sm">
                      This campaign has no posted execution updates.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(executionsPayload?.executions || []).map(
                      (update, index) => {
                        const totalBudget =
                          Number(
                            executionsPayload?.campaign?.totalPlannedCost,
                          ) ||
                          Number(campaign?.totalPlannedCost) ||
                          0;
                        const percent = totalBudget
                          ? Math.min(
                              Math.round(
                                (Number(update?.fundsUsed || 0) / totalBudget) *
                                  100,
                              ),
                              100,
                            )
                          : 0;

                        return (
                          <div
                            key={update._id || index}
                            className="flex items-start gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center shadow">
                                {percent}%
                              </div>
                              {index !==
                                (executionsPayload?.executions || []).length -
                                  1 && (
                                <div className="w-0.5 h-24 bg-slate-300 mt-2"></div>
                              )}
                            </div>

                            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-5">
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="text-2xl font-semibold text-slate-900">
                                  {update.title}
                                </h4>
                                <span className="text-sm text-slate-500">
                                  {formatExecutionDate(update.date)}
                                </span>
                              </div>

                              <p className="text-slate-600 mt-2">
                                {update.description || "No description"}
                              </p>

                              <p className="text-teal-700 font-semibold mt-3">
                                {formatLkr(update.fundsUsed)} used
                              </p>

                              <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                  Photos ({update?.evidencePhotos?.length || 0})
                                </p>
                                {(update?.evidencePhotos || []).length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {update.evidencePhotos.map(
                                      (photo, photoIndex) => (
                                        <a
                                          key={`${update._id}-photo-${photoIndex}`}
                                          href={photo.secure_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="block"
                                        >
                                          <img
                                            src={photo.secure_url}
                                            alt={`Execution evidence ${photoIndex + 1}`}
                                            className="h-16 w-16 rounded-md object-cover border border-slate-200"
                                          />
                                        </a>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-500">
                                    No photos attached
                                  </p>
                                )}
                              </div>

                              {(update?.receipts || []).length > 0 && (
                                <div className="mt-4">
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Receipts ({update.receipts.length})
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {update.receipts.map(
                                      (receipt, receiptIndex) => (
                                        <a
                                          key={`${update._id}-receipt-${receiptIndex}`}
                                          href={receipt.secure_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-sm text-emerald-700 hover:text-emerald-900 underline"
                                        >
                                          {receipt.fileName ||
                                            `Receipt ${receiptIndex + 1}`}
                                        </a>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer (Action Buttons) */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
