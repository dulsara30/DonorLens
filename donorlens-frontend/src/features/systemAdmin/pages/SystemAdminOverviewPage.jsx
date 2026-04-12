// ============================================
// SYSTEM ADMIN OVERVIEW PAGE
// ============================================
// Dashboard with real backend analytics derived from users, campaigns, and NGO requests

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SystemAdminLayout from "../layout/SystemAdminLayout";
import {
  fetchAllCampaignsAPI,
  fetchAllNgoRequestsAPI,
  fetchAllUsersAPI,
} from "../api";

const SDG_META = {
  1: { name: "No Poverty", color: "#E5243B" },
  2: { name: "Zero Hunger", color: "#DDA63A" },
  3: { name: "Good Health", color: "#4C9F38" },
  4: { name: "Quality Education", color: "#C5192D" },
  5: { name: "Gender Equality", color: "#FF3A21" },
  6: { name: "Clean Water", color: "#26BDE2" },
  7: { name: "Affordable Energy", color: "#FCC30B" },
  8: { name: "Decent Work", color: "#A21942" },
  9: { name: "Industry & Innovation", color: "#FD6925" },
  10: { name: "Reduced Inequalities", color: "#DD1367" },
  11: { name: "Sustainable Cities", color: "#FD9D24" },
  12: { name: "Responsible Consumption", color: "#BF8B2E" },
  13: { name: "Climate Action", color: "#3F7E44" },
  14: { name: "Life Below Water", color: "#0A97D9" },
  15: { name: "Life On Land", color: "#56C02B" },
  16: { name: "Peace & Justice", color: "#00689D" },
  17: { name: "Partnerships", color: "#19486A" },
};

