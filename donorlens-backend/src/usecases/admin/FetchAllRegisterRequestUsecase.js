import User from "../../models/user/User.js";
import { NotFoundError } from "../../utils/errors.js";
import loggerService from "../../services/logger.service.js";

export default async function FetchAllRegisterRequest() {
  try {
    const user = await User.find({
      role: "NGO_ADMIN",
    });

    if (!user || user.length === 0) {
      throw new NotFoundError("NGO registration requests");
    }

    return user;
  } catch (error) {
    loggerService.error("Error in FetchAllRegisterRequestUsecase:", error);
    if (error) {
      throw new Error("Failed to fetch NGO registration requests");
    }
  }
}
