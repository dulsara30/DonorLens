import { createExecutions } from "../../../usecases/campaigns/executions/createExecutionsUsecase.js";
import { ApiResponse, sendCreated } from "../../../utils/apiResponse.js";
import { NotFoundError } from "../../../utils/errors.js";

/**
 * Create Execution Update Controller
 * Handles file uploads and creates execution update
 */
export const createExecutionUpdate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const userId = "698e1f3cb308e018d5d2186f";

    if (!userId) {
      throw new NotFoundError("User not found. Authentication required.");
    }

    const { campaignId } = req.params; // Get from URL params

    const { title, date, description, fundsUsed } = req.body;

    const executionFile = req.files; // Get files from multer

    // Validate files are uploaded
    if (!executionFile || !executionFile.evidencePhotos) {
      throw new NotFoundError("Evidence photos are required.");
    }

    const execution = {
      userId,
      campaignId,
      title,
      date,
      description,
      fundsUsed: Number(fundsUsed),
      executionFile,
    };

    // Create execution update
    const result = await createExecutions({ execution });

    // return sendCreated(res, result, "Execution update created successfully");
    return ApiResponse.created(
      res,
      result,
      "Execution update created successfully",
    );
  } catch (error) {
    next(error);
  }
};
