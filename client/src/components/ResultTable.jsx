const gradeClass = (grade) => {
  const map = {
    'A+': 'grade-aplus',
    'A': 'grade-a',
    'B': 'grade-b',
    'C': 'grade-c',
    'D': 'grade-d',
    'F': 'grade-f',
  };
  return map[grade] || '';
};

const ResultTable = ({ results }) => {
  if (!results || results.length === 0) {
    return <div className="empty">No results found for this query.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Score</th>
            <th>Total</th>
            <th>Percent</th>
            <th>Grade</th>
            <th>GPA</th>
            <th>Status</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const pct = r.total_marks
              ? Math.round((r.marks_obtained / r.total_marks) * 100)
              : 0;
            return (
              <tr key={r._id}>
                <td>{r.subject_id?.subject_code ?? '—'}</td>
                <td>{r.subject_id?.subject_name ?? '—'}</td>
                <td>{r.marks_obtained}</td>
                <td>{r.total_marks}</td>
                <td>{pct}%</td>
                <td className={gradeClass(r.grade)}>{r.grade}</td>
                <td>{r.GPA ?? '—'}</td>
                <td>
                  <span className={`badge badge-${r.status === 'Pass' ? 'pass' : 'fail'}`}>
                    {r.status}
                  </span>
                </td>
                <td>Sem {r.semester}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
