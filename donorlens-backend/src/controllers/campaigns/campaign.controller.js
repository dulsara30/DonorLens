import { createCampaignUsecase } from "../../usecases/campaigns/createCampaign.usecase.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";

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
      return res.status(400).json({ message: "Cover image is required" });
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

    res.status(201).json({
      success: true,
      data: campaign,
    });

  } catch (error) {
    next(error);
  }
};