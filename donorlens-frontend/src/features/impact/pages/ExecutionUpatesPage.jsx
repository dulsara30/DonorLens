import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../admin/layout/AdminLayout";
import ExecutionStatsCard from "../components/ExecutionStatsCard";
import ExecutionEmptyState from "../components/ExecutionEmptyState";
import ExecutionTimeline from "../components/ExecutionTimeline";
import { useExecutionStore } from "../store/executionStore";

export default function ExecutionUpdatesPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const {
    executions,
    selectedCampaignId,
    loading,
    error,
    campaign,
    summary,
    fetchExecutions,
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
    const sorted = [...executions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      // If dates are invalid, fallback to comparing timestamps
      if (isNaN(dateA) || isNaN(dateB)) {
        console.warn("Invalid date detected:", { a: a.date, b: b.date });
        return 0;
      }
      
      return dateB - dateA; // Descending (newest first)
    });
    
    console.log("📊 Sorted Executions:", sorted.map(e => ({ title: e.title, date: e.date })));
    return sorted;
  }, [executions]);

  const handleDeleteExecution = async (executionId) => {
    const confirmDelete = () => {
      setPendingDeleteId(null);
      performDelete(executionId);
    };

    const cancelDelete = () => {
      setPendingDeleteId(null);
    };

    toast.info(
      <div className="flex flex-col gap-3">
        <p>Are you sure you want to delete this execution update? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={confirmDelete}
            className="px-3 py-1 bg-rose-600 text-white rounded text-sm font-medium hover:bg-rose-700"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-3 py-1 bg-slate-400 text-white rounded text-sm font-medium hover:bg-slate-500"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const performDelete = async (executionId) => {
    try {
      await deleteExecution(executionId);
      toast.success("Execution update deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Failed to delete execution";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
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
            onClick={() => navigate(`/admin/campaign-executions/${campaignId}/create`)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700"
          >
            + Add Execution Update
          </button>
        </div>

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