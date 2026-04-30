import { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Folder } from '../types';
import './MoveTestModal.css';

interface MoveTestModalProps {
  testId: string;
  currentFolderId: string | null;
  onClose: () => void;
  onMoved: () => void;
}

export default function MoveTestModal({ testId, currentFolderId, onClose, onMoved }: MoveTestModalProps) {
  const { folders, moveTest } = useData();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Build folder tree
  const buildFolderTree = (parentId: string | null = null, level = 0): (Folder & { level: number })[] => {
    const result: (Folder & { level: number })[] = [];
    const children = folders.filter(f => f.parentId === parentId);
    
    children.forEach(child => {
      result.push({ ...child, level });
      result.push(...buildFolderTree(child.id, level + 1));
    });
    
    return result;
  };

  const folderTree = buildFolderTree();
  
  // Filter folders by search
  const filteredFolders = searchTerm
    ? folderTree.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : folderTree;

  const handleSubmit = () => {
    if (selectedFolderId !== currentFolderId) {
      moveTest(testId, selectedFolderId);
    }
    onMoved();
    onClose();
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal move-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Move Test</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="folder-tree">
            {/* Root option */}
            <div 
              className={`folder-item ${selectedFolderId === null ? 'selected' : ''}`}
              onClick={() => setSelectedFolderId(null)}
            >
              <span className="folder-icon">📁</span>
              <span className="folder-name">Root Directory</span>
            </div>

            {/* Folder tree */}
            {filteredFolders.map(folder => (
              <div
                key={folder.id}
                className={`folder-item ${selectedFolderId === folder.id ? 'selected' : ''}`}
                style={{ paddingLeft: `${folder.level * 20 + 20}px` }}
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <button 
                  className="folder-expand"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder.id);
                  }}
                >
                  {expandedFolders.has(folder.id) ? '▼' : '▶'}
                </button>
                <span className="folder-icon">📁</span>
                <span className="folder-name">{folder.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
}