import express from 'express';
import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProductsByName
} from '../controllers/product.controller.js';


const router = express.Router();

router.get('/search', searchProductsByName);

// Add a new product (admin only)
router.post('/add', addProduct);

// Get all products (public or restricted depending on your logic)
router.get('/all', getProducts);

// Get a single product by ID
router.get('/:productId', getProduct);

// Update product (admin only)
router.put('/update/:productId/:userId', updateProduct);

// Delete product (admin only)
router.delete('/delete/:productId', deleteProduct);

export default router;
