import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { STATS } from '../data';

const CITY_DETAIL = [
  { city:'Surat',     workers:8420, hirers:1200, jobs:12400, completed:9800,  growth:18, topSkill:'Mason',       state:'Gujarat'     },
  { city:'Ahmedabad', workers:7230, hirers:980,  jobs:10800, completed:8600,  growth:14, topSkill:'Helper',      state:'Gujarat'     },
  { city:'Mumbai',    workers:6900, hirers:1100, jobs:9800,  completed:7200,  growth:10, topSkill:'Electrician', state:'Maharashtra' },
  { city:'Delhi',     workers:5400, hirers:820,  jobs:8200,  completed:6400,  growth:12, topSkill:'Driver',      state:'Delhi'       },
  { city:'Bangalore', workers:4800, hirers:700,  jobs:7100,  completed:5800,  growth:22, topSkill:'Plumber',     state:'Karnataka'   },
  { city:'Pune',      workers:3900, hirers:560,  jobs:5600,  completed:4200,  growth:16, topSkill:'Welder',      state:'Maharashtra' },
  { city:'Jaipur',    workers:2800, hirers:380,  jobs:4100,  completed:3100,  growth:25, topSkill:'Carpenter',   state:'Rajasthan'   },
  { city:'Indore',    workers:2200, hirers:290,  jobs:3200,  completed:2400,  growth:30, topSkill:'Mason',       state:'MP'          },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) return (
    <div style={{background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:'var(--r-sm)',padding:'10px 14px',fontSize:12}}>
      <p style={{color:'var(--text3)',marginBottom:6,fontWeight:700,textTransform:'uppercase',fontSize:11}}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{color:p.color,marginBottom:2}}>{p.name}: <strong style={{color:'var(--text)'}}>{p.value.toLocaleString()}</strong></p>)}
    </div>
  );
  return null;
};

export default function CityActivity() {
  const [sortBy, setSortBy] = useState('workers');

  const sorted = [...CITY_DETAIL].sort((a,b) => b[sortBy]-a[sortBy]);

  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>City Activity</h1>
          <p>Platform performance across cities — helps identify where to focus growth</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
          <div>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:3}}>City Comparison</h3>
            <p style={{fontSize:12,color:'var(--text3)'}}>Workers & Jobs across top cities</p>
          </div>
          <div className="filters">
            {[['workers','Workers'],['jobs','Jobs'],['completed','Completed Jobs']].map(([v,l])=>(
              <button key={v} className={`filter-btn ${sortBy===v?'filter-btn--on':''}`} onClick={()=>setSortBy(v)}>{l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sorted} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="city" tick={{fill:'var(--text3)',fontSize:12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="workers"   name="Workers"          fill="var(--orange)" radius={[6,6,0,0]} />
            <Bar dataKey="jobs"      name="Jobs Posted"      fill="var(--blue)"   radius={[6,6,0,0]} />
            <Bar dataKey="completed" name="Jobs Completed"   fill="var(--green)"  radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:'flex',gap:20,marginTop:12}}>
          {[['var(--orange)','Workers'],['var(--blue)','Jobs Posted'],['var(--green)','Completed']].map(([c,l])=>(
            <span key={l} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text2)'}}>
              <span style={{width:10,height:10,borderRadius:2,background:c,display:'inline-block'}}></span>{l}
            </span>
          ))}
        </div>
      </div>

      {/* City Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
        {sorted.map((c, i) => {
          const completionRate = Math.round(c.completed/c.jobs*100);
          return (
            <div key={c.city} className="card" style={{position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,var(--orange),var(--blue))`}}></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                    <span style={{fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,color:'var(--text3)'}}>#{i+1}</span>
                    <h3 style={{fontSize:17,fontWeight:800}}>{c.city}</h3>
                  </div>
                  <span style={{fontSize:11,color:'var(--text3)'}}>{c.state}</span>
                </div>
                <span style={{background:'var(--green-pale)',color:'var(--green)',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20}}>↑ {c.growth}%</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                {[['👷',c.workers.toLocaleString(),'Workers'],['🏢',c.hirers.toLocaleString(),'Hirers'],['📋',c.jobs.toLocaleString(),'Jobs'],['✅',c.completed.toLocaleString(),'Completed']].map(([ic,v,l])=>(
                  <div key={l} style={{background:'var(--bg3)',borderRadius:'var(--r-sm)',padding:'10px'}}>
                    <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:800,color:'var(--text)',marginBottom:2}}>{v}</div>
                    <div style={{fontSize:11,color:'var(--text3)'}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:12,color:'var(--text3)'}}>Completion Rate</span>
                <span style={{fontSize:13,fontWeight:700,color:completionRate>80?'var(--green)':completionRate>60?'var(--yellow)':'var(--red)'}}>{completionRate}%</span>
              </div>
              <div style={{height:6,background:'var(--bg3)',borderRadius:3,overflow:'hidden',marginBottom:12}}>
                <div style={{height:'100%',width:`${completionRate}%`,background:`linear-gradient(90deg,var(--orange),var(--green))`,borderRadius:3}}></div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                <span style={{color:'var(--text3)'}}>Top Skill:</span>
                <span className="badge badge--orange">{c.topSkill}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
