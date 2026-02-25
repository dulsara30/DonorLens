import { createCampaignUsecase } from "../../usecases/campaigns/createCampaign.usecase.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import { sendCreated } from "../../utils/apiResponse.js";
import { MissingFieldError } from "../../utils/errors.js";

export const createCampaign = async (req, res, next) => {
  try {
    const userId = req.user.userId; 

    const {
      title,
      sdgGoalNumber,
      description,
      endDate,
      financialBreakdown,
      location,
    } = req.body;

    if (!req.file) {
      throw new MissingFieldError("coverImage");
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
        originalName: req.file.originalname,
    });

    const campaign = await createCampaignUsecase({
      userId,
      title,
      sdgGoalNumber: Number(sdgGoalNumber),
      description,
      endDate,
      coverImage: {
        public_id: uploadResult.publicId,
        secure_url: uploadResult.url,
      },
      financialBreakdown: JSON.parse(financialBreakdown),
      location: JSON.parse(location),
    });

    return sendCreated(res, campaign, "Campaign created successfully");

  } catch (error) {
    next(error);
  }
};