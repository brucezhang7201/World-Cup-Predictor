import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface BracketSummary {
  id: string;
  name: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

interface MyBracketsPanelProps {
  onClose: () => void;
}

export function MyBracketsPanel({ onClose }: MyBracketsPanelProps) {
  const { loadBracket } = useApp();
  const [brackets, setBrackets] = useState<BracketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/brackets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setBrackets(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLoad = async (id: string) => {
    const res = await fetch(`/api/brackets/${id}`, { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    loadBracket(data.stateJson);
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bracket?')) return;
    const res = await fetch(`/api/brackets/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      setBrackets(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleCopyLink = async (shareToken: string) => {
    const url = `${window.location.origin}/?share=${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(shareToken);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">My Brackets</h2>
        {loading ? (
          <p className="bracket-list-empty">Loading...</p>
        ) : brackets.length === 0 ? (
          <p className="bracket-list-empty">No saved brackets yet.</p>
        ) : (
          brackets.map(b => (
            <div key={b.id} className="bracket-list-item">
              <div className="bracket-list-info">
                <div className="bracket-list-name">{b.name}</div>
                <div className="bracket-list-date">{new Date(b.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="bracket-list-actions">
                <button className="btn btn-gold btn-sm" onClick={() => handleLoad(b.id)}>Load</button>
                <button className="btn btn-outline btn-sm" onClick={() => handleCopyLink(b.shareToken)}>
                  {copied === b.shareToken ? 'Copied!' : 'Copy Link'}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleDelete(b.id)} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
