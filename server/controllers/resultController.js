const Result = require('../models/Result');
const Student = require('../models/Student');

const calculateGrade = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const calculateGPA = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 10;
  if (pct >= 80) return 9;
  if (pct >= 70) return 8;
  if (pct >= 60) return 7;
  if (pct >= 50) return 6;
  return 5;
};

const pctExpr = {
  $cond: [
    { $gt: ['$total_marks', 0] },
    { $multiply: [{ $divide: ['$marks_obtained', '$total_marks'] }, 100] },
    0,
  ],
};

exports.getResultsByRollNumber = async (req, res) => {
  try {
    const student = await Student.findOne({ roll_number: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const results = await Result.find({ student_id: student._id })
      .populate('subject_id', 'subject_name subject_code total_marks')
      .sort({ semester: 1 });
    res.json({ student, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResultsByRollAndSemester = async (req, res) => {
  try {
    const student = await Student.findOne({ roll_number: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const results = await Result.find({
      student_id: student._id,
      semester: req.params.sem,
    }).populate('subject_id', 'subject_name subject_code total_marks');
    res.json({ student, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student_id: req.student._id })
      .populate('subject_id', 'subject_name subject_code total_marks department')
      .sort({ semester: 1, createdAt: -1 });

    res.json({ student: req.student, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const results = await Result.find()
      .populate('student_id', 'name roll_number')
      .populate('subject_id', 'subject_name subject_code')
      .skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Result.countDocuments();
    res.json({ results, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResultAnalytics = async (req, res) => {
  try {
    const [overview] = await Result.aggregate([
      {
        $group: {
          _id: null,
          totalResults: { $sum: 1 },
          averageGPA: { $avg: '$GPA' },
          averagePercentage: { $avg: pctExpr },
          passCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalResults: 1,
          averageGPA: { $round: ['$averageGPA', 2] },
          averagePercentage: { $round: ['$averagePercentage', 2] },
          passRate: {
            $cond: [
              { $gt: ['$totalResults', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$passCount', '$totalResults'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    const gradeDistribution = await Result.aggregate([
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          grade: '$_id',
          count: 1,
        },
      },
    ]);

    const semesterTrend = await Result.aggregate([
      {
        $group: {
          _id: '$semester',
          avgGPA: { $avg: '$GPA' },
          avgPercent: { $avg: pctExpr },
          total: { $sum: 1 },
          passCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          semester: '$_id',
          avgGPA: { $round: ['$avgGPA', 2] },
          avgPercent: { $round: ['$avgPercent', 2] },
          passRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$passCount', '$total'] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    const subjectAnalysis = await Result.aggregate([
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject_id',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: '$subject' },
      {
        $group: {
          _id: '$subject_id',
          subjectCode: { $first: '$subject.subject_code' },
          subjectName: { $first: '$subject.subject_name' },
          avgPercent: { $avg: pctExpr },
          avgGPA: { $avg: '$GPA' },
          total: { $sum: 1 },
          passCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          subjectCode: 1,
          subjectName: 1,
          avgPercent: { $round: ['$avgPercent', 2] },
          avgGPA: { $round: ['$avgGPA', 2] },
          passRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$passCount', '$total'] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      { $sort: { avgPercent: -1 } },
    ]);

    const departmentAnalysis = await Result.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.department',
          avgPercent: { $avg: pctExpr },
          avgGPA: { $avg: '$GPA' },
          total: { $sum: 1 },
          passCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          avgPercent: { $round: ['$avgPercent', 2] },
          avgGPA: { $round: ['$avgGPA', 2] },
          passRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$passCount', '$total'] },
                  100,
                ],
              },
              2,
            ],
          },
          total: 1,
        },
      },
      { $sort: { avgPercent: -1 } },
    ]);

    res.json({
      overview: overview || {
        totalResults: 0,
        averageGPA: 0,
        averagePercentage: 0,
        passRate: 0,
      },
      gradeDistribution,
      semesterTrend,
      subjectAnalysis,
      departmentAnalysis,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopPerformers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 10);

    const leaderboard = await Result.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student_id',
          studentName: { $first: '$student.name' },
          rollNumber: { $first: '$student.roll_number' },
          department: { $first: '$student.department' },
          avgPercent: { $avg: pctExpr },
          avgGPA: { $avg: '$GPA' },
          resultCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          studentId: '$_id',
          studentName: 1,
          rollNumber: 1,
          department: 1,
          avgPercent: { $round: ['$avgPercent', 2] },
          avgGPA: { $round: ['$avgGPA', 2] },
          resultCount: 1,
        },
      },
      { $sort: { avgPercent: -1, avgGPA: -1, studentName: 1 } },
      { $limit: limit },
    ]);

    const topPerformers = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    res.json({ topPerformers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addResult = async (req, res) => {
  try {
    const { result_id, student_id, subject_id, semester, marks_obtained, total_marks } = req.body;
    const grade = calculateGrade(marks_obtained, total_marks);
    const status = marks_obtained >= (total_marks * 0.4) ? 'Pass' : 'Fail';
    const GPA = calculateGPA(marks_obtained, total_marks);
    const result = await Result.create({
      result_id, student_id, subject_id,
      admin_id: req.admin._id,
      semester, marks_obtained, total_marks,
      grade, status, GPA,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    const marks = req.body.marks_obtained ?? result.marks_obtained;
    const total = req.body.total_marks ?? result.total_marks;
    result.marks_obtained = marks;
    result.total_marks = total;
    result.grade = calculateGrade(marks, total);
    result.status = marks >= (total * 0.4) ? 'Pass' : 'Fail';
    result.GPA = calculateGPA(marks, total);
    await result.save();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Result deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
