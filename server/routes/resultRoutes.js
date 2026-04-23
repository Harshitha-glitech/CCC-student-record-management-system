const express = require('express');
const router = express.Router();
const {
  getResultsByRollNumber, getResultsByRollAndSemester,
  getAllResults, addResult, updateResult, deleteResult,
  getResultAnalytics, getMyResults, getTopPerformers,
} = require('../controllers/resultController');
const { protect, protectStudent } = require('../middleware/authMiddleware');

router.get('/leaderboard/top', getTopPerformers);
router.get('/student/me', protectStudent, getMyResults);
router.get('/student/:rollNumber/semester/:sem', getResultsByRollAndSemester);
router.get('/student/:rollNumber', getResultsByRollNumber);
router.get('/analytics/overview', protect, getResultAnalytics);
router.get('/', protect, getAllResults);
router.post('/', protect, addResult);
router.put('/:id', protect, updateResult);
router.delete('/:id', protect, deleteResult);

module.exports = router;
