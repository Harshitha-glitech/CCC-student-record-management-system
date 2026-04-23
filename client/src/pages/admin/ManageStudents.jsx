import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents, addStudent, updateStudent, deleteStudent } from '../../services/api';

const EMPTY_FORM = {
  student_id: '', roll_number: '', name: '', email: '',
  phone: '', class: '', section: '', department: '', password: '',
};

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.students || []);
    } catch {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (s) => {
    setForm({
      student_id: s.student_id, roll_number: s.roll_number, name: s.name,
      email: s.email, phone: s.phone || '', class: s.class || '',
      section: s.section || '', department: s.department || '', password: '',
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
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      if (editId) {
        await updateStudent(editId, payload);
        setSuccess('Student updated successfully.');
      } else {
        await addStudent(payload);
        setSuccess('Student added successfully.');
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
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await deleteStudent(id);
      setSuccess('Student deleted.');
      fetch();
    } catch {
      setError('Delete failed.');
    }
  };

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Manage Students</h1>
        <div className="flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm">← Back</Link>
          {!showForm && (
            <button
              id="add-student-btn"
              className="btn btn-primary btn-sm"
              onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
            >
              + Add Student
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <div className="card-title">{editId ? 'Edit Student' : 'Add New Student'}</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input name="student_id" className="form-control" placeholder="e.g. STU2024001"
                  value={form.student_id} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input name="roll_number" className="form-control" placeholder="e.g. 21CS101"
                  value={form.roll_number} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" className="form-control" placeholder="Student name"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" placeholder="student@email.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" placeholder="Phone number"
                  value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Class</label>
                <input name="class" className="form-control" placeholder="e.g. B.Tech CSE"
                  value={form.class} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <input name="section" className="form-control" placeholder="e.g. A"
                  value={form.section} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input name="department" className="form-control" placeholder="e.g. Computer Science"
                value={form.department} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder={editId ? 'Leave blank to keep current password' : 'Set student login password'}
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update Student' : 'Add Student'}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="empty">No students found. Add one above.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.student_id}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.class} {s.section && `(${s.section})`}</td>
                  <td>{s.department}</td>
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

export default ManageStudents;
