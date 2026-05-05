import React, { useState } from 'react';
import { REPORTS } from '../data';

const priorityBadge = p => ({ high: 'badge--red', medium: 'badge--yellow', low: 'badge--blue' }[p]);
const statusBadge   = s => ({ pending: 'badge--yellow', resolved: 'badge--green', action: 'badge--orange' }[s]);

export default function Reports() {
  const [reports, setReports] = useState(REPORTS);
  const [filter, setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [action, setAction]   = useState('');

  const filtered = reports.filter(r => filter==='all' || r.status===filter);
  const counts = { pending: reports.filter(r=>r.status==='pending').length, resolved: reports.filter(r=>r.status==='resolved').length, action: reports.filter(r=>r.status==='action').length };

  const resolve = (id, newStatus) => {
    setReports(rs => rs.map(r => r.id===id ? {...r, status: newStatus} : r));
    setSelected(null);
    alert(newStatus==='resolved' ? '✅ Report marked as resolved.' : '⚠️ Action taken and user warned.');
  };

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports & Complaints</h1>
          <p>Handle disputes between workers and hirers</p>
        </div>
      </div>

      {/* Priority notice */}
      {counts.pending > 0 && (
        <div style={{background:'var(--red-pale)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'var(--r)',padding:'14px 18px',marginBottom:20,display:'flex',gap:12,alignItems:'center'}}>
          <span style={{fontSize:20}}>🚨</span>
          <div>
            <strong style={{color:'var(--red)'}}>Action Required:</strong>
            <span style={{color:'var(--text2)',fontSize:13,marginLeft:8}}>{counts.pending} reports are pending and need your attention today.</span>
          </div>
        </div>
      )}

      <div className="filters" style={{marginBottom:20}}>
        {[['all',`All (${reports.length})`],['pending',`⏳ Pending (${counts.pending})`],['action',`⚠️ Action Taken (${counts.action})`],['resolved',`✅ Resolved (${counts.resolved})`]].map(([v,l])=>(
          <button key={v} className={`filter-btn ${filter===v?'filter-btn--on':''}`} onClick={()=>setFilter(v)}>{l}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Reported By</th><th>Against</th><th>Category</th><th>Reason</th><th>Priority</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{fontSize:12}}>{r.reportedBy}</td>
                  <td style={{fontSize:12}}>{r.reportedAgainst}</td>
                  <td><span className="badge badge--purple">{r.category}</span></td>
                  <td style={{maxWidth:180,fontSize:12,color:'var(--text2)'}}>{r.reason}</td>
                  <td><span className={`badge ${priorityBadge(r.priority)}`}>{r.priority.toUpperCase()}</span></td>
                  <td style={{fontSize:12}}>{r.date}</td>
                  <td>
                    {r.status==='pending'  && <span className="badge badge--yellow">⏳ Pending</span>}
                    {r.status==='resolved' && <span className="badge badge--green">✅ Resolved</span>}
                    {r.status==='action'   && <span className="badge badge--orange">⚠️ Action Taken</span>}
                  </td>
                  <td>
                    <button className="btn btn--ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>setSelected(r)}>Handle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="empty-state"><div className="es-icon">🚨</div><p>No reports in this category</p></div>}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal anim-scaleIn">
            <h3>🚨 Handle Report</h3>
            <div style={{background:'var(--bg3)',borderRadius:'var(--r)',padding:'16px',marginBottom:16}}>
              <div style={{fontSize:12,color:'var(--text3)',marginBottom:8}}>REPORT DETAILS</div>
              <div style={{display:'grid',gap:8}}>
                <div><strong style={{color:'var(--text2)',fontSize:12}}>Reported By:</strong> <span style={{color:'var(--text)',fontSize:13}}>{selected.reportedBy}</span></div>
                <div><strong style={{color:'var(--text2)',fontSize:12}}>Against:</strong> <span style={{color:'var(--text)',fontSize:13}}>{selected.reportedAgainst}</span></div>
                <div><strong style={{color:'var(--text2)',fontSize:12}}>Category:</strong> <span className={`badge ${priorityBadge(selected.priority)}`}>{selected.category}</span></div>
                <div><strong style={{color:'var(--text2)',fontSize:12}}>Reason:</strong> <span style={{color:'var(--text)',fontSize:13,lineHeight:1.6}}>{selected.reason}</span></div>
                <div><strong style={{color:'var(--text2)',fontSize:12}}>Priority:</strong> <span className={`badge ${priorityBadge(selected.priority)}`}>{selected.priority.toUpperCase()}</span></div>
              </div>
            </div>

            <div style={{background:'var(--yellow-pale)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'var(--r-sm)',padding:'12px',marginBottom:16,fontSize:13,color:'var(--yellow)'}}>
              💡 <strong>Admin Action:</strong> Call both parties to verify facts before taking action.
            </div>

            <div className="rc-field">
              <label>Admin Notes (Optional)</label>
              <textarea className="input" rows={3} placeholder="Your notes after calling both parties..." value={action} onChange={e=>setAction(e.target.value)} style={{resize:'vertical'}} />
            </div>

            {selected.status === 'pending' && (
              <div className="modal-actions" style={{justifyContent:'flex-start',flexWrap:'wrap'}}>
                <button className="btn btn--ghost" onClick={()=>setSelected(null)}>Cancel</button>
                <button className="btn btn--blue"  onClick={()=>resolve(selected.id,'action')}>⚠️ Warn User</button>
                <button className="btn btn--red"   onClick={()=>{ alert('User suspended.'); setSelected(null); }}>🚫 Suspend User</button>
                <button className="btn btn--green" onClick={()=>resolve(selected.id,'resolved')}>✅ Mark Resolved</button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <div className="modal-actions">
                <button className="btn btn--ghost" onClick={()=>setSelected(null)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
