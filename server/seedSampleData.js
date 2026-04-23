const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Subject = require('./models/Subject');
const Result = require('./models/Result');

const students = [
  ['STU000', '22CSE000', 'Harshitha Medepalli', 'harshitha.medepalli@campus.edu', '9876543298', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU00A', '22CSE099', 'Subhanshu Singh', 'subhanshu.singh@campus.edu', '9876543287', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU00B', '22CSE054', 'Aryanish Singh Rathore', 'aryanish.rathore@campus.edu', '9876543254', 'B.Tech CSE', 'B', 'Computer Science'],
  ['STU001', '22CSE001', 'Aarav Sharma', 'aarav.sharma@campus.edu', '9876543201', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU002', '22CSE002', 'Diya Patel', 'diya.patel@campus.edu', '9876543202', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU003', '22CSE003', 'Vivaan Singh', 'vivaan.singh@campus.edu', '9876543203', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU004', '22CSE004', 'Anaya Verma', 'anaya.verma@campus.edu', '9876543204', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU005', '22CSE005', 'Advik Gupta', 'advik.gupta@campus.edu', '9876543205', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU006', '22CSE006', 'Ira Nair', 'ira.nair@campus.edu', '9876543206', 'B.Tech CSE', 'A', 'Computer Science'],
  ['STU007', '22CSE007', 'Kabir Mehta', 'kabir.mehta@campus.edu', '9876543207', 'B.Tech CSE', 'B', 'Computer Science'],
  ['STU008', '22CSE008', 'Myra Joshi', 'myra.joshi@campus.edu', '9876543208', 'B.Tech CSE', 'B', 'Computer Science'],
  ['STU009', '22CSE009', 'Arjun Rao', 'arjun.rao@campus.edu', '9876543209', 'B.Tech CSE', 'B', 'Computer Science'],
  ['STU010', '22CSE010', 'Sara Khan', 'sara.khan@campus.edu', '9876543210', 'B.Tech CSE', 'B', 'Computer Science'],
  ['STU011', '22ECE001', 'Reyansh Kulkarni', 'reyansh.kulkarni@campus.edu', '9876543211', 'B.Tech ECE', 'A', 'Electronics'],
  ['STU012', '22ECE002', 'Kiara Iyer', 'kiara.iyer@campus.edu', '9876543212', 'B.Tech ECE', 'A', 'Electronics'],
  ['STU013', '22ECE003', 'Atharv Deshmukh', 'atharv.deshmukh@campus.edu', '9876543213', 'B.Tech ECE', 'A', 'Electronics'],
  ['STU014', '22ECE004', 'Navya Reddy', 'navya.reddy@campus.edu', '9876543214', 'B.Tech ECE', 'A', 'Electronics'],
  ['STU015', '22ECE005', 'Dhruv Bansal', 'dhruv.bansal@campus.edu', '9876543215', 'B.Tech ECE', 'B', 'Electronics'],
  ['STU016', '22ECE006', 'Aanya Kapoor', 'aanya.kapoor@campus.edu', '9876543216', 'B.Tech ECE', 'B', 'Electronics'],
  ['STU017', '22BBA001', 'Rohan Malhotra', 'rohan.malhotra@campus.edu', '9876543217', 'BBA', 'A', 'Management'],
  ['STU018', '22BBA002', 'Nisha Arora', 'nisha.arora@campus.edu', '9876543218', 'BBA', 'A', 'Management'],
  ['STU019', '22BBA003', 'Yash Tiwari', 'yash.tiwari@campus.edu', '9876543219', 'BBA', 'A', 'Management'],
  ['STU020', '22BBA004', 'Meera Sethi', 'meera.sethi@campus.edu', '9876543220', 'BBA', 'A', 'Management'],
  ['STU021', '22BCA001', 'Krish Saxena', 'krish.saxena@campus.edu', '9876543221', 'BCA', 'A', 'Computer Applications'],
  ['STU022', '22BCA002', 'Siya Chawla', 'siya.chawla@campus.edu', '9876543222', 'BCA', 'A', 'Computer Applications'],
  ['STU023', '22BCA003', 'Manav Suri', 'manav.suri@campus.edu', '9876543223', 'BCA', 'B', 'Computer Applications'],
  ['STU024', '22BCA004', 'Tara Bhatia', 'tara.bhatia@campus.edu', '9876543224', 'BCA', 'B', 'Computer Applications'],
];

const subjects = [
  ['CSE101', 'Programming Fundamentals', 100, 40, 1, 'Computer Science'],
  ['CSE102', 'Engineering Mathematics I', 100, 40, 2, 'Computer Science'],
  ['CSE201', 'Data Structures', 100, 40, 3, 'Computer Science'],
  ['CSE202', 'Database Systems', 100, 40, 3, 'Computer Science'],
  ['CSE203', 'Operating Systems', 100, 40, 4, 'Computer Science'],
  ['CSE204', 'Web Technologies', 100, 40, 4, 'Computer Science'],
  ['CSE601', 'Machine Learning', 100, 40, 6, 'Computer Science'],
  ['CSE602', 'Cloud Computing', 100, 40, 6, 'Computer Science'],
  ['ECE101', 'Basic Electronics', 100, 40, 1, 'Electronics'],
  ['ECE102', 'Engineering Physics', 100, 40, 2, 'Electronics'],
  ['ECE201', 'Digital Electronics', 100, 40, 3, 'Electronics'],
  ['ECE202', 'Signals and Systems', 100, 40, 3, 'Electronics'],
  ['ECE601', 'Embedded Systems', 100, 40, 6, 'Electronics'],
  ['MGT101', 'Business Communication', 100, 40, 1, 'Management'],
  ['MGT102', 'Business Mathematics', 100, 40, 2, 'Management'],
  ['MGT201', 'Principles of Management', 100, 40, 3, 'Management'],
  ['MGT601', 'Strategic Management', 100, 40, 6, 'Management'],
  ['BCA101', 'Computer Basics', 100, 40, 1, 'Computer Applications'],
  ['BCA102', 'Discrete Mathematics', 100, 40, 2, 'Computer Applications'],
  ['BCA201', 'Object Oriented Programming', 100, 40, 3, 'Computer Applications'],
  ['BCA601', 'Mobile App Development', 100, 40, 6, 'Computer Applications'],
];

const fixedSemesterPerformance = {
  '22CSE000': { 1: 99, 2: 98, 3: 97, 4: 98, 6: 99 },
  '22CSE099': { 1: 89, 2: 86, 3: 87, 4: 85, 6: 88 },
  '22CSE054': { 1: 84, 2: 81, 3: 82, 4: 80, 6: 83 },
};

const gradeFromMarks = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const gpaFromMarks = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 10;
  if (pct >= 80) return 9;
  if (pct >= 70) return 8;
  if (pct >= 60) return 7;
  if (pct >= 50) return 6;
  return 5;
};

