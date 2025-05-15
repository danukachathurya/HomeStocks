import express from 'express';
import { test, updateUser, deleteUser, signout, getUser } from '../controllers/user.controller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', protect, updateUser);
router.delete('/delete/:userId', protect, deleteUser);
router.post('/signout', signout);
router.get('/:userId',protect, getUser);

export default router;