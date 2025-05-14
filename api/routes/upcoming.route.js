import express from 'express';
import {
  getAllUpcomingOrders,
  markOrder
} from '../controllers/upcoming.controller.js';


const router = express.Router();


// Get all products 
router.get('/upcoming-orders', getAllUpcomingOrders);

router.put('/mark/:orderId', markOrder);

export default router;
