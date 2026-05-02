import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Log In</h2>
        <p className="modal-subtitle">Enter your email to save and access your brackets.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          {error && <p className="modal-error">{error}</p>}
          <button className="btn btn-gold modal-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
