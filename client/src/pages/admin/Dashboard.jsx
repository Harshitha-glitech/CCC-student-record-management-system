import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { adminInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const cards = [
    { icon: '📝', label: 'Add Result', sub: 'Publish new result entry', path: '/admin/add-result' },
    { icon: '📊', label: 'Manage Results', sub: 'Update / delete result records', path: '/admin/results' },
    { icon: '📈', label: 'Grade Analytics', sub: 'Deep graph analysis and performance insights', path: '/admin/analytics' },
    { icon: '👥', label: 'Manage Students', sub: 'Add / edit / delete students', path: '/admin/students' },
    { icon: '📚', label: 'Manage Subjects', sub: 'Add / edit / delete subjects', path: '/admin/subjects' },
  ];

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span className="text-muted">Logged in as <strong>{adminInfo?.name || adminInfo?.username}</strong> ({adminInfo?.role})</span>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </div>

      <div className="dash-grid">
        {cards.map(({ icon, label, sub, path }) => (
          <Link key={label} to={path} className="dash-card">
            <div className="dash-icon">{icon}</div>
            <div className="dash-label">{label}</div>
            <div className="dash-sub">{sub}</div>
          </Link>
        ))}
      </div>

      <div className="alert alert-info">
        <strong>Tip:</strong> First add Students and Subjects before adding Results.
        Use the cards above to navigate.
      </div>
    </div>
  );
};

export default Dashboard;
