interface DeleteModalProps {
  itemName: string;
  itemType: 'test' | 'folder';
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({ itemName, itemType, onConfirm, onClose }: DeleteModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete {itemType === 'folder' ? 'Folder' : 'Test'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '0 0 16px' }}>
          <p style={{ marginBottom: 8 }}>
            Are you sure you want to delete <strong>"{itemName}"</strong>?
          </p>
          {itemType === 'folder' && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              All sub-folders will also be deleted. Tests inside will be moved to the root.
            </p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn"
            style={{ background: 'var(--error, #dc2626)', color: '#fff', border: 'none' }}
            onClick={() => { onConfirm(); onClose(); }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}