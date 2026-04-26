import { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Test, Folder } from '../types';
import TakeTest from '../components/TakeTest';
import CorrectTest from '../components/CorrectTest';
import ViewDetails from '../components/ViewDetails';
import './Tests.css';

interface NewTestModalProps {
  folders: Folder[];
  onStart: (config: any) => void;
  onClose: () => void;
}

function NewTestModal({ folders, onStart, onClose }: NewTestModalProps) {
  const [name, setName] = useState('');
  const [numQuestions, setNumQuestions] = useState<number | string>(44);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | string>(70);
  const [folderId, setFolderId] = useState('');

  const handleStart = () => {
    if (!name.trim() || (typeof numQuestions === 'string' ? !numQuestions : numQuestions < 1)) return;
    onStart({ name: name.trim(), numQuestions: parseInt(numQuestions as string), timerEnabled, timerMinutes: parseInt(timerMinutes as string), folderId: folderId || null });
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
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SAT Math Practice #3" />
        </div>
        <div className="form-group">
          <label className="form-label">Number of Questions</label>
          <input className="form-input" type="number" min={1} max={200} value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Folder (optional)</label>
          <select className="form-input" value={folderId} onChange={e => setFolderId(e.target.value)}>
            <option value="">No Folder</option>
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

interface FolderModalProps {
  folder?: Folder | null;
  onSave: (name: string) => void;
  onClose: () => void;
}

function FolderModal({ folder, onSave, onClose }: FolderModalProps) {
  const [name, setName] = useState(folder?.name || '');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{folder ? 'Rename Folder' : 'New Folder'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Folder name" autoFocus onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(name.trim())} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}

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
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(name.trim())} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}

interface MoveModalProps {
  test: Test;
  folders: Folder[];
  onSave: (folderId: string | null) => void;
  onClose: () => void;
}

function MoveModal({ test, folders, onSave, onClose }: MoveModalProps) {
  const [folderId, setFolderId] = useState(test.folderId || '');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Move to Folder</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <select className="form-input" value={folderId} onChange={e => setFolderId(e.target.value)}>
            <option value="">No Folder</option>
            {folders.map((f: Folder) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(folderId || null)}>Move</button>
        </div>
      </div>
    </div>
  );
}

interface TestRowProps {
  test: Test;
  folders: Folder[];
  onRename: () => void;
  onDelete: () => void;
  onCorrect: () => void;
  onViewDetails: () => void;
  onMove: () => void;
}

function TestRow({ test, folders, onRename, onDelete, onCorrect, onViewDetails, onMove }: TestRowProps) {
  const [open, setOpen] = useState(false);
  const folder = folders.find((f: Folder) => f.id === test.folderId);

  return (
    <div className="test-row">
      <div className="test-row-main">
        <div className="test-row-name">
          <span className="test-name">{test.name}</span>
          {folder && <span className="folder-chip">📁 {folder.name}</span>}
        </div>
        <div className="test-row-meta">
          <span>{new Date(test.createdAt).toLocaleDateString()}</span>
          <span className="score-chip raw">{test.rawScore !== null ? `${test.rawScore}/${test.numQuestions}` : 'Uncorrected'}</span>
          {test.scaledScore && <span className="score-chip scaled">{test.scaledScore}{test.maxScaledScore ? `/${test.maxScaledScore}` : ''}</span>}
        </div>
      </div>
      <div className="test-row-actions">
        <button className="btn btn-outline btn-xs" onClick={onViewDetails}>Details</button>
        <div className="action-menu-wrap">
          <button className="btn btn-ghost btn-xs" onClick={() => setOpen(!open)}>⋯</button>
          {open && (
            <div className="action-menu" onMouseLeave={() => setOpen(false)}>
              <button onClick={() => { onRename(); setOpen(false); }}>✏️ Rename</button>
              <button onClick={() => { onMove(); setOpen(false); }}>📁 Move to Folder</button>
              <button onClick={() => { onCorrect(); setOpen(false); }}>🤖 Correct Test</button>
              <button className="danger" onClick={() => { onDelete(); setOpen(false); }}>🗑 Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Tests() {
  const data = useData();
  const folders = data.folders;
  const tests = data.tests;
  const createFolder = data.createFolder;
  const deleteFolder = data.deleteFolder;
  const renameFolder = data.renameFolder;
  const addTest = data.addTest;
  const updateTest = data.updateTest;
  const deleteTest = data.deleteTest;
  const moveTestToFolder = data.moveTestToFolder;

  const [activeFolder, setActiveFolder] = useState<Folder | null>(null); // null = all tests view
  const [showNewTest, setShowNewTest] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editFolder, setEditFolder] = useState<Folder | null>(null);
  const [takingTest, setTakingTest] = useState<Test | null>(null);
  const [correctingTest, setCorrectingTest] = useState<Test | null>(null);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const [renamingTest, setRenamingTest] = useState<Test | null>(null);
  const [movingTest, setMovingTest] = useState<Test | null>(null);

  const displayTests = activeFolder
    ? tests.filter((t: Test) => t.folderId === activeFolder.id)
    : tests;

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
      // Refresh viewing test if open
      if (viewingTest && viewingTest.id === correctingTest.id) {
        setViewingTest({ ...viewingTest, ...data });
      }
    }
  };

  const handleSaveDetails = (data: any) => {
    if (viewingTest) {
      updateTest(viewingTest.id, data);
      setViewingTest(null);
    }
  };

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
        <h1 className="page-title">Tests</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setShowFolderModal(true)}>📁 New Folder</button>
          <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>+ Take Test</button>
        </div>
      </div>

      {/* Folders row */}
      <div className="folders-row">
        <button
          className={`folder-chip-btn ${!activeFolder ? 'active' : ''}`}
          onClick={() => setActiveFolder(null)}
        >
          📋 All Tests <span className="chip-count">{tests.length}</span>
        </button>
        {folders.map((f: Folder) => (
          <div key={f.id} className="folder-chip-wrap">
            <button
              className={`folder-chip-btn ${activeFolder?.id === f.id ? 'active' : ''}`}
              onClick={() => setActiveFolder(activeFolder?.id === f.id ? null : f)}
            >
              📁 {f.name} <span className="chip-count">{tests.filter((t: Test) => t.folderId === f.id).length}</span>
            </button>
            <div className="folder-mini-actions">
              <button title="Rename" onClick={() => { setEditFolder(f); setShowFolderModal(true); }}>✏️</button>
              <button title="Delete" className="danger-btn" onClick={() => deleteFolder(f.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Tests list */}
      <div className="tests-list">
        {displayTests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>{activeFolder ? `No tests in "${activeFolder.name}" yet.` : 'No tests yet. Take your first practice test!'}</p>
            <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>+ Take Test</button>
          </div>
        ) : (
          [...displayTests].reverse().map((test: Test) => (
            <TestRow
              key={test.id}
              test={test}
              folders={folders}
              onRename={() => setRenamingTest(test)}
              onDelete={() => deleteTest(test.id)}
              onCorrect={() => setCorrectingTest(test)}
              onViewDetails={() => setViewingTest(test)}
              onMove={() => setMovingTest(test)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showNewTest && (
        <NewTestModal folders={folders} onStart={handleStartTest} onClose={() => setShowNewTest(false)} />
      )}
      {showFolderModal && (
        <FolderModal
          folder={editFolder}
          onSave={(name: string) => {
            if (editFolder) renameFolder(editFolder.id, name);
            else createFolder(name);
            setShowFolderModal(false);
            setEditFolder(null);
          }}
          onClose={() => { setShowFolderModal(false); setEditFolder(null); }}
        />
      )}
      {renamingTest && (
        <RenameModal
          test={renamingTest}
          onSave={(name: string) => { updateTest(renamingTest.id, { name }); setRenamingTest(null); }}
          onClose={() => setRenamingTest(null)}
        />
      )}
      {movingTest && (
        <MoveModal
          test={movingTest}
          folders={folders}
          onSave={(folderId: string | null) => { moveTestToFolder(movingTest.id, folderId); setMovingTest(null); }}
          onClose={() => setMovingTest(null)}
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
    </div>
  );
}
