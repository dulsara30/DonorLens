// ============================================
// CAMPAIGN REVIEW MODAL
// ============================================
// Modal for reviewing campaign details and taking actions

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  toggleCampaignStatus,
  sendCampaignWarningEmail,
} from "../../../store/slices/campaignsSlice";

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
  const dispatch = useDispatch();

  // State for email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // State for active tab
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'financials', 'updates'

  /**
   * Handle Send Warning Email
   */
  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert("Please fill in both subject and message");
      return;
    }

    if (
      !confirm(
        `Send warning email to ${campaign.createdBy?.ngoDetails?.ngoName}?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(
        sendCampaignWarningEmail({
          campaignId: campaign._id,
          subject: emailSubject,
          message: emailMessage,
        }),
      ).unwrap();

      alert("Warning email sent successfully!");
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      alert("Failed to send email: " + error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Deactivate Campaign
   */
  const handleDeactivate = async () => {
    if (
      !confirm(
        `Are you sure you want to deactivate "${campaign.title}"? The NGO will be notified.`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(
        toggleCampaignStatus({
          campaignId: campaign._id,
          action: "DEACTIVATE",
        }),
      ).unwrap();

      alert("Campaign deactivated successfully!");
      onClose();
    } catch (error) {
      alert("Failed to deactivate campaign: " + error);
    } finally {
      setLoading(false);
    }
  };

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

                {/* TODO: Backend should add executionUpdates array to Campaign model */}
                {/* For now, show placeholder */}
                <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-600">
                  <svg
                    className="w-12 h-12 text-slate-400 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="font-medium mb-1">No execution updates yet</p>
                  <p className="text-sm">
                    Execution updates will be shown here once the NGO starts
                    posting progress
                  </p>
                </div>

                {/* TODO: When backend adds executionUpdates, use this structure:
                <div className="space-y-4">
                  {campaign.executionUpdates?.map((update, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <img src={update.image} className="w-16 h-16 rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{update.title}</h4>
                          <p className="text-sm text-slate-600">{update.description}</p>
                          <div className="text-xs text-slate-500 mt-2">
                            {update.percentage}% complete • ${update.amountUsed} used
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(update.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                */}
              </div>
            )}
          </div>

          {/* Modal Footer (Action Buttons) */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEmailModal(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Warning Email
                </button>

                <button
                  onClick={handleDeactivate}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Deactivate Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal (Nested) */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Send Warning Email to {campaign.createdBy?.ngoDetails?.ngoName}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
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

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g., Terms & Conditions Violation Alert"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Describe the issue or violation..."
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              {/* Campaign Info Display */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-900 mb-2">
                  Campaign Details:
                </div>
                <div className="text-sm text-yellow-800 space-y-1">
                  <div>Title: {campaign.title}</div>
                  <div>Status: {campaign.status}</div>
                  <div>
                    Raised: {formatCurrency(campaign.raisedAmount)} of{" "}
                    {formatCurrency(campaign.totalPlannedCost)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
