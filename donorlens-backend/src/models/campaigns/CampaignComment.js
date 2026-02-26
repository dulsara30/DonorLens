import mongoose from "mongoose";

const { Schema } = mongoose;

const campaignCommentSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient querying of comments per campaign per donor
campaignCommentSchema.index({ campaign: 1, donor: 1 });

const CampaignComment = mongoose.model(
  "CampaignComment",
  campaignCommentSchema,
);

export default CampaignComment;
