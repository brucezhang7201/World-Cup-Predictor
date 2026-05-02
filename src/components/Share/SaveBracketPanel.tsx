import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function SaveBracketPanel() {
  const { state } = useApp();
  const { user } = useAuth();
  const [name, setName] = useState(state.bracketName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ shareToken: string } | null>(null);
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/brackets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim(), stateJson: state }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }
      const data = await res.json();
      setSaved(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const shareUrl = saved ? `${window.location.origin}/?share=${saved.shareToken}` : '';

  return (
    <div className="save-bracket-panel">
      <h3>Save Bracket</h3>
      {saved ? (
        <div className="save-success">
          Bracket saved! Share link: <a href={shareUrl}>{shareUrl}</a>
        </div>
      ) : (
        <form className="save-form" onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Bracket name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button className="btn btn-gold btn-sm" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}
      {error && <p className="modal-error">{error}</p>}
    </div>
  );
}