export default function SystemAdminOverviewPage() {
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorObj,
    refetch: refetchUsers,
    isFetching: usersFetching,
  } = useQuery({
    queryKey: ["system-admin", "overview", "users"],
    queryFn: fetchAllUsersAPI,
  });

  const {
    data: campaigns = [],
    isLoading: campaignsLoading,
    isError: campaignsError,
    error: campaignsErrorObj,
    refetch: refetchCampaigns,
    isFetching: campaignsFetching,
  } = useQuery({
    queryKey: ["system-admin", "overview", "campaigns"],
    queryFn: fetchAllCampaignsAPI,
  });

  const {
    data: ngoRequests = [],
    isLoading: ngoRequestsLoading,
    isError: ngoRequestsError,
    error: ngoRequestsErrorObj,
    refetch: refetchNgoRequests,
    isFetching: ngoRequestsFetching,
  } = useQuery({
    queryKey: ["system-admin", "overview", "ngo-requests"],
    queryFn: fetchAllNgoRequestsAPI,
  });

  const loading = usersLoading || campaignsLoading || ngoRequestsLoading;
  const refreshing = usersFetching || campaignsFetching || ngoRequestsFetching;
  const hasError = usersError || campaignsError || ngoRequestsError;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(Number(num) || 0);
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Unknown time";

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c?.status === "ONGOING",
    ).length;
    const totalDonationAmount = campaigns.reduce(
      (sum, c) => sum + (Number(c?.raisedAmount) || 0),
      0,
    );

    const donorUsers = users.filter((u) => u?.role === "USER");
    const ngoUsers = users.filter((u) => u?.role === "NGO_ADMIN");

    const pendingNGOs = ngoUsers.filter(
      (u) => (u?.ngoDetails?.status || "").toUpperCase() === "PENDING",
    ).length;

    return {
      totalCampaigns,
      activeCampaigns,
      totalDonationAmount,
      totalDonations: donorUsers.length,
      totalUsers: donorUsers.length,
      totalNGOs: ngoUsers.length,
      pendingNGOs,
    };
  }, [campaigns, users]);

  const donationTrends = useMemo(() => {
    const monthlyMap = new Map();

    campaigns.forEach((campaign) => {
      const date = campaign?.createdAt ? new Date(campaign.createdAt) : null;
      if (!date || Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const month = date.toLocaleDateString("en-US", { month: "short" });

      const previous = monthlyMap.get(key) || { month, amount: 0 };
      previous.amount += Number(campaign?.raisedAmount) || 0;
      monthlyMap.set(key, previous);
    });

    return [...monthlyMap.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-6)
      .map(([, value]) => value);
  }, [campaigns]);

  const topSDGGoals = useMemo(() => {
    const sdgCount = new Map();

    campaigns.forEach((campaign) => {
      const goalNumber = Number(campaign?.sdgGoalNumber);
      if (!Number.isFinite(goalNumber) || !SDG_META[goalNumber]) return;
      sdgCount.set(goalNumber, (sdgCount.get(goalNumber) || 0) + 1);
    });

    const maxCount = Math.max(...[...sdgCount.values(), 1]);

    return [...sdgCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([goal, count]) => ({
        goal,
        count,
        maxCount,
        name: SDG_META[goal].name,
        color: SDG_META[goal].color,
      }));
  }, [campaigns]);

  const recentActivity = useMemo(() => {
    const userActivities = users.slice(0, 6).map((user) => ({
      id: `user-${user._id}`,
      type: "user",
      timestamp: user?.createdAt,
      message: `${user.fullName || "User"} joined as ${
        user?.role === "NGO_ADMIN" ? "NGO Admin" : user?.role || "USER"
      }`,
    }));

    const campaignActivities = campaigns.slice(0, 6).map((campaign) => ({
      id: `campaign-${campaign._id}`,
      type: "campaign",
      timestamp: campaign?.createdAt,
      message: `Campaign \"${campaign?.title || "Untitled"}\" created`,
    }));

    const ngoActivities = ngoRequests.slice(0, 6).map((ngo) => ({
      id: `ngo-${ngo._id}`,
      type: "ngo",
      timestamp: ngo?.updatedAt || ngo?.createdAt,
      message: `NGO ${ngo?.ngoDetails?.ngoName || ngo?.fullName || "Unknown"} is ${(
        ngo?.ngoDetails?.status || "PENDING"
      ).toLowerCase()}`,
    }));

    return [...userActivities, ...campaignActivities, ...ngoActivities]
      .filter((x) => x.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [users, campaigns, ngoRequests]);

  const retryAll = () => {
    refetchUsers();
    refetchCampaigns();
    refetchNgoRequests();
  };

  const maxTrendAmount = Math.max(...donationTrends.map((x) => x.amount), 1);

  return (
    <SystemAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 mt-1">
            Monitor your platform's real-time performance and metrics
            {refreshing && !loading ? " (refreshing...)" : ""}
          </p>
        </div>

        {hasError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-semibold">Failed to load some dashboard data</p>
            <p className="text-sm mt-1">
              {[
                usersErrorObj?.message,
                campaignsErrorObj?.message,
                ngoRequestsErrorObj?.message,
              ]
                .filter(Boolean)
                .join(" | ") || "Unknown error"}
            </p>
            <button
              onClick={retryAll}
              className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <StatCard
            title="Total Raised"
            value={formatCurrency(stats.totalDonationAmount)}
            subtitle={`${formatNumber(stats.totalDonations)} donors`}
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

          <StatCard
            title="Total Donors"
            value={formatNumber(stats.totalUsers)}
            subtitle="Registered donor accounts"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Monthly Raised Trend
            </h3>

            {donationTrends.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                No trend data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {donationTrends.map((trend, index) => (
                  <div
                    key={`${trend.month}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="w-12 text-sm text-slate-600 font-medium">
                      {trend.month}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{
                          width: `${Math.max((trend.amount / maxTrendAmount) * 100, 8)}%`,
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
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Top SDG Goals
            </h3>

            {topSDGGoals.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                No SDG campaign data available yet
              </div>
            ) : (
              <div className="space-y-4">
                {topSDGGoals.map((goal) => (
                  <div key={goal.goal} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.goal}
                    </div>

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
                            width: `${(goal.count / goal.maxCount) * 100}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Recent Activity
          </h3>

          {recentActivity.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              No recent activity available
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "campaign"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "ngo"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {activity.type === "campaign" ? (
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2"
                        />
                      </svg>
                    ) : activity.type === "ngo" ? (
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {getRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SystemAdminLayout>
  );
}

function StatCard({ title, value, subtitle, icon, color, loading, badge }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
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

        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
