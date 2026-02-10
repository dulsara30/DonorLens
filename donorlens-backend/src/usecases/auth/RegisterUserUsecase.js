// src/usecases/auth/RegisterUserUsecase.js
// Business logic for normal user (donor) registration

import User from "../../models/user/User.js";

/**
 * Register User Usecase - Handles normal user (donor) registration business logic
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's plain text password (will be hashed)
 * @returns {Object} Result object with success status and user data or error message
 */
export default async function RegisterUserUsecase(userData) {
  try {
    const { fullName, email, password } = userData;

    // Validation: Check if all required fields are provided
    if (!fullName || !email || !password) {
      return {
        success: false,
        status: 400,
        message: "Full name, email, and password are required",
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

    // Create new user
    // Note: password will be automatically hashed by pre-save hook
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: "USER",
      isActive: true,
    });

    // Save user to database
    await newUser.save();

    // Return success response with safe user data (no password)
    return {
      success: true,
      status: 201,
      message: "User registered successfully",
      data: {
        user: newUser.toSafeObject(),
      },
    };
  } catch (error) {
    console.error("RegisterUserUsecase error:", error);

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
