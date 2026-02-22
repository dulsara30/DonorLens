import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.role !== "NGO_ADMIN";
      },
      select: false, // IMPORTANT: never return password by default
    },

    role: {
      type: String,
      enum: ["USER", "NGO_ADMIN", "ADMIN"],
      default: "USER",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ngoDetails: {
      ngoName: {
        type: String,
        trim: true,
      },
      registrationNumber: {
        type: String,
        trim: true,
      },
      primaryPhone: {
        type: String,
        trim: true,
      },
      secondaryPhone: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      documents: {
        registrationCertificate: {
          url: String,
          publicId: String,
          format: String,
          size: Number,
          uploadedAt: { type: Date, default: Date.now },
        },
        additionalDocuments: [
          {
            url: String,
            publicId: String,
            format: String,
            size: Number,
            uploadedAt: { type: Date, default: Date.now },
          },
        ],
      },
      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
          "RESUBMIT_REQUIRED",
          "DEACTIVATED",
        ],
        default: "PENDING",
      },
      rejectionReason: {
        type: String,
        trim: true,
      },
      reviewNotes: [
        {
          note: String,
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      submissionHistory: [
        {
          submittedAt: Date,
          status: String,
          documents: Object, // Store snapshot of submitted docs
        },
      ],
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    profile: {
      phone: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      profileImageUrl: {
        type: String,
      },
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save middleware to hash password before saving to database
 * Only runs if password field is modified or document is new
 * Note: Using async/await, so no 'next' parameter needed - Mongoose handles promise resolution
 */
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }

  // Generate salt and hash password
  // If error occurs, Mongoose will catch it automatically
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

/**
 * Instance method to compare password with hashed password
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

/**
 * Transform user object to safe format (remove sensitive data)
 * @returns {Object} User object without sensitive fields
 */
userSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();

  // Remove sensitive fields
  delete userObject.passwordHash;
  delete userObject.__v;

  return {
    id: userObject._id,
    fullName: userObject.fullName,
    email: userObject.email,
    role: userObject.role,
    isActive: userObject.isActive,
    profile: userObject.profile,
    ngoDetails: userObject.ngoDetails,
    createdAt: userObject.createdAt,
    lastLoginAt: userObject.lastLoginAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
