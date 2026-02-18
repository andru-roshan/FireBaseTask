import { useMemo, useState } from 'react';
import './App.css';

const initialForm = {
  date: new Date().toISOString().split('T')[0],
  task: '',
  hours: '',
  status: 'In Progress',
  blockers: '',
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [workLogs, setWorkLogs] = useState([]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const addWorkLog = (event) => {
    event.preventDefault();

    if (!form.task.trim() || !form.hours) {
      return;
    }

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...form,
      submitted: false,
      submittedAt: null,
    };

    setWorkLogs((current) => [newEntry, ...current]);
    setForm((current) => ({
      ...initialForm,
      date: current.date,
    }));
  };

  const submitToManager = (id) => {
    const now = new Date().toLocaleString();
    setWorkLogs((current) =>
      current.map((log) =>
        log.id === id ? { ...log, submitted: true, submittedAt: now } : log
      )
    );
  };

  const summary = useMemo(() => {
    const submittedCount = workLogs.filter((log) => log.submitted).length;
    const pendingCount = workLogs.length - submittedCount;

    return {
      total: workLogs.length,
      submitted: submittedCount,
      pending: pendingCount,
    };
  }, [workLogs]);

  return (
    <main className="app-shell">
      <section className="card">
        <h1>Daily Work Log Tracker</h1>
        <p className="subtitle">
          Track today&apos;s tasks and submit each completed work log to your manager.
        </p>

        <form className="worklog-form" onSubmit={addWorkLog}>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Work done
            <textarea
              name="task"
              placeholder="Describe what you completed today"
              value={form.task}
              onChange={updateField}
              rows={3}
              required
            />
          </label>

          <div className="row-fields">
            <label>
              Hours spent
              <input
                type="number"
                min="0.5"
                step="0.5"
                name="hours"
                value={form.hours}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={updateField}>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Blocked</option>
              </select>
            </label>
          </div>

          <label>
            Blockers / Notes
            <input
              type="text"
              name="blockers"
              placeholder="Any blockers for your manager?"
              value={form.blockers}
              onChange={updateField}
            />
          </label>

          <button type="submit">Add work log</button>
        </form>
      </section>

      <section className="card">
        <h2>Work Log Summary</h2>
        <div className="summary-grid">
          <article>
            <strong>{summary.total}</strong>
            <span>Total logs</span>
          </article>
          <article>
            <strong>{summary.pending}</strong>
            <span>Pending submission</span>
          </article>
          <article>
            <strong>{summary.submitted}</strong>
            <span>Submitted</span>
          </article>
        </div>

        <h3>Entries</h3>
        {workLogs.length === 0 ? (
          <p className="empty-state">No entries yet. Add your first work log above.</p>
        ) : (
          <ul className="entries">
            {workLogs.map((log) => (
              <li key={log.id} className="entry">
                <div>
                  <p>
                    <strong>{log.date}</strong> · {log.hours}h · {log.status}
                  </p>
                  <p>{log.task}</p>
                  {log.blockers && <p className="notes">Notes: {log.blockers}</p>}
                  {log.submittedAt && (
                    <p className="submitted-text">
                      Submitted to manager on {log.submittedAt}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => submitToManager(log.id)}
                  disabled={log.submitted}
                >
                  {log.submitted ? 'Submitted' : 'Submit to manager'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
