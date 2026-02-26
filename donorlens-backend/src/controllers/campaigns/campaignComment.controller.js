import { CampaignCommentUsecase } from "../../usecases/campaigns/campaignComment.usecase.js";

const campaignCommentUsecase = new CampaignCommentUsecase();

export const addComment = async (req, res, next) => {
  try {
    const donorId = req.user.userId;
    const { campaignId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const result = await campaignCommentUsecase.addComment(
      donorId,
      campaignId,
      content.trim(),
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const result =
      await campaignCommentUsecase.getCommentsByCampaign(campaignId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const donorId = req.user.userId;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const result = await campaignCommentUsecase.updateComment(
      commentId,
      donorId,
      content.trim(),
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const donorId = req.user.userId;
    const { commentId } = req.params;

    const result = await campaignCommentUsecase.deleteComment(
      commentId,
      donorId,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
