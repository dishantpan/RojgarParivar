import React, { useState } from 'react';
import { SKILLS } from '../data';

export default function SkillCategories() {
  const [skills, setSkills]     = useState(SKILLS);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ nameEn:'', nameHi:'' });
  const [editId, setEditId]     = useState(null);
  const [editName, setEditName] = useState('');

  const filtered = skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const toggleActive = id => setSkills(ss => ss.map(s => s.id===id ? {...s, active:!s.active} : s));
  const deleteSkill  = id => { if (window.confirm('Delete this skill?')) setSkills(ss => ss.filter(s => s.id!==id)); };

  const addSkill = () => {
    if (!newSkill.nameEn) { alert('Please enter English skill name'); return; }
    const fullName = newSkill.nameHi ? `${newSkill.nameEn} / ${newSkill.nameHi}` : newSkill.nameEn;
    const id = `S${String(skills.length+1).padStart(3,'0')}`;
    setSkills(ss => [...ss, { id, name: fullName, workers: 0, active: true }]);
    setNewSkill({ nameEn:'', nameHi:'' });
    setShowForm(false);
    alert(`✅ Skill "${fullName}" added! It will appear in worker signup.`);
  };

  const saveEdit = id => {
    setSkills(ss => ss.map(s => s.id===id ? {...s, name: editName} : s));
    setEditId(null);
  };

  const activeCount   = skills.filter(s=>s.active).length;
  const inactiveCount = skills.filter(s=>!s.active).length;

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Skill Categories</h1>
          <p>Manage skills available in the platform. Changes appear in worker signup form.</p>
        </div>
        <button className="btn btn--primary" onClick={()=>setShowForm(true)}>+ Add Skill</button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {[['Total Skills',skills.length,'var(--blue)'],['Active',activeCount,'var(--green)'],['Inactive',inactiveCount,'var(--red)']].map(([l,v,c])=>(
          <div key={l} className="card" style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:32,fontWeight:800,color:c,marginBottom:4}}>{v}</div>
            <div style={{fontSize:13,color:'var(--text2)'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card anim-scaleIn" style={{marginBottom:20,border:'1px solid var(--orange)'}}>
          <h3 style={{marginBottom:4,fontSize:16}}>+ Add New Skill</h3>
          <p style={{fontSize:12,color:'var(--text3)',marginBottom:16}}>New skill will appear in worker signup immediately after adding</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div className="rc-field">
              <label>Skill Name (English) *</label>
              <input className="input" placeholder="E.g. Crane Operator" value={newSkill.nameEn} onChange={e=>setNewSkill(n=>({...n,nameEn:e.target.value}))} />
            </div>
            <div className="rc-field">
              <label>Skill Name (Hindi)</label>
              <input className="input" placeholder="E.g. क्रेन ऑपरेटर" value={newSkill.nameHi} onChange={e=>setNewSkill(n=>({...n,nameHi:e.target.value}))} />
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button className="btn btn--ghost" onClick={()=>setShowForm(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={addSkill}>+ Add Skill</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{marginBottom:16}}>
        <div className="search-bar" style={{maxWidth:360}}>
          <span>🔍</span>
          <input placeholder="Search skills..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Skills Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Skill Name</th><th>Workers Using</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td style={{color:'var(--text3)',fontSize:12}}>{i+1}</td>
                  <td>
                    {editId === s.id ? (
                      <input className="input" value={editName} onChange={e=>setEditName(e.target.value)} style={{maxWidth:280}} autoFocus onKeyDown={e=>e.key==='Enter'&&saveEdit(s.id)} />
                    ) : (
                      <span style={{fontWeight:600,color:'var(--text)'}}>{s.name}</span>
                    )}
                  </td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:80,height:5,background:'var(--bg3)',borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',background:'var(--orange)',borderRadius:3,width:`${Math.min(s.workers/6200*100,100)}%`}}></div>
                      </div>
                      <span style={{fontSize:12,fontWeight:600}}>{s.workers.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <button onClick={()=>toggleActive(s.id)} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                      {s.active ? <span className="badge badge--green">● Active</span> : <span className="badge badge--red">● Inactive</span>}
                    </button>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      {editId===s.id ? (
                        <>
                          <button className="btn btn--green" style={{padding:'5px 10px',fontSize:12}} onClick={()=>saveEdit(s.id)}>Save</button>
                          <button className="btn btn--ghost" style={{padding:'5px 10px',fontSize:12}} onClick={()=>setEditId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn--ghost" style={{padding:'5px 10px',fontSize:12}} onClick={()=>{setEditId(s.id);setEditName(s.name);}}>✏️ Edit</button>
                          <button className="btn btn--red"   style={{padding:'5px 10px',fontSize:12}} onClick={()=>deleteSkill(s.id)}>🗑</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="empty-state"><div className="es-icon">🔧</div><p>No skills found</p></div>}
        </div>
      </div>
    </div>
  );
}
