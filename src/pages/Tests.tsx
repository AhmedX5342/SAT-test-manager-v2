import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import type { Test, Folder } from '../types';
import TakeTest from '../components/TakeTest';
import CorrectTest from '../components/CorrectTest';
import ViewDetails from '../components/ViewDetails';
import MoveTestModal from '../components/MoveTestModal';
import DeleteModal from '../components/DeleteModal';
import './Tests.css';

// ─── New Test Modal ───────────────────────────────────────────────────────────

interface NewTestModalProps {
  folders: Folder[];
  currentFolderId: string | null;
  onStart: (config: any) => void;
  onClose: () => void;
}

function NewTestModal({ folders, currentFolderId, onStart, onClose }: NewTestModalProps) {
  const [name, setName] = useState('');
  const [numQuestions, setNumQuestions] = useState<number | string>(44);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | string>(70);
  const [folderId, setFolderId] = useState(currentFolderId || '');

  const handleStart = () => {
    if (!name.trim() || (typeof numQuestions === 'string' ? !numQuestions : numQuestions < 1)) return;
    onStart({
      name: name.trim(),
      numQuestions: parseInt(numQuestions as string),
      timerEnabled,
      timerMinutes: parseInt(timerMinutes as string),
      folderId: folderId || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Practice Test</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <label className="form-label">Test Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SAT Math Practice #3" autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Number of Questions</label>
          <input className="form-input" type="number" min={1} max={200} value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Folder (optional)</label>
          <select className="form-input" value={folderId} onChange={e => setFolderId(e.target.value)}>
            <option value="">Root Directory</option>
            {folders.map((f: Folder) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label toggle-label">
            <input type="checkbox" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} />
            <span>Enable Timer</span>
          </label>
        </div>
        {timerEnabled && (
          <div className="form-group">
            <label className="form-label">Timer Duration (minutes)</label>
            <input className="form-input" type="number" min={1} max={300} value={timerMinutes} onChange={e => setTimerMinutes(e.target.value)} />
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleStart} disabled={!name.trim() || !numQuestions}>Start Test →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Folder Modal ─────────────────────────────────────────────────────────────

interface FolderModalProps {
  folder?: Folder | null;
  parentId?: string | null;
  onSave: (name: string, parentId: string | null) => void;
  onClose: () => void;
}

function FolderModal({ folder, parentId = null, onSave, onClose }: FolderModalProps) {
  const [name, setName] = useState(folder?.name || '');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{folder ? 'Rename Folder' : 'New Folder'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim(), parentId)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(name.trim(), parentId)} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

interface RenameModalProps {
  test: Test;
  onSave: (name: string) => void;
  onClose: () => void;
}

function RenameModal({ test, onSave, onClose }: RenameModalProps) {
  const [name, setName] = useState(test.name);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rename Test</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(name.trim())} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Folder Tree Sidebar ──────────────────────────────────────────────────────

function FolderTree({
  folders,
  currentFolderId,
  onSelectFolder,
}: {
  folders: Folder[];
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (folderId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const renderFolder = (folder: Folder, level: number) => {
    const children = folders.filter(f => f.parentId === folder.id);
    const isExpanded = expanded.has(folder.id);
    return (
      <div key={folder.id}>
        <div
          className={`folder-tree-item ${currentFolderId === folder.id ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          <button className="folder-expand-btn" onClick={() => children.length > 0 && toggleExpand(folder.id)}>
            {children.length > 0 ? (isExpanded ? '▼' : '▶') : '•'}
          </button>
          <button className="folder-tree-name" onClick={() => onSelectFolder(folder.id)}>
            📁 {folder.name}
          </button>
        </div>
        {isExpanded && children.map(child => renderFolder(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="folder-tree-sidebar">
      <div
        className={`folder-tree-item ${currentFolderId === null ? 'active' : ''}`}
        onClick={() => onSelectFolder(null)}
      >
        <span className="folder-expand-btn">📂</span>
        <span className="folder-tree-name">All Tests</span>
      </div>
      {folders.filter(f => !f.parentId).map(folder => renderFolder(folder, 1))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreLabel(test: Test) {
  if (test.rawScore === null) return '—';
  return `${test.rawScore}/${test.numQuestions}`;
}

function scaledLabel(test: Test) {
  if (test.scaledScore === null) return '—';
  return test.maxScaledScore ? `${test.scaledScore}/${test.maxScaledScore}` : `${test.scaledScore}`;
}

function isCorrected(test: Test) {
  return test.corrections !== null;
}

// ─── Action buttons shared by grid + list ─────────────────────────────────────

interface TestActionsProps {
  test: Test;
  onOpen: (t: Test) => void;
  onDelete: (t: Test) => void;
  onRename: (t: Test) => void;
  onMove: (t: Test) => void;
  onCorrect: (t: Test) => void;
  onDetails: (t: Test) => void;
  onExportTest: (t: Test) => void;
}

function TestActionButtons({ test, onOpen, onDelete, onRename, onMove, onCorrect, onDetails, onExportTest }: TestActionsProps) {
  return (
    <>
      <button onClick={() => onOpen(test)} className="btn-icon" title="Take Test">▶ Take</button>
      <button onClick={() => onDetails(test)} className="btn-icon" title="View Details">👁 View</button>
      <button onClick={() => onCorrect(test)} className="btn-icon" title="Correct Test">
        {isCorrected(test) ? '✔ Re-correct' : '✔ Correct'}
      </button>
      <button onClick={() => onRename(test)} className="btn-icon" title="Rename">✏️ Rename</button>
      <button onClick={() => onMove(test)} className="btn-icon" title="Move">📁 Move</button>
      <button onClick={() => onExportTest(test)} className="btn-icon" title="Export Test">⬇ Export</button>
      <button onClick={() => onDelete(test)} className="btn-icon danger-action" title="Delete">🗑️ Delete</button>
    </>
  );
}

// ─── Grid View ────────────────────────────────────────────────────────────────

function GridView({
  folders, tests,
  onFolderOpen, onFolderDelete, onFolderRename,
  onTestOpen, onTestDelete, onTestRename, onTestMove, onTestCorrect, onTestDetails, onExportTest,
}: {
  folders: Folder[]; tests: Test[];
  onFolderOpen: (id: string) => void;
  onFolderDelete: (f: Folder) => void;
  onFolderRename: (f: Folder) => void;
  onTestOpen: (t: Test) => void;
  onTestDelete: (t: Test) => void;
  onTestRename: (t: Test) => void;
  onTestMove: (t: Test) => void;
  onTestCorrect: (t: Test) => void;
  onTestDetails: (t: Test) => void;
  onExportTest: (t: Test) => void;
}) {
  return (
    <div className="explorer-grid">
      {folders.map(folder => (
        <div key={folder.id} className="folder-card" onDoubleClick={() => onFolderOpen(folder.id)}>
          <div className="folder-card-content">
            <span className="folder-icon">📁</span>
            <span className="folder-name">{folder.name}</span>
          </div>
          <div className="folder-actions">
            <button onClick={() => onFolderRename(folder)} className="btn-icon" title="Rename">✏️ Rename</button>
            <button onClick={() => onFolderDelete(folder)} className="btn-icon" title="Delete">🗑️ Delete</button>
          </div>
        </div>
      ))}

      {tests.map(test => (
        <div
          key={test.id}
          className="test-card"
          onDoubleClick={() => onTestDetails(test)}   // double-click → view, not take
        >
          <div className="test-card-content">
            <span className="test-icon">📄</span>
            <span className="test-name">{test.name}</span>
            {test.rawScore !== null && (
              <span className="test-score">{test.rawScore}/{test.numQuestions}</span>
            )}
          </div>
          <div className="test-actions">
            <TestActionButtons
              test={test}
              onOpen={onTestOpen}
              onDelete={onTestDelete}
              onRename={onTestRename}
              onMove={onTestMove}
              onCorrect={onTestCorrect}
              onDetails={onTestDetails}
              onExportTest={onExportTest}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({
  folders, tests,
  onFolderOpen, onFolderDelete, onFolderRename,
  onTestOpen, onTestDelete, onTestRename, onTestMove, onTestCorrect, onTestDetails, onExportTest,
}: {
  folders: Folder[]; tests: Test[];
  onFolderOpen: (id: string) => void;
  onFolderDelete: (f: Folder) => void;
  onFolderRename: (f: Folder) => void;
  onTestOpen: (t: Test) => void;
  onTestDelete: (t: Test) => void;
  onTestRename: (t: Test) => void;
  onTestMove: (t: Test) => void;
  onTestCorrect: (t: Test) => void;
  onTestDetails: (t: Test) => void;
  onExportTest: (t: Test) => void;
}) {
  return (
    <div className="explorer-list">
      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Created</th>
            <th>Raw Score</th>
            <th>Scaled Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {folders.map(folder => (
            <tr key={folder.id} onDoubleClick={() => onFolderOpen(folder.id)}>
              <td><span className="folder-icon">📁</span> {folder.name}</td>
              <td>Folder</td>
              <td>{new Date(folder.createdAt).toLocaleDateString()}</td>
              <td>—</td>
              <td>—</td>
              <td className="actions-cell">
                <button onClick={() => onFolderRename(folder)} className="btn-icon">✏️ Rename</button>
                <button onClick={() => onFolderDelete(folder)} className="btn-icon">🗑️ Delete</button>
              </td>
            </tr>
          ))}
          {tests.map(test => (
            <tr
              key={test.id}
              onDoubleClick={() => onTestDetails(test)}   // double-click → view details
            >
              <td>
                <span className="test-icon">📄</span> {test.name}
                {isCorrected(test) && <span title="Corrected" style={{ marginLeft: 6 }}>✔️</span>}
              </td>
              <td>Test</td>
              <td>{new Date(test.createdAt).toLocaleDateString()}</td>
              <td>{scoreLabel(test)}</td>
              <td>{scaledLabel(test)}</td>
              <td className="actions-cell">
                <TestActionButtons
                  test={test}
                  onOpen={onTestOpen}
                  onDelete={onTestDelete}
                  onRename={onTestRename}
                  onMove={onTestMove}
                  onCorrect={onTestCorrect}
                  onDetails={onTestDetails}
                  onExportTest={onExportTest}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Tests() {
  const {
    folders, tests, viewSettings, updateViewSettings,
    getFolderContents, getFolderPath,
    createFolder, deleteFolder, renameFolder,
    addTest, updateTest, deleteTest,
  } = useData();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewTest, setShowNewTest] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editFolder, setEditFolder] = useState<Folder | null>(null);

  const [takingTest, setTakingTest] = useState<Test | null>(null);
  const [correctingTest, setCorrectingTest] = useState<Test | null>(null);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const [renamingTest, setRenamingTest] = useState<Test | null>(null);
  const [movingTest, setMovingTest] = useState<Test | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'test'; item: Test } | { type: 'folder'; item: Folder } | null
  >(null);

  // Import ref
  const importRef = useRef<HTMLInputElement>(null);

  const { folders: currentFolders, tests: currentTests } = getFolderContents(currentFolderId);
  const folderPath = getFolderPath(currentFolderId);

  // ── handlers ──

  const handleStartTest = (config: any) => {
    setShowNewTest(false);
    const newTest = addTest(config);
    setTakingTest(newTest);
  };

  const handleSaveTest = (testData: any) => {
    if (takingTest) {
      updateTest(takingTest.id, testData);
      setTakingTest(null);
    }
  };

  const handleSaveCorrection = (data: any) => {
    if (correctingTest) {
      updateTest(correctingTest.id, data);
      setCorrectingTest(null);
    }
  };

  const handleSaveDetails = (data: any) => {
    if (viewingTest) {
      updateTest(viewingTest.id, data);
      setViewingTest(null);
    }
  };

  const handleCreateOrRenameFolder = (name: string, parentId: string | null) => {
    if (editFolder) {
      renameFolder(editFolder.id, name);
    } else {
      createFolder(name, parentId);
    }
    setShowFolderModal(false);
    setEditFolder(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'test') {
      deleteTest(deleteTarget.item.id);
    } else {
      deleteFolder(deleteTarget.item.id);
    }
    setDeleteTarget(null);
  };

  // Export single test
  const handleExportTest = (test: Test) => {
    const blob = new Blob([JSON.stringify(test, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${test.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import single test
  const handleImportTest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        // Accept a single test object or an array of tests
        const items: Test[] = Array.isArray(parsed) ? parsed : [parsed];
        items.forEach(item => {
          // Re-add with a fresh id to avoid collisions
          const { id: _id, createdAt: _ca, ...rest } = item;
          addTest({ ...rest, folderId: currentFolderId });
        });
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    // reset so same file can be imported again
    e.target.value = '';
  };

  // ── render TakeTest fullscreen ──

  if (takingTest) {
    return (
      <TakeTest
        test={takingTest}
        onSave={handleSaveTest}
        onCancel={() => setTakingTest(null)}
      />
    );
  }

  return (
    <div className="tests-page page">
      <div className="page-header">
        <h1 className="page-title">Test Explorer</h1>
        <div className="header-actions">
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewSettings.viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => updateViewSettings({ viewMode: 'grid' })}
              title="Grid View"
            >⊞</button>
            <button
              className={`view-toggle-btn ${viewSettings.viewMode === 'list' ? 'active' : ''}`}
              onClick={() => updateViewSettings({ viewMode: 'list' })}
              title="List View"
            >☰</button>
          </div>
          <button className="btn btn-outline" onClick={() => { setEditFolder(null); setShowFolderModal(true); }}>
            📁 New Folder
          </button>
          {/* Hidden file input for import */}
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportTest}
          />
          <button className="btn btn-outline" onClick={() => importRef.current?.click()}>
            ⬆ Import Test
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>
            + Take Test
          </button>
        </div>
      </div>

      <div className="tests-layout">
        <div className="tests-sidebar">
          <FolderTree
            folders={folders}
            currentFolderId={currentFolderId}
            onSelectFolder={setCurrentFolderId}
          />
        </div>

        <div className="tests-main">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <button
              className={`breadcrumb-item ${currentFolderId === null ? 'active' : ''}`}
              onClick={() => setCurrentFolderId(null)}
            >Root</button>
            {folderPath.map(folder => (
              <span key={folder.id}>
                <span className="breadcrumb-separator">/</span>
                <button className="breadcrumb-item" onClick={() => setCurrentFolderId(folder.id)}>
                  {folder.name}
                </button>
              </span>
            ))}
          </div>

          {/* Content */}
          {currentFolders.length === 0 && currentTests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <p>This folder is empty</p>
              <div className="empty-actions">
                <button className="btn btn-outline" onClick={() => { setEditFolder(null); setShowFolderModal(true); }}>Create Folder</button>
                <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>Take Test</button>
              </div>
            </div>
          ) : viewSettings.viewMode === 'grid' ? (
            <GridView
              folders={currentFolders}
              tests={currentTests}
              onFolderOpen={setCurrentFolderId}
              onFolderDelete={f => setDeleteTarget({ type: 'folder', item: f })}
              onFolderRename={f => { setEditFolder(f); setShowFolderModal(true); }}
              onTestOpen={setTakingTest}
              onTestDelete={t => setDeleteTarget({ type: 'test', item: t })}
              onTestRename={setRenamingTest}
              onTestMove={setMovingTest}
              onTestCorrect={setCorrectingTest}
              onTestDetails={setViewingTest}
              onExportTest={handleExportTest}
            />
          ) : (
            <ListView
              folders={currentFolders}
              tests={currentTests}
              onFolderOpen={setCurrentFolderId}
              onFolderDelete={f => setDeleteTarget({ type: 'folder', item: f })}
              onFolderRename={f => { setEditFolder(f); setShowFolderModal(true); }}
              onTestOpen={setTakingTest}
              onTestDelete={t => setDeleteTarget({ type: 'test', item: t })}
              onTestRename={setRenamingTest}
              onTestMove={setMovingTest}
              onTestCorrect={setCorrectingTest}
              onTestDetails={setViewingTest}
              onExportTest={handleExportTest}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}

      {showNewTest && (
        <NewTestModal
          folders={folders}
          currentFolderId={currentFolderId}
          onStart={handleStartTest}
          onClose={() => setShowNewTest(false)}
        />
      )}

      {showFolderModal && (
        <FolderModal
          folder={editFolder}
          parentId={editFolder ? editFolder.parentId : currentFolderId}
          onSave={handleCreateOrRenameFolder}
          onClose={() => { setShowFolderModal(false); setEditFolder(null); }}
        />
      )}

      {renamingTest && (
        <RenameModal
          test={renamingTest}
          onSave={name => { updateTest(renamingTest.id, { name }); setRenamingTest(null); }}
          onClose={() => setRenamingTest(null)}
        />
      )}

      {movingTest && (
        <MoveTestModal
          testId={movingTest.id}
          currentFolderId={movingTest.folderId}
          onClose={() => setMovingTest(null)}
          onMoved={() => setMovingTest(null)}
        />
      )}

      {correctingTest && (
        <CorrectTest
          test={correctingTest}
          onSave={handleSaveCorrection}
          onClose={() => setCorrectingTest(null)}
        />
      )}

      {viewingTest && (
        <ViewDetails
          test={tests.find(t => t.id === viewingTest.id) || viewingTest}
          onSave={handleSaveDetails}
          onClose={() => setViewingTest(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.item.name}
          itemType={deleteTarget.type}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}