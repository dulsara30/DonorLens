import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../../admin/layout/AdminLayout";
import ExecutionCreateForm from "../components/ExecutionCreateForm";
import { useExecutionStore } from "../store/executionStore";

export default function ExecutionCreatePage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const { campaign, summary, fetchExecutions, createExecution, setSelectedCampaignId } = useExecutionStore();

  useEffect(() => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
      fetchExecutions(campaignId);
    }
  }, [campaignId, setSelectedCampaignId, fetchExecutions]);

  const handleCreateSubmit = async (payload) => {
    try {
      await createExecution(payload);
      toast.success("Execution update created successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Redirect to executions list after 2 seconds
      setTimeout(() => {
        navigate(`/admin/campaign-executions/${campaignId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Failed to create execution update";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!campaignId) {
    return (
      <AdminLayout title="Add Execution Update">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">Campaign not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Add Execution Update">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleClose}
          className="mb-6 flex items-center gap-2 text-teal-600 transition hover:text-teal-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        {campaign && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Add Execution Update</h1>
            <p className="mt-2 text-slate-600">
              Campaign: <span className="font-semibold text-teal-600">{campaign.title}</span>
            </p>
          </div>
        )}

        {/* Form */}
        <ExecutionCreateForm
          isOpen={true}
          onClose={handleClose}
          onSubmit={handleCreateSubmit}
          campaign={campaign}
          summary={summary}
        />
      </div>
    </AdminLayout>
  );
}
