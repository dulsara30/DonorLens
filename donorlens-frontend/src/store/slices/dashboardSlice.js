// ============================================
// DASHBOARD SLICE - Redux State Management
// ============================================
// This manages dashboard statistics and overview data

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

/**
 * INITIAL STATE
 */
const initialState = {
  // Overview statistics
  stats: {
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalDonations: 0,
    totalDonationAmount: 0,
    totalUsers: 0,
    totalNGOs: 0,
    pendingNGOs: 0,
  },

  // SDG Goals distribution
  sdgDistribution: [], // [{ goal: 1, count: 5 }, { goal: 3, count: 8 }, ...]

  // Recent activity
  recentActivity: [],

  // Chart data for graphs
  donationTrends: [], // Daily/Monthly donation trends
  campaignsByCategory: [],

  loading: false,
  error: null,
};

/**
 * ASYNC THUNKS - API Calls
 */

/**
 * Fetch dashboard overview statistics
 * Usage: dispatch(fetchDashboardStats())
 */
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual endpoint
      // const response = await api.get('/admin/dashboard/stats');
      // return response.data.data;

      console.log("🔄 Fetching dashboard statistics...");

      // Temporary mock data - remove when you implement backend
      return {
        totalCampaigns: 45,
        activeCampaigns: 12,
        completedCampaigns: 33,
        totalDonations: 1250,
        totalDonationAmount: 125000,
        totalUsers: 850,
        totalNGOs: 25,
        pendingNGOs: 5,
      };
    } catch (error) {
      console.error("❌ Failed to fetch dashboard stats:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

/**
 * Fetch SDG goals distribution
 * Shows which SDG goals have the most campaigns
 * Usage: dispatch(fetchSDGDistribution())
 */
export const fetchSDGDistribution = createAsyncThunk(
  "dashboard/fetchSDG",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual endpoint
      // const response = await api.get('/admin/dashboard/sdg-distribution');
      // return response.data.data;

      console.log("🔄 Fetching SDG distribution...");

      // Mock data - SDG goals 1-17
      return [
        { goal: 1, name: "No Poverty", count: 12, color: "#E5243B" },
        { goal: 2, name: "Zero Hunger", count: 8, color: "#DDA63A" },
        { goal: 3, name: "Good Health", count: 15, color: "#4C9F38" },
        { goal: 4, name: "Quality Education", count: 10, color: "#C5192D" },
        { goal: 6, name: "Clean Water", count: 7, color: "#26BDE2" },
        { goal: 13, name: "Climate Action", count: 5, color: "#3F7E44" },
      ];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch SDG data",
      );
    }
  },
);

/**
 * Fetch donation trends over time
 * Usage: dispatch(fetchDonationTrends('monthly'))
 */
export const fetchDonationTrends = createAsyncThunk(
  "dashboard/fetchTrends",
  async (period = "monthly", { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual endpoint
      // const response = await api.get(`/admin/dashboard/trends?period=${period}`);
      // return response.data.data;

      console.log("🔄 Fetching donation trends for:", period);

      // Mock data - last 6 months
      return [
        { month: "Jan", donations: 45, amount: 12000 },
        { month: "Feb", donations: 52, amount: 15000 },
        { month: "Mar", donations: 48, amount: 13500 },
        { month: "Apr", donations: 61, amount: 18000 },
        { month: "May", donations: 55, amount: 16000 },
        { month: "Jun", donations: 70, amount: 21000 },
      ];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trends",
      );
    }
  },
);

/**
 * Fetch recent activity/logs
 * Usage: dispatch(fetchRecentActivity())
 */
export const fetchRecentActivity = createAsyncThunk(
  "dashboard/fetchActivity",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual endpoint
      // const response = await api.get('/admin/dashboard/recent-activity');
      // return response.data.data;

      console.log("🔄 Fetching recent activity...");

      // Mock data
      return [
        {
          id: 1,
          type: "donation",
          message: 'John Doe donated $500 to "Clean Water for Africa"',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: "campaign",
          message: 'New campaign "Education for All" was created',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          type: "ngo",
          message: "Hope Foundation registration approved",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity",
      );
    }
  },
);

/**
 * SLICE DEFINITION
 */
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    // Clear dashboard data
    clearDashboard: (state) => {
      return initialState;
    },

    // Update a specific stat (for real-time updates)
    updateStat: (state, action) => {
      const { key, value } = action.payload;
      if (state.stats.hasOwnProperty(key)) {
        state.stats[key] = value;
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch SDG distribution
      .addCase(fetchSDGDistribution.fulfilled, (state, action) => {
        state.sdgDistribution = action.payload;
      })

      // Fetch donation trends
      .addCase(fetchDonationTrends.fulfilled, (state, action) => {
        state.donationTrends = action.payload;
      })

      // Fetch recent activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      });
  },
});

/**
 * SELECTORS
 */

// Get all dashboard stats
export const selectDashboardStats = (state) => state.dashboard.stats;

// Get SDG distribution
export const selectSDGDistribution = (state) => state.dashboard.sdgDistribution;

// Get donation trends
export const selectDonationTrends = (state) => state.dashboard.donationTrends;

// Get recent activity
export const selectRecentActivity = (state) => state.dashboard.recentActivity;

// Get loading state
export const selectDashboardLoading = (state) => state.dashboard.loading;

// Get top performing SDG goals
export const selectTopSDGGoals = (state) => {
  return [...state.dashboard.sdgDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

/**
 * EXPORT ACTIONS
 */
export const { clearDashboard, updateStat } = dashboardSlice.actions;

/**
 * EXPORT REDUCER
 */
export default dashboardSlice.reducer;
