import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteResult, getAllResults, updateResult } from '../../services/api';

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ marks_obtained: '', total_marks: '' });
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const fetchResults = async (nextPage = page) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllResults(nextPage);
      setResults(res.data.results || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch {
      setError('Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(1);
  }, []);

  const startEdit = (result) => {
    setEditingId(result._id);
    setEditForm({
      marks_obtained: String(result.marks_obtained ?? ''),
      total_marks: String(result.total_marks ?? ''),
    });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ marks_obtained: '', total_marks: '' });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateResult(id, {
        marks_obtained: Number(editForm.marks_obtained),
        total_marks: Number(editForm.total_marks),
      });
      setSuccess('Result updated successfully.');
      cancelEdit();
      fetchResults(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update result.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result entry?')) return;
    setError('');
    setSuccess('');

    try {
      await deleteResult(id);
      setSuccess('Result deleted successfully.');
      const currentPage = results.length === 1 && page > 1 ? page - 1 : page;
      fetchResults(currentPage);
    } catch {
      setError('Failed to delete result.');
    }
  };

  const visibleResults = results.filter((r) => {
    const q = query.trim().toLowerCase();
    const semMatch = semesterFilter ? String(r.semester) === semesterFilter : true;
    if (!q) return semMatch;

    const text = [
      r.result_id,
      r.student_id?.name,
      r.student_id?.roll_number,
      r.subject_id?.subject_code,
      r.subject_id?.subject_name,
    ].join(' ').toLowerCase();

    return semMatch && text.includes(q);
  });

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Manage Results</h1>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">← Back</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="search-row">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Result ID, Student, Roll No, Subject Code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="search-select"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={String(s)}>Semester {s}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setQuery('');
              setSemesterFilter('');
            }}
            disabled={!query && !semesterFilter}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner">Loading results...</div>
      ) : visibleResults.length === 0 ? (
        <div className="empty">No results found. Add results first.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Result ID</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Marks</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>GPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((r) => {
                  const isEditing = editingId === r._id;
                  return (
                    <tr key={r._id}>
                      <td>{r.result_id}</td>
                      <td>{r.student_id?.name} ({r.student_id?.roll_number})</td>
                      <td>{r.subject_id?.subject_code} - {r.subject_id?.subject_name}</td>
                      <td>Sem {r.semester}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            className="form-control"
                            value={editForm.marks_obtained}
                            onChange={(e) => setEditForm({ ...editForm, marks_obtained: e.target.value })}
                          />
                        ) : r.marks_obtained}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            className="form-control"
                            value={editForm.total_marks}
                            onChange={(e) => setEditForm({ ...editForm, total_marks: e.target.value })}
                          />
                        ) : r.total_marks}
                      </td>
                      <td>{r.grade}</td>
                      <td>{r.GPA}</td>
                      <td>
                        <span className={`badge badge-${r.status === 'Pass' ? 'pass' : 'fail'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => saveEdit(r._id)} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button className="btn btn-outline btn-sm" onClick={cancelEdit}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-outline btn-sm" onClick={() => startEdit(r)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex-between mt-2">
            <span className="text-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => fetchResults(page - 1)}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => fetchResults(page + 1)}
                disabled={page >= pages || loading}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageResults;
