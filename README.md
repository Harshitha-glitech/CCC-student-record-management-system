# Student Result Management System

A full-stack MERN application for student result viewing and admin-side academic record management.

## 1. Project Overview

This project provides a centralized result management platform where:
- Students search and view results by roll number.
- Faculty/admin users add, update, and delete records.
- Data is stored reliably in MongoDB with secure admin APIs.

## 2. Objective

Build a simple, efficient, and secure system for:
- Public result access by roll number.
- Structured admin control over students, subjects, and results.
- Semester and subject-based filtering.

## 3. Problem Statement

Students do not always have a centralized and easy way to check academic performance online.

Institutes often face these challenges:
- Manual result handling in spreadsheets.
- Difficulty in updating records consistently.
- Lack of centralized storage.
- Slow result search and retrieval.

This project addresses those issues with a web-based result management system.

## 4. Scenario

In a college environment:
- A student enters a roll number.
- The system fetches and displays subject-wise marks, grades, and GPA.
- The student can filter by semester and subject.

Meanwhile, an admin user:
- Logs into the admin panel.
- Adds new records.
- Updates existing records.
- Deletes incorrect entries.

## 5. Architecture

The application follows a three-tier architecture.

Frontend Layer (React):
- Roll number search UI.
- Result table display.
- Semester and subject filters.
- Admin pages for CRUD operations.

Backend Layer (Node.js + Express):
- REST APIs.
- Authentication and protected admin routes.
- CRUD for students, subjects, and results.
- Grade/GPA computation logic.

Database Layer (MongoDB + Mongoose):
- Persistent storage for admin, student, subject, and result documents.

Communication flow:
- React frontend sends API requests.
- Express controllers process business logic.
- Mongoose reads/writes MongoDB collections.

## 6. Project Flow (System Flow)

1. Admin login.
2. Student/subject setup.
3. Result entry and storage.
4. Student roll-number search.
5. Result retrieval via API.
6. Result display with filters.

## 7. User Flow

Student flow:
- Enter roll number.
- View results.
- Apply semester/subject filters.

Admin flow:
- Login.
- Add/update/delete results.
- Manage students and subjects.

## 8. Backend Requirements

- REST API design.
- CRUD operations.
- Middleware and error handling.
- JWT authentication for admin routes.

## 9. Database Requirements

- Schema design with Mongoose models.
- CRUD support with references.
- Indexed and structured records for result lookup.

## 10. Required Technologies

Frontend:
- React.js
- Vite
- Axios

Backend:
- Node.js
- Express.js
- JWT

Database:
- MongoDB
- Mongoose

Tools:
- Git
- GitHub
- Postman

## 11. Suggested Database Collections

Students:
- student_id
- roll_number
- name
- email
- class
- section
- department

Subjects:
- subject_code
- subject_name
- semester
- total_marks
- passing_marks

Results:
- result_id
- student_id (reference)
- subject_id (reference)
- semester
- marks_obtained
- total_marks
- grade
- GPA
- status

Admins:
- username
- password (hashed)
- role

## 12. Key Features

Result viewing:
- Search by roll number.
- Subject-wise marks and grades.
- GPA display.
- Student login protected dashboard.
- PDF marksheet download.
- Graph-based analytics and performance insights.

Admin panel:
- Add results.
- Update result marks.
- Delete records.
- Grade analytics dashboard with trend charts.

Search and filter:
- Filter by semester.
- Filter by subject.

Data management:
- Centralized storage.
- Reliable access via APIs.

## 13. Optional Advanced Features

- Student login system.
- PDF result download.
- Email notifications.
- Analytics dashboard.
- Role-based access control.

## 14. Learning Outcomes

By building this project, developers practice:
- Full-stack MERN architecture.
- REST API and CRUD workflows.
- MongoDB schema modeling and relations.
- JWT-based route protection.
- Production-style frontend/backend integration.

## Quick Start

Prerequisites:
- Node.js 18+
- MongoDB running locally at mongodb://localhost:27017

Install dependencies:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

Run full project from root:

```bash
npm run dev
```

App URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

Seed demo data (optional):

```bash
cd server
npm run seed:sample
```

Default admin login:
- Username: admin
- Password: admin123

Default student login:
- Roll Number: 22CSE001
- Password: student123

## Grade Scale

| Percentage | Grade | GPA |
|-----------:|:-----:|----:|
| >= 90 | A+ | 10 |
| >= 80 | A | 9 |
| >= 70 | B | 8 |
| >= 60 | C | 7 |
| >= 50 | D | 6 |
| < 50 | F | 5 |
