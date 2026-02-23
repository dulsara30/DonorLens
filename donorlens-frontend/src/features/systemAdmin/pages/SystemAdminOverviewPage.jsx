// ============================================
// SYSTEM ADMIN OVERVIEW PAGE
// ============================================
// Dashboard with statistics, charts, and analytics

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SystemAdminLayout from "../layout/SystemAdminLayout";
import {
  fetchDashboardStats,
  fetchSDGDistribution,
  fetchDonationTrends,
  fetchRecentActivity,
  selectDashboardStats,
  selectSDGDistribution,
  selectDonationTrends,
  selectRecentActivity,
  selectDashboardLoading,
  selectTopSDGGoals,
} from "../../../store/slices/dashboardSlice";

/**
 * SystemAdminOverviewPage Component
 * Shows comprehensive dashboard with:
 * - Key statistics cards
 * - SDG goals distribution
 * - Donation trends chart
 * - Recent activity feed
 */
export default function SystemAdminOverviewPage() {
  const dispatch = useDispatch();

  // Get data from Redux store using useSelector
  const stats = useSelector(selectDashboardStats);
  const sdgDistribution = useSelector(selectSDGDistribution);
  const donationTrends = useSelector(selectDonationTrends);
  const recentActivity = useSelector(selectRecentActivity);
  const loading = useSelector(selectDashboardLoading);
  const topSDGGoals = useSelector(selectTopSDGGoals);

  /**
   * Fetch all dashboard data on component mount
   * TODO: You can add error handling and retry logic here
   */
  useEffect(() => {
    // Dispatch all fetch actions
    dispatch(fetchDashboardStats());
    dispatch(fetchSDGDistribution());
    dispatch(fetchDonationTrends("monthly"));
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Format number with commas
   */
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 mt-1">
            Monitor your platform's performance and key metrics
          </p>
        </div>

        {/* ========================================
            KEY STATISTICS CARDS
            ======================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Campaigns */}
          <StatCard
            title="Total Campaigns"
            value={formatNumber(stats.totalCampaigns)}
            subtitle={`${stats.activeCampaigns} active`}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
            color="blue"
            loading={loading}
          />

          {/* Total Donations */}
          <StatCard
            title="Total Donations"
            value={formatCurrency(stats.totalDonationAmount)}
            subtitle={`${formatNumber(stats.totalDonations)} donations`}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="green"
            loading={loading}
          />

          {/* Total Users */}
          <StatCard
            title="Total Users"
            value={formatNumber(stats.totalUsers)}
            subtitle="Registered donors"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            color="purple"
            loading={loading}
          />

          {/* NGO Organizations */}
          <StatCard
            title="NGO Organizations"
            value={formatNumber(stats.totalNGOs)}
            subtitle={`${stats.pendingNGOs} pending approval`}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            color="orange"
            loading={loading}
            badge={stats.pendingNGOs > 0 ? stats.pendingNGOs : null}
          />
        </div>

        {/* ========================================
            CHARTS ROW
            ======================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Donation Trends
              </h3>
              <select className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {donationTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-slate-600 font-medium">
                    {trend.month}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{
                        width: `${(trend.amount / 25000) * 100}%`,
                      }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {formatCurrency(trend.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TODO: Integrate a real charting library like Chart.js or Recharts */}
            {/* Example: npm install recharts */}
            {/* Then use <LineChart> or <BarChart> components */}
          </div>

          {/* SDG Goals Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Top SDG Goals
            </h3>

            <div className="space-y-4">
              {topSDGGoals.map((goal) => (
                <div key={goal.goal} className="flex items-center gap-4">
                  {/* SDG Goal Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: goal.color }}
                  >
                    {goal.goal}
                  </div>

                  {/* Goal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {goal.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 ml-2">
                        {goal.count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(goal.count / 20) * 100}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <button className="w-full mt-6 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              View All SDG Goals →
            </button>
          </div>
        </div>

        {/* ========================================
            RECENT ACTIVITY FEED
            ======================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0"
              >
                {/* Activity Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "donation"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "campaign"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type === "donation" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : activity.type === "campaign" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Activity Button */}
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </SystemAdminLayout>
  );
}

/**
 * StatCard Component
 * Reusable statistics card
 */
function StatCard({ title, value, subtitle, icon, color, loading, badge }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
          {badge}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>

          {loading ? (
            <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
          ) : (
            <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
          )}

          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
