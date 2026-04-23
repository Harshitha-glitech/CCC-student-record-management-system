import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addResult, getAllStudents, getAllSubjects } from '../../services/api';

const AddResult = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    result_id: '',
    student_id: '',
    subject_id: '',
    semester: '',
    marks_obtained: '',
    total_marks: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, subRes] = await Promise.all([getAllStudents(), getAllSubjects()]);
        setStudents(sRes.data.students || []);
        setSubjects(subRes.data || []);
      } catch {
        setError('Failed to load students or subjects.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addResult({
        ...form,
        marks_obtained: Number(form.marks_obtained),
        total_marks: Number(form.total_marks),
        semester: Number(form.semester),
      });
      setSuccess('Result added successfully!');
      setForm({ result_id: '', student_id: '', subject_id: '', semester: '', marks_obtained: '', total_marks: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add result.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Add Result</h1>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">← Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="result_id">Result ID</label>
              <input
                id="result_id"
                name="result_id"
                type="text"
                className="form-control"
                placeholder="e.g. RES2024001"
                value={form.result_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="semester">Semester</label>
              <select
                id="semester"
                name="semester"
                className="form-control"
                value={form.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="student_id">Student</label>
              <select
                id="student_id"
                name="student_id"
                className="form-control"
                value={form.student_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.roll_number})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="subject_id">Subject</label>
              <select
                id="subject_id"
                name="subject_id"
                className="form-control"
                value={form.subject_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.subject_code} – {s.subject_name} (Sem {s.semester})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="marks_obtained">Marks Obtained</label>
              <input
                id="marks_obtained"
                name="marks_obtained"
                type="number"
                className="form-control"
                placeholder="e.g. 75"
                value={form.marks_obtained}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="total_marks">Total Marks</label>
              <input
                id="total_marks"
                name="total_marks"
                type="number"
                className="form-control"
                placeholder="e.g. 100"
                value={form.total_marks}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
          </div>

          {form.marks_obtained && form.total_marks && (
            <div className="alert alert-info" style={{ marginBottom: 12 }}>
              Preview: {Math.round((form.marks_obtained / form.total_marks) * 100)}% —
              Grade will be auto-calculated by server.
            </div>
          )}

          <button
            id="add-result-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : '+ Add Result'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResult;
