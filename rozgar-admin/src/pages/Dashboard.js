import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { STATS } from '../data';
import './Dashboard.css';

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div className="stat-card" style={{'--sc': color}}>
    <div className="stat-card-top">
      <div className="stat-card-icon">{icon}</div>
      {trend && <span className={`stat-trend ${trend > 0 ? 'stat-trend--up' : 'stat-trend--down'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>}
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{label}</div>
    {sub && <div className="stat-card-sub">{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="anim-fadeUp">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Platform Overview</h1>
          <p>Real-time statistics and platform health</p>
        </div>
        <div className="dash-live">
          <span className="dash-live-dot"></span>
          Live Data
        </div>
      </div>

      {/* TODAY STRIP */}
      <div className="dash-today-strip">
        <span>📅 Today's Activity:</span>
        <div className="dash-today-pills">
          <span className="dash-today-pill dash-today-pill--green">+{STATS.newToday.workers} new workers</span>
          <span className="dash-today-pill dash-today-pill--blue">+{STATS.newToday.hirers} new hirers</span>
          <span className="dash-today-pill dash-today-pill--orange">+{STATS.newToday.jobs} new jobs</span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="dash-stats anim-fadeUp d1">
        <StatCard icon="👷" label="Total Workers"        value={STATS.totalWorkers.toLocaleString()} sub="Registered on platform"   color="var(--orange)" trend={12} />
        <StatCard icon="🏢" label="Total Employers"      value={STATS.totalHirers.toLocaleString()}  sub="Regular + Business"       color="var(--blue)"   trend={8}  />
        <StatCard icon="📋" label="Total Jobs Posted"    value={STATS.totalJobs.toLocaleString()}    sub="All time"                 color="var(--purple)" trend={15} />
        <StatCard icon="✅" label="Jobs Completed"       value={STATS.completedJobs.toLocaleString()} sub={`${Math.round(STATS.completedJobs/STATS.totalJobs*100)}% completion rate`} color="var(--green)" trend={5} />
        <StatCard icon="⏳" label="Pending Verifications" value={STATS.pendingVerifications}         sub="Business accounts"        color="var(--yellow)" />
        <StatCard icon="🚨" label="Open Reports"         value={STATS.pendingReports}               sub="Need attention"           color="var(--red)"    />
      </div>

      {/* CHARTS ROW */}
      <div className="dash-charts anim-fadeUp d2">
        {/* Weekly Activity */}
        <div className="card dash-chart-card">
          <div className="dash-chart-head">
            <h3>Weekly Activity</h3>
            <p>Workers & Jobs this week</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={STATS.weeklyActivity} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="workers" name="Workers" fill="var(--orange)" radius={[4,4,0,0]} />
              <Bar dataKey="jobs"    name="Jobs"    fill="var(--blue)"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="dash-chart-legend">
            <span><span style={{background:'var(--orange)'}}></span>Workers</span>
            <span><span style={{background:'var(--blue)'}}></span>Jobs</span>
          </div>
        </div>

        {/* City Activity */}
        <div className="card dash-chart-card">
          <div className="dash-chart-head">
            <h3>Top Cities</h3>
            <p>Most active cities on platform</p>
          </div>
          <div className="dash-city-list">
            {STATS.cityActivity.map((c, i) => {
              const maxWorkers = STATS.cityActivity[0].workers;
              const pct = Math.round(c.workers / maxWorkers * 100);
              return (
                <div key={c.city} className="dash-city-row">
                  <div className="dash-city-info">
                    <span className="dash-city-rank">#{i+1}</span>
                    <span className="dash-city-name">{c.city}</span>
                  </div>
                  <div className="dash-city-bar-wrap">
                    <div className="dash-city-bar" style={{width:`${pct}%`}}></div>
                  </div>
                  <div className="dash-city-nums">
                    <span>{c.workers.toLocaleString()} workers</span>
                    <span>{c.jobs.toLocaleString()} jobs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="card anim-fadeUp d3">
        <h3 className="dash-qa-title">Quick Actions</h3>
        <div className="dash-qa-grid">
          {[
            { icon:'✅', label:'Review Pending Verifications', count: STATS.pendingVerifications, color:'var(--yellow)', link:'/verifications' },
            { icon:'🚨', label:'Handle Open Reports',           count: STATS.pendingReports,       color:'var(--red)',    link:'/reports' },
            { icon:'👥', label:'Manage Users',                  count: null,                       color:'var(--blue)',   link:'/users' },
            { icon:'📢', label:'Send Announcement',             count: null,                       color:'var(--purple)', link:'/announcements' },
          ].map((a, i) => (
            <a key={i} href={a.link} className="dash-qa-card" style={{'--qc': a.color}}>
              <span className="dash-qa-icon">{a.icon}</span>
              <span className="dash-qa-label">{a.label}</span>
              {a.count && <span className="dash-qa-count">{a.count}</span>}
              <span className="dash-qa-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
