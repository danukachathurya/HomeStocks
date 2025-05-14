import express from 'express';
import {
  addCheckout,
  getCheckouts,
  getCheckout,
} from '../controllers/checkout.controller.js';

const router = express.Router();

// Add a new checkout
router.post('/add', addCheckout);

// Get all checkouts (this could be for admin or customer dashboard)
router.get('/all', getCheckouts);

// Get a single checkout by ID
router.get('/:checkoutId', getCheckout);

export default router;
