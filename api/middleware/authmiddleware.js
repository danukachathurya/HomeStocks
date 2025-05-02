import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { protectAdmin } from '../middleware/authmiddleware';


// Middleware to verify the user is authenticated
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add the user information to the request (without the password)
      req.user = await User.findById(decoded.id).select('-password');
      
      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const protectAdmin = (req, res, next) => {
  protect(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied, admin only' });
    }
  });
};

// Middleware to check if the user is an admin
export const adminOnly = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.isAdmin) {
    // If the user is an admin, allow access to the next middleware or route handler
    next();
  } else {
    // If the user is not an admin, deny access
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};
