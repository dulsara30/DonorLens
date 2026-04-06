import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../admin/layout/AdminLayout";
import { getSingleCampaignApi } from "../api";
import CampaignDetailsHero from "../components/CampaignDeatilsHero";
import CampaignAboutCard from "../components/CampaignAboutCard";
import CampaignFinancialSummaryCard from "../components/CampaignFinancialSummaryCard";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getSingleCampaignApi(id);
      setCampaign(response?.data || null);
    } catch (error) {
      console.error(error);
      setPageError(
        error?.response?.data?.message || "Failed to load campaign details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Campaign Details">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/admin/campaigns")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          <span>Back to Campaigns</span>
        </button>

        {loading && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500 shadow-sm">
            Loading campaign details...
          </div>
        )}

        {!loading && pageError && (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-8 text-sm text-rose-600 shadow-sm">
            {pageError}
          </div>
        )}

        {!loading && !pageError && campaign && (
          <div className="space-y-6">
            <CampaignDetailsHero campaign={campaign} />
            <CampaignAboutCard description={campaign.description} />
            <CampaignFinancialSummaryCard campaign={campaign} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}