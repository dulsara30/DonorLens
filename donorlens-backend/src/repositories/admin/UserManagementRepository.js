import User from "../../models/user/User.js";
import { DatabaseError } from "../../utils/errors.js";

export const findAllUsers = async () => {
  try {
    return await User.find({}).select("-passwordHash").sort({ createdAt: -1 });
  } catch (error) {
    throw new DatabaseError("Failed to fetch users from database");
  }
};

export const findUserById = async (userId) => {
  try {
    return await User.findById(userId).select("-passwordHash");
  } catch (error) {
    throw new DatabaseError("Failed to fetch user from database");
  }
};
