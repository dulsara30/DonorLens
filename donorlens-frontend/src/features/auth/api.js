// Authentication API service - centralized auth-related API calls

import api from "../../lib/axios.js";

/**
 * Register a new donor user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Response data with user information
 * @throws {Error} API error with response data
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register/user", userData);
    return response.data;
  } catch (error) {
    // Rethrow with better error handling
    throw error.response?.data || error;
  }
};

/**
 * Register a new NGO admin account
 * @param {Object} ngoData - NGO registration data
 * @param {string} ngoData.fullName - Admin's full name
 * @param {string} ngoData.email - Admin's email address
 * @param {string} ngoData.password - Admin's password
 * @param {string} ngoData.ngoName - NGO organization name
 * @param {string} [ngoData.registrationNumber] - NGO registration number (optional)
 * @param {string} ngoData.contactNumber - NGO contact number
 * @param {string} [ngoData.website] - NGO website URL (optional)
 * @param {string} ngoData.address - NGO registered address
 * @returns {Promise<Object>} Response data with user information
 * @throws {Error} API error with response data
 */
export const ngoRegister = async (ngoData) => {
  try {
    const response = await api.post("/admin/register-ngo", ngoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response data with access token and user info
 * @throws {Error} API error with response data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Submit NGO verification request with documents
 * @param {FormData} formData - FormData containing NGO info and documents
 * @returns {Promise<Object>} Response data with request ID and status
 * @throws {Error} API error with response data
 */
export const submitNgoRequest = async (formData) => {
  try {
    console.log("Submitting NGO request with formData:", formData);
    const response = await api.post("/admin/register-ngo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
