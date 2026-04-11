import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminLayout from "../../admin/layout/AdminLayout";
import { deleteCampaignApi, getMyCampaignsApi } from "../api";
import MyCampaignListHeader from "../components/CampaignsListHeader";
import MyCampaignCard from "../components/CampaignCard";
import { toast } from "react-toastify";

export default function CampaignListPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

  const filteredCampaigns = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return campaigns;

    return campaigns.filter((campaign) => {
      const title = campaign.title?.toLowerCase() || "";
      const description = campaign.description?.toLowerCase() || "";
      const location = campaign.location?.locationName?.toLowerCase() || "";

      return (
        title.includes(keyword) ||
        description.includes(keyword) ||
        location.includes(keyword)
      );
    });
  }, [campaigns, searchTerm]);

  const campaignCount = useMemo(
    () => filteredCampaigns.length,
    [filteredCampaigns.length]
  );

  const handleDeleteCampaign = async (campaignId) => {
    try {
      setDeletingId(campaignId);
      await deleteCampaignApi(campaignId);

      setCampaigns((prev) => prev.filter((item) => item._id !== campaignId));
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete campaign"
      );
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

        <div className="mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>
        </div>

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

        {!loading && !pageError && filteredCampaigns.length === 0 && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500 shadow-sm">
            No campaigns found.
          </div>
        )}

        {!loading && !pageError && filteredCampaigns.length > 0 && (
          <div className="space-y-5">
            {filteredCampaigns.map((campaign) => (
              <MyCampaignCard
                key={campaign._id}
                campaign={campaign}
                deleting={deletingId === campaign._id}
                onView={() => navigate(`/admin/campaigns/${campaign._id}`)}
                onEdit={() =>
                  navigate(`/admin/campaigns/${campaign._id}/edit`)
                }
                onDelete={() => setConfirmDeleteId(campaign._id)}
              />
            ))}
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Campaign?
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone. Are you sure you want to delete this campaign?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDeleteCampaign(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      
      )}
    </AdminLayout>

    
  );
}