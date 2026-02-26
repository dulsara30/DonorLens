import CampaignComment from "../../models/campaigns/CampaignComment.js";
import Campaign from "../../models/campaigns/Campaign.js";
import Payment from "../../models/payment/Payment.js";

export class CampaignCommentUsecase {

  async hasFundedCampaign(donorId, campaignId) {
    const payment = await Payment.findOne({
      donor: donorId,
      campaign: campaignId,
      status: "COMPLETED",
    });
    return !!payment;
  }

  async addComment(donorId, campaignId, content) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const hasFunded = await this.hasFundedCampaign(donorId, campaignId);
    if (!hasFunded) {
      throw new Error(
        "You can only comment on campaigns you have funded",
      );
    }

    const comment = new CampaignComment({
      campaign: campaignId,
      donor: donorId,
      content,
    });

    await comment.save();

    const populatedComment = await CampaignComment.findById(comment._id)
      .populate("donor", "fullName email profile");

    return {
      success: true,
      message: "Comment added successfully",
      data: populatedComment,
    };
  }

  async getCommentsByCampaign(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const comments = await CampaignComment.find({ campaign: campaignId })
      .populate("donor", "fullName email profile")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Comments fetched successfully",
      count: comments.length,
      data: comments,
    };
  }

  async updateComment(commentId, donorId, content) {
    const comment = await CampaignComment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.donor.toString() !== donorId) {
      throw new Error("You can only update your own comments");
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await CampaignComment.findById(commentId)
      .populate("donor", "fullName email profile");

    return {
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    };
  }

  async deleteComment(commentId, donorId) {
    const comment = await CampaignComment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.donor.toString() !== donorId) {
      throw new Error("You can only delete your own comments");
    }

    await CampaignComment.findByIdAndDelete(commentId);

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  }
}
