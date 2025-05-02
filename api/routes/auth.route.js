import express from 'express';
import { signin, signup, google } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/signup',protect, signup);
router.post('/signin',protect, signin);
router.post('/google',protect, google);

export default router;