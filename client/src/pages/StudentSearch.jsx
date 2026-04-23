import { useState } from 'react';
import { getResultsByRoll, getResultsBySemester } from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ResultTable from '../components/ResultTable';

const StudentSearch = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!rollNumber.trim()) return;
    setLoading(true);
    setError('');
    setStudent(null);
    setResults([]);
    setSelectedSubject('');
    try {
      const res = selectedSemester
        ? await getResultsBySemester(rollNumber.trim(), selectedSemester)
        : await getResultsByRoll(rollNumber.trim());
      setStudent(res.data.student);
      setResults(res.data.results);
    } catch {
      setError('Student not found or no results available for this roll number.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const availableSubjects = Array.from(
    new Map(
      results
        .filter((item) => item.subject_id?._id)
        .map((item) => [item.subject_id._id, item.subject_id])
    ).values()
  );

  const filteredResults = selectedSubject
    ? results.filter((item) => item.subject_id?._id === selectedSubject)
    : results;

  const averageGpa = filteredResults.length
    ? (filteredResults.reduce((sum, item) => sum + (Number(item.GPA) || 0), 0) / filteredResults.length).toFixed(2)
    : '0.00';

  const averagePercent = filteredResults.length
    ? Math.round(
      filteredResults.reduce((sum, item) => {
        const percent = item.total_marks ? (item.marks_obtained / item.total_marks) * 100 : 0;
        return sum + percent;
      }, 0) / filteredResults.length
    )
    : 0;

  const passCount = filteredResults.filter((item) => item.status === 'Pass').length;

  const gradeDistribution = filteredResults.reduce((acc, item) => {
    acc[item.grade] = (acc[item.grade] || 0) + 1;
    return acc;
  }, {});

  const semesterDistribution = filteredResults.reduce((acc, item) => {
    const key = `Sem ${item.semester}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const downloadPdf = () => {
    if (!student || filteredResults.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Student Result Summary', 14, 16);
    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 14, 26);
    doc.text(`Roll Number: ${student.roll_number}`, 14, 32);
    doc.text(`Department: ${student.department || '-'}`, 14, 38);
    doc.text(`Average %: ${averagePercent}%   Average GPA: ${averageGpa}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [['Semester', 'Subject Code', 'Subject Name', 'Marks', 'Total', 'Percent', 'Grade', 'GPA', 'Status']],
      body: filteredResults.map((r) => {
        const percent = r.total_marks ? ((r.marks_obtained / r.total_marks) * 100).toFixed(2) : '0.00';
        return [
          `Sem ${r.semester}`,
          r.subject_id?.subject_code || '-',
          r.subject_id?.subject_name || '-',
          r.marks_obtained,
          r.total_marks,
          `${percent}%`,
          r.grade,
          r.GPA,
          r.status,
        ];
      }),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 118, 110] },
    });

    doc.save(`${student.roll_number}-results.pdf`);
  };

  return (
    <div className="page">
      <h1 className="page-title">Search Student Results</h1>
      <p className="page-subtitle">Enter roll number and use semester or subject filters to view detailed academic performance.</p>

      <div className="card">
        <div className="search-row">
          <input
            id="roll-input"
            type="text"
            className="form-control"
            placeholder="Roll Number (e.g. 22CSE000)"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select
            id="semester-select"
            className="search-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <button
            id="search-btn"
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && <div className="spinner">Loading results...</div>}

      {student && !loading && (
        <>
          <div className="student-strip">
            <strong>{student.name}</strong>
            <span>Roll: {student.roll_number}</span>
            <span>ID: {student.student_id}</span>
            <span>Class: {student.class} {student.section && `(${student.section})`}</span>
            <span>Dept: {student.department}</span>
          </div>

          {results.length > 0 ? (
            <>
              <div className="result-summary-grid">
                <div className="summary-card">
                  <span>Visible Results</span>
                  <strong>{filteredResults.length}</strong>
                </div>
                <div className="summary-card">
                  <span>Average Percentage</span>
                  <strong>{averagePercent}%</strong>
                </div>
                <div className="summary-card">
                  <span>Average GPA</span>
                  <strong>{averageGpa}</strong>
                </div>
                <div className="summary-card">
                  <span>Pass Rate</span>
                  <strong>{filteredResults.length ? `${Math.round((passCount / filteredResults.length) * 100)}%` : '0%'}</strong>
                </div>
              </div>

              <div className="card result-filter-card">
                <div className="result-filter-head">
                  <div>
                    <h3>Refine View</h3>
                    <p>Filter the loaded result set by subject without running a new search.</p>
                  </div>
                  <span className="result-filter-count">{filteredResults.length} visible row(s)</span>
                </div>
                <div className="search-row">
                  <select
                    className="search-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subject_code} - {subject.subject_name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSelectedSubject('')}
                    disabled={!selectedSubject}
                  >
                    Reset Subject Filter
                  </button>
                </div>
              </div>

              <div className="flex-between mb-0 results-meta">
                <span className="text-muted">{results.length} total result(s) loaded</span>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  {selectedSemester && <span className="text-muted">Semester {selectedSemester}</span>}
                  <button type="button" className="btn btn-outline btn-sm" onClick={downloadPdf}>
                    Download PDF
                  </button>
                </div>
              </div>
              <ResultTable results={filteredResults} />

              <div className="card analysis-card">
                <div className="analysis-head">
                  <h3>Result & Analysis Snapshot</h3>
                  <p>Quick academic insight with grade graph and relationship map.</p>
                </div>
                <div className="analysis-grid">
                  <div className="analysis-box">
                    <h4>Grade Distribution Graph</h4>
                    <div className="grade-bars">
                      {Object.entries(gradeDistribution).map(([grade, count]) => (
                        <div className="grade-bar-row" key={grade}>
                          <span className="grade-key">{grade}</span>
                          <div className="grade-bar-track">
                            <div
                              className="grade-bar-fill"
                              style={{ width: `${Math.max(10, (count / filteredResults.length) * 100)}%` }}
                            >
                              {count}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="analysis-box">
                    <h4>Venn-Style Performance View</h4>
                    <div className="venn-wrap">
                      <div className="venn-circle venn-circle-a">
                        <strong>{averagePercent}%</strong>
                        <span>Marks</span>
                      </div>
                      <div className="venn-circle venn-circle-b">
                        <strong>{averageGpa}</strong>
                        <span>GPA</span>
                      </div>
                      <div className="venn-circle venn-circle-c">
                        <strong>{Object.keys(semesterDistribution).length}</strong>
                        <span>Semesters</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">No results found{selectedSemester ? ` for Semester ${selectedSemester}` : ''}.</div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentSearch;
