import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CampaignGrid from "../components/layout/CampaignGrid";
import { getPublicCampaignsApi } from "../features/campaigns/api";

export default function PublicCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ONGOING"); // 👈 default

  useEffect(() => {
    fetchPublicCampaigns();
  }, []);

  const fetchPublicCampaigns = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await getPublicCampaignsApi();
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

  // 🔍 Search filter
  const searchedCampaigns = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return campaigns;

    return campaigns.filter((campaign) => {
      const title = campaign.title?.toLowerCase() || "";
      const description = campaign.description?.toLowerCase() || "";

      return title.includes(keyword) || description.includes(keyword);
    });
  }, [campaigns, searchTerm]);

  // 🎯 Status filter (ONGOING / COMPLETED)
  const filteredCampaigns = useMemo(() => {
    return searchedCampaigns.filter(
      (campaign) => campaign.status === activeTab
    );
  }, [searchedCampaigns, activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-b from-slate-50/50 to-white px-6 pt-28 pb-16">
        <div className="mx-auto max-w-[1400px]">

          {/* Title */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-5xl font-extrabold text-slate-900">
              Campaigns
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Discover ongoing and completed campaigns making a real difference.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          {/* 🔥 Tabs (ONGOING / COMPLETED) */}
          <div className="mb-10 flex items-center gap-3">
            <button
              onClick={() => setActiveTab("ONGOING")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                activeTab === "ONGOING"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ongoing
            </button>

            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                activeTab === "COMPLETED"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Campaign Grid */}
          <CampaignGrid
            campaigns={filteredCampaigns}
            loading={loading}
            error={pageError}
            hideHeader
            emptyMessage={`No ${activeTab.toLowerCase()} campaigns found.`}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}