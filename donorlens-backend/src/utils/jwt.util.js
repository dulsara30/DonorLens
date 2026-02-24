// JWT utility functions for token generation and verification

import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * Generate JWT Access Token (short-lived)
 * @param {Object} payload - Token payload containing userId and role
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  const { userId, role } = payload;

  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
  });
};

/**
 * Generate JWT Refresh Token (long-lived)
 * @param {Object} payload - Token payload containing userId
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  const { userId } = payload;

  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "14d",
  });
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    console.error("Access token verification failed:", error.message);
    return null;
  }
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error("Refresh token verification failed:", error.message);
    return null;
  }
};

export const generatePasswordSetupToken = (ngoData) => {
  const payload = {
    ngoId: ngoData.ngoId.toString(),
    email: ngoData.email,
    registrationNumber: ngoData.registrationNumber,
    type: "PASSWORD_SETUP",
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

export const verifyPasswordSetupToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.type !== "PASSWORD_SETUP") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Password setup token verification failed:", error.message);
    return null;
  }
};

export const getTokenExpiryDate = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
};
