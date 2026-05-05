import React, { useState } from 'react';
import { JOB_POSTS } from '../data';

export default function JobPostings() {
  const [jobs, setJobs]     = useState(JOB_POSTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = jobs
    .filter(j => filter==='all' || j.status===filter)
    .filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.postedBy.toLowerCase().includes(search.toLowerCase()) || j.city.toLowerCase().includes(search.toLowerCase()));

  const removeJob = id => { setJobs(js=>js.filter(j=>j.id!==id)); setSelected(null); alert('Job post removed from platform.'); };

  const counts = { open: jobs.filter(j=>j.status==='open').length, filled: jobs.filter(j=>j.status==='filled').length, closed: jobs.filter(j=>j.status==='closed').length };

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Job Postings</h1>
          <p>Monitor and moderate all active job listings</p>
        </div>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <div className="filters">
          {[['all',`All (${jobs.length})`],['open',`🟢 Open (${counts.open})`],['filled',`✅ Filled (${counts.filled})`],['closed',`⬛ Closed (${counts.closed})`]].map(([v,l])=>(
            <button key={v} className={`filter-btn ${filter===v?'filter-btn--on':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>
        <div className="search-bar" style={{maxWidth:300}}>
          <span>🔍</span>
          <input placeholder="Search jobs..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Job Title</th><th>Posted By</th><th>Type</th><th>City</th><th>Skill</th><th>Salary</th><th>Days</th><th>Applied</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(j => (
                <tr key={j.id}>
                  <td style={{maxWidth:200}}>
                    <div style={{fontWeight:700,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{j.title}</div>
                    <div style={{fontSize:11,color:'var(--text3)'}}>{j.date}</div>
                  </td>
                  <td>{j.postedBy}</td>
                  <td><span className={`badge ${j.type==='Business'?'badge--purple':'badge--blue'}`}>{j.type}</span></td>
                  <td>{j.city}</td>
                  <td><span className="badge badge--orange">{j.skill}</span></td>
                  <td style={{fontWeight:600,color:'var(--green)',fontSize:12}}>{j.salary}</td>
                  <td>{j.days}d</td>
                  <td><span style={{fontWeight:700,color:'var(--blue)'}}>{j.applied}</span></td>
                  <td>
                    {j.status==='open'   && <span className="badge badge--green">🟢 Open</span>}
                    {j.status==='filled' && <span className="badge badge--blue">✅ Filled</span>}
                    {j.status==='closed' && <span className="badge" style={{background:'var(--bg3)',color:'var(--text3)'}}>Closed</span>}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn--ghost" style={{padding:'6px 10px',fontSize:12}} onClick={()=>setSelected(j)}>View</button>
                      <button className="btn btn--red"   style={{padding:'6px 10px',fontSize:12}} onClick={()=>removeJob(j.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="empty-state"><div className="es-icon">📋</div><p>No job posts found</p></div>}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal anim-scaleIn">
            <h3>📋 Job Post Details</h3>
            <p>{selected.title}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[['Posted By',selected.postedBy],['Type',selected.type],['City',selected.city],['Skill Required',selected.skill],['Salary',selected.salary],['Duration',`${selected.days} days`],['Applications',selected.applied],['Status',selected.status],['Posted On',selected.date]].map(([k,v])=>(
                <div key={k} style={{background:'var(--bg3)',borderRadius:'var(--r-sm)',padding:'10px'}}>
                  <div style={{fontSize:10,color:'var(--text3)',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:3}}>{k}</div>
                  <div style={{fontSize:13,color:'var(--text)',fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={()=>setSelected(null)}>Close</button>
              <button className="btn btn--red" onClick={()=>removeJob(selected.id)}>🗑 Remove Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
