import { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Test, Folder } from '../types';
import TakeTest from '../components/TakeTest';
import CorrectTest from '../components/CorrectTest';
import ViewDetails from '../components/ViewDetails';
import MoveTestModal from '../components/MoveTestModal';
import './Tests.css';

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
      folderId: folderId || null 
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
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SAT Math Practice #3" />
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
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Folder name" autoFocus onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim(), parentId)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(name.trim(), parentId)} disabled={!name.trim()}>Save</button>
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

// Component to display folder tree for navigation
function FolderTree({ 
  folders, 
  currentFolderId, 
  onSelectFolder,
  level = 0 
}: { 
  folders: Folder[]; 
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  level?: number;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  
  const rootFolders = folders.filter(f => !f.parentId);
  
  const toggleExpand = (folderId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpanded(newExpanded);
  };
  
  const renderFolder = (folder: Folder, currentLevel: number) => {
    const children = folders.filter(f => f.parentId === folder.id);
    const isExpanded = expanded.has(folder.id);
    
    return (
      <div key={folder.id}>
        <div 
          className={`folder-tree-item ${currentFolderId === folder.id ? 'active' : ''}`}
          style={{ paddingLeft: `${currentLevel * 20 + 8}px` }}
        >
          <button 
            className="folder-expand-btn"
            onClick={() => children.length > 0 && toggleExpand(folder.id)}
          >
            {children.length > 0 ? (isExpanded ? '▼' : '▶') : '•'}
          </button>
          <button 
            className="folder-tree-name"
            onClick={() => onSelectFolder(folder.id)}
          >
            📁 {folder.name}
          </button>
        </div>
        {isExpanded && children.map(child => renderFolder(child, currentLevel + 1))}
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
      {rootFolders.map(folder => renderFolder(folder, 1))}
    </div>
  );
}

// Grid view component
function GridView({ 
  folders, 
  tests, 
  onFolderOpen, 
  onFolderDelete,
  onFolderRename,
  onTestOpen, 
  onTestDelete,
  onTestRename,
  onTestMove,
  onTestCorrect,
  onTestDetails
}: { 
  folders: Folder[]; 
  tests: Test[];
  onFolderOpen: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
  onFolderRename: (folder: Folder) => void;
  onTestOpen: (test: Test) => void;
  onTestDelete: (testId: string) => void;
  onTestRename: (test: Test) => void;
  onTestMove: (test: Test) => void;
  onTestCorrect: (test: Test) => void;
  onTestDetails: (test: Test) => void;
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
            <button onClick={() => onFolderRename(folder)} className="btn-icon" title="Rename">✏️</button>
            <button onClick={() => onFolderDelete(folder.id)} className="btn-icon" title="Delete">🗑️</button>
          </div>
        </div>
      ))}
      
      {tests.map(test => (
        <div key={test.id} className="test-card" onDoubleClick={() => onTestOpen(test)}>
          <div className="test-card-content">
            <span className="test-icon">📄</span>
            <span className="test-name">{test.name}</span>
            {test.rawScore !== null && (
              <span className="test-score">{test.rawScore}/{test.numQuestions}</span>
            )}
          </div>
          <div className="test-actions">
            <button onClick={() => onTestRename(test)} className="btn-icon" title="Rename">✏️</button>
            <button onClick={() => onTestMove(test)} className="btn-icon" title="Move">📁</button>
            <button onClick={() => onTestCorrect(test)} className="btn-icon" title="Correct">🤖</button>
            <button onClick={() => onTestDetails(test)} className="btn-icon" title="Details">👁️</button>
            <button onClick={() => onTestDelete(test.id)} className="btn-icon" title="Delete">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// List view component
function ListView({ 
  folders, 
  tests, 
  onFolderOpen, 
  onFolderDelete,
  onFolderRename,
  onTestOpen, 
  onTestDelete,
  onTestRename,
  onTestMove,
  onTestCorrect,
  onTestDetails
}: { 
  folders: Folder[]; 
  tests: Test[];
  onFolderOpen: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
  onFolderRename: (folder: Folder) => void;
  onTestOpen: (test: Test) => void;
  onTestDelete: (testId: string) => void;
  onTestRename: (test: Test) => void;
  onTestMove: (test: Test) => void;
  onTestCorrect: (test: Test) => void;
  onTestDetails: (test: Test) => void;
}) {
  return (
    <div className="explorer-list">
      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Created</th>
            <th>Score</th>
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
              <td>
                <button onClick={() => onFolderRename(folder)} className="btn-icon">✏️</button>
                <button onClick={() => onFolderDelete(folder.id)} className="btn-icon">🗑️</button>
              </td>
            </tr>
          ))}
          {tests.map(test => (
            <tr key={test.id} onDoubleClick={() => onTestOpen(test)}>
              <td><span className="test-icon">📄</span> {test.name}</td>
              <td>Test</td>
              <td>{new Date(test.createdAt).toLocaleDateString()}</td>
              <td>{test.rawScore !== null ? `${test.rawScore}/${test.numQuestions}` : '—'}</td>
              <td>
                <button onClick={() => onTestRename(test)} className="btn-icon">✏️</button>
                <button onClick={() => onTestMove(test)} className="btn-icon">📁</button>
                <button onClick={() => onTestCorrect(test)} className="btn-icon">🤖</button>
                <button onClick={() => onTestDetails(test)} className="btn-icon">👁️</button>
                <button onClick={() => onTestDelete(test.id)} className="btn-icon">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Tests() {
  const data = useData();
  const { 
    folders, 
    tests, 
    viewSettings, 
    updateViewSettings,
    getFolderContents,
    getFolderPath,
    createFolder,
    deleteFolder,
    renameFolder,
    addTest,
    updateTest,
    deleteTest,
  } = data;

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewTest, setShowNewTest] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editFolder, setEditFolder] = useState<Folder | null>(null);
  const [takingTest, setTakingTest] = useState<Test | null>(null);
  const [correctingTest, setCorrectingTest] = useState<Test | null>(null);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const [renamingTest, setRenamingTest] = useState<Test | null>(null);
  const [movingTest, setMovingTest] = useState<Test | null>(null);

  const { folders: currentFolders, tests: currentTests } = getFolderContents(currentFolderId);
  const folderPath = getFolderPath(currentFolderId);

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

  const handleCreateFolder = (name: string, parentId: string | null) => {
    createFolder(name, parentId);
    setShowFolderModal(false);
    setEditFolder(null);
  };

  const toggleViewMode = () => {
    updateViewSettings({
      viewMode: viewSettings.viewMode === 'grid' ? 'list' : 'grid'
    });
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
        <h1 className="page-title">Test Explorer</h1>
        <div className="header-actions">
          <div className="view-toggle-group">
            <button 
              className={`view-toggle-btn ${viewSettings.viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => updateViewSettings({ viewMode: 'grid' })}
              title="Grid View"
            >
              ⊞
            </button>
            <button 
              className={`view-toggle-btn ${viewSettings.viewMode === 'list' ? 'active' : ''}`}
              onClick={() => updateViewSettings({ viewMode: 'list' })}
              title="List View"
            >
              ☰
            </button>
          </div>
          <button className="btn btn-outline" onClick={() => { setEditFolder(null); setShowFolderModal(true); }}>
            📁 New Folder
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>
            + Take Test
          </button>
        </div>
      </div>

      <div className="tests-layout">
        {/* Sidebar with folder tree */}
        <div className="tests-sidebar">
          <FolderTree 
            folders={folders}
            currentFolderId={currentFolderId}
            onSelectFolder={setCurrentFolderId}
          />
        </div>

        {/* Main content area */}
        <div className="tests-main">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <button 
              className={`breadcrumb-item ${currentFolderId === null ? 'active' : ''}`}
              onClick={() => setCurrentFolderId(null)}
            >
              Root
            </button>
            {folderPath.map(folder => (
              <span key={folder.id}>
                <span className="breadcrumb-separator">/</span>
                <button 
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="breadcrumb-item"
                >
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
                <button className="btn btn-outline" onClick={() => { setEditFolder(null); setShowFolderModal(true); }}>
                  Create Folder
                </button>
                <button className="btn btn-primary" onClick={() => setShowNewTest(true)}>
                  Take Test
                </button>
              </div>
            </div>
          ) : viewSettings.viewMode === 'grid' ? (
            <GridView
              folders={currentFolders}
              tests={currentTests}
              onFolderOpen={setCurrentFolderId}
              onFolderDelete={deleteFolder}
              onFolderRename={(folder) => { setEditFolder(folder); setShowFolderModal(true); }}
              onTestOpen={setTakingTest}
              onTestDelete={deleteTest}
              onTestRename={setRenamingTest}
              onTestMove={setMovingTest}
              onTestCorrect={setCorrectingTest}
              onTestDetails={setViewingTest}
            />
          ) : (
            <ListView
              folders={currentFolders}
              tests={currentTests}
              onFolderOpen={setCurrentFolderId}
              onFolderDelete={deleteFolder}
              onFolderRename={(folder) => { setEditFolder(folder); setShowFolderModal(true); }}
              onTestOpen={setTakingTest}
              onTestDelete={deleteTest}
              onTestRename={setRenamingTest}
              onTestMove={setMovingTest}
              onTestCorrect={setCorrectingTest}
              onTestDetails={setViewingTest}
            />
          )}
        </div>
      </div>

      {/* Modals */}
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
          onSave={handleCreateFolder}
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
    </div>
  );
}