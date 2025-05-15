import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  addSupply, 
  getSupplies, 
  getSupply, 
  updateSupply, 
  deleteSupply,
  getUniqueSupplierCount  
} from '../controllers/supply.controller.js';

const router = express.Router();

// Add a new supply
router.post('/add', addSupply);

router.get('/supplier-count', getUniqueSupplierCount);

// Get all supplies with pagination & search
router.get('/all', getSupplies);

// Get a single supply by ID
router.get('/:supplyId', getSupply);

// Update supply
router.put('/update/:supplyId/:userId', updateSupply);

// Delete supply
router.delete('/delete/:supplyId/:userId', deleteSupply);

export default router;
