import { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import type { Test, Folder, Message } from '../types';
import './Settings.css';

function exportToExcel(tests: Test[], folders: Folder[]) {
  // Build CSV content
  const lines: (string | number | boolean)[][] = [['Test Name', 'Date', 'Folder', 'Questions', 'Raw Score', 'Scaled Score', 'Max Scaled', 'Corrected']];
  tests.forEach((t: Test) => {
    const folder = folders.find((f: Folder) => f.id === t.folderId)?.name || '';
    lines.push([
      t.name,
      new Date(t.createdAt).toLocaleDateString(),
      folder,
      t.numQuestions,
      t.rawScore ?? '',
      t.scaledScore ?? '',
      t.maxScaledScore ?? '',
      t.corrections ? 'Yes' : 'No',
    ]);
  });
  const csv = lines.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sat-tests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Settings() {
  const data = useData();
  const tests = data.tests;
  const folders = data.folders;
  const importData = data.importData;
  const clearAll = data.clearAll;

  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ folders, tests }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Data exported as JSON successfully.');
  };

  const handleExportCSV = () => {
    exportToExcel(tests, folders);
    showMsg('Data exported as CSV/Excel successfully.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result as string;
        const data = JSON.parse(result);
        importData(data);
        showMsg('Data imported successfully!');
      } catch {
        showMsg('Invalid JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    clearAll();
    setConfirmDelete(false);
    showMsg('All data cleared.', 'error');
  };

  return (
    <div className="settings-page page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      {message && (
        <div className={`toast ${message.type}`}>{message.text}</div>
      )}

      <div className="settings-section">
        <h2 className="section-title">Data Management</h2>
        <p className="settings-desc">Your test data is stored locally in your browser. Export regularly to back up your progress.</p>

        <div className="settings-cards">
          <div className="settings-card">
            <div className="settings-card-icon">📤</div>
            <div className="settings-card-content">
              <h3>Export as JSON</h3>
              <p>Full backup including all tests, answers, corrections, and folders.</p>
              <button className="btn btn-primary btn-sm" onClick={handleExportJSON}>Export JSON</button>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-icon">📊</div>
            <div className="settings-card-content">
              <h3>Export as CSV</h3>
              <p>Summary of all tests in spreadsheet format (Excel compatible).</p>
              <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>Export CSV</button>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-icon">📥</div>
            <div className="settings-card-content">
              <h3>Import Data</h3>
              <p>Restore from a previously exported JSON backup file.</p>
              <button className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>Import JSON</button>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section danger-section">
        <h2 className="section-title">Danger Zone</h2>
        {!confirmDelete ? (
          <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>🗑 Delete All Data</button>
        ) : (
          <div className="confirm-delete">
            <p>⚠️ This will permanently delete all {tests.length} tests and {folders.length} folders. This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleClearAll}>Yes, Delete Everything</button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2 className="section-title">Stats</h2>
        <div className="stats-row">
          <div className="mini-stat"><strong>{tests.length}</strong> Tests</div>
          <div className="mini-stat"><strong>{folders.length}</strong> Folders</div>
          <div className="mini-stat"><strong>{tests.filter(t => t.corrections).length}</strong> Corrected</div>
        </div>
      </div>
    </div>
  );
}
