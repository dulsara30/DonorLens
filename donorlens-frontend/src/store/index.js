// ============================================
// REDUX STORE CONFIGURATION
// ============================================
// This is the central Redux store that holds ALL application state
// Think of it as a global database that any component can access

import { configureStore } from "@reduxjs/toolkit";
import ngoRequestsReducer from "./slices/ngoRequestsSlice";
import usersReducer from "./slices/usersSlice";
import dashboardReducer from "./slices/dashboardSlice";
import campaignsReducer from "./slices/campaignsSlice";

/**
 * Configure Redux Store
 *
 * What is a Store?
 * - It's like a JavaScript object that holds your entire app's state
 * - Any component can read from it using useSelector()
 * - Any component can update it using useDispatch()
 *
 * configureStore() automatically includes:
 * - Redux DevTools integration (time-travel debugging)
 * - Redux Thunk middleware (for async actions)
 * - Development checks (immutability, serializability)
 */
const store = configureStore({
  // Reducer = The "departments" of your store
  // Each reducer manages a specific slice of state
  reducer: {
    // State will be accessible as: state.ngoRequests
    ngoRequests: ngoRequestsReducer,

    // State will be accessible as: state.users
    users: usersReducer,

    // State will be accessible as: state.dashboard
    dashboard: dashboardReducer,

    // State will be accessible as: state.campaigns
    campaigns: campaignsReducer,
  },

  // Middleware configuration (optional)
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(yourCustomMiddleware),

  // Enable Redux DevTools in development
  devTools: import.meta.env.MODE !== "production",
});

/**
 * Export Types for TypeScript (optional, but good practice)
 * These help with autocompletion in VSCode
 */
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
