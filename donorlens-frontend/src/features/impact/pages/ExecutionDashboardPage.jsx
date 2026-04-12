import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import AdminLayout from "../../admin/layout/AdminLayout";
import { getMyCampaignsApi } from "../../campaigns/api";
import { useExecutionStore } from "../store/executionStore";
import ExecutionDashboardLoading from "../components/ExecutionDashboardLoading";
import ExecutionDashboardError from "../components/ExecutionDashboardError";
import ExecutionDashboardEmpty from "../components/ExecutionDashboardEmpty";
import ExecutionCampaignsList from "../components/ExecutionCampaignsList";

const CAMPAIGN_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
];

export default function ExecutionDashboardPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  // Filter and search campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Search filter
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !statusFilter || (campaign.status?.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const handleCampaignSelect = async (campaignId) => {
    setSelectedCampaignId(campaignId);
    await fetchExecutions(campaignId);
    navigate(`/admin/campaign-executions/${campaignId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  return (
    <AdminLayout title="Campaign Executions">
      <div className="mx-auto max-w-5xl">
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
          <>
            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search campaigns by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Filter by Status:</span>
                <div className="flex flex-wrap gap-2">
                  {CAMPAIGN_STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        statusFilter === option.value
                          ? "bg-teal-600 text-white"
                          : "border border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Info */}
              {(searchQuery || statusFilter) && (
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2">
                  <p className="text-sm text-slate-600">
                    Found <span className="font-semibold text-slate-900">{filteredCampaigns.length}</span> campaign{filteredCampaigns.length !== 1 ? "s" : ""}
                  </p>
                  {(searchQuery || statusFilter) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Campaigns List */}
            {filteredCampaigns.length > 0 ? (
              <ExecutionCampaignsList
                campaigns={filteredCampaigns}
                onSelectCampaign={handleCampaignSelect}
              />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-slate-600">
                  No campaigns found matching your filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
