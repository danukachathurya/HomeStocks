import express from 'express';
import {
  loginAdmin,
  assignRole,
  getUsers
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

// Admin login
router.post('/login', loginAdmin);

// Admin dashboard access
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.user.username}` });
});

// Assign role to a user
router.put('/assign-role/:userId', protect, adminOnly, assignRole);

// Get all users
router.get('/get-users', protect, adminOnly, getUsers);

export default router;
