// ============================================
// CAMPAIGNS SLICE - Redux State Management
// ============================================
// This manages ALL campaigns data and admin review operations

import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

/**
 * INITIAL STATE
 * Campaign management state for System Admin
 */
const initialState = {
  // Data from backend
  campaigns: [], // Array of all campaigns
  selectedCampaign: null, // Currently selected campaign (for review modal)

  // UI state
  loading: false, // Is data being fetched?
  error: null, // Error message if fetch fails

  // Filters
  searchQuery: "", // Search by title/NGO name
  statusFilter: "ALL", // ALL, ONGOING, COMPLETED
  sdgFilter: "ALL", // ALL, 1-17 (SDG Goals)

  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  totalCount: 0,
};

/**
 * ASYNC THUNKS
 * These are async actions that fetch/update data from backend
 */

/**
 * Fetch all campaigns
 * Usage: dispatch(fetchAllCampaigns())
 */
export const fetchAllCampaigns = createAsyncThunk(
  "campaigns/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with your backend endpoint
      // const response = await api.get('/admin/campaigns');
      // return response.data.data;

      console.log("🔄 Fetching all campaigns from backend...");
      // For now, return empty array until backend is ready
      return [];
    } catch (error) {
      console.error("❌ Failed to fetch campaigns:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch campaigns",
      );
    }
  },
);

/**
 * Deactivate/Activate a campaign
 * Usage: dispatch(toggleCampaignStatus({ campaignId, action: 'DEACTIVATE' }))
 */
