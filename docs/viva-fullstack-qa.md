# Student Result Management System - Full Stack Viva Q&A

## 1) Synchronous vs Asynchronous JavaScript
Q: What is synchronous JavaScript?
A: Synchronous code runs line by line. Each statement waits for the previous statement to finish.

Q: What is asynchronous JavaScript?
A: Asynchronous code allows long operations (API call, DB operation, timers) to run without blocking the main thread.

Q: Where is async used in your project?
A: In frontend API calls (Axios) and backend MongoDB queries (Mongoose), plus authentication and analytics endpoints.

## 2) Web APIs
Q: What are Web APIs in this project?
A: Browser-provided APIs like Fetch/XHR (through Axios), localStorage for auth/theme persistence, and DOM events.

Q: Why use Axios instead of fetch directly?
A: Centralized base URL, interceptors for JWT token injection, and cleaner error handling.

## 3) Closures
Q: What is a closure?
A: A function that remembers variables from its lexical scope even after the outer function has finished.

Q: Example in your app?
A: Event handlers and state updater functions in React components retain references to current state values.

## 4) Hoisting
Q: What is hoisting?
A: JavaScript moves declarations to the top of their scope during compile phase. `var` is hoisted as undefined, `let/const` are hoisted but in TDZ.

Q: Best practice used in your project?
A: Use `const` and `let`, avoid `var`.

## 5) DOM
Q: What is DOM?
A: Document Object Model is a tree representation of HTML.

Q: Do you manipulate DOM directly?
A: Mostly no. React updates the DOM through Virtual DOM and reconciliation.

## 6) Promises and Async/Await
Q: Why use async/await?
A: Cleaner async flow than chaining `.then()`. Easier error handling with `try/catch`.

Q: Where used?
A: Login, student search, result management, analytics fetch, leaderboard fetch, and seed scripts.

## 7) Scope
Q: Types of scope in JavaScript?
A: Global scope, function scope, and block scope.

Q: Which one is common in your code?
A: Block scope using `let/const` inside React components and backend controllers.

## 8) Data Types and Variables
Q: Which data types are heavily used?
A: String, Number, Boolean, Array, Object, Null/Undefined.

Q: Example from your project?
A: `marks_obtained` is Number, `grade` is String, `results` is Array of objects.

## 9) URL Structure
Q: Explain your API URL structure.
A: REST-style grouped by resource, e.g. `/api/auth/login`, `/api/results/student/:rollNumber`, `/api/results/leaderboard/top`.

Q: Why structured this way?
A: Better readability, predictable route design, and easier frontend integration.

## 10) Prop Drilling
Q: What is prop drilling?
A: Passing props through multiple levels of components just to reach a deeply nested component.

Q: How handled in your app?
A: Global auth data is handled with `useContext` via AuthContext to avoid prop drilling.

## 11) React Hooks Overview
Q: Which hooks are used?
A: `useState`, `useEffect`, and `useContext`.

Q: Why hooks?
A: Cleaner functional components with state and lifecycle logic.

## 12) useState
Q: What does `useState` do?
A: Adds local state to functional components.

Q: Example?
A: Search form input, loading flags, selected semester, filters, edit forms.

## 13) useEffect
Q: What does `useEffect` do?
A: Runs side effects after render, such as API calls and DOM/class updates.

Q: Example?
A: Fetch leaderboard on Home load, fetch results in dashboards, persist/apply dark mode.

## 14) useContext
Q: Why use `useContext`?
A: To share global app data (admin/student auth sessions) without deep prop passing.

Q: Example?
A: `AuthContext` stores admin and student info, login/logout methods.

## 15) Virtual DOM
Q: What is Virtual DOM?
A: Lightweight in-memory representation of real DOM.

Q: Benefit?
A: Efficient UI updates by diffing and updating only changed nodes.

## 16) How React Updates UI
Q: How does React trigger UI updates?
A: State/prop changes cause re-render, React computes diff and patches real DOM.

## 17) Reconciliation
Q: What is reconciliation?
A: The diffing process comparing old and new Virtual DOM trees.

Q: Why keys matter?
A: Stable keys help React identify list items correctly and update efficiently.

## 18) How useState Triggers Re-render
Q: Why does `setState` re-render component?
A: It schedules an update in React's render pipeline with new state value.

## 19) Navigation Between Pages
Q: How navigation works?
A: React Router handles client-side routing without full page reload.

Q: What routes are important?
A: Home, Search, Admin Login, Student Login, Student Dashboard, Admin Dashboard, Manage pages.

