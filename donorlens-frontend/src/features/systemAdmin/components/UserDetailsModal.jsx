// ============================================
// USER DETAILS MODAL
// ============================================
// Modal to view user details, donations, and perform actions

import { useState } from "react";

/**
 * UserDetailsModal Component
 * Shows:
 * - User profile information
 * - Donation history
 * - Actions: Activate/Deactivate, Send Email
 */
export default function UserDetailsModal({ user, onClose }) {
  // Local state
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'donations'
  const [donations] = useState([]);

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
   * Calculate total donations
   */
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user.fullName}
                </h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            {/* Close Button */}
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
          <div className="px-6 border-b border-slate-200 flex gap-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "details"
                  ? "text-emerald-600 border-emerald-600"
                  : "text-slate-600 border-transparent hover:text-slate-900"
              }`}
            >
              User Details
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "donations"
                  ? "text-emerald-600 border-emerald-600"
                  : "text-slate-600 border-transparent hover:text-slate-900"
              }`}
            >
              Donation History ({donations.length})
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" ? (
              /* ========================================
                 USER DETAILS TAB
                 ======================================== */
              <div className="space-y-6">
                {/* Basic Information */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Full Name" value={user.fullName} />
                    <InfoField label="Email" value={user.email} />
                    <InfoField
                      label="Role"
                      value={
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "USER"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {user.role === "USER" ? "Donor" : "NGO Admin"}
                        </span>
                      }
                    />
                    <InfoField
                      label="Account Status"
                      value={
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-green-500" : "bg-slate-500"
                            }`}
                          ></span>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      }
                    />
                    <InfoField
                      label="Phone"
                      value={user.profile?.phone || "Not provided"}
                    />
                    <InfoField
                      label="Country"
                      value={user.profile?.country || "Not provided"}
                    />
                    <InfoField
                      label="Joined Date"
                      value={formatDate(user.createdAt)}
                    />
                    <InfoField
                      label="Last Login"
                      value={formatDate(user.lastLoginAt)}
                    />
                  </div>
                </section>

                {/* NGO Details (if NGO_ADMIN) */}
                {user.role === "NGO_ADMIN" && user.ngoDetails && (
                  <section>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      NGO Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField
                        label="NGO Name"
                        value={user.ngoDetails.ngoName || "N/A"}
                      />
                      <InfoField
                        label="Registration No."
                        value={user.ngoDetails.registrationNumber || "N/A"}
                      />
                      <InfoField
                        label="Contact"
                        value={
                          user.ngoDetails.primaryPhone ||
                          user.ngoDetails.contactNumber ||
                          "N/A"
                        }
                      />
                      <InfoField
                        label="Verification Status"
                        value={
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.ngoDetails.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : user.ngoDetails.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.ngoDetails.status}
                          </span>
                        }
                      />
                      {user.ngoDetails.address && (
                        <InfoField
                          label="Address"
                          value={user.ngoDetails.address}
                          className="col-span-2"
                        />
                      )}
                      {user.ngoDetails.description && (
                        <InfoField
                          label="Description"
                          value={user.ngoDetails.description}
                          className="col-span-2"
                        />
                      )}
                    </div>
                  </section>
                )}

                {/* Activity Summary */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Activity Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Total Donations
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {donations.length}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium mb-1">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(totalDonations)}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium mb-1">
                        Campaigns Supported
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {donations.length}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              /* ========================================
                 DONATION HISTORY TAB
                 ======================================== */
              <div>
                {donations.length === 0 ? (
                  <div className="text-center py-12">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-slate-600 font-medium">
                      No donations yet
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      This user hasn't made any donations
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div
                        key={donation._id}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {donation.campaignName}
                          </h4>
                          <span className="text-lg font-bold text-emerald-600">
                            {formatCurrency(donation.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Date: {formatDate(donation.createdAt)}</span>
                          <span>•</span>
                          <span>Transaction ID: {donation.transactionId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer (Actions) */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * InfoField Component
 * Reusable field display
 */
function InfoField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <div className="text-slate-900">{value || "N/A"}</div>
    </div>
  );
}
