const Admin = require('../models/Admin');
const Student = require('../models/Student');
const generateToken = require('../utils/generateToken');

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
        token: generateToken(admin._id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { admin_id, username, password, name, email, role } = req.body;
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create({ admin_id, username, password, name, email, role });
    res.status(201).json({ message: 'Admin created', token: generateToken(admin._id, 'admin') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.admin);
};

exports.loginStudent = async (req, res) => {
  try {
    const { roll_number, password } = req.body;
    const student = await Student.findOne({ roll_number }).select('+password');

    if (student && (await student.matchPassword(password))) {
      res.json({
        _id: student._id,
        student_id: student.student_id,
        roll_number: student.roll_number,
        name: student.name,
        email: student.email,
        class: student.class,
        section: student.section,
        department: student.department,
        token: generateToken(student._id, 'student'),
      });
    } else {
      res.status(401).json({ message: 'Invalid student credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentMe = async (req, res) => {
  res.json(req.student);
};
