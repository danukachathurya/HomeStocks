import express from 'express';
import {
  getAllUpcomingOrders,
  markOrder,
  getUpcomingOrdersCount 
} from '../controllers/upcoming.controller.js';


const router = express.Router();

router.get('/count', getUpcomingOrdersCount);
// Get all products 
router.get('/upcoming-orders', getAllUpcomingOrders);

router.put('/mark/:orderId', markOrder);

export default router;
