import { findAllUsers } from "../../repositories/admin/UserManagementRepository.js";

export default async function FetchAllUsersUsecase() {
  try {
    return await findAllUsers();
  } catch (error) {
    throw error;
  }
}
