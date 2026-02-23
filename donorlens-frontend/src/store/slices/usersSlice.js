// ============================================
// USERS SLICE - Redux State Management
// ============================================
// This manages ALL registered users (donors) data

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

/**
 * INITIAL STATE
 */
const initialState = {
  users: [], // All registered users
  selectedUser: null, // Currently selected user (for modal)
  loading: false,
  error: null,
  searchQuery: "", // Search filter
  roleFilter: "ALL", // Filter by role: ALL, USER, NGO_ADMIN
};

/**
 * ASYNC THUNKS - API Calls
 */

/**
 * Fetch all registered users
 * Usage: dispatch(fetchAllUsers())
 */
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with your actual endpoint
      // const response = await api.get('/admin/users');
      // return response.data.data;

      console.log("🔄 Fetching all users from backend...");
      // Temporary mock data - remove when you implement backend
      return [];
    } catch (error) {
      console.error("❌ Failed to fetch users:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

/**
 * Toggle user active status (activate/deactivate)
 * Usage: dispatch(toggleUserStatus({ userId, isActive }))
 */
export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      // TODO: Call your backend endpoint
      // const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
      // return response.data.data;

      console.log(
        `🔄 ${isActive ? "Activating" : "Deactivating"} user:`,
        userId,
      );
      return { userId, isActive };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status",
      );
    }
  },
);

/**
 * Send custom email to user
 * Usage: dispatch(sendEmailToUser({ userId, subject, message }))
 */
export const sendEmailToUser = createAsyncThunk(
  "users/sendEmail",
  async ({ userId, subject, message }, { rejectWithValue }) => {
    try {
      // TODO: Call your backend email endpoint
      // const response = await api.post(`/admin/send-email/${userId}`, { subject, message });
      // return response.data;

      console.log("📧 Sending email to user:", userId);
      console.log("Subject:", subject);
      console.log("Message:", message);
      return { userId, success: true };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send email",
      );
    }
  },
);

/**
 * Fetch user donation history
 * Usage: dispatch(fetchUserDonations(userId))
 */
export const fetchUserDonations = createAsyncThunk(
  "users/fetchDonations",
  async (userId, { rejectWithValue }) => {
    try {
      // TODO: Call your backend endpoint to get user's donations
      // const response = await api.get(`/admin/users/${userId}/donations`);
      // return { userId, donations: response.data.data };

      console.log("🔄 Fetching donations for user:", userId);
      return { userId, donations: [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donations",
      );
    }
  },
);

/**
 * SLICE DEFINITION
 */
const usersSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    // Set selected user for modal
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    // Clear selected user (close modal)
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Set role filter
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },

    // Clear all users (logout)
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle user status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { userId, isActive } = action.payload;
        const user = state.users.find((u) => u._id === userId);
        if (user) {
          user.isActive = isActive;
        }
      })

      // Fetch user donations
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        const { userId, donations } = action.payload;
        if (state.selectedUser && state.selectedUser._id === userId) {
          state.selectedUser.donations = donations;
        }
      });
  },
});

/**
 * SELECTORS
 */

// Get all users
export const selectAllUsers = (state) => state.users.users;

// Get filtered users (by search and role)
export const selectFilteredUsers = (state) => {
  let filtered = state.users.users;

  // Filter by role
  if (state.users.roleFilter !== "ALL") {
    filtered = filtered.filter((user) => user.role === state.users.roleFilter);
  }

  // Filter by search query
  if (state.users.searchQuery) {
    const query = state.users.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }

  return filtered;
};

// Get users count by role
export const selectUsersCountByRole = (state) => {
  const users = state.users.users;
  return {
    total: users.length,
    donors: users.filter((u) => u.role === "USER").length,
    ngoAdmins: users.filter((u) => u.role === "NGO_ADMIN").length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };
};

// Get selected user
export const selectSelectedUser = (state) => state.users.selectedUser;

// Get loading state
export const selectUsersLoading = (state) => state.users.loading;

// Get error
export const selectUsersError = (state) => state.users.error;

/**
 * EXPORT ACTIONS
 */
export const {
  setSelectedUser,
  clearSelectedUser,
  setSearchQuery,
  setRoleFilter,
  clearUsers,
} = usersSlice.actions;

/**
 * EXPORT REDUCER
 */
export default usersSlice.reducer;
