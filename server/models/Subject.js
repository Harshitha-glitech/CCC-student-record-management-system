const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_code: { type: String, required: true, unique: true },
  subject_name: { type: String, required: true },
  total_marks: { type: Number, required: true },
  passing_marks: { type: Number, required: true },
  semester: { type: Number, required: true },
  department: String,
});

module.exports = mongoose.model('Subject', subjectSchema);
