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
  const { folders, moveTestToFolder } = useData();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // Start with all folders expanded
    return new Set(folders.map(f => f.id));
  });

  // Recursive function to get all folder paths
  const getAllFolders = (parentId: string | null = null, level: number = 0): (Folder & { level: number })[] => {
    const result: (Folder & { level: number })[] = [];
    const children = folders.filter(f => f.parentId === parentId);
    
    for (const child of children) {
      result.push({ ...child, level });
      result.push(...getAllFolders(child.id, level + 1));
    }
    
    return result;
  };

  const allFolders = getAllFolders();
  
  // Filter folders based on search
  const filteredFolders = searchTerm
    ? allFolders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFolders;

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleSubmit = () => {
    moveTestToFolder(testId, selectedFolderId);
    onMoved();
    onClose();
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
              <span className="folder-expand-spacer" />
              <span className="folder-icon">📂</span>
              <span className="folder-name">Root Directory</span>
            </div>

            {/* Render all folders in tree structure */}
            {filteredFolders.map(folder => {
              const children = folders.filter(f => f.parentId === folder.id);
              const isExpanded = expandedFolders.has(folder.id);
              const isSelected = selectedFolderId === folder.id;
              
              // Don't show if searching and folder doesn't match
              if (searchTerm && !folder.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return null;
              }
              
              return (
                <div key={folder.id}>
                  <div
                    className={`folder-item ${isSelected ? 'selected' : ''}`}
                    style={{ paddingLeft: `${folder.level * 20 + 20}px` }}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    {children.length > 0 ? (
                      <button
                        className="folder-expand"
                        onClick={e => toggleExpand(folder.id, e)}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    ) : (
                      <span className="folder-expand-spacer" />
                    )}
                    <span className="folder-icon">📁</span>
                    <span className="folder-name">{folder.name}</span>
                  </div>
                  {isExpanded && !searchTerm && children.map(child => {
                    return (
                      <div
                        key={child.id}
                        className={`folder-item ${selectedFolderId === child.id ? 'selected' : ''}`}
                        style={{ paddingLeft: `${(folder.level + 1) * 20 + 20}px` }}
                        onClick={() => setSelectedFolderId(child.id)}
                      >
                        <span className="folder-expand-spacer" />
                        <span className="folder-icon">📁</span>
                        <span className="folder-name">{child.name}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
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