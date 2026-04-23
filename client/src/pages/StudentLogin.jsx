import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStudent } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
  const [form, setForm] = useState({ roll_number: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginStudent: setStudentSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await loginStudent(form);
      setStudentSession(data);
      navigate('/student/dashboard');
    } catch {
      setError('Invalid roll number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap student-login-wrap">
      <div className="login-shell student-login-shell">
        <section className="login-hero-panel student-hero-panel">
          <div className="login-badge">Student Access</div>
          <h1>Track your results, GPA trend, and growth insights in one secure portal.</h1>
          <p>
            Sign in with your roll number to unlock your academic dashboard with
            semester analysis, subject heatmap, and instant PDF marksheet export.
          </p>
          <div className="login-metrics">
            <div className="metric-card">
              <strong>PDF</strong>
              <span>download marksheet</span>
            </div>
            <div className="metric-card">
              <strong>Live</strong>
              <span>semester trend analytics</span>
            </div>
            <div className="metric-card">
              <strong>Smart</strong>
              <span>performance insights</span>
            </div>
          </div>
        </section>

        <section className="login-box login-box-premium student-login-box">
          <div className="login-card-top">
            <div>
              <p className="eyebrow">Student Sign In</p>
              <h2>Welcome learner</h2>
              <p className="login-subtext">Use your roll number and password to open your dashboard.</p>
            </div>
            <div className="login-demo">
              <span>Demo</span>
              <strong>22CSE001 / student123</strong>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="roll_number">Roll Number</label>
              <input
                id="roll_number"
                name="roll_number"
                type="text"
                className="form-control"
                placeholder="e.g. 22CSE001"
                value={form.roll_number}
                onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <div className="flex-between login-field-head">
                <label className="form-label" htmlFor="student_password">Password</label>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="student_password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-login" disabled={loading}>
              {loading ? 'Signing in...' : 'Open Student Dashboard'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StudentLogin;
