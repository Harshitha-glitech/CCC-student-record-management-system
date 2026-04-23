const express = require('express');
const router = express.Router();
const {
	loginAdmin,
	registerAdmin,
	getMe,
	loginStudent,
	getStudentMe,
} = require('../controllers/authController');
const { protect, protectStudent } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.post('/student/login', loginStudent);
router.get('/student/me', protectStudent, getStudentMe);

module.exports = router;
