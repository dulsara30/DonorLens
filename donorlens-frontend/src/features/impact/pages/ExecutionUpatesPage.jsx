import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/layout/AdminLayout";
import ExecutionCreateForm from "../components/ExecutionCreateForm";
import ExecutionStatsCard from "../components/ExecutionStatsCard";
import ExecutionEmptyState from "../components/ExecutionEmptyState";
import ExecutionTimeline from "../components/ExecutionTimeline";
import { useExecutionStore } from "../store/executionStore";

export default function ExecutionUpdatesPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const {
    executions,
    selectedCampaignId,
    loading,
    error,
    campaign,
    summary,
    fetchExecutions,
    createExecution,
    deleteExecution,
    setSelectedCampaignId,
  } = useExecutionStore();

  useEffect(() => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
      fetchExecutions(campaignId);
    }
  }, [campaignId, setSelectedCampaignId, fetchExecutions]);

  // Sort executions by date in descending order (newest first)
  const sortedExecutions = useMemo(() => {
    return [...executions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [executions]);

  const handleCreateSubmit = async (payload) => {
    try {
      setSubmitError("");
      setSubmitSuccess("");

      await createExecution(payload);
      setSubmitSuccess("Execution update created successfully!");
      setIsFormOpen(false);

      setTimeout(() => setSubmitSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err?.response?.data?.message || "Failed to create execution"
      );
    }
  };

  const handleDeleteExecution = async (executionId) => {
    if (!window.confirm("Are you sure you want to delete this execution update?")) {
      return;
    }

    try {
      setSubmitError("");
      await deleteExecution(executionId);
      setSubmitSuccess("Execution update deleted successfully!");
      setTimeout(() => setSubmitSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err?.response?.data?.message || "Failed to delete execution"
      );
    }
  };

  if (!campaignId) {
    return (
      <AdminLayout title="Campaign Executions">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-8 text-center">
            <p className="text-sm text-slate-600">
              Please select a campaign first
            </p>
            <button
              onClick={() => navigate("/admin/campaign-executions")}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Execution Updates">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/campaign-executions")}
          className="mb-6 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          ← Back to Campaigns
        </button>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-rose-800">{submitError}</p>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-emerald-800">{submitSuccess}</p>
          </div>
        )}

        {/* Campaign Summary Stats Card */}
        <div className="mb-6">
          <ExecutionStatsCard 
            campaign={campaign} 
            summary={summary} 
            executionsCount={executions.length}
          />
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700"
          >
            + Add Execution Update
          </button>
        </div>

        {/* Form Modal */}
        <ExecutionCreateForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        {/* Loading State */}
        {loading && (
          <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600"></div>
              <p className="text-sm text-slate-600">Loading executions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-6 py-4 shadow-sm">
            <p className="text-sm font-medium text-rose-800">{error}</p>
          </div>
        )}

        {/* Empty State - Show only Campaign Launched card */}
        {!loading && !error && executions.length === 0 && (
          <ExecutionEmptyState campaign={campaign} />
        )}

        {/* Executions List - Timeline View */}
        {!loading && !error && executions.length > 0 && (
          <ExecutionTimeline
            sortedExecutions={sortedExecutions}
            campaign={campaign}
            onDelete={handleDeleteExecution}
          />
        )}
      </div>
    </AdminLayout>
  );
}