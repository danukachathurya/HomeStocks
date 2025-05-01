import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const assignPosition = async (req, res, next) => {
  // Only admin can access this endpoint
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Only admin can assign positions"));
  }

  const { userId, position } = req.body;

  // Validate input
  if (!userId || !position) {
    return next(errorHandler(400, "User ID and position are required"));
  }

  // Validate position value
  const validPositions = ['inventory_manager', 'supplier'];
  if (!validPositions.includes(position)) {
    return next(errorHandler(400, "Invalid position"));
  }

  try {
    // Find user and update position
    const user = await User.findByIdAndUpdate(
      userId,
      { position },
      { new: true } // Return the updated user
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Remove sensitive data before sending response
    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};