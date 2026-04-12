/**
 * ⚠️  ONE-TIME CLEANUP SCRIPT
 * Deletes ALL test NGO data from database
 * This targets all email patterns used in ngo-registration.spec.js
 * Usage: node cleanup-test-data.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// User model
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("User", userSchema, "users");

const cleanupTestData = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Email patterns from ngo-registration.spec.js tests
    const testEmailPatterns = [
      "testngo", // POSITIVE TEST 1
      "completengo", // POSITIVE TEST 2
      "nocert", // NEGATIVE TEST 1
      "duplicate", // NEGATIVE TEST 2
      "edgecase", // EDGE CASE
      "pwsetup", // MOCKING test
    ];

    console.log(
      "🗑️  Finding test users with patterns:",
      testEmailPatterns.join(", "),
    );

    // Create regex to match ANY of these patterns
    const regexPattern = testEmailPatterns.join("|");
    const testUsers = await User.find({
      email: { $regex: regexPattern, $options: "i" },
    });

    console.log(`📊 Found ${testUsers.length} test users to delete`);

    if (testUsers.length === 0) {
      console.log("✅ No test users to delete!");
      await mongoose.connection.close();
      return;
    }

    // Show sample of test users
    console.log("\n📋 Sample of test users to delete:");
    testUsers.slice(0, 10).forEach((user) => {
      console.log(`  - ${user.email} (Role: ${user.role})`);
    });
    if (testUsers.length > 10) {
      console.log(`  ... and ${testUsers.length - 10} more`);
    }

    // Delete test users
    console.log("\n🗑️  Deleting all test users...");
    const result = await User.deleteMany({
      email: { $regex: regexPattern, $options: "i" },
    });

    console.log(
      `✅ Successfully deleted ${result.deletedCount} test users from database!`,
    );

    // Verify deletion
    const remaining = await User.countDocuments({
      email: { $regex: regexPattern, $options: "i" },
    });

    console.log(`\n✔️  Verification: ${remaining} test users remaining`);

    await mongoose.connection.close();
    console.log("✅ Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

cleanupTestData();
