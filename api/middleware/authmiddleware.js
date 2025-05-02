import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      return next(errorHandler(401, 'Not authorized, no token'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    next(errorHandler(401, 'Not authorized, token failed'));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return next(errorHandler(403, 'Not authorized as admin'));
  }
};