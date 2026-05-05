import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';
import { workerLogin, hirerLogin, adminLogin } from '../api';

export default function AuthModal({ defaultTab = 'login', onClose }) {
  const [tab, setTab]         = useState(defaultTab);
  const [userType, setUserType] = useState('worker');
  const [method, setMethod]   = useState('phone');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp]         = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // Reset error when user switches anything
  useEffect(() => { setError(''); }, [tab, userType, method]);

  /* ── OTP input handling ── */
  const handleOtpChange = (idx, val) => {
    if (val.length > 1) val = val.slice(-1);
    if (val && !/^\d$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  /* ── SEND OTP (mock — always works) ── */
  const handleSendOtp = () => {
    setError('');
    if (method === 'phone' && phone.length >= 10) setOtpSent(true);
    if (method === 'email' && email.includes('@')) setOtpSent(true);
  };

  /* ── REAL LOGIN with backend ── */
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (userType === 'worker') {
        // Worker logs in with mobile + password
        await workerLogin(phone, password);
        onClose();
        navigate('/dashboard/worker');

      } else if (userType === 'regular' || userType === 'business') {
        // Hirer/Business logs in with email + password
        await hirerLogin(email, password);
        onClose();
        if (userType === 'regular') navigate('/dashboard/regular');
        else navigate('/dashboard/business');

      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /* ── ADMIN LOGIN ── */
  const handleAdminLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      onClose();
      window.location.href = 'http://localhost:3001';
    } catch (err) {
      setError('Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP VERIFY (for phone login — mock) ── */
  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      if (userType === 'worker') navigate('/dashboard/worker');
      else if (userType === 'regular') navigate('/dashboard/regular');
      else if (userType === 'business') navigate('/dashboard/business');
      onClose();
    }
  };

  /* ── SIGNUP NAVIGATE ── */
  const handleSignupNavigate = (type) => {
    onClose();
    if (type === 'worker') navigate('/signup/worker');
    else if (type === 'regular') navigate('/signup/hirer?type=regular');
    else navigate('/signup/hirer?type=business');
  };

  // Check if login button should be enabled
  const canLogin = () => {
    if (userType === 'worker') return phone.length >= 10 && password.length >= 6;
    return email.includes('@') && password.length >= 6;
  };

  return (
    <div className="am-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="am-modal">

        {/* Close */}
        <button className="am-close" onClick={onClose}>✕</button>

        {/* Logo */}
        <div className="am-logo">⚡ Rozgar<em style={{fontStyle:'normal',color:'#FF6B00'}}>Connect</em></div>

        {/* Trust strip */}
        <div className="am-info-strip">
          <span>✓ Free for Workers</span>
          <span>✓ No Middlemen</span>
          <span>✓ Verified</span>
        </div>

        {/* Tabs */}
        <div className="am-tabs">
          <button className={`am-tab ${tab==='login'?'am-tab--on':''}`} onClick={()=>{setTab('login');setOtpSent(false);setOtp(['','','','','','']);setError('');}}>
            Login
          </button>
          <button className={`am-tab ${tab==='signup'?'am-tab--on':''}`} onClick={()=>{setTab('signup');setError('');}}>
            Sign Up
          </button>
        </div>

        {/* ── LOGIN TAB ── */}
        {tab==='login' && (
          <div className="am-body">

            {/* Role Selector */}
            <div style={{display:'flex',gap:8,marginBottom:16,padding:4,background:'#F8F9FA',borderRadius:10}}>
              {[
                {key:'worker',  label:'👷 Worker',   color:'#FF6B00'},
                {key:'regular', label:'🏠 Regular',  color:'#138808'},
                {key:'business',label:'🏭 Business', color:'#0D1B2A'},
              ].map(btn => (
                <button key={btn.key} onClick={()=>setUserType(btn.key)} style={{
                  flex:1, padding:'8px 4px', borderRadius:8, border:'none',
                  background: userType===btn.key ? '#fff' : 'transparent',
                  color: userType===btn.key ? btn.color : '#778DA9',
                  fontWeight:600, cursor:'pointer', fontSize:12,
                  boxShadow: userType===btn.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition:'all 0.2s',
                }}>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* ── WORKER LOGIN — mobile + password ── */}
            {userType === 'worker' && (
              <>
                <p className="am-label" style={{marginBottom:8,fontWeight:700,fontSize:13,color:'#5A4E44'}}>
                  👷 Worker Login — Mobile + Password
                </p>
                <div className="am-fields">
                  <div style={{display:'flex',alignItems:'center',border:'2px solid #E8E2DA',borderRadius:10,overflow:'hidden',marginBottom:10}}>
                    <span style={{padding:'13px 12px',background:'#F8F9FA',fontWeight:700,color:'#9A8E84',borderRight:'2px solid #E8E2DA'}}>+91</span>
                    <input
                      type="tel" maxLength={10}
                      placeholder="Your registered mobile number"
                      value={phone}
                      onChange={e=>setPhone(e.target.value.replace(/\D/g,''))}
                      style={{flex:1,padding:'13px 16px',border:'none',outline:'none',fontSize:15,fontWeight:600,fontFamily:'inherit'}}
                    />
                  </div>
                  <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&canLogin()&&handleLogin()}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'2px solid #E8E2DA',fontSize:15,fontWeight:600,color:'#0D1B2A',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
                  />
                </div>
                {error && <div style={{background:'#FFF0F0',border:'1px solid #FFB3B3',borderRadius:8,padding:'10px 14px',marginTop:8,color:'#C00',fontSize:13,fontWeight:600}}>❌ {error}</div>}
                <button
                  className="am-submit-btn hp-btn-find"
                  onClick={handleLogin}
                  disabled={!canLogin() || loading}
                  style={{marginTop:14, opacity: (!canLogin()||loading) ? 0.6 : 1}}>
                  {loading ? '⏳ Logging in...' : '🚀 Login'}
                </button>
                <p style={{fontSize:12,color:'#9A8E84',textAlign:'center',marginTop:8}}>
                  Use the mobile number and password you registered with
                </p>
              </>
            )}

            {/* ── REGULAR / BUSINESS LOGIN — email + password ── */}
            {(userType === 'regular' || userType === 'business') && (
              <>
                <p className="am-label" style={{marginBottom:8,fontWeight:700,fontSize:13,color:'#5A4E44'}}>
                  {userType==='regular' ? '🏠 Regular Hirer Login' : '🏭 Business Login'} — Email + Password
                </p>

                {/* Admin shortcut */}
                {userType === 'business' && (
                  <div style={{background:'#FFF8F0',border:'1px solid #FFD9B3',borderRadius:8,padding:'8px 12px',marginBottom:10,fontSize:12,color:'#9A8E84'}}>
                    💡 Admin? Use <strong>admin@rozgarconnect.in</strong>
                  </div>
                )}

                <div className="am-fields">
                  <input
                    type="email"
                    placeholder="Your registered email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'2px solid #E8E2DA',fontSize:15,fontWeight:600,color:'#0D1B2A',outline:'none',fontFamily:'inherit',boxSizing:'border-box',marginBottom:10}}
                  />
                  <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    onKeyDown={e=>{
                      if (e.key==='Enter' && canLogin()) {
                        if (email==='admin@rozgarconnect.in') handleAdminLogin();
                        else handleLogin();
                      }
                    }}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'2px solid #E8E2DA',fontSize:15,fontWeight:600,color:'#0D1B2A',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
                  />
                </div>

                {error && <div style={{background:'#FFF0F0',border:'1px solid #FFB3B3',borderRadius:8,padding:'10px 14px',marginTop:8,color:'#C00',fontSize:13,fontWeight:600}}>❌ {error}</div>}

                <button
                  className="am-submit-btn hp-btn-find"
                  onClick={()=> email==='admin@rozgarconnect.in' ? handleAdminLogin() : handleLogin()}
                  disabled={!canLogin() || loading}
                  style={{marginTop:14, opacity:(!canLogin()||loading)?0.6:1}}>
                  {loading ? '⏳ Logging in...' : '🚀 Login'}
                </button>

                {userType==='business' && (
                  <p style={{fontSize:12,color:'#9A8E84',textAlign:'center',marginTop:8}}>
                    ⚠️ Business accounts must be admin-verified before login
                  </p>
                )}
              </>
            )}

            <div className="am-switch" style={{marginTop:16}}>
              Don't have an account?{' '}
              <button className="am-link am-link--bold" onClick={()=>{setTab('signup');setError('');}}>
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* ── SIGNUP TAB ── */}
        {tab==='signup' && (
          <div className="am-body">
            <p className="am-label">I want to join as:</p>
            <div className="am-signup-cards">
              <button className="am-signup-card" style={{'--sc':'#FF6B00'}} onClick={()=>handleSignupNavigate('worker')}>
                <span className="am-sc-icon">👷</span>
                <div className="am-sc-text">
                  <span className="am-sc-title">Daily Wage Worker · मजदूर</span>
                  <span className="am-sc-sub">Find work near you, build your profile, get verified</span>
                </div>
                <span className="am-sc-arrow">→</span>
              </button>
              <button className="am-signup-card" style={{'--sc':'#138808'}} onClick={()=>handleSignupNavigate('regular')}>
                <span className="am-sc-icon">🏠</span>
                <div className="am-sc-text">
                  <span className="am-sc-title">Home / Regular Hirer · सामान्य हायरर</span>
                  <span className="am-sc-sub">Post jobs for home repairs, events, or small tasks</span>
                </div>
                <span className="am-sc-arrow">→</span>
              </button>
              <button className="am-signup-card" style={{'--sc':'#0D1B2A'}} onClick={()=>handleSignupNavigate('business')}>
                <span className="am-sc-icon">🏭</span>
                <div className="am-sc-text">
                  <span className="am-sc-title">Factory / Business · बिज़नेस मालिक</span>
                  <span className="am-sc-sub">Hire in bulk, manage workforce, track attendance</span>
                </div>
                <span className="am-sc-arrow">→</span>
              </button>
            </div>
            <div className="am-switch">
              Already have an account?{' '}
              <button className="am-link am-link--bold" onClick={()=>{setTab('login');setError('');}}>
                Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}