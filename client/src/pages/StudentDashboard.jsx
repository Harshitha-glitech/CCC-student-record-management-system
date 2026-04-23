import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';
import { getMyResults } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PIE_COLORS = ['#0ea5a4', '#0ea15f', '#2563eb', '#f59e0b', '#ef4444', '#6366f1'];

const toPercent = (item) => (item.total_marks ? (item.marks_obtained / item.total_marks) * 100 : 0);

const StudentDashboard = () => {
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const { studentInfo, logoutStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyResults();
        setStudent(data.student);
        setResults(data.results || []);
      } catch {
        setError('Session expired or failed to load student result data. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subjects = useMemo(() => {
    const map = new Map();
    results.forEach((r) => {
      if (r.subject_id?._id) map.set(r.subject_id._id, r.subject_id);
    });
    return Array.from(map.values());
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const semOK = semesterFilter ? String(r.semester) === String(semesterFilter) : true;
      const subOK = subjectFilter ? r.subject_id?._id === subjectFilter : true;
      return semOK && subOK;
    });
  }, [results, semesterFilter, subjectFilter]);

  const stats = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        avgPercent: 0,
        avgGPA: 0,
        passRate: 0,
        bestScore: 0,
        consistency: 0,
      };
    }

    const percents = filteredResults.map(toPercent);
    const avgPercent = percents.reduce((a, b) => a + b, 0) / percents.length;
    const avgGPA = filteredResults.reduce((sum, r) => sum + (Number(r.GPA) || 0), 0) / filteredResults.length;
    const passRate = (filteredResults.filter((r) => r.status === 'Pass').length / filteredResults.length) * 100;
    const bestScore = Math.max(...percents);

    const variance = percents.reduce((sum, val) => sum + (val - avgPercent) ** 2, 0) / percents.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, Math.min(100, 100 - stdDev));

    return {
      avgPercent: Number(avgPercent.toFixed(2)),
      avgGPA: Number(avgGPA.toFixed(2)),
      passRate: Number(passRate.toFixed(2)),
      bestScore: Number(bestScore.toFixed(2)),
      consistency: Number(consistency.toFixed(2)),
    };
  }, [filteredResults]);

  const semesterTrend = useMemo(() => {
    const grouped = {};
    filteredResults.forEach((r) => {
      const key = `Sem ${r.semester}`;
      if (!grouped[key]) grouped[key] = { semester: key, totalPct: 0, totalGPA: 0, count: 0 };
      grouped[key].totalPct += toPercent(r);
      grouped[key].totalGPA += Number(r.GPA) || 0;
      grouped[key].count += 1;
    });

    return Object.values(grouped)
      .map((item) => ({
        semester: item.semester,
        percent: Number((item.totalPct / item.count).toFixed(2)),
        gpa: Number((item.totalGPA / item.count).toFixed(2)),
      }))
      .sort((a, b) => Number(a.semester.split(' ')[1]) - Number(b.semester.split(' ')[1]));
  }, [filteredResults]);

  const gradeDistribution = useMemo(() => {
    const grouped = {};
    filteredResults.forEach((r) => {
      grouped[r.grade] = (grouped[r.grade] || 0) + 1;
    });
    return Object.keys(grouped).map((grade) => ({ name: grade, value: grouped[grade] }));
  }, [filteredResults]);

  const subjectRadarData = useMemo(() => {
    const grouped = {};
    filteredResults.forEach((r) => {
      const key = r.subject_id?.subject_code || 'NA';
      if (!grouped[key]) {
        grouped[key] = {
          subject: key,
          name: r.subject_id?.subject_name || 'Unknown Subject',
          total: 0,
          count: 0,
        };
      }
      grouped[key].total += toPercent(r);
      grouped[key].count += 1;
    });

    return Object.values(grouped).map((s) => ({
      subject: s.subject,
      fullName: s.name,
      score: Number((s.total / s.count).toFixed(2)),
    }));
  }, [filteredResults]);

  const topSubjects = useMemo(() => {
    return [...subjectRadarData].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [subjectRadarData]);

  const improvementSubjects = useMemo(() => {
    return [...subjectRadarData].sort((a, b) => a.score - b.score).slice(0, 2);
  }, [subjectRadarData]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    doc.setFontSize(16);
    doc.text('Student Result Marksheet', 14, 16);
    doc.setFontSize(11);
    doc.text(`Name: ${student?.name || studentInfo?.name || '-'}`, 14, 26);
    doc.text(`Roll Number: ${student?.roll_number || studentInfo?.roll_number || '-'}`, 14, 32);
    doc.text(`Department: ${student?.department || '-'}`, 14, 38);
    doc.text(`Generated: ${dateText}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [['Semester', 'Subject Code', 'Subject Name', 'Marks', 'Total', 'Percent', 'Grade', 'GPA', 'Status']],
      body: filteredResults.map((r) => {
        const pct = toPercent(r);
        return [
          `Sem ${r.semester}`,
          r.subject_id?.subject_code || '-',
          r.subject_id?.subject_name || '-',
          r.marks_obtained,
          r.total_marks,
          `${pct.toFixed(2)}%`,
          r.grade,
          r.GPA,
          r.status,
        ];
      }),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 118, 110] },
    });

    doc.save(`${student?.roll_number || 'student'}-results.pdf`);
  };

  const handleLogout = () => {
    logoutStudent();
    navigate('/student/login');
  };

  if (loading) {
    return <div className="page"><div className="spinner">Loading student dashboard...</div></div>;
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page analytics-page">
      <div className="analytics-hero">
        <div>
          <p className="eyebrow">Student Analytics Dashboard</p>
          <h1 className="page-title">{student?.name || studentInfo?.name}</h1>
          <p className="page-subtitle">
            Roll: {student?.roll_number || studentInfo?.roll_number} • Department: {student?.department || '-'}
          </p>
        </div>
        <div className="analytics-actions">
          <button className="btn btn-outline" onClick={handleDownloadPDF}>Download PDF Marksheet</button>
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="card">
        <div className="search-row">
          <select className="search-select" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <select className="search-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.subject_code} - {s.subject_name}</option>
            ))}
          </select>
          <button className="btn btn-outline" onClick={() => { setSemesterFilter(''); setSubjectFilter(''); }}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="result-summary-grid analytics-summary-grid">
        <div className="summary-card">
          <span>Average Percentage</span>
          <strong>{stats.avgPercent}%</strong>
        </div>
        <div className="summary-card">
          <span>Average GPA</span>
          <strong>{stats.avgGPA}</strong>
        </div>
        <div className="summary-card">
          <span>Pass Rate</span>
          <strong>{stats.passRate}%</strong>
        </div>
        <div className="summary-card">
          <span>Best Score</span>
          <strong>{stats.bestScore}%</strong>
        </div>
        <div className="summary-card">
          <span>Consistency Index</span>
          <strong>{stats.consistency}</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card chart-card">
          <div className="card-title">Semester Trend Analysis</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={semesterTrend}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="semester" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="percent" name="Avg %" stroke="#0ea5a4" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="gpa" name="Avg GPA" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-title">Grade Distribution</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
          <div className="card-title">Subject Strength Radar</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={subjectRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar dataKey="score" stroke="#0d9488" fill="#2dd4bf" fillOpacity={0.35} />
                <Tooltip formatter={(value) => `${value}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-title">Subject Performance Bar View</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectRadarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" fill="#0ea5a4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card insight-card">
          <div className="card-title">Top Performing Subjects</div>
          {topSubjects.length === 0 ? (
            <p className="text-muted">No data available.</p>
          ) : (
            topSubjects.map((item) => (
              <div key={item.subject} className="insight-row success">
                <div>
                  <strong>{item.subject}</strong>
                  <p>{item.fullName}</p>
                </div>
                <span>{item.score}%</span>
              </div>
            ))
          )}
        </div>

        <div className="card insight-card">
          <div className="card-title">Focus Zone Suggestions</div>
          {improvementSubjects.length === 0 ? (
            <p className="text-muted">No data available.</p>
          ) : (
            improvementSubjects.map((item) => (
              <div key={item.subject} className="insight-row warning">
                <div>
                  <strong>{item.subject}</strong>
                  <p>{item.fullName}</p>
                </div>
                <span>{item.score}%</span>
              </div>
            ))
          )}
          <p className="insight-note">
            Extra analysis: improve subjects below 65% first, then optimize consistency by weekly revisions.
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Marks</th>
              <th>Total</th>
              <th>Percent</th>
              <th>Grade</th>
              <th>GPA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((r) => (
              <tr key={r._id}>
                <td>Sem {r.semester}</td>
                <td>{r.subject_id?.subject_code}</td>
                <td>{r.subject_id?.subject_name}</td>
                <td>{r.marks_obtained}</td>
                <td>{r.total_marks}</td>
                <td>{toPercent(r).toFixed(2)}%</td>
                <td>{r.grade}</td>
                <td>{r.GPA}</td>
                <td>
                  <span className={`badge badge-${r.status === 'Pass' ? 'pass' : 'fail'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
