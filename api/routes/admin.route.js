import express from 'express';
import {
  loginAdmin,
  assignRole,
  getUsers,
  deleteUser
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

// Admin login
router.post('/login', loginAdmin);

// Dashboard access check
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.status(200).json({ message: `Welcome Admin ${req.user.username}` });
});

// Assign role to a user
router.put('/assign-role', protect, adminOnly, assignRole);

// Get all users
router.get('/get-users', protect, adminOnly, getUsers);

// Delete user (non-admin only)
router.delete('/delete-user/:id', protect, adminOnly, deleteUser);

export default router;
