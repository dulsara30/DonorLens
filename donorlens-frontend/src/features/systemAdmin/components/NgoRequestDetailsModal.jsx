// Modal for reviewing NGO registration requests with actions

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  approveRequest,
  requestResubmit,
  rejectRequest,
  resendPasswordEmail,
} from "../../../store/slices/ngoRequestsSlice";

/**
 * NgoRequestDetailsModal Component
 * Features:
 * - View organization details
 * - View and download documents
 * - Approve with optional note
 * - Request resubmission with instructions
 * - Reject with reason
 */
export default function NgoRequestDetailsModal({ request, onClose }) {
  const dispatch = useDispatch();
  const ngo = request.ngoDetails;

  // State for action modals
  const [activeAction, setActiveAction] = useState(null); // 'approve', 'resubmit', 'reject'
  const [actionNote, setActionNote] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handle Approve
   */
  const handleApprove = async (e) => {
    e.preventDefault();

    if (
      !confirm(
        "Approve this NGO registration? This will send a password setup email to the organization.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(
        approveRequest({
          requestId: request._id,
          note: actionNote,
        }),
      ).unwrap();

      alert("NGO approved successfully! Password setup email sent.");
      onClose();
    } catch (error) {
      alert("Failed to approve request: " + error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Request Resubmission
   */
  const handleRequestResubmit = async (e) => {
    e.preventDefault();

    if (!actionNote.trim()) {
      alert("Please provide instructions for resubmission");
      return;
    }

    if (
      !confirm(
        "Request resubmission from this NGO? They will be notified via email.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(
        requestResubmit({
          requestId: request._id,
          instructions: actionNote,
        }),
      ).unwrap();

      alert("Resubmission request sent successfully!");
      onClose();
    } catch (error) {
      alert("Failed to request resubmission: " + error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Reject
   */
  const handleReject = async (e) => {
    e.preventDefault();

    if (!actionNote.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    if (
      !confirm("Reject this NGO registration? This action cannot be undone.")
    ) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(
        rejectRequest({
          requestId: request._id,
          reason: actionNote,
        }),
      ).unwrap();

      alert("NGO registration rejected.");
      onClose();
    } catch (error) {
      alert("Failed to reject request: " + error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Resend Password Email
   */
  const handleResendPasswordEmail = async () => {
    if (!confirm("Resend password setup email to this NGO?")) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend
      await dispatch(resendPasswordEmail(request._id)).unwrap();
      alert("Password setup email sent successfully!");
    } catch (error) {
      alert("Failed to send email: " + error);
    } finally {
      setLoading(false);
    }
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
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "RESUBMIT_REQUIRED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {ngo.ngoName?.charAt(0).toUpperCase() || "N"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {ngo.ngoName || "Unnamed Organization"}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(ngo.status)}`}
              >
                {ngo.status.replace("_", " ")}
              </span>
            </div>
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

        {/* Modal Body (Scrollable) */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Organization Details Section */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Organization Details
            </h3>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <DetailField icon="📧" label="Email" value={request.email} />
              <DetailField
                icon="📱"
                label="Phone"
                value={ngo.primaryPhone || ngo.contactNumber || "Not provided"}
              />
              <DetailField
                icon="🆔"
                label="Registration No."
                value={ngo.registrationNumber || "Not provided"}
              />
              <DetailField
                icon="🌐"
                label="Website"
                value={ngo.website || "Not provided"}
              />
              <DetailField
                icon="📍"
                label="Address"
                value={ngo.address || "Not provided"}
                className="col-span-2"
              />
              <DetailField
                icon="👤"
                label="Contact Person"
                value={request.fullName}
              />
              <DetailField
                icon="📅"
                label="Submitted On"
                value={formatDate(request.createdAt)}
              />
            </div>
          </section>

          {/* Description Section */}
          {ngo.description && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600"
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
                Description
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {ngo.description}
                </p>
              </div>
            </section>
          )}

          {/* Verification Documents Section */}
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
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
              Verification Documents
            </h3>

            <div className="space-y-3">
              {/* Registration Certificate */}
              {ngo.documents?.registrationCertificate && (
                <DocumentCard
                  title="Registration Certificate"
                  fileName="Registration Certificate.pdf"
                  fileType="PDF"
                  uploadDate={formatDate(
                    ngo.documents.registrationCertificate.uploadedAt,
                  )}
                  fileSize={formatFileSize(
                    ngo.documents.registrationCertificate.size,
                  )}
                  url={ngo.documents.registrationCertificate.url}
                />
              )}

              {/* Tax Exempt Status (if exists) */}
              {ngo.documents?.taxExemptStatus && (
                <DocumentCard
                  title="Tax Exempt Status"
                  fileName="Tax Exempt Status.pdf"
                  fileType="PDF"
                  uploadDate={formatDate(
                    ngo.documents.taxExemptStatus.uploadedAt,
                  )}
                  fileSize={formatFileSize(ngo.documents.taxExemptStatus.size)}
                  url={ngo.documents.taxExemptStatus.url}
                />
              )}

              {/* Board Resolution (if exists) */}
              {ngo.documents?.boardResolution && (
                <DocumentCard
                  title="Board Resolution"
                  fileName="Board Resolution.pdf"
                  fileType="PDF"
                  uploadDate={formatDate(
                    ngo.documents.boardResolution.uploadedAt,
                  )}
                  fileSize={formatFileSize(ngo.documents.boardResolution.size)}
                  url={ngo.documents.boardResolution.url}
                />
              )}

              {/* Additional Documents */}
              {ngo.documents?.additionalDocuments?.map((doc, index) => (
                <DocumentCard
                  key={index}
                  title={`Additional Document ${index + 1}`}
                  fileName={doc.originalName || "Document.pdf"}
                  fileType="PDF"
                  uploadDate={formatDate(doc.uploadedAt)}
                  fileSize={formatFileSize(doc.size)}
                  url={doc.url}
                />
              ))}
            </div>
          </section>

          {/* Review History Section (if exists) */}
          {ngo.reviewNotes && ngo.reviewNotes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600"
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
                Review History
              </h3>
              <div className="space-y-3">
                {ngo.reviewNotes.map((note, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-blue-900">{note.note}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Submission History */}
          {ngo.submissionHistory && ngo.submissionHistory.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                1 review
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  Submission history: {ngo.submissionHistory.length}{" "}
                  submission(s)
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Action Section (Sticky Footer) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 rounded-b-xl">
          {!activeAction ? (
            /* ========================================
               ACTION BUTTONS (Initial State)
               ======================================== */
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Take Action
              </h4>
              <div className="flex items-center gap-3">
                {/* Approve Button */}
                {ngo.status === "PENDING" && (
                  <button
                    onClick={() => setActiveAction("approve")}
                    className="flex-1 px-4 py-2.5 bg-white border-2 border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
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
                    Approve
                  </button>
                )}

                {/* Ask to Resubmit Button */}
                {(ngo.status === "PENDING" ||
                  ngo.status === "RESUBMIT_REQUIRED") && (
                  <button
                    onClick={() => setActiveAction("resubmit")}
                    className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
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
                    Ask to Resubmit
                  </button>
                )}

                {/* Reject Button */}
                {ngo.status === "PENDING" && (
                  <button
                    onClick={() => setActiveAction("reject")}
                    className="flex-1 px-4 py-2.5 bg-white border-2 border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
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
                    Reject
                  </button>
                )}

                {/* Resend Email (for approved) */}
                {ngo.status === "APPROVED" && (
                  <button
                    onClick={handleResendPasswordEmail}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Resend Password Email
                  </button>
                )}
              </div>
            </div>
          ) : activeAction === "approve" ? (
            /* ========================================
               APPROVE FORM
               ======================================== */
            <form onSubmit={handleApprove} className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Approval Note
              </h4>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Add a note for the approval record... (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setActionNote("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
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
                      Approve & Send Password Email
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : activeAction === "resubmit" ? (
            /* ========================================
               RESUBMIT FORM
               ======================================== */
            <form onSubmit={handleRequestResubmit} className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Resubmission Instructions
              </h4>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Describe what needs to be corrected and resubmitted..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setActionNote("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Request Resubmission"}
                </button>
              </div>
            </form>
          ) : (
            /* ========================================
               REJECT FORM
               ======================================== */
            <form onSubmit={handleReject} className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Rejection Reason
              </h4>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Explain why this registration is being rejected..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                required
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAction(null);
                    setActionNote("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Rejecting..." : "Reject Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * DetailField Component
 */
function DetailField({ icon, label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-slate-500 mb-1">
        {icon} {label}
      </p>
      <p className="text-sm text-slate-900 break-words">{value}</p>
    </div>
  );
}

/**
 * DocumentCard Component
 */
function DocumentCard({
  title,
  fileName,
  fileType,
  uploadDate,
  fileSize,
  url,
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4">
      {/* PDF Icon */}
      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg
          className="w-6 h-6 text-red-600"
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

      {/* Document Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-600 mt-1">
          {fileType} • {fileSize}
        </p>
      </div>

      {/* View Button */}
      <button
        onClick={() => {
          if (url) {
            window.open(url, "_blank");
          } else {
            alert("Document URL not available");
          }
        }}
        className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5"
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
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        View
      </button>
    </div>
  );
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
