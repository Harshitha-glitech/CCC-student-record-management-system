const express = require('express');
const router = express.Router();
const {
  getAllSubjects, addSubject, updateSubject, deleteSubject
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllSubjects);
router.post('/', protect, addSubject);
router.put('/:id', protect, updateSubject);
router.delete('/:id', protect, deleteSubject);

module.exports = router;
