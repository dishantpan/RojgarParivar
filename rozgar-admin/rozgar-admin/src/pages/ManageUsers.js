import React, { useState } from 'react';
import { WORKERS, HIRERS } from '../data';

export default function ManageUsers() {
  const [tab, setTab]         = useState('workers');
  const [search, setSearch]   = useState('');
  const [workers, setWorkers] = useState(WORKERS);
  const [hirers,  setHirers]  = useState(HIRERS);
  const [selected, setSelected] = useState(null);

  const filteredW = workers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.skill.toLowerCase().includes(search.toLowerCase()) || w.city.toLowerCase().includes(search.toLowerCase()));
  const filteredH = hirers.filter(h  => h.name.toLowerCase().includes(search.toLowerCase())  || h.city.toLowerCase().includes(search.toLowerCase()));

  const toggleWorkerStatus = id => setWorkers(ws => ws.map(w => w.id===id ? {...w, status: w.status==='active'?'suspended':'active'} : w));
  const toggleHirerStatus  = id => setHirers(hs  => hs.map(h  => h.id===id ? {...h, status: h.status==='active'?'suspended':'active'} : h));

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Manage Users</h1>
          <p>View, search and manage all workers and hirers</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {[['workers',`👷 Workers (${workers.length})`],['hirers',`🏢 Hirers (${hirers.length})`]].map(([v,l])=>(
          <button key={v} className={`filter-btn ${tab===v?'filter-btn--on':''}`} style={{fontSize:14,padding:'9px 20px'}} onClick={()=>{setTab(v);setSearch('')}}>{l}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{marginBottom:16}}>
        <div className="search-bar" style={{maxWidth:400}}>
          <span>🔍</span>
          <input placeholder={tab==='workers'?'Search by name, skill, city...':'Search by name, city...'} value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Workers Table */}
      {tab === 'workers' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Worker</th><th>Skill</th><th>City</th><th>Age</th><th>Rating</th><th>Jobs Done</th><th>Verified</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredW.map(w => (
                  <tr key={w.id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:'var(--orange-pale)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'var(--orange-light)',fontSize:14,flexShrink:0}}>{w.name[0]}</div>
                        <div>
                          <div style={{fontWeight:700,color:'var(--text)'}}>{w.name}</div>
                          <div style={{fontSize:11,color:'var(--text3)'}}>{w.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge--orange">{w.skill}</span></td>
                    <td>{w.city}</td>
                    <td>{w.age}</td>
                    <td><span style={{color:'var(--yellow)',fontWeight:700}}>⭐ {w.rating}</span></td>
                    <td><span style={{fontWeight:600}}>{w.jobs}</span></td>
                    <td>{w.verified ? <span className="badge badge--green">✓ Verified</span> : <span className="badge badge--yellow">Pending</span>}</td>
                    <td>{w.status==='active' ? <span className="badge badge--green">Active</span> : <span className="badge badge--red">Suspended</span>}</td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn--ghost" style={{padding:'6px 10px',fontSize:12}} onClick={()=>setSelected({...w,kind:'worker'})}>View</button>
                        <button className={`btn ${w.status==='active'?'btn--red':'btn--green'}`} style={{padding:'6px 10px',fontSize:12}} onClick={()=>toggleWorkerStatus(w.id)}>
                          {w.status==='active'?'Suspend':'Restore'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredW.length===0 && <div className="empty-state"><div className="es-icon">👷</div><p>No workers found</p></div>}
          </div>
        </div>
      )}

      {/* Hirers Table */}
      {tab === 'hirers' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Hirer</th><th>Type</th><th>City</th><th>Jobs Posted</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredH.map(h => (
                  <tr key={h.id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:'var(--blue-pale)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'var(--blue)',fontSize:14,flexShrink:0}}>{h.name[0]}</div>
                        <div>
                          <div style={{fontWeight:700,color:'var(--text)'}}>{h.name}</div>
                          <div style={{fontSize:11,color:'var(--text3)'}}>{h.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${h.type==='Business'?'badge--purple':'badge--blue'}`}>{h.type}</span></td>
                    <td>{h.city}</td>
                    <td><span style={{fontWeight:600}}>{h.jobs}</span></td>
                    <td style={{fontSize:12}}>{h.joined}</td>
                    <td>{h.status==='active' ? <span className="badge badge--green">Active</span> : <span className="badge badge--red">Suspended</span>}</td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn--ghost" style={{padding:'6px 10px',fontSize:12}} onClick={()=>setSelected({...h,kind:'hirer'})}>View</button>
                        <button className={`btn ${h.status==='active'?'btn--red':'btn--green'}`} style={{padding:'6px 10px',fontSize:12}} onClick={()=>toggleHirerStatus(h.id)}>
                          {h.status==='active'?'Suspend':'Restore'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredH.length===0 && <div className="empty-state"><div className="es-icon">🏢</div><p>No hirers found</p></div>}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal anim-scaleIn">
            <h3>{selected.kind==='worker'?'👷':'🏢'} {selected.name}</h3>
            <p>Full profile details</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {Object.entries(selected).filter(([k])=>!['id','kind'].includes(k)).map(([k,v])=>(
                <div key={k} style={{background:'var(--bg3)',borderRadius:'var(--r-sm)',padding:'10px'}}>
                  <div style={{fontSize:10,color:'var(--text3)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:3}}>{k}</div>
                  <div style={{fontSize:13,color:'var(--text)',fontWeight:600}}>{String(v)}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={()=>setSelected(null)}>Close</button>
              <button className="btn btn--red" onClick={()=>{ alert('User deleted.'); setSelected(null); }}>🗑 Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
