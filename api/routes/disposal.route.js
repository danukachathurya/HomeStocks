import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; 
import {
  addDisposalItem,
  getDisposalItems,
  getDisposalItem,
  updateDisposalItem,
  deleteDisposalItem
} from '../controllers/disposal.controller.js'; 

const router = express.Router();

router.post('/add', verifyToken, addDisposalItem);
router.get('/all', getDisposalItems);
router.get('/:disposalId', getDisposalItem);
router.put('/update/:disposalId/:userId', verifyToken, updateDisposalItem);
router.delete('/delete/:disposalId/:userId', verifyToken, deleteDisposalItem);

export default router;