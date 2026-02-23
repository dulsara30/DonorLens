import mongoose from "mongoose";

const { Schema } = mongoose;

const evidencePhotosSchema = new Schema(
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
  { _id: false },
);

const receiptSchema = new Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const executionUpdateSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },

    fundsUsed: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000000, // Arbitrary upper limit to prevent unrealistic values
    },

    evidencePhotos: {
      type: [evidencePhotosSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one evidence photo is required.",
      },
    },

    receipts: {
      type: [receiptSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ExecutionUpdate = mongoose.model(
  "ExecutionUpdate",
  executionUpdateSchema,
);

export default ExecutionUpdate;
