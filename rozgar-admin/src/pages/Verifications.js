import React, { useState } from 'react';
import { PENDING_BUSINESSES } from '../data';

export default function Verifications() {
  const [businesses, setBusinesses] = useState(PENDING_BUSINESSES);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = businesses.filter(b => filter === 'all' ? true : b.status === filter);

  const approve = (id) => {
    setBusinesses(bs => bs.map(b => b.id === id ? {...b, status:'approved'} : b));
    setSelected(null);
    alert('✅ Business approved! Email & SMS notification sent.');
  };

  const reject = () => {
    if (!rejectReason.trim()) { alert('Please enter rejection reason'); return; }
    setBusinesses(bs => bs.map(b => b.id === rejectModal.id ? {...b, status:'rejected'} : b));
    setRejectModal(null); setRejectReason(''); setSelected(null);
    alert('❌ Business rejected. Email sent with reason.');
  };

  const counts = { pending: businesses.filter(b=>b.status==='pending').length, approved: businesses.filter(b=>b.status==='approved').length, rejected: businesses.filter(b=>b.status==='rejected').length };

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Business Verifications</h1>
          <p>Review and approve business / factory accounts</p>
        </div>
      </div>

      <div className="filters" style={{marginBottom:20}}>
        {[['all','All',businesses.length],['pending','⏳ Pending',counts.pending],['approved','✅ Approved',counts.approved],['rejected','❌ Rejected',counts.rejected]].map(([v,l,c]) => (
          <button key={v} className={`filter-btn ${filter===v?'filter-btn--on':''}`} onClick={()=>setFilter(v)}>
            {l} <span style={{marginLeft:4,opacity:0.7}}>({c})</span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th><th>Type</th><th>Owner</th><th>City</th>
                <th>GST</th><th>License</th><th>Applied</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{fontWeight:700,color:'var(--text)'}}>{b.company}</div>
                    <div style={{fontSize:11,color:'var(--text3)'}}>{b.yearsOld} yrs old · {b.email}</div>
                  </td>
                  <td><span className="badge badge--blue">{b.type}</span></td>
                  <td>{b.owner}</td>
                  <td>{b.city}</td>
                  <td><code style={{fontSize:11,color:'var(--orange-light)',background:'var(--bg3)',padding:'2px 6px',borderRadius:4}}>{b.gst}</code></td>
                  <td>{b.license ? <span className="badge badge--green">✓ Uploaded</span> : <span className="badge badge--red">✗ Missing</span>}</td>
                  <td style={{fontSize:12}}>{b.appliedDate}</td>
                  <td>
                    {b.status === 'pending'  && <span className="badge badge--yellow">⏳ Pending</span>}
                    {b.status === 'approved' && <span className="badge badge--green">✅ Approved</span>}
                    {b.status === 'rejected' && <span className="badge badge--red">❌ Rejected</span>}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn--ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>setSelected(b)}>View</button>
                      {b.status === 'pending' && <>
                        <button className="btn btn--green" style={{padding:'6px 12px',fontSize:12}} onClick={()=>approve(b.id)}>✓</button>
                        <button className="btn btn--red"   style={{padding:'6px 12px',fontSize:12}} onClick={()=>setRejectModal(b)}>✗</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><div className="es-icon">✅</div><p>No businesses in this category</p></div>}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal anim-scaleIn">
            <h3>🏢 {selected.company}</h3>
            <p>Full verification details for this business account</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
              {[['Company',selected.company],['Type',selected.type],['Owner',selected.owner],['City',selected.city],['Mobile',selected.mobile],['Email',selected.email],['GST',selected.gst],['Business Age',`${selected.yearsOld} years`],['Applied On',selected.appliedDate],['License',selected.license?'Uploaded':'Not uploaded']].map(([k,v])=>(
                <div key={k} style={{background:'var(--bg3)',borderRadius:'var(--r-sm)',padding:'12px'}}>
                  <div style={{fontSize:10,color:'var(--text3)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{k}</div>
                  <div style={{fontSize:13,color:'var(--text)',fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={()=>setSelected(null)}>Close</button>
              {selected.status==='pending' && <>
                <button className="btn btn--red"   onClick={()=>{setRejectModal(selected);setSelected(null)}}>❌ Reject</button>
                <button className="btn btn--green" onClick={()=>approve(selected.id)}>✅ Approve</button>
              </>}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setRejectModal(null)}>
          <div className="modal anim-scaleIn">
            <h3>❌ Reject Business Account</h3>
            <p>Rejecting: <strong>{rejectModal.company}</strong>. The owner will receive an email with your reason.</p>
            <div className="rc-field">
              <label>Rejection Reason *</label>
              <textarea className="input" rows={4} placeholder="E.g. GST number is invalid, please reapply with correct documents..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{resize:'vertical'}} />
            </div>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={()=>setRejectModal(null)}>Cancel</button>
              <button className="btn btn--red" onClick={reject}>Send Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
