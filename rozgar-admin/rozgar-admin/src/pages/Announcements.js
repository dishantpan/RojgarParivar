import React, { useState } from 'react';
import { ANNOUNCEMENTS_SENT } from '../data';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_SENT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', message:'', sentTo:'Everyone' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const send = () => {
    if (!form.title || !form.message) { alert('Please fill title and message'); return; }
    const newA = { id:`A00${announcements.length+1}`, ...form, date: new Date().toISOString().split('T')[0], status:'sent' };
    setAnnouncements(a => [newA, ...a]);
    setForm({ title:'', message:'', sentTo:'Everyone' });
    setShowForm(false);
    alert(`📢 Announcement sent to ${form.sentTo}!`);
  };

  const targetColors = { Everyone:'badge--orange', Workers:'badge--blue', Hirers:'badge--green', 'Business Owners':'badge--purple' };

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Announcements</h1>
          <p>Send notifications to workers, hirers or everyone</p>
        </div>
        <button className="btn btn--primary" onClick={()=>setShowForm(true)}>📢 New Announcement</button>
      </div>

      {/* Compose Form */}
      {showForm && (
        <div className="card anim-scaleIn" style={{marginBottom:24,border:'1px solid var(--orange)',borderRadius:'var(--r-lg)'}}>
          <h3 style={{marginBottom:4,fontSize:17}}>📢 Compose Announcement</h3>
          <p style={{fontSize:13,color:'var(--text3)',marginBottom:20}}>This will be sent as a push notification and in-app message</p>
          <div className="rc-field">
            <label>Title *</label>
            <input className="input" placeholder="E.g. Platform Maintenance on Dec 1" value={form.title} onChange={e=>set('title',e.target.value)} />
          </div>
          <div className="rc-field">
            <label>Message *</label>
            <textarea className="input" rows={4} placeholder="Write your announcement message here..." value={form.message} onChange={e=>set('message',e.target.value)} style={{resize:'vertical'}} />
          </div>
          <div className="rc-field">
            <label>Send To *</label>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {['Everyone','Workers','Hirers','Business Owners'].map(t => (
                <button key={t} className={`filter-btn ${form.sentTo===t?'filter-btn--on':''}`} onClick={()=>set('sentTo',t)}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button className="btn btn--ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={send}>📤 Send Now</button>
          </div>
        </div>
      )}

      {/* Sent Announcements */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {announcements.map(a => (
          <div key={a.id} className="card" style={{display:'flex',alignItems:'flex-start',gap:20}}>
            <div style={{width:48,height:48,background:'var(--orange-pale)',borderRadius:'var(--r)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>📢</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap'}}>
                <h3 style={{fontSize:15,fontWeight:700}}>{a.title}</h3>
                <span className={`badge ${targetColors[a.sentTo]||'badge--blue'}`}>→ {a.sentTo}</span>
                <span className="badge badge--green">✓ Sent</span>
              </div>
              <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.6,marginBottom:8}}>{a.message}</p>
              <span style={{fontSize:11,color:'var(--text3)'}}>Sent on {a.date}</span>
            </div>
          </div>
        ))}
        {announcements.length===0 && <div className="empty-state card"><div className="es-icon">📢</div><p>No announcements sent yet</p></div>}
      </div>
    </div>
  );
}
