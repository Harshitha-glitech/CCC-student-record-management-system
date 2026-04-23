const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman) or local frontend origins.
    if (
      !origin ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Student Result Management System API is running.',
    docs: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
      },
      students: {
        publicByRoll: 'GET /api/students/:rollNumber',
        adminList: 'GET /api/students',
      },
      results: {
        publicByRoll: 'GET /api/results/student/:rollNumber',
        publicByRollAndSemester: 'GET /api/results/student/:rollNumber/semester/:sem',
        adminList: 'GET /api/results',
      },
      subjects: {
        adminList: 'GET /api/subjects',
      },
    },
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
