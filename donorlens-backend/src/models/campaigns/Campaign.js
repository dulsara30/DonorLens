import mongoose from "mongoose";

const { Schema } = mongoose;

const financialItemSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const coverImageSchema = new Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const campaignSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    sdgGoalNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 17,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    endDate: {
      type: Date,
      required: true,
    },

    coverImage: {
      type: coverImageSchema,
      required: true,
    },

    financialBreakdown: {
      type: [financialItemSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Financial breakdown must contain at least one item.",
      },
    },

    totalPlannedCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ONGOING", "COMPLETED"],
      default: "ONGOING",
    },

    location: {
      type: locationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Auto calculate totalPlannedCost + status before saving
 */
campaignSchema.pre("save", function () {
  if (this.financialBreakdown && this.financialBreakdown.length > 0) {
    this.totalPlannedCost = this.financialBreakdown.reduce(
      (sum, item) => sum + item.cost,
      0
    );
  } else {
    this.totalPlannedCost = 0;
  }

  // Update status
  if (this.raisedAmount >= this.totalPlannedCost && this.totalPlannedCost > 0) {
    this.status = "COMPLETED";
  } else {
    this.status = "ONGOING";
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;