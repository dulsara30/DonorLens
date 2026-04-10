import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, DollarSign, Zap, Download, Edit2, Save, X } from "lucide-react";
import AdminLayout from "../../admin/layout/AdminLayout";
import { useExecutionStore } from "../store/executionStore";

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

export default function ExecutionDetailPage() {
  const { campaignId, executionId } = useParams();
  const navigate = useNavigate();
  const [execution, setExecution] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [updatingExecution, setUpdatingExecution] = useState(false);

  const { executions, campaign: cachedCampaign, updateExecution } = useExecutionStore();

  useEffect(() => {
    // Find the execution from store
    const foundExecution = executions.find((e) => e._id === executionId);
    if (foundExecution) {
      setExecution(foundExecution);
      setEditedData({
        title: foundExecution.title,
        description: foundExecution.description,
        fundsUsed: foundExecution.fundsUsed,
      });
      setCampaign(cachedCampaign);
      setLoading(false);
      
      console.log("📊 Execution Detail Page:", {
        execution: foundExecution,
        campaign: cachedCampaign,
        totalPlannedCost: cachedCampaign?.totalPlannedCost,
        fundsUsed: foundExecution.fundsUsed,
      });
    }
  }, [executionId, executions, cachedCampaign]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      title: execution.title,
      description: execution.description,
      fundsUsed: execution.fundsUsed,
    });
  };

  const handleSave = async () => {
    try {
      setUpdatingExecution(true);
      // Call API to update execution
      await updateExecution(campaignId, executionId, editedData);
      
      // Update local state
      setExecution({
        ...execution,
        title: editedData.title,
        description: editedData.description,
        fundsUsed: editedData.fundsUsed,
      });
      
      setIsEditing(false);
      
      // Redirect to executions list after 1 second
      setTimeout(() => {
        navigate(`/admin/campaign-executions/${campaignId}`);
      }, 1000);
    } catch (error) {
      console.error("Failed to update execution:", error);
      alert("Failed to update execution. Please try again.");
    } finally {
      setUpdatingExecution(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Execution Detail">
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!execution) {
    return (
      <AdminLayout title="Execution Detail">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-teal-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">Execution update not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Execution Detail">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-teal-600 transition hover:text-teal-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Updates
        </button>

        {/* Header Card */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-teal-600 to-teal-700 text-white">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) =>
                      setEditedData({ ...editedData, title: e.target.value })
                    }
                    className="mb-3 w-full rounded-lg bg-white/20 px-4 py-2 text-2xl font-bold text-white placeholder-white/60 backdrop-blur focus:bg-white/30 focus:outline-none"
                    placeholder="Enter title"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{execution.title}</h1>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className="rounded-lg bg-white/20 p-2 transition hover:bg-white/30"
                  title="Edit execution"
                >
                  <Edit2 size={20} className="text-white" />
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2 text-teal-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="text-base">
                  {new Date(execution.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {campaign && (
                <div className="text-base">
                  Campaign: <span className="font-semibold">{campaign.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-linear-to-br from-teal-50 to-cyan-50 border border-teal-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-teal-100 p-2">
                <DollarSign size={18} className="text-teal-600" />
              </div>
              <p className="text-xs font-bold text-teal-700 tracking-wide">FUNDS USED</p>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editedData.fundsUsed}
                onChange={(e) =>
                  setEditedData({ ...editedData, fundsUsed: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg bg-teal-100 px-3 py-2 text-xl font-bold text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            ) : (
              <p className="text-2xl font-bold text-teal-600">
                {formatCurrency(execution.fundsUsed || 0)}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-emerald-100 p-2">
                <Zap size={18} className="text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-emerald-700 tracking-wide">PROGRESS</p>
            </div>
            {isEditing ? (
              <p className="text-2xl font-bold text-emerald-600">
                {Math.round(calculateProgress(editedData.fundsUsed || 0, campaign?.totalPlannedCost))}%
              </p>
            ) : (
              <p className="text-2xl font-bold text-emerald-600">
                {campaign && campaign.totalPlannedCost
                  ? Math.round(calculateProgress(execution.fundsUsed || 0, campaign.totalPlannedCost))
                  : execution.progressPercentage || execution.progress || 0}%
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="mb-3 text-base font-bold text-slate-900 uppercase tracking-wide">
            Description
          </h2>
          <div className="rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 p-4 border border-slate-200">
            {isEditing ? (
              <textarea
                value={editedData.description}
                onChange={(e) =>
                  setEditedData({ ...editedData, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                rows="5"
                placeholder="Enter description"
              />
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {execution.description}
              </p>
            )}
          </div>
        </div>

        {/* Edit Action Buttons */}
        {isEditing && (
          <div className="mb-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={updatingExecution}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              <Save size={18} />
              {updatingExecution ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={updatingExecution}
              className="flex items-center gap-2 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}

        {/* Evidence Photos */}
        {execution.evidencePhotos?.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-base font-bold text-slate-900 uppercase tracking-wide">
              Evidence Photos ({execution.evidencePhotos.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
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
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-black/0 p-3">
                    <p className="text-xs font-semibold text-white">Photo {index + 1}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Receipts */}
        {execution.receipts?.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-base font-bold text-slate-900 uppercase tracking-wide">
              Receipts ({execution.receipts.length})
            </h2>
            <div className="space-y-3">
              {execution.receipts.map((receipt, index) => (
                <a
                  key={`${receipt.public_id || index}`}
                  href={receipt.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 p-4 transition hover:border-teal-400 hover:from-teal-50 hover:to-cyan-50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-200 transition group-hover:bg-teal-200 shrink-0">
                    <svg
                      className="h-7 w-7 text-slate-600 transition group-hover:text-teal-600"
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
                    <p className="text-xs text-slate-500">Click to download</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-2 transition group-hover:bg-teal-100">
                    <Download size={18} className="text-slate-600 transition group-hover:text-teal-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* No Media Message */}
        {(!execution.evidencePhotos?.length && !execution.receipts?.length) && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400 mb-4"
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
            <p className="text-base font-medium text-slate-700 mb-1">No Media Attached</p>
            <p className="text-sm text-slate-500">This execution update has no evidence photos or receipts</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
