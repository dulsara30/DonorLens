import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/layout/AdminLayout";
import { deleteCampaignApi, getMyCampaignsApi } from "../api";
import MyCampaignListHeader from "../components/CampaignsListHeader";
import MyCampaignCard from "../components/CampaignCard";

export default function CampaignListPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const campaignCount = useMemo(() => campaigns.length, [campaigns.length]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getMyCampaignsApi();
      setCampaigns(response?.data || []);
    } catch (error) {
      console.error(error);
      setPageError(
        error?.response?.data?.message || "Failed to load campaigns"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(campaignId);
      await deleteCampaignApi(campaignId);

      setCampaigns((prev) => prev.filter((item) => item._id !== campaignId));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to delete campaign");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <AdminLayout title="My Campaigns">
      <div className="mx-auto max-w-6xl">
        <MyCampaignListHeader
          count={campaignCount}
          onCreateNew={() => navigate("/admin/campaigns/new")}
        />

        {loading && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500 shadow-sm">
            Loading campaigns...
          </div>
        )}

        {!loading && pageError && (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-8 text-sm text-rose-600 shadow-sm">
            {pageError}
          </div>
        )}

        {!loading && !pageError && campaigns.length > 0 && (
          <div className="space-y-5">
            {campaigns.map((campaign) => (
              <MyCampaignCard
                key={campaign._id}
                campaign={campaign}
                deleting={deletingId === campaign._id}
                onView={() => navigate(`/admin/campaigns/${campaign._id}`)}
                onEdit={() =>
                  navigate(`/admin/campaigns/${campaign._id}/edit`)
                }
                onDelete={() => handleDeleteCampaign(campaign._id)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}