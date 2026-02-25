// This manages ALL NGO registration requests data and operations
// A "slice" is a portion of your Redux store with its own state and reducers

import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

/**
 * INITIAL STATE
 * This is what the state looks like when app first loads
 * It holds ALL NGO requests data and UI state
 */
const initialState = {
  // Data from backend
  requests: [], // Array of all NGO registration requests
  noOfRequest: 0,
  selectedRequest: null, // Currently selected request (for modal)

  // UI state
  loading: false, // Is data being fetched?
  error: null, // Error message if fetch fails

  // Filters
  activeFilter: "PENDING", // Current tab: PENDING, APPROVED, REJECTED, etc.

  // Pagination (if you implement it later)
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

/**
 * ASYNC THUNKS
 * These are async actions that fetch/update data from backend
 * Redux Toolkit handles loading states automatically!
 */

/**
 * Fetch all NGO registration requests
 * Usage: dispatch(fetchNgoRequests())
 */
export const fetchNgoRequests = createAsyncThunk(
  "ngoRequests/fetchAll", // Action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Call your backend API endpoint
      // const response = await api.get('/admin/fetch-all-register-requests');
      // return response.data.data; // Return the requests array

      // For now, return empty array (you'll replace this)
      console.log("🔄 Fetching NGO requests from backend...");
      const response = await api.get("/admin/fetch-all-register-requests");
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to fetch NGO requests:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests",
      );
    }
  },
);

/**
 * Approve an NGO registration request
 * Usage: dispatch(approveRequest({ requestId, note }))
 */
export const approveRequest = createAsyncThunk(
  "ngoRequests/approve",
  async ({ requestId, note }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/ngo-request/${requestId}/approve`,
        { note },
      );

      console.log("Approving request:", requestId, "with note:", note);
      // Return the updated request
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve request",
      );
    }
  },
);

/**
 * Request resubmission for an NGO registration
 * Usage: dispatch(requestResubmit({ requestId, instructions }))
 */
export const requestResubmit = createAsyncThunk(
  "ngoRequests/resubmit",
  async ({ requestId, instructions }, { rejectWithValue }) => {
    try {
      // TODO: Call your backend resubmit endpoint
      // const response = await api.post(`/admin/request-resubmit/${requestId}`, { instructions });
      // return response.data.data;

      console.log(
        "🔄 Requesting resubmit for:",
        requestId,
        "with instructions:",
        instructions,
      );
      return { requestId, status: "RESUBMIT_REQUIRED", instructions };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request resubmission",
      );
    }
  },
);

/**
 * Reject an NGO registration request
 * Usage: dispatch(rejectRequest({ requestId, reason }))
 */
export const rejectRequest = createAsyncThunk(
  "ngoRequests/reject",
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      // TODO: Call your backend rejection endpoint
      // const response = await api.post(`/admin/reject-ngo/${requestId}`, { reason });
      // return response.data.data;

      console.log("❌ Rejecting request:", requestId, "with reason:", reason);
      return { requestId, status: "REJECTED", reason };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject request",
      );
    }
  },
);

/**
 * Resend password setup email
 * Usage: dispatch(resendPasswordEmail(requestId))
 */
export const resendPasswordEmail = createAsyncThunk(
  "ngoRequests/resendEmail",
  async (requestId, { rejectWithValue }) => {
    try {
      console.log("📧 Resending password setup email for NGO ID:", requestId);

      // ✅ Call backend endpoint that already exists
      const response = await api.put(`/admin/pw-Request/${requestId}`);

      console.log("✅ Password setup email sent successfully");
      return {
        requestId,
        message:
          response.data.message || "Password setup email sent successfully",
      };
    } catch (error) {
      console.error("❌ Failed to resend password email:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to resend password setup email",
      );
    }
  },
);

/**
 * SLICE DEFINITION
 * This creates the reducer and actions automatically
 */
const ngoRequestsSlice = createSlice({
  name: "ngoRequests",
  initialState,

  /**
   * REGULAR REDUCERS (Synchronous)
   * These update state immediately without backend calls
   */
  reducers: {
    // Set the currently selected request (for modal display)
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },

    // Clear selected request (close modal)
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },

    // Change filter tab (PENDING, APPROVED, etc.)
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },

    // Clear all data (useful for logout)
    clearRequests: (state) => {
      state.requests = [];
      state.selectedRequest = null;
      state.error = null;
    },
  },

  /**
   * EXTRA REDUCERS (Asynchronous)
   * These handle the loading states of async thunks
   * Redux Toolkit automatically generates pending/fulfilled/rejected actions
   */
  extraReducers: (builder) => {
    // ========================================
    // FETCH NGO REQUESTS
    // ========================================
    builder
      // When fetchNgoRequests() is called
      .addCase(fetchNgoRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When fetchNgoRequests() succeeds
      .addCase(fetchNgoRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload; // Store the fetched requests
        state.error = null;
      })
      // When fetchNgoRequests() fails
      .addCase(fetchNgoRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // APPROVE REQUEST
      // ========================================
      .addCase(approveRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the request in the array
        const index = state.requests.findIndex(
          (req) => req._id === action.payload.requestId,
        );
        if (index !== -1) {
          state.requests[index].ngoDetails.status = "APPROVED";
          // Add review note if needed
          if (action.payload.note) {
            state.requests[index].ngoDetails.reviewNotes.push({
              note: action.payload.note,
              createdAt: new Date().toISOString(),
            });
          }
        }
        state.selectedRequest = null; // Close modal
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // REQUEST RESUBMIT
      // ========================================
      .addCase(requestResubmit.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestResubmit.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(
          (req) => req._id === action.payload.requestId,
        );
        if (index !== -1) {
          state.requests[index].ngoDetails.status = "RESUBMIT_REQUIRED";
        }
        state.selectedRequest = null;
      })
      .addCase(requestResubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // REJECT REQUEST
      // ========================================
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(
          (req) => req._id === action.payload.requestId,
        );
        if (index !== -1) {
          state.requests[index].ngoDetails.status = "REJECTED";
          state.requests[index].ngoDetails.rejectionReason =
            action.payload.reason;
        }
        state.selectedRequest = null;
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // RESEND EMAIL
      // ========================================
      .addCase(resendPasswordEmail.fulfilled, (state) => {
        // Show success notification (you can add a toast notification here)
        console.log("Email sent successfully");
      });
  },
});

/**
 * SELECTORS
 * These are helper functions to read data from the store
 * Use these in components with useSelector()
 *
 * MEMOIZED SELECTORS:
 * We use createSelector to memoize selectors that return computed/filtered data.
 * This prevents unnecessary re-renders when the underlying data hasn't changed.
 */

// Get all requests (simple selector - no memoization needed)
export const selectAllRequests = (state) => state.ngoRequests.requests;

// Get requests filtered by status (MEMOIZED - prevents re-renders)
// Usage: useSelector(state => selectRequestsByStatus(state, 'PENDING'))
export const selectRequestsByStatus = createSelector(
  [
    (state) => state.ngoRequests.requests, // Input: all requests
    (state, status) => status, // Input: status filter
  ],
  (requests, status) => {
    // Output: filtered array (only recomputes if requests or status changes)
    return requests.filter((req) => req.ngoDetails.status === status);
  },
);

// Get requests count by status (MEMOIZED - prevents re-renders)
export const selectRequestsCountByStatus = createSelector(
  [(state) => state.ngoRequests.requests], // Input: all requests
  (requests) => {
    // Output: count object (only recomputes if requests array changes)
    return {
      pending: requests.filter((req) => req.ngoDetails.status === "PENDING")
        .length,
      approved: requests.filter((req) => req.ngoDetails.status === "APPROVED")
        .length,
      rejected: requests.filter((req) => req.ngoDetails.status === "REJECTED")
        .length,
      resubmit: requests.filter(
        (req) => req.ngoDetails.status === "RESUBMIT_REQUIRED",
      ).length,
      deactivated: requests.filter(
        (req) => req.ngoDetails.status === "DEACTIVATED",
      ).length,
    };
  },
);

// Get currently selected request
export const selectSelectedRequest = (state) =>
  state.ngoRequests.selectedRequest;

// Get loading state
export const selectLoading = (state) => state.ngoRequests.loading;

// Get error state
export const selectError = (state) => state.ngoRequests.error;

// Get active filter
export const selectActiveFilter = (state) => state.ngoRequests.activeFilter;

/**
 * EXPORT ACTIONS
 * These are automatically generated by createSlice
 * Use these with useDispatch() in components
 */
export const {
  setSelectedRequest,
  clearSelectedRequest,
  setActiveFilter,
  clearRequests,
} = ngoRequestsSlice.actions;

/**
 * EXPORT REDUCER
 * This is imported by the store
 */
export default ngoRequestsSlice.reducer;