## 20) React Router and BrowserRouter
Q: Difference?
A: React Router provides route components; BrowserRouter uses browser history API for URL management.

## 21) JWT Authentication
Q: Why JWT used?
A: Stateless authentication between frontend and backend APIs.

Q: Where token stored?
A: localStorage (`adminInfo` / `studentInfo`).

## 22) JSON Web Tokens
Q: What is inside JWT in your project?
A: User id and role (`admin` or `student`) signed with `JWT_SECRET`.

## 23) Authentication Flow
Q: Admin flow?
A: Admin login -> token returned -> token attached in Authorization header via Axios interceptor -> protected APIs accessible.

Q: Student flow?
A: Student login with roll number + password -> token stored -> student protected routes fetch own results.

## 24) Backend Architecture Concepts
Q: What are Schema, Models, Middleware, Controllers?
A: 
- Schema: DB document blueprint
- Model: Mongoose interface for collection
- Middleware: request preprocessing/auth/error handling
- Controller: business logic for routes

Q: Why `.env` file?
A: Stores environment-specific secrets/config (DB URI, JWT secret, ports).

## 25) CORS Error
Q: Why CORS errors happen?
A: Browser blocks cross-origin requests if server doesn't allow the requesting origin.

Q: How fixed in your app?
A: Express `cors()` configured for localhost origins and credentials handling.

## 26) Cross-Origin Requests in Express
Q: How handled?
A: CORS middleware with controlled origin checks and allowed local frontend domains.

## 27) Encryption / Hashing
Q: Difference?
A: Encryption is reversible (with key), hashing is one-way.

Q: What is used in your app?
A: Password hashing with bcrypt.

## 28) bcrypt
Q: Why bcrypt for passwords?
A: Salted adaptive hashing improves password security against rainbow-table and brute-force attacks.

Q: Where used?
A: Admin and student model password save hooks and password comparison methods.

## 29) CSS Selectors
Q: Which selectors are used?
A: Class selectors, pseudo-classes (`:hover`, `:focus`), grouped selectors, responsive media queries.

Q: Example?
A: `.btn-primary:hover`, `.feature-card-pro:hover .feature-arrow`, `body.dark-theme .card`.

## 30) How to Select Elements for Styling
Q: Best practice followed?
A: Semantic class names by section (`hero`, `analysis-card`, `ticker-item`) and state classes (`dark-theme`).

## 31) How to Add CSS File to HTML/React
Q: How CSS is loaded?
A: Imported in React entry (`main.jsx`) using `import './index.css';`.

## 32) Block vs Inline Elements
Q: Difference?
A: Block elements take full width/new line. Inline elements flow inside text line.

Q: Example from project?
A: `div` as block containers, `span` for badges/labels.

## 33) 10 Quick Viva Questions (Project-Specific)
1. Why MongoDB for this project? Flexible schema and rapid iteration for academic data.
2. Why Mongoose? Schema validation, model abstraction, relation population.
3. How GPA is calculated? Server-side based on marks percentage mapping.
4. How grades are assigned? Rule-based percentage thresholds (A+, A, B, C, D, F).
5. Why protect admin routes? Prevent unauthorized CRUD on academic records.
6. How dark mode implemented? Navbar toggle + `body.dark-theme` + localStorage persistence.
7. Why separate admin and student tokens? Role-based authorization and security boundaries.
8. How leaderboard works? Aggregation pipeline computes average percentage per student.
9. Why use seed scripts? Fast reproducible demo environment with realistic data.
10. How PDF download works? Frontend generates marksheet with jsPDF + autoTable.

## 34) 10 Debugging/Issue Questions
1. Invalid login though username is correct? Password hash mismatch; reseed/reset admin.
2. CORS error in browser? Verify allowed origin and backend port.
3. API 401 on protected route? Missing/expired token or wrong role token.
4. Student not found in search? Wrong roll number or no seeded data.
5. Dark mode not persisting? Check localStorage key `themeMode`.
6. Build warning about large chunks? Introduce code splitting/lazy loading.
7. API not hitting backend in dev? Confirm Vite proxy and backend running.
8. Old data still visible? Rerun seed script and refresh frontend.
9. PDF not downloading? Ensure results exist and jsPDF import is valid.
10. Leaderboard order wrong? Verify seed marks and aggregation sort logic.

## 35) Final Viva Summary Statement
This project demonstrates end-to-end MERN full-stack concepts: React UI and routing, secure JWT auth, role-based APIs, MongoDB data modeling, Express middleware/controllers, analytics aggregation, PDF generation, and polished UX features like dark mode and dynamic leaderboard.
