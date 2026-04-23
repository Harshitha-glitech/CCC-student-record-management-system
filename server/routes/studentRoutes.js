const express = require('express');
const router = express.Router();
const {
  getAllStudents, getStudentByRoll, addStudent, updateStudent, deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllStudents);
router.get('/:rollNumber', getStudentByRoll);
router.post('/', protect, addStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;
