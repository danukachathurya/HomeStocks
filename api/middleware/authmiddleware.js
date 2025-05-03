import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token || req.cookies.access_token; // ✅ Fix
    if (!token) {
      return next(errorHandler(401, 'Not authorized, no token'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  } catch (error) {
    return next(errorHandler(401, 'Not authorized, token failed'));
  }
};


export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    return next(errorHandler(403, 'Not authorized as admin'));
  }
};

export const roleCheck = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return next(errorHandler(403, 'Access denied. Unauthorized role.'));
  };
};
