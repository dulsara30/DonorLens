// JWT utility functions for token generation and verification

import jwt from "jsonwebtoken";
import crypto from "crypto";
import loggerService from "../services/logger.service.js";

const ALG = "HS256";

/**
 * Generate JWT Access Token (short-lived)
 * @param {Object} payload - Token payload containing userId/id, role, and tv/tokenVersion
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  const userId = payload.userId || payload.id;
  const role = payload.role;
  const tv = payload.tv ?? payload.tokenVersion ?? 0;

  return jwt.sign({ userId, id: userId, role, tv }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    algorithm: ALG,
  });
};

/**
 * Generate JWT Refresh Token (long-lived)
 * @param {Object} payload - Token payload containing userId/id and tv/tokenVersion
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  const userId = payload.userId || payload.id;
  const tv = payload.tv ?? payload.tokenVersion ?? 0;

  return jwt.sign({ userId, id: userId, tv }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "14d",
    algorithm: ALG,
  });
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: [ALG] });
  } catch (error) {
    loggerService.warn("Access token verification failed:", { error: error.message });
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
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: [ALG] });
  } catch (error) {
    loggerService.warn("Refresh token verification failed:", { error: error.message });
    return null;
  }
};

export const generatePasswordSetupToken = (ngoData) => {
  const payload = {
    ngoId: ngoData.ngoId,
    email: ngoData.email,
    registrationNumber: ngoData.registrationNumber,
    type: "PASSWORD_SETUP",
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
    algorithm: ALG,
  });

  return token;
};

export const verifyPasswordSetupToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: [ALG] });

    if (decoded.type !== "PASSWORD_SETUP") {
      return null;
    }

    return decoded;
  } catch (error) {
    loggerService.warn("Password setup token verification failed:", { error: error.message });
    return null;
  }
};

export const getTokenExpiryDate = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
};

export const generateResubmissionToken = (ngoData) => {
  const payload = {
    ngoId: ngoData.ngoId,
    email: ngoData.email,
    registrationNumber: ngoData.registrationNumber,
    type: "RESUBMISSION_REQUIRED",
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
    algorithm: ALG,
  });

  return token;
};

export const verifyResubmissionToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: [ALG] });

    if (decoded.type !== "RESUBMISSION_REQUIRED") {
      return null;
    }

    return decoded;
  } catch (error) {
    loggerService.warn("Resubmission token verification failed:", { error: error.message });
    return null;
  }
};

