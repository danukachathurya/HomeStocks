import express from 'express';
import {
  loginAdmin,
  assignRole,
  getUsers,
  deleteUser
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/authmiddleware.js';
import { getAllSupplies } from "../controllers/admin.controller.js";
import { addToInventory } from "../controllers/admin.controller.js";
import { getUserCount } from '../controllers/admin.controller.js';
import { getInventoryCount } from '../controllers/admin.controller.js';
import { getProductCount } from '../controllers/admin.controller.js';
import { getSupplyCount } from '../controllers/admin.controller.js';


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

router.get("/supplier-orders", protect, adminOnly, getAllSupplies);

router.post("/add-to-system/:supplyId", protect, adminOnly, addToInventory);

// Get total user count
router.get('/user-count', protect, adminOnly, getUserCount);

// get inventories count
router.get('/inventory-count', protect, adminOnly, getInventoryCount);

// get products count
router.get('/product-count', protect, adminOnly, getProductCount);

// get supplies count
router.get('/supply-count', protect, adminOnly, getSupplyCount);



export default router;
