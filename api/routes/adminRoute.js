import express from 'express';
import {
  assignRole,
  getUsers,
  loginAdmin
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

router.put('/assign-role/:userId', protect, adminOnly, assignRole);
router.get('/getusers', protect, adminOnly, getUsers);

export default router;