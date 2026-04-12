import { findUserById } from "../../repositories/admin/UserManagementRepository.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

export default async function GetUserByIdUsecase(userId) {
  try {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const user = await findUserById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  } catch (error) {
    throw error;
  }
}
