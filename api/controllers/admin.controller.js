import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const allowedRoles = ['inventorymanager', 'supplier', 'user'];

// Admin Login Controller
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required.'));
    }

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return next(errorHandler(401, 'Invalid admin credentials.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, 'Invalid admin credentials.'));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: pass, ...rest } = user._doc;

    res
      .cookie('admin_token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Assign Role to a User
export const assignRole = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const roleToAssign = req.body.role?.trim().toLowerCase();

    if (!email || !roleToAssign) {
      return next(errorHandler(400, 'Email and role are required.'));
    }

    if (!allowedRoles.includes(roleToAssign)) {
      return next(errorHandler(400, 'Invalid role assignment.'));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found with the given email.'));
    }

    user.role = roleToAssign;
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json({ message: 'Role assigned successfully.', user: rest });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin only)
export const getUsers = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to see all users.'));
    }

    const users = await User.find({}, 'username email role createdAt');
    res.status(200).json({ users }); // ✅ Correct format
  } catch (error) {
    next(error);
  }
};

// Delete User (Admin only, can't delete admin users)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    if (user.isAdmin || user.role === 'admin') {
      return next(errorHandler(403, 'Cannot delete another admin user.'));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
