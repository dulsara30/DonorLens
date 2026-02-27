import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentLogSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
      index: true,
    },

    amount: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      default: "LKR",
      uppercase: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "BANK_TRANSFER", "ONLINE", "OTHER", null],
      default: null,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
      index: true,
    },

    failureReason: {
      type: String,
      default: null,
      trim: true,
    },

    failureCategory: {
      type: String,
      enum: [
        "VALIDATION_ERROR",
        "CAMPAIGN_ERROR",
        "PAYMENT_PROVIDER_ERROR",
        "SYSTEM_ERROR",
        "UNKNOWN",
        null,
      ],
      default: null,
    },

    requestBody: {
      type: Schema.Types.Mixed,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);

export default PaymentLog;
