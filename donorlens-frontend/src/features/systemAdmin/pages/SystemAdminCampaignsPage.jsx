// ============================================
// SYSTEM ADMIN CAMPAIGNS PAGE
// ============================================
// Review and manage all campaigns across the platform

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SystemAdminLayout from "../layout/SystemAdminLayout";
import {
  fetchAllCampaigns,
  setSelectedCampaign,
  clearSelectedCampaign,
  setSearchQuery,
  setStatusFilter,
  setSdgFilter,
  clearFilters,
  setCurrentPage,
  selectPaginatedCampaigns,
  selectFilteredCampaigns,
  selectLoading,
  selectSearchQuery,
  selectStatusFilter,
  selectSdgFilter,
  selectCurrentPage,
  selectTotalPages,
  selectCampaignStats,
  selectSelectedCampaign,
} from "../../../store/slices/campaignsSlice";
import CampaignReviewModal from "../components/CampaignReviewModal";

/**
 * SDG GOALS DATA
 * 17 Sustainable Development Goals with colors
 */
const SDG_GOALS = [
  { number: 1, name: "No Poverty", color: "#E5243B" },
  { number: 2, name: "Zero Hunger", color: "#DDA63A" },
  { number: 3, name: "Good Health", color: "#4C9F38" },
  { number: 4, name: "Quality Education", color: "#C5192D" },
  { number: 5, name: "Gender Equality", color: "#FF3A21" },
  { number: 6, name: "Clean Water", color: "#26BDE2" },
  { number: 7, name: "Affordable Energy", color: "#FCC30B" },
  { number: 8, name: "Decent Work", color: "#A21942" },
  { number: 9, name: "Industry & Innovation", color: "#FD6925" },
  { number: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { number: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { number: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { number: 13, name: "Climate Action", color: "#3F7E44" },
  { number: 14, name: "Life Below Water", color: "#0A97D9" },
  { number: 15, name: "Life On Land", color: "#56C02B" },
  { number: 16, name: "Peace & Justice", color: "#00689D" },
  { number: 17, name: "Partnerships", color: "#19486A" },
];

/**
 * SystemAdminCampaignsPage Component
 * Features:
 * - Search campaigns by title/NGO name
 * - Filter by status (Ongoing/Completed) and SDG Goal
 * - Row-based card layout with campaign details
 * - Review button to open detailed modal
 * - Send warning email and deactivate options
 */
export default function SystemAdminCampaignsPage() {
  const dispatch = useDispatch();

  // Redux state
  const campaigns = useSelector(selectPaginatedCampaigns);
  const allFilteredCampaigns = useSelector(selectFilteredCampaigns);
  const loading = useSelector(selectLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const statusFilter = useSelector(selectStatusFilter);
  const sdgFilter = useSelector(selectSdgFilter);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const stats = useSelector(selectCampaignStats);
  const selectedCampaign = useSelector(selectSelectedCampaign);

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(searchQuery);

  /**
   * Fetch campaigns on component mount
   */
  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  /**
   * Debounce search input (300ms delay)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  /**
   * Handle filter changes
   */
  const handleStatusFilterChange = (status) => {
    dispatch(setStatusFilter(status));
  };

  const handleSdgFilterChange = (sdg) => {
    dispatch(setSdgFilter(sdg));
  };

  const handleClearFilters = () => {
    setSearchInput("");
    dispatch(clearFilters());
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Open review modal
   */
  const handleReviewCampaign = (campaign) => {
    dispatch(setSelectedCampaign(campaign));
  };

  /**
   * Close review modal
   */
  const handleCloseModal = () => {
    dispatch(clearSelectedCampaign());
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Calculate progress percentage
   */
  const calculateProgress = (raised, total) => {
    if (!total || total === 0) return 0;
    return Math.min((raised / total) * 100, 100);
  };

  /**
   * Get SDG info by number
   */
  const getSDGInfo = (number) => {
    return SDG_GOALS.find((goal) => goal.number === number) || {};
  };

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <SystemAdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaign Review</h1>
          <p className="text-slate-600 mt-1">
            Monitor and manage all campaigns across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Campaigns</div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Ongoing</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.ongoing}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Raised</div>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.totalRaised)}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Campaigns
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title or NGO name..."
                  className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* SDG Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SDG Goal
              </label>
              <select
                value={sdgFilter}
                onChange={(e) => handleSdgFilterChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="ALL">All Goals</option>
                {SDG_GOALS.map((goal) => (
                  <option key={goal.number} value={goal.number}>
                    {goal.number}. {goal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== "ALL" || sdgFilter !== "ALL") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                  Search: "{searchQuery}"
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Status: {statusFilter}
                </span>
              )}
              {sdgFilter !== "ALL" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  SDG: {getSDGInfo(parseInt(sdgFilter)).name}
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600">
          Showing {campaigns.length} of {allFilteredCampaigns.length} campaigns
        </div>

        {/* Campaign Cards (Row Layout) */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-200 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No campaigns found
              </h3>
              <p className="text-slate-600">
                {searchQuery || statusFilter !== "ALL" || sdgFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "No campaigns have been created yet"}
              </p>
            </div>
          ) : (
            campaigns.map((campaign) => {
              const progress = calculateProgress(
                campaign.raisedAmount,
                campaign.totalPlannedCost,
              );
              const sdgInfo = getSDGInfo(campaign.sdgGoalNumber);

              return (
                <div
                  key={campaign._id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Campaign Cover Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            campaign.coverImage?.secure_url ||
                            "/placeholder.jpg"
                          }
                          alt={campaign.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Campaign Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {campaign.createdBy?.ngoDetails?.ngoName ||
                                "Unknown NGO"}
                            </p>
                          </div>

                          {/* Status and SDG Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}
                            >
                              {campaign.status}
                            </span>
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: sdgInfo.color }}
                            >
                              SDG {campaign.sdgGoalNumber}
                            </span>
                          </div>
                        </div>

                        {/* Description (Truncated) */}
                        <p className="text-sm text-slate-700 mb-4 line-clamp-2">
                          {campaign.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-900">
                              {formatCurrency(campaign.raisedAmount)} raised
                            </span>
                            <span className="text-slate-600">
                              of {formatCurrency(campaign.totalPlannedCost)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 mt-1">
                            <span>{progress.toFixed(1)}% completed</span>
                            <span>Ends: {formatDate(campaign.endDate)}</span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>
                            {campaign.location?.locationName ||
                              "Location not specified"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleReviewCampaign(campaign)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Review Campaign
                          </button>

                          <span className="text-xs text-slate-500">
                            Created: {formatDate(campaign.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Campaign Review Modal */}
      {selectedCampaign && (
        <CampaignReviewModal
          campaign={selectedCampaign}
          onClose={handleCloseModal}
        />
      )}
    </SystemAdminLayout>
  );
}
