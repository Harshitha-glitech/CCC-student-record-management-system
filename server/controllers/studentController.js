const Student = require('../models/Student');

exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const students = await Student.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Student.countDocuments();
    res.json({ students, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentByRoll = async (req, res) => {
  try {
    const student = await Student.findOne({ roll_number: req.params.rollNumber }).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.password = payload.password || 'student123';
    const student = await Student.create(payload);
    const safeStudent = student.toObject();
    delete safeStudent.password;
    res.status(201).json(safeStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('+password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const payload = { ...req.body };
    if (!payload.password) delete payload.password;

    Object.assign(student, payload);
    await student.save();

    const safeStudent = student.toObject();
    delete safeStudent.password;
    res.json(safeStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
