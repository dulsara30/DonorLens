// src/usecases/auth/RegisterNgoUsecase.js
// Business logic for NGO admin registration

import User from "../../models/user/User.js";

/**
 * Register NGO Admin Usecase - Handles NGO administrator registration business logic
 * @param {Object} userData - NGO admin registration data
 * @param {string} userData.fullName - Admin's full name
 * @param {string} userData.email - Admin's email address
 * @param {string} userData.password - Admin's plain text password (will be hashed)
 * @param {string} userData.ngoName - Name of the NGO organization
 * @param {string} [userData.registrationNumber] - NGO registration number (optional)
 * @param {string} userData.contactNumber - NGO contact number
 * @param {string} [userData.website] - NGO website URL (optional)
 * @param {string} userData.address - NGO address
 * @returns {Object} Result object with success status and user data or error message
 */
export default async function RegisterNgoUsecase(userData) {
  try {
    const { 
      fullName, 
      email, 
      password, 
      ngoName,
      registrationNumber,
      contactNumber,
      website,
      address
    } = userData;

    // Validation: Check if all required fields are provided
    if (!fullName || !email || !password) {
      return {
        success: false,
        status: 400,
        message: "Full name, email, and password are required",
      };
    }

    // Validate NGO required fields
    if (!ngoName || !contactNumber || !address) {
      return {
        success: false,
        status: 400,
        message: "NGO name, contact number, and address are required",
      };
    }

    // Validate full name length
    if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      return {
        success: false,
        status: 400,
        message: "Full name must be between 2 and 100 characters",
      };
    }

    // Validate NGO name length
    if (ngoName.trim().length < 2) {
      return {
        success: false,
        status: 400,
        message: "NGO name must be at least 2 characters long",
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        status: 400,
        message: "Invalid email format",
      };
    }

    // Password strength validation
    if (password.length < 8) {
      return {
        success: false,
        status: 400,
        message: "Password must be at least 8 characters long",
      };
    }

    // Validate contact number
    if (contactNumber.trim().length < 10) {
      return {
        success: false,
        status: 400,
        message: "Contact number must be at least 10 digits",
      };
    }

    // Validate address
    if (address.trim().length < 10) {
      return {
        success: false,
        status: 400,
        message: "Address must be at least 10 characters long",
      };
    }

    // Validate website URL format if provided
    if (website && website.trim() !== "") {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        return {
          success: false,
          status: 400,
          message: "Invalid website URL format",
        };
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

    // Create new NGO admin user
    // Note: password will be automatically hashed by pre-save hook
    const newNgoAdmin = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: "NGO_ADMIN",
      isActive: true,
      ngoDetails: {
        ngoName: ngoName.trim(),
        registrationNumber: registrationNumber?.trim() || undefined,
        contactNumber: contactNumber.trim(),
        website: website?.trim() || undefined,
        address: address.trim(),
      },
    });

    // Save NGO admin to database
    await newNgoAdmin.save();

    // Return success response with safe user data (no password)
    return {
      success: true,
      status: 201,
      message: "NGO admin registered successfully",
      data: {
        user: newNgoAdmin.toSafeObject(),
      },
    };
  } catch (error) {
    console.error("RegisterNgoUsecase error:", error);

    // Handle MongoDB duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return {
        success: false,
        status: 400,
        message: "Validation error: " + error.message,
      };
    }

    // Don't leak internal errors to the client
    return {
      success: false,
      status: 500,
      message: "Internal server error during registration",
    };
  }
}
