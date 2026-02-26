import mongoose from "mongoose";
import User from "../../models/user/User.js";
import Campaign from "../../models/campaigns/Campaign.js";
import {
  AnyDuplicationError,
  NotFoundError,
  ValidationError,
} from "../../utils/errors.js";

export default async function DeactivateNgoRequestUsecase(
  ngoId,
  note,
  adminId,
) {
  console.log("Deactivating NGO registration request!");
  try {
    const error = {};
    if (!ngoId?.trim() || !mongoose.Types.ObjectId.isValid(ngoId))
      error.ngoId = "NGO ID is required";
    if (!adminId?.trim()) error.adminId = "Admin ID is required";
    if (!note?.trim()) error.note = "Deactivation note is required";

    if (Object.keys(error).length > 0) {
      throw new ValidationError("Missing Required Fields", error);
    }

    const ngoUser = await User.findById(ngoId);
    if (!ngoUser) {
      throw new NotFoundError("NGO");
    }

    if (ngoUser.ngoDetails.status !== "APPROVED") {
      throw new AnyDuplicationError(
        "NGO registration request is already deactivated or not approved yet",
      );
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    const activeCampaigns = await Campaign.find({
      createdBy: ngoId.toString(),
      status: { $in: ["ONGOING", "COMPLETED"] },
    });

    let canceledCampaignsCount = 0;

    if (activeCampaigns.length > 0) {
      const campaignUpdatePromises = activeCampaigns.map(async (campaign) => {
        campaign.status = "CANCELLED";

        await campaign.save();
        canceledCampaignsCount++;
        return campaign;
      });

      await Promise.all(campaignUpdatePromises);
      console.log(
        `Canceled ${canceledCampaignsCount} active campaigns created by the NGO.`,
      );
    } else {
      console.log("No active campaigns found for this NGO.");
    }

    ngoUser.ngoDetails.status = "DEACTIVATED";
    ngoUser.ngoDetails.reviewedAt = new Date();
    ngoUser.ngoDetails.reviewedBy = adminId;
    ngoUser.isActive = false;

    ngoUser.ngoDetails.reviewNotes.push({
      note: note || "Registration deactivated by admin",
      createdBy: adminId,
      createdAt: new Date(),
    });
    await ngoUser.save();
    return {
      success: true,
      message: `NGO has been deactivated successfully. ${canceledCampaignsCount} active campaigns were canceled.`,
    };
  } catch (error) {
    console.error("Error in DeactivateNgoRequestUsecase", error);
    throw error;
  }
}
