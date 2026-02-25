// ============================================
// PASSWORD SETUP API SERVICE
// ============================================
// API calls for NGO password setup flow (3-step verification)

import api from "../../lib/axios";

/**
 * Step 1: Verify password setup token
 * @param {string} token - JWT token from email link
 * @returns {Promise} Token validation result
 */
export const verifyPasswordSetupTokenAPI = async (token) => {
  try {
    const response = await api.get(`/auth/verify-password-setup-token`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw error;
  }
};

/**
 * Step 2: Verify identity with email and registration number
 * @param {Object} data - Identity verification data
 * @param {string} data.token - JWT token
 * @param {string} data.email - NGO email address
 * @param {string} data.registrationNumber - NGO registration number
 * @returns {Promise} Identity verification result
 */
export const verifyIdentityAPI = async ({
  token,
  email,
  registrationNumber,
}) => {
  try {
    const response = await api.post(`/auth/verify-identity`, {
      token,
      email,
      registrationNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to verify identity:", error);
    throw error;
  }
};

/**
 * Step 3: Set password and activate account
 * @param {Object} data - Password setup data
 * @param {string} data.token - JWT token
 * @param {string} data.email - NGO email address
 * @param {string} data.registrationNumber - NGO registration number
 * @param {string} data.password - New password
 * @param {string} data.confirmPassword - Password confirmation
 * @returns {Promise} Password setup result
 */
export const setPasswordAPI = async ({
  token,
  email,
  registrationNumber,
  password,
  confirmPassword,
}) => {
  try {
    const response = await api.post(`/auth/set-password`, {
      token,
      email,
      registrationNumber,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to set password:", error);
    throw error;
  }
};
