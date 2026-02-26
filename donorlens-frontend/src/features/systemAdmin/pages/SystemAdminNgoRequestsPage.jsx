// ============================================
// SYSTEM ADMIN NGO REQUESTS PAGE
// ============================================
// Manage NGO registration requests with review workflow

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SystemAdminLayout from "../layout/SystemAdminLayout";
import {
  fetchNgoRequests,
  setSelectedRequest,
  clearSelectedRequest,
  setActiveFilter,
  resendPasswordEmail,
  selectAllRequests,
  selectRequestsByStatus,
  selectRequestsCountByStatus,
  selectSelectedRequest,
  selectLoading,
  selectActiveFilter,
} from "../../../store/slices/ngoRequestsSlice";
import NgoRequestDetailsModal from "../components/NgoRequestDetailsModal";

/**
 * SystemAdminNgoRequestsPage Component
 * Features:
 * - Tab-based filtering (Pending, Approved, Rejected, etc.)
 * - Request cards with key information
 * - Review modal with document viewing
 * - Approve/Reject/Request Resubmit actions
 */
export default function SystemAdminNgoRequestsPage() {
  const dispatch = useDispatch();

  // Get data from Redux store
  const allRequests = useSelector(selectAllRequests);
  const requestCounts = useSelector(selectRequestsCountByStatus);
  const selectedRequest = useSelector(selectSelectedRequest);
  const loading = useSelector(selectLoading);
  const activeFilter = useSelector(selectActiveFilter);

  /**
   * Fetch all NGO requests on component mount
   */
  useEffect(() => {
    dispatch(fetchNgoRequests());
  }, [dispatch]);

  /**
   * Get filtered requests based on active tab
   */
  const filteredRequests = useSelector((state) =>
    selectRequestsByStatus(state, activeFilter),
  );

  /**
   * Handle filter change (tab click)
   */
  const handleFilterChange = (status) => {
    dispatch(setActiveFilter(status));
  };

  /**
   * Open request review modal
   */
  const handleReviewRequest = (request) => {
    dispatch(setSelectedRequest(request));
  };

  /**
   * Close review modal
   */
  const handleCloseModal = () => {
    dispatch(clearSelectedRequest());
  };

  /**
   * Handle resend password email
   */
  const handleResendEmail = async (requestId) => {
    try {
      await dispatch(resendPasswordEmail(requestId)).unwrap();
      alert("Password setup email sent successfully!");
    } catch (error) {
      alert(`Failed to send email: ${error}`);
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Tab configuration
   */
  const tabs = [
    {
      id: "PENDING",
      label: "Pending",
      count: requestCounts.pending,
      color: "yellow",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "APPROVED",
      label: "Approved",
      count: requestCounts.approved,
      color: "green",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "REJECTED",
      label: "Rejected",
      count: requestCounts.rejected,
      color: "red",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "RESUBMIT_REQUIRED",
      label: "Resubmit Required",
      count: requestCounts.resubmit,
      color: "orange",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      id: "DEACTIVATED",
      label: "Deactivated",
      count: requestCounts.deactivated,
      color: "slate",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            NGO Registration Requests
          </h1>
          <p className="text-slate-600 mt-1">
            Review and manage NGO registration applications
          </p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeFilter === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-800 shadow-sm`
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
                style={
                  activeFilter === tab.id
                    ? {
                        backgroundColor: getColorByName(tab.color, 100),
                        color: getColorByName(tab.color, 800),
                      }
                    : undefined
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className="px-2 py-0.5 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: getColorByName(tab.color, 200),
                      color: getColorByName(tab.color, 900),
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Loading requests...</p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-slate-300 mx-auto mb-4"
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
            <p className="text-slate-600 font-medium">No requests found</p>
            <p className="text-slate-500 text-sm mt-1">
              There are no {activeFilter.toLowerCase().replace("_", " ")}{" "}
              requests at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <NgoRequestCard
                key={request._id}
                request={request}
                onReview={handleReviewRequest}
                onResendEmail={handleResendEmail}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <NgoRequestDetailsModal
          request={selectedRequest}
          onClose={handleCloseModal}
        />
      )}
    </SystemAdminLayout>
  );
}

/**
 * NgoRequestCard Component
 * Displays individual NGO request information
 */
function NgoRequestCard({ request, onReview, onResendEmail, formatDate }) {
  const ngo = request.ngoDetails;
  console.log(
    "Rendering NgoRequestCard for NGO:",
    ngo.ngoName,
    "with status:",
    ngo.status,
    "and request ID:",
    request._id,
  );
  const status = ngo.status;

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "RESUBMIT_REQUIRED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "DEACTIVATED":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start gap-4">
          {/* NGO Logo/Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {ngo.ngoName?.charAt(0).toUpperCase() || "N"}
          </div>

          {/* NGO Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {ngo.ngoName || "Unnamed Organization"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {ngo.description?.substring(0, 80) || "No description provided"}
              {ngo.description?.length > 80 && "..."}
            </p>

            {/* Status Badge */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}
              >
                {status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-3">
        {/* Contact Person */}
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-medium text-slate-700">Contact:</span>
          <span className="text-slate-600">{request.fullName}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-slate-400"
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
          <span className="font-medium text-slate-700">Email:</span>
          <span className="text-slate-600 truncate">{request.email}</span>
        </div>

        {/* Phone */}
        {(ngo.primaryPhone || ngo.contactNumber) && (
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="font-medium text-slate-700">Phone:</span>
            <span className="text-slate-600">
              {ngo.primaryPhone || ngo.contactNumber}
            </span>
          </div>
        )}

        {/* Submission Date */}
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium text-slate-700">Submitted:</span>
          <span className="text-slate-600">
            {formatDate(request.createdAt)}
          </span>
        </div>

        {/* Documents Count */}
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-slate-400"
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
          <span className="font-medium text-slate-700">Documents:</span>
          <span className="text-slate-600">
            {1 + (ngo.documents?.additionalDocuments?.length || 0)} attached
          </span>
        </div>

        {/* Registration Number */}
        {ngo.registrationNumber && (
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">Reg. No:</p>
            <p className="text-sm font-medium text-slate-900">
              {ngo.registrationNumber}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer (Actions) */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        {/* Status-specific info */}
        {status === "APPROVED" && ngo.reviewedAt && (
          <div className="text-xs text-slate-600">
            <p>Approved on {formatDate(ngo.reviewedAt)}</p>
            {ngo.reviewedBy && <p>Password email sent</p>}
          </div>
        )}
        {status === "REJECTED" && ngo.rejectionReason && (
          <div className="text-xs text-red-600 flex-1 mr-4">
            <p className="font-medium">Reason:</p>
            <p className="truncate">{ngo.rejectionReason}</p>
          </div>
        )}
        {status === "PENDING" && (
          <div className="text-xs text-slate-600">
            <p>Awaiting review</p>
          </div>
        )}
        {status === "RESUBMIT_REQUIRED" && (
          <div className="text-xs text-orange-600">
            <p>Resubmission required</p>
          </div>
        )}
        {status === "DEACTIVATED" && (
          <div className="text-xs text-slate-600">
            <p>Account deactivated</p>
          </div>
        )}

        {/* Review Button */}
        <button
          onClick={() => onReview(request)}
          className="ml-auto px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Review
        </button>
      </div>

      {/* Resend Email Button (for approved) */}
      {status === "APPROVED" && (
        <div className="px-6 pb-4 bg-slate-50">
          <button
            onClick={() => onResendEmail(request._id)}
            className="w-full px-4 py-2 border border-blue-300 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
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
            Resend Password Email
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to get color values
 */
function getColorByName(color, shade) {
  const colors = {
    yellow: { 100: "#FEF3C7", 200: "#FDE68A", 800: "#92400E", 900: "#78350F" },
    green: { 100: "#D1FAE5", 200: "#A7F3D0", 800: "#065F46", 900: "#064E3B" },
    red: { 100: "#FEE2E2", 200: "#FECACA", 800: "#991B1B", 900: "#7F1D1D" },
    orange: { 100: "#FFEDD5", 200: "#FED7AA", 800: "#9A3412", 900: "#7C2D12" },
    slate: { 100: "#F1F5F9", 200: "#E2E8F0", 800: "#1E293B", 900: "#0F172A" },
  };

  return colors[color]?.[shade] || "#E2E8F0";
}