export const toggleCampaignStatus = createAsyncThunk(
  "campaigns/toggleStatus",
  async ({ campaignId, action }, { rejectWithValue }) => {
    try {
      // TODO: Replace with your backend endpoint
      // const response = await api.patch(`/admin/campaigns/${campaignId}/status`, { action });
      // return response.data.data;

      console.log(`🔄 ${action}ing campaign:`, campaignId);
      return { campaignId, action };
    } catch (error) {
      console.error(`❌ Failed to ${action} campaign:`, error);
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} campaign`,
      );
    }
  },
);

/**
 * Send warning email to NGO about campaign
 * Usage: dispatch(sendCampaignWarningEmail({ campaignId, subject, message }))
 */
export const sendCampaignWarningEmail = createAsyncThunk(
  "campaigns/sendWarningEmail",
  async ({ campaignId, subject, message }, { rejectWithValue }) => {
    try {
      // TODO: Replace with your backend endpoint
      // const response = await api.post(`/admin/campaigns/${campaignId}/send-warning`, {
      //   subject,
      //   message
      // });
      // return response.data;

      console.log("📧 Sending warning email for campaign:", campaignId);
      console.log("Subject:", subject);
      console.log("Message:", message);
      return { campaignId, message: "Email sent successfully" };
    } catch (error) {
      console.error("❌ Failed to send warning email:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send email",
      );
    }
  },
);

/**
 * SLICE DEFINITION
 */
const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,

  /**
   * REGULAR REDUCERS (Synchronous)
   */
  reducers: {
    // Set selected campaign for review modal
    setSelectedCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },

    // Clear selected campaign (close modal)
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },

    // Update search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },

    // Update status filter
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter
    },

    // Update SDG filter
    setSdgFilter: (state, action) => {
      state.sdgFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter
    },

    // Clear all filters
    clearFilters: (state) => {
      state.searchQuery = "";
      state.statusFilter = "ALL";
      state.sdgFilter = "ALL";
      state.currentPage = 1;
    },

    // Set current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  /**
   * EXTRA REDUCERS (Asynchronous)
   */
  extraReducers: (builder) => {
    // ========================================
    // FETCH ALL CAMPAIGNS
    // ========================================
    builder
      .addCase(fetchAllCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.totalCount = action.payload.length;
        state.error = null;
      })
      .addCase(fetchAllCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // TOGGLE CAMPAIGN STATUS
      // ========================================
      .addCase(toggleCampaignStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { campaignId, action: statusAction } = action.payload;

        // Update campaign status in the array
        const index = state.campaigns.findIndex((c) => c._id === campaignId);
        if (index !== -1) {
          state.campaigns[index].isActive = statusAction === "ACTIVATE";
        }

        state.selectedCampaign = null; // Close modal
      })
      .addCase(toggleCampaignStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // SEND WARNING EMAIL
      // ========================================
      .addCase(sendCampaignWarningEmail.fulfilled, (state) => {
        console.log("✅ Warning email sent successfully");
      });
  },
});

/**
 * MEMOIZED SELECTORS
 * These prevent unnecessary re-renders by caching computed values
 */

// Get all campaigns (simple selector)
export const selectAllCampaigns = (state) => state.campaigns.campaigns;

// Get loading state
export const selectLoading = (state) => state.campaigns.loading;

// Get error state
export const selectError = (state) => state.campaigns.error;

// Get selected campaign
export const selectSelectedCampaign = (state) =>
  state.campaigns.selectedCampaign;

// Get search query
export const selectSearchQuery = (state) => state.campaigns.searchQuery;

// Get status filter
export const selectStatusFilter = (state) => state.campaigns.statusFilter;

// Get SDG filter
export const selectSdgFilter = (state) => state.campaigns.sdgFilter;

// Get current page
export const selectCurrentPage = (state) => state.campaigns.currentPage;

// Get items per page
export const selectItemsPerPage = (state) => state.campaigns.itemsPerPage;

/**
 * FILTERED CAMPAIGNS (MEMOIZED)
 * Applies search and filters to campaigns list
 */
export const selectFilteredCampaigns = createSelector(
  [selectAllCampaigns, selectSearchQuery, selectStatusFilter, selectSdgFilter],
  (campaigns, searchQuery, statusFilter, sdgFilter) => {
    let filtered = [...campaigns];

    // Apply search filter (search in title and NGO name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.title?.toLowerCase().includes(query) ||
          campaign.createdBy?.ngoDetails?.ngoName
            ?.toLowerCase()
            .includes(query),
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (campaign) => campaign.status === statusFilter,
      );
    }

    // Apply SDG filter
    if (sdgFilter !== "ALL") {
      filtered = filtered.filter(
        (campaign) => campaign.sdgGoalNumber === parseInt(sdgFilter),
      );
    }

    return filtered;
  },
);

/**
 * PAGINATED CAMPAIGNS (MEMOIZED)
 * Returns campaigns for current page
 */
export const selectPaginatedCampaigns = createSelector(
  [selectFilteredCampaigns, selectCurrentPage, selectItemsPerPage],
  (filtered, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  },
);

/**
 * TOTAL PAGES (MEMOIZED)
 */
export const selectTotalPages = createSelector(
  [selectFilteredCampaigns, selectItemsPerPage],
  (filtered, itemsPerPage) => {
    return Math.ceil(filtered.length / itemsPerPage);
  },
);

/**
 * CAMPAIGN STATISTICS (MEMOIZED)
 */
export const selectCampaignStats = createSelector(
  [selectAllCampaigns],
  (campaigns) => {
    return {
      total: campaigns.length,
      ongoing: campaigns.filter((c) => c.status === "ONGOING").length,
      completed: campaigns.filter((c) => c.status === "COMPLETED").length,
      totalRaised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
      totalPlanned: campaigns.reduce(
        (sum, c) => sum + (c.totalPlannedCost || 0),
        0,
      ),
    };
  },
);

/**
 * EXPORT ACTIONS
 */
export const {
  setSelectedCampaign,
  clearSelectedCampaign,
  setSearchQuery,
  setStatusFilter,
  setSdgFilter,
  clearFilters,
  setCurrentPage,
} = campaignsSlice.actions;

/**
 * EXPORT REDUCER
 */
export default campaignsSlice.reducer;
