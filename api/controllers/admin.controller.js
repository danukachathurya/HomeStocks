import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

const allowedRoles = ['inventoryManager', 'supplier'];

export const assignRole = async (req, res, next) => {
  try {
    const roleToAssign = req.body.role?.toLowerCase();
    const userId = req.params.userId;

    if (!allowedRoles.includes(roleToAssign)) {
      return next(errorHandler(400, 'Invalid role assignment.'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    user.role = roleToAssign;
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json({ message: 'Role assigned successfully', user: rest });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
