// scripts/createTestUser.js
// Utility script to create test users in MongoDB with hashed passwords
// Run with: node scripts/createTestUser.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user/User.js";

// Load environment variables
dotenv.config();

/**
 * Create a test user in the database
 */
async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "test@donorlens.com" });
    
    if (existingUser) {
      console.log("❌ User already exists with email: test@donorlens.com");
      await mongoose.connection.close();
      return;
    }

    // Hash the password using bcrypt
    const password = "Password123!";
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create regular USER
    const regularUser = new User({
      fullName: "Test User",
      email: "test@donorlens.com",
      passwordHash: passwordHash,
      role: "USER",
      isActive: true,
      profile: {
        phone: "+1234567890",
        country: "USA"
      }
    });

    await regularUser.save();
    console.log("✅ Regular user created successfully!");
    console.log("   Email: test@donorlens.com");
    console.log("   Password: Password123!");
    console.log("   Role: USER");

    // Create NGO_ADMIN user
    const adminPasswordHash = await bcrypt.hash("Admin123!", saltRounds);
    
    const adminUser = new User({
      fullName: "Admin User",
      email: "admin@donorlens.com",
      passwordHash: adminPasswordHash,
      role: "NGO_ADMIN",
      isActive: true,
      ngoDetails: {
        ngoName: "Test NGO Organization",
        registrationNumber: "NGO-12345",
        contactNumber: "+1987654321",
        website: "https://testngo.org",
        address: "123 NGO Street, City, Country"
      },
      profile: {
        phone: "+1987654321",
        country: "USA"
      }
    });

    await adminUser.save();
    console.log("\n✅ Admin user created successfully!");
    console.log("   Email: admin@donorlens.com");
    console.log("   Password: Admin123!");
    console.log("   Role: NGO_ADMIN");

    console.log("\n🎉 Test users created successfully!");
    console.log("\n📝 You can now test the login with:");
    console.log("   Regular User: test@donorlens.com / Password123!");
    console.log("   Admin User: admin@donorlens.com / Admin123!");

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ MongoDB connection closed");

  } catch (error) {
    console.error("❌ Error creating test users:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
createTestUser();
