const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  roll_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: String,
  class: String,
  section: String,
  department: String,
}, { timestamps: true });

studentSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.pre('insertMany', async function preInsertMany(next, docs) {
  for (const doc of docs) {
    if (doc.password) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }
  }
  next();
});

studentSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
