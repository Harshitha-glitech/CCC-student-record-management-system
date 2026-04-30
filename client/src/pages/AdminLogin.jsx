import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginAdmin(form);
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-shell">
        <section className="login-hero-panel">
          <div className="login-badge">Secure Faculty Access</div>
          <h1>Manage results with a dashboard that feels modern and reliable.</h1>
          <p>
            Sign in to publish marks, maintain subjects, manage student records,
            and keep academic data organized in one protected workspace.
          </p>

          <div className="login-metrics">
            <div className="metric-card">
              <strong>20+</strong>
              <span>demo student profiles</span>
            </div>
            <div className="metric-card">
              <strong>8 Sem</strong>
              <span>semester-ready structure</span>
            </div>
            <div className="metric-card">
              <strong>Live GPA</strong>
              <span>auto-calculated grading flow</span>
            </div>
          </div>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <span>01</span>
              <div>
                <strong>Protected admin workspace</strong>
                <p>Only authenticated faculty can add, update, or remove academic records.</p>
              </div>
            </div>
            <div className="login-feature-item">
              <span>02</span>
              <div>
                <strong>Student-first result visibility</strong>
                <p>Search by roll number and review semester-wise and subject-wise performance.</p>
              </div>
            </div>
            <div className="login-feature-item">
              <span>03</span>
              <div>
                <strong>Ready for project demo</strong>
                <p>Includes sample credentials and seeded academic data for a smoother presentation.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="login-box login-box-premium">
          <div className="login-card-top">
            <div>
              <p className="eyebrow">Admin Sign In</p>
              <h2>Welcome back</h2>
              <p className="login-subtext">Use your faculty credentials to continue to the dashboard.</p>
            </div>
            <div className="login-demo">
              <span>Demo</span>
              <strong>admin / admin123</strong>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="flex-between login-field-head">
                <label className="form-label" htmlFor="password">Password</label>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary btn-block btn-login"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Enter Dashboard'}
            </button>
          </form>

          <div className="login-help">
            <span>Need quick access for demo day?</span>
            <p>The seeded admin account works immediately once the backend sample data script has been run.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
