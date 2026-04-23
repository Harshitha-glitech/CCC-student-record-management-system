import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubjects, addSubject, updateSubject, deleteSubject } from '../../services/api';

const EMPTY_FORM = {
  subject_code: '', subject_name: '', total_marks: '', passing_marks: '',
  semester: '', department: '',
};

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try {
      const res = await getAllSubjects();
      setSubjects(res.data || []);
    } catch {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (s) => {
    setForm({
      subject_code: s.subject_code, subject_name: s.subject_name,
      total_marks: s.total_marks, passing_marks: s.passing_marks,
      semester: s.semester, department: s.department || '',
    });
    setEditId(s._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        total_marks: Number(form.total_marks),
        passing_marks: Number(form.passing_marks),
        semester: Number(form.semester),
      };
      if (editId) {
        await updateSubject(editId, payload);
        setSuccess('Subject updated successfully.');
      } else {
        await addSubject(payload);
        setSuccess('Subject added successfully.');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSuccess('Subject deleted.');
      fetch();
    } catch {
      setError('Delete failed.');
    }
  };

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Manage Subjects</h1>
        <div className="flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm">← Back</Link>
          {!showForm && (
            <button
              id="add-subject-btn"
              className="btn btn-primary btn-sm"
              onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
            >
              + Add Subject
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <div className="card-title">{editId ? 'Edit Subject' : 'Add New Subject'}</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input name="subject_code" className="form-control" placeholder="e.g. CS301"
                  value={form.subject_code} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input name="subject_name" className="form-control" placeholder="e.g. Data Structures"
                  value={form.subject_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Total Marks</label>
                <input name="total_marks" type="number" className="form-control" placeholder="100"
                  value={form.total_marks} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Marks</label>
                <input name="passing_marks" type="number" className="form-control" placeholder="40"
                  value={form.passing_marks} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select name="semester" className="form-control" value={form.semester} onChange={handleChange} required>
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input name="department" className="form-control" placeholder="e.g. Computer Science"
                value={form.department} onChange={handleChange} />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update Subject' : 'Add Subject'}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="empty">No subjects found. Add one above.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Total</th>
                <th>Passing</th>
                <th>Semester</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s._id}>
                  <td>{s.subject_code}</td>
                  <td>{s.subject_name}</td>
                  <td>{s.total_marks}</td>
                  <td>{s.passing_marks}</td>
                  <td>Sem {s.semester}</td>
                  <td>{s.department || '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSubjects;
