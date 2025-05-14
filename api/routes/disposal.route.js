import express from 'express';
import {
  addDisposalItem,
  getDisposalItems,
  getDisposalItem,
  updateDisposalItem,
  deleteDisposalItem
} from '../controllers/disposal.controller.js';

import { protect, adminOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/add', addDisposalItem);

router.get('/all', getDisposalItems);

router.get('/:disposalId', protect, adminOnly, getDisposalItem);

router.put('/update/:disposalId', protect, adminOnly, updateDisposalItem);

router.delete('/delete/:disposalId', protect, adminOnly, deleteDisposalItem);

export default router;