const marksFromIndex = (studentIndex, subjectIndex) => {
  const raw = 48 + ((studentIndex * 9 + subjectIndex * 11) % 47);
  return Math.min(raw, 97);
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    admin = new Admin({
      admin_id: 'ADM001',
      username: 'admin',
      password: 'admin123',
      name: 'Super Admin',
      email: 'admin@srms.com',
      role: 'superadmin',
    });
    await admin.save();
  } else {
    admin.admin_id = 'ADM001';
    admin.password = 'admin123';
    admin.name = 'Super Admin';
    admin.email = 'admin@srms.com';
    admin.role = 'superadmin';
    await admin.save();
  }

  await Result.deleteMany({});
  await Subject.deleteMany({});
  await Student.deleteMany({});

  const createdStudents = await Student.insertMany(
    students.map(([student_id, roll_number, name, email, phone, className, section, department]) => ({
      student_id,
      roll_number,
      name,
      email,
      password: 'student123',
      phone,
      class: className,
      section,
      department,
    }))
  );

  const createdSubjects = await Subject.insertMany(
    subjects.map(([subject_code, subject_name, total_marks, passing_marks, semester, department]) => ({
      subject_code,
      subject_name,
      total_marks,
      passing_marks,
      semester,
      department,
    }))
  );

  const results = [];

  createdStudents.forEach((student, studentIndex) => {
    const relevantSubjects = createdSubjects.filter((subject) => {
      if (student.department === 'Computer Science') return subject.department === 'Computer Science';
      if (student.department === 'Electronics') return subject.department === 'Electronics';
      if (student.department === 'Management') return subject.department === 'Management';
      return subject.department === 'Computer Applications';
    });

    relevantSubjects.forEach((subject, subjectIndex) => {
      const fixedBySem = fixedSemesterPerformance[student.roll_number];
      let marks;

      if (fixedBySem) {
        const basePct = fixedBySem[subject.semester] || 80;
        const swing = subjectIndex % 2 === 0 ? 1 : -1;
        const finalPct = Math.max(40, Math.min(99, basePct + swing));
        marks = Math.round((subject.total_marks * finalPct) / 100);
      } else {
        marks = marksFromIndex(studentIndex, subjectIndex);
      }

      const status = marks >= subject.passing_marks ? 'Pass' : 'Fail';
      results.push({
        result_id: `RES${String(studentIndex + 1).padStart(2, '0')}${String(subjectIndex + 1).padStart(2, '0')}`,
        student_id: student._id,
        subject_id: subject._id,
        admin_id: admin._id,
        semester: subject.semester,
        marks_obtained: marks,
        total_marks: subject.total_marks,
        grade: gradeFromMarks(marks, subject.total_marks),
        status,
        GPA: gpaFromMarks(marks, subject.total_marks),
      });
    });
  });

  await Result.insertMany(results);

  console.log(`Seed complete: ${createdStudents.length} students, ${createdSubjects.length} subjects, ${results.length} results.`);
  console.log('Admin login: admin / admin123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
