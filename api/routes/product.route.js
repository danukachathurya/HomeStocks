import express from 'express';
import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProductsByName
} from '../controllers/product.controller.js';

import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/search', protect, adminOnly, searchProductsByName);

// Add a new product (admin only)
router.post('/add', protect, adminOnly, addProduct);

// Get all products (public or restricted depending on your logic)
router.get('/all', getProducts);

// Get a single product by ID
router.get('/:productId', getProduct);

// Update product (admin only)
router.put('/update/:productId/:userId', protect, adminOnly, updateProduct);

// Delete product (admin only)
router.delete('/delete/:productId', protect, adminOnly, deleteProduct);

export default router;
