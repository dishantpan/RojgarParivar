import React, { useState } from 'react';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { setError('Please enter email and password'); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@rozgarconnect.in' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid credentials. Use admin@rozgarconnect.in / admin123');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="al-root">
      <div className="al-bg">
        <div className="al-blob al-b1"></div>
        <div className="al-blob al-b2"></div>
        <div className="al-grid"></div>
      </div>
      <div className="al-box anim-scaleIn">
        <div className="al-logo">
          <div className="al-logo-icon">⚡</div>
          <div>
            <span className="al-logo-text">RozgarConnect</span>
            <span className="al-logo-sub">Admin Portal</span>
          </div>
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to manage the platform</p>

        <div className="al-hint">
          <span>🔑</span>
          <div>
            <strong>Demo credentials:</strong><br />
            Email: admin@rozgarconnect.in<br />
            Password: admin123
          </div>
        </div>

        <div className="rc-field">
          <label>Admin Email</label>
          <input className="input" type="email" placeholder="admin@rozgarconnect.in"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="rc-field">
          <label>Password</label>
          <input className="input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <div className="al-error">⚠️ {error}</div>}

        <button className="al-btn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="al-spinner"></span> : '→'} &nbsp;
          {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
        </button>

        <p className="al-footer">RozgarConnect Admin v1.0 · Secure Access Only</p>
      </div>
    </div>
  );
}
