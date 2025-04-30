const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected route example
router.get('/dashboard', protectAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.username}` });
});

module.exports = router;
