import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import { STATS } from '../data';

const NAV = [
  { path:'/dashboard',     icon:'📊', label:'Dashboard' },
  { path:'/verifications', icon:'✅', label:'Verifications', badge: STATS.pendingVerifications },
  { path:'/users',         icon:'👥', label:'Users' },
  { path:'/jobs',          icon:'📋', label:'Job Postings' },
  { path:'/reports',       icon:'🚨', label:'Reports', badge: STATS.pendingReports },
  { path:'/announcements', icon:'📢', label:'Announcements' },
  { path:'/skills',        icon:'🔧', label:'Skill Categories' },
  { path:'/cities',        icon:'🗺️', label:'City Activity' },
];

export default function Layout({ children, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = NAV.find(n => location.pathname === n.path);

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span>RozgarConnect</span>
              <span>Admin Portal</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button key={n.path}
              className={`sidebar-item ${location.pathname === n.path ? 'sidebar-item--on' : ''}`}
              onClick={() => { navigate(n.path); setMobileOpen(false); }}
              title={collapsed ? n.label : ''}>
              <span className="sidebar-item-icon">{n.icon}</span>
              {!collapsed && <span className="sidebar-item-label">{n.label}</span>}
              {n.badge && !collapsed && <span className="sidebar-badge">{n.badge}</span>}
              {n.badge && collapsed && <span className="sidebar-badge-dot"></span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="sidebar-admin-info">
              <div className="sidebar-avatar">A</div>
              <div>
                <span className="sidebar-admin-name">Admin</span>
                <span className="sidebar-admin-email">admin@rozgarconnect.in</span>
              </div>
            </div>
          )}
          <button className="sidebar-logout" onClick={onLogout} title="Logout">
            🚪 {!collapsed && 'Logout'}
          </button>
        </div>

        <button className="sidebar-collapse" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '→' : '←'}
        </button>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && <div className="layout-overlay" onClick={() => setMobileOpen(false)} />}

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="topbar-menu" onClick={() => setMobileOpen(o => !o)}>☰</button>
            <div>
              <h2 className="topbar-title">{current?.label || 'Admin Portal'}</h2>
              <p className="topbar-date">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-alert">
              <span>🔔</span>
              <span className="topbar-alert-dot"></span>
            </div>
            <div className="topbar-user">
              <div className="topbar-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
