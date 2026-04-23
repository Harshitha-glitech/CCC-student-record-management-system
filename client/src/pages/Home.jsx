import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopPerformers } from '../services/api';

const Home = () => {
  const { adminInfo, studentInfo } = useAuth();

  const statTargets = [
    { label: 'Total Students', value: 27, suffix: '+' },
    { label: 'Subjects', value: 20, suffix: '+' },
    { label: 'Result Entries', value: 140, suffix: '+' },
    { label: 'System Uptime', value: 99.9, suffix: '%' },
  ];

  const [stats, setStats] = useState(statTargets.map(() => 0));
  const [topPerformers, setTopPerformers] = useState([
    { rank: 1, studentName: 'Harshitha Medepalli', avgPercent: 98 },
    { rank: 2, studentName: 'Subhanshu Singh', avgPercent: 87 },
    { rank: 3, studentName: 'Aryanish Singh Rathore', avgPercent: 54 },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setStats((current) => current.map((value, index) => {
        const target = statTargets[index].value;
        const step = target > 100 ? 6 : target > 50 ? 3 : 1;
        const next = value + step;
        return next >= target ? target : Number(next.toFixed(1));
      }));
    }, 35);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const { data } = await getTopPerformers(5);
        if (data?.topPerformers?.length) {
          setTopPerformers(data.topPerformers);
        }
      } catch {
        // Keep static fallback when API is unavailable.
      }
    };

    fetchTopPerformers();
  }, []);

  const highlights = [
    {
      icon: '🔎',
      title: 'Student-Centric Search',
      description: 'Look up complete result history with semester-wise filters in a clean, readable view.',
      path: '/search',
    },
    {
      icon: '📊',
      title: 'Academic Performance View',
      description: 'See marks, grades, pass status and GPA at a glance with consistent table structure and charts.',
      path: studentInfo ? '/student/dashboard' : '/student/login',
    },
    {
      icon: '🛡',
      title: 'Secure Admin Workspace',
      description: 'Manage students, subjects and results through role-protected, reliable admin tools.',
      path: adminInfo ? '/admin/dashboard' : '/admin/login',
    },
  ];

  const tickerItems = [
    ...topPerformers.map((student) => ({
      label: student.rank === 1 ? 'Top Rank' : `Rank ${student.rank}`,
      name: student.studentName,
      score: `${student.avgPercent}%`,
    })),
  ];

  return (
    <div>
      <div className="hero hero-pro">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-chip">Trusted by 1,200+ Institutions</span>
            <h1>Student Result Management System</h1>
            <p>Search academic results by roll number or manage students, subjects and results with ease and accuracy.</p>
            <div className="hero-btns">
              <Link to="/search" className="btn btn-primary">Search Results</Link>
              {studentInfo ? (
                <Link to="/student/dashboard" className="btn btn-outline hero-ghost-btn">Student Dashboard</Link>
              ) : (
                <Link to="/student/login" className="btn btn-outline hero-ghost-btn">Student Login</Link>
              )}
              {adminInfo ? (
                <Link to="/admin/dashboard" className="btn btn-outline hero-ghost-btn">Dashboard</Link>
              ) : (
                <Link to="/admin/login" className="btn btn-outline hero-ghost-btn">Admin Login</Link>
              )}
            </div>
          </div>

          <div className="hero-chart-card">
            <div className="hero-chart-bars">
              {[48, 60, 38, 78, 54, 88, 65].map((height, index) => (
                <span
                  key={height}
                  style={{ height: `${height}%`, animationDelay: `${index * 0.08}s` }}
                />
              ))}
            </div>
            <div className="hero-chart-line" />
            <p>Live growth in academic outcomes</p>
          </div>
        </div>
      </div>

      <div className="page home-features">
        <div className="ticker-shell">
          <div className="ticker-title">Live Merit Ticker</div>
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div className={`ticker-item ${idx === 0 ? 'ticker-item-top' : ''}`} key={`${item.name}-${idx}`}>
                <span className="ticker-label">{item.label}</span>
                <strong>{item.name}</strong>
                <span className="ticker-score">{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-strip">
          {statTargets.map((item, index) => (
            <div key={item.label} className="stat-item">
              <strong>{stats[index]}{item.suffix}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="dash-grid home-dash-grid">
          {highlights.map((item) => (
            <Link key={item.title} to={item.path} className="card feature-card feature-card-pro feature-link-card">
              <div className="feature-icon feature-icon-round">{item.icon}</div>
              <div className="feature-title">{item.title}</div>
              <p className="text-muted mt-2">{item.description}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="card topper-card">
          <div className="flex-between" style={{ marginBottom: 10 }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Top Performers</h3>
            <span className="topper-note">Latest leaderboard snapshot</span>
          </div>
          <div className="topper-grid">
            {topPerformers.slice(0, 3).map((student) => (
              <div className="topper-item" key={student.studentName}>
                <div>
                  <strong>{student.studentName}</strong>
                  <p>Top {student.rank}</p>
                </div>
                <span>{student.avgPercent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
