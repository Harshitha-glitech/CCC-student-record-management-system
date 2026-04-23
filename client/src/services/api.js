import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const API = axios.create({ baseURL });
const StudentAPI = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const admin = JSON.parse(localStorage.getItem('adminInfo') || 'null');
  if (admin?.token) req.headers.Authorization = `Bearer ${admin.token}`;
  return req;
});

StudentAPI.interceptors.request.use((req) => {
  const student = JSON.parse(localStorage.getItem('studentInfo') || 'null');
  if (student?.token) req.headers.Authorization = `Bearer ${student.token}`;
  return req;
});

// Public
export const getResultsByRoll = (rollNumber) =>
  API.get(`/results/student/${rollNumber}`);
export const getResultsBySemester = (rollNumber, sem) =>
  API.get(`/results/student/${rollNumber}/semester/${sem}`);
export const getTopPerformers = (limit = 5) =>
  API.get(`/results/leaderboard/top?limit=${limit}`);

// Auth
export const loginAdmin = (data) => API.post('/auth/login', data);
export const registerAdmin = (data) => API.post('/auth/register', data);
export const loginStudent = (data) => StudentAPI.post('/auth/student/login', data);
export const getStudentMe = () => StudentAPI.get('/auth/student/me');

// Students
export const getAllStudents = (page = 1) =>
  API.get(`/students?page=${page}&limit=20`);
export const addStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Results
export const getAllResults = (page = 1) =>
  API.get(`/results?page=${page}&limit=20`);
export const addResult = (data) => API.post('/results', data);
export const updateResult = (id, data) => API.put(`/results/${id}`, data);
export const deleteResult = (id) => API.delete(`/results/${id}`);
export const getResultAnalytics = () => API.get('/results/analytics/overview');

// Student protected
export const getMyResults = () => StudentAPI.get('/results/student/me');

// Subjects
export const getAllSubjects = () => API.get('/subjects');
export const addSubject = (data) => API.post('/subjects', data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);
