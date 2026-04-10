import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/layout/AdminLayout";
import { getMyCampaignsApi } from "../../campaigns/api";
import { useExecutionStore } from "../store/executionStore";
import ExecutionDashboardHeader from "../components/ExecutionDashboardHeader";
import ExecutionDashboardLoading from "../components/ExecutionDashboardLoading";
import ExecutionDashboardError from "../components/ExecutionDashboardError";
import ExecutionDashboardEmpty from "../components/ExecutionDashboardEmpty";
import ExecutionCampaignsList from "../components/ExecutionCampaignsList";

export default function ExecutionDashboardPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setSelectedCampaignId, fetchExecutions } = useExecutionStore();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyCampaignsApi();
      setCampaigns(response?.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load campaigns"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = async (campaignId) => {
    setSelectedCampaignId(campaignId);
    await fetchExecutions(campaignId);
    navigate(`/admin/campaign-executions/${campaignId}`);
  };

  return (
    <AdminLayout title="Campaign Executions">
      <div className="mx-auto max-w-5xl">
        <ExecutionDashboardHeader />

        {loading && <ExecutionDashboardLoading />}

        {!loading && error && (
          <ExecutionDashboardError
            error={error}
            onRetry={fetchCampaigns}
          />
        )}

        {!loading && !error && campaigns.length === 0 && (
          <ExecutionDashboardEmpty
            onCreateCampaign={() => navigate("/admin/campaigns/new")}
          />
        )}

        {!loading && !error && campaigns.length > 0 && (
          <ExecutionCampaignsList
            campaigns={campaigns}
            onSelectCampaign={handleCampaignSelect}
          />
        )}
      </div>
    </AdminLayout>
  );
}
