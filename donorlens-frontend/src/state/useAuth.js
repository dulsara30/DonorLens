// Custom hook to access authentication context

import { useContext } from "react";
import AuthContext from "./AuthContext";

/**
 * useAuth Hook
 * Provides access to authentication state and methods
 * Must be used within AuthProvider
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}

export default useAuth;