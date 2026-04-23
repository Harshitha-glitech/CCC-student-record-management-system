import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getResultAnalytics } from '../../services/api';

const COLORS = ['#0ea5a4', '#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getResultAnalytics();
        setData(res.data);
      } catch {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const spotlight = useMemo(() => {
    if (!data?.subjectAnalysis?.length) return null;
    const best = data.subjectAnalysis[0];
    const risk = [...data.subjectAnalysis].sort((a, b) => a.avgPercent - b.avgPercent)[0];
    return { best, risk };
  }, [data]);

  if (loading) return <div className="page"><div className="spinner">Loading analytics...</div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page analytics-page admin-analytics-page">
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 6 }}>Grade Analytics Dashboard</h1>
          <p className="page-subtitle">Comprehensive graph analysis for academic performance trends.</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">← Back</Link>
      </div>

      <div className="result-summary-grid analytics-summary-grid">
        <div className="summary-card">
          <span>Total Records</span>
          <strong>{data?.overview?.totalResults || 0}</strong>
        </div>
        <div className="summary-card">
          <span>Average Percentage</span>
          <strong>{data?.overview?.averagePercentage || 0}%</strong>
        </div>
        <div className="summary-card">
          <span>Average GPA</span>
          <strong>{data?.overview?.averageGPA || 0}</strong>
        </div>
        <div className="summary-card">
          <span>Pass Rate</span>
          <strong>{data?.overview?.passRate || 0}%</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card chart-card">
          <div className="card-title">Semester Performance Trend</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.semesterTrend || []}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="semester" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgPercent" stroke="#0ea5a4" strokeWidth={3} name="Avg %" />
                <Line yAxisId="right" type="monotone" dataKey="avgGPA" stroke="#2563eb" strokeWidth={3} name="Avg GPA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-title">Grade Distribution</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data?.gradeDistribution || []} dataKey="count" nameKey="grade" outerRadius={95} label>
                  {(data?.gradeDistribution || []).map((entry, index) => (
                    <Cell key={`${entry.grade}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card chart-card">
          <div className="card-title">Top Subject Analysis</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={(data?.subjectAnalysis || []).slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="subjectCode" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgPercent" fill="#0ea5a4" name="Avg %" radius={[8, 8, 0, 0]} />
                <Bar dataKey="passRate" fill="#2563eb" name="Pass %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-title">Department Comparison</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data?.departmentAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgPercent" fill="#10b981" name="Avg %" radius={[8, 8, 0, 0]} />
                <Bar dataKey="passRate" fill="#f59e0b" name="Pass %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card insight-card">
          <div className="card-title">Best Performing Subject</div>
          {spotlight?.best ? (
            <div className="insight-row success">
              <div>
                <strong>{spotlight.best.subjectCode}</strong>
                <p>{spotlight.best.subjectName}</p>
              </div>
              <span>{spotlight.best.avgPercent}%</span>
            </div>
          ) : <p className="text-muted">No subject data available.</p>}
        </div>

        <div className="card insight-card">
          <div className="card-title">Needs Attention</div>
          {spotlight?.risk ? (
            <div className="insight-row warning">
              <div>
                <strong>{spotlight.risk.subjectCode}</strong>
                <p>{spotlight.risk.subjectName}</p>
              </div>
              <span>{spotlight.risk.avgPercent}%</span>
            </div>
          ) : <p className="text-muted">No risk indicators.</p>}
          <p className="insight-note">
            Extra feature: use this dashboard to identify weak courses, then assign focused remediation for the next cycle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
