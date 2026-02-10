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

    
    if (!fullName || !email || !password) {
      return {
        success: false,
        status: 400,
        message: "Full name, email, and password are required",
      };
    }

    
    if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      return {
        success: false,
        status: 400,
        message: "Full name must be between 2 and 100 characters",
      };
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        status: 400,
        message: "Invalid email format",
      };
    }

    
    if (password.length < 8) {
      return {
        success: false,
        status: 400,
        message: "Password must be at least 8 characters long",
      };
    }

    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

    
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: "USER",
      isActive: true,
    });

    // Save user to database
    await newUser.save();

    
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

   
    if (error.code === 11000) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

   
    if (error.name === "ValidationError") {
      return {
        success: false,
        status: 400,
        message: "Validation error: " + error.message,
      };
    }


    return {
      success: false,
      status: 500,
      message: "Internal server error during registration",
    };
  }
}
