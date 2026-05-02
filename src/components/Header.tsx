import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './Auth/LoginModal';
import { MyBracketsPanel } from './Brackets/MyBracketsPanel';

export function Header() {
  const { state, isViewOnly, goToShare, resetApp } = useApp();
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showBrackets, setShowBrackets] = useState(false);

  const handleShare = () => {
    goToShare();
  };

  const canShare = state.step !== 'intro';
  const showShare = !isViewOnly && canShare && state.step !== 'share';

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo" onClick={!isViewOnly ? resetApp : undefined} style={{ cursor: isViewOnly ? 'default' : 'pointer' }}>
            <div className="header-badge">
              <span className="header-trophy">⚽</span>
            </div>
            <div className="header-title-group">
              <div className="header-subtitle">FIFA WORLD CUP</div>
              <div className="header-title">2026 Bracket Predictor</div>
            </div>
          </div>
          <div className="header-right">
            {state.bracketName && (
              <div className="bracket-name-badge">{state.bracketName}</div>
            )}
            {showShare && (
              <button className="btn btn-gold btn-sm" onClick={handleShare}>
                Share Bracket
              </button>
            )}
            {isViewOnly && (
              <button className="btn btn-outline btn-sm" onClick={resetApp}>
                Create My Own
              </button>
            )}
            {user ? (
              <div className="header-auth">
                <button className="btn btn-outline btn-sm" onClick={() => setShowBrackets(true)}>
                  My Brackets
                </button>
                <span className="header-email">{user.email}</span>
                <button className="btn btn-outline btn-sm" onClick={logout}>
                  Log Out
                </button>
              </div>
            ) : (
              <button className="btn btn-outline btn-sm" onClick={() => setShowLogin(true)}>
                Log In
              </button>
            )}
          </div>
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showBrackets && <MyBracketsPanel onClose={() => setShowBrackets(false)} />}
    </>
  );
}
