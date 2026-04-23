const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  result_id: { type: String, required: true, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  semester: { type: Number, required: true },
  marks_obtained: { type: Number, required: true },
  total_marks: { type: Number, required: true },
  grade: { type: String, required: true },
  status: { type: String, enum: ['Pass', 'Fail'], required: true },
  GPA: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
