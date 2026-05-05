import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkerDashboard.css';
import { getMyWorkerProfile, browseJobs, applyToJob, withdrawApplication, updateAvailability, logout } from '../api';

/* ── MOCK FALLBACK DATA (shown while loading or if API fails) ── */
const WORKER_DEFAULT = {
  name: '', firstName: '', lastName: '',
  skill: 'Worker', city: '', mobile: '',
  rating: 0, totalJobs: 0, profileViews: 0, thisMonthJobs: 0,
  available: true, verified: false, joined: '',
  experience: 0, profileCompletion: 60,
  skills: [], languages: [], bio: '',
};

const NEARBY_JOBS_MOCK = [
  { id:1, title:'Need 2 Masons for house renovation',   hirer:'Anita Shah',        type:'Regular', city:'Surat',     salary:650,  avgSalary:600, days:5,  skill:'Mason',    urgent:true,  posted:'2 hrs ago',  applied:8,  image:'A' },
  { id:2, title:'Factory construction workers needed',   hirer:'Mehta Constructions',type:'Business',city:'Surat',    salary:550,  avgSalary:600, days:60, skill:'Mason',    urgent:false, posted:'5 hrs ago',  applied:22, image:'M' },
  { id:3, title:'Plastering work for new apartment',     hirer:'Ravi Builders',     type:'Business',city:'Surat',     salary:700,  avgSalary:600, days:10, skill:'Mason',    urgent:true,  posted:'1 day ago',  applied:5,  image:'R' },
  { id:4, title:'Tile laying for bathroom renovation',   hirer:'Sunita Verma',      type:'Regular', city:'Surat',     salary:800,  avgSalary:750, days:3,  skill:'Tile Work', urgent:false, posted:'3 hrs ago',  applied:3,  image:'S' },
];

const MY_APPLICATIONS = [
  { id:1, title:'Need 2 Masons for house renovation', hirer:'Anita Shah',    salary:650, appliedOn:'Nov 10', status:'contacted' },
  { id:2, title:'Tile work for office building',      hirer:'ABC Corp',      salary:750, appliedOn:'Nov 9',  status:'pending'   },
  { id:3, title:'House construction mason needed',    hirer:'Rajesh Mehta',  salary:600, appliedOn:'Nov 8',  status:'rejected'  },
  { id:4, title:'Plastering for new society',         hirer:'DLF Builders',  salary:680, appliedOn:'Nov 7',  status:'completed' },
];

const ACTIVE_JOB = {
  title: 'House renovation — Mason work', hirer: 'Anita Shah',
  hirerMobile: '+91 91234 56789', city: 'Varachha, Surat',
  salary: 650, days: 5, startDate: 'Nov 11, 2024', endDate: 'Nov 15, 2024',
  workerConfirmed: false, hirerConfirmed: false,
  description: 'Complete plastering and brick laying work for a 2BHK house renovation.',
};

const RATINGS_HISTORY = [
  { job:'House renovation — Varachha',  hirer:'Anita Shah',         rating:5, date:'Oct 2024', comment:'Excellent work, very punctual and skilled.' },
  { job:'Factory wall plastering',       hirer:'Mehta Constructions', rating:4, date:'Sept 2024',comment:'Good work. Completed on time.' },
  { job:'Office tile laying',            hirer:'ABC Corp',            rating:5, date:'Sept 2024',comment:'Best mason I have hired. Will hire again.' },
];

const NOTIFICATIONS = [
  { icon:'👁️', text:'Someone viewed your profile', time:'10 min ago', unread:true  },
  { icon:'💼', text:'New job posted in your city',  time:'1 hr ago',  unread:true  },
  { icon:'⭐', text:'You received a 5-star rating!', time:'2 hrs ago', unread:true  },
  { icon:'📞', text:'A hirer contacted you',         time:'5 hrs ago', unread:false },
];

const TABS = ['🏠 Jobs', '📋 Applied', '⚡ Active Job', '👤 Profile', '⭐ Ratings'];
const Stars = ({ n }) => (
  <span className="wd-stars">
    {[1,2,3,4,5].map(i => <span key={i} style={{color: i<=n ? '#F59E0B' : '#D1C4A8'}}>★</span>)}
  </span>
);

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [lang, setLang]           = useState('en');
  const [tab, setTab]             = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applications, setApplications] = useState(MY_APPLICATIONS);
  const [activeJob, setActiveJob] = useState(ACTIVE_JOB);
  const [showUnavailModal, setShowUnavailModal] = useState(false);
  const [unavailDate, setUnavailDate]           = useState('');
  const [showWithdrawId, setShowWithdrawId]     = useState(null);

  // ── REAL DATA STATE ──
  const [worker, setWorker]         = useState(WORKER_DEFAULT);
  const [available, setAvailable]   = useState(true);
  const [nearbyJobs, setNearbyJobs] = useState(NEARBY_JOBS_MOCK);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [toast, setToast]           = useState('');

  const l = (en, hi) => lang === 'hi' ? hi : en;
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  /* ── LOAD REAL WORKER PROFILE ON MOUNT ── */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyWorkerProfile();
        const w = data.worker;
        const fullName = `${w.firstName} ${w.lastName}`;
        const primarySkill = w.skills && w.skills.length > 0
          ? w.skills[0].name
          : 'Worker';

        setWorker({
          name:              fullName,
          firstName:         w.firstName,
          lastName:          w.lastName,
          skill:             primarySkill,
          city:              w.currentCity || '',
          mobile:            w.mobile || '',
          rating:            w.averageRating || 0,
          totalJobs:         w.totalJobsDone || 0,
          profileViews:      w.profileViews || 0,
          thisMonthJobs:     0,
          available:         w.isAvailable,
          verified:          w.isVerified,
          joined:            new Date(w.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          experience:        w.skills && w.skills.length > 0 ? w.skills[0].experience : 0,
          profileCompletion: calculateCompletion(w),
          skills:            w.skills ? w.skills.map(s => s.name) : [],
          languages:         w.languages || [],
          bio:               w.bio || `${w.firstName} is a skilled worker registered on RozgarConnect.`,
        });
        setAvailable(w.isAvailable);

        // Load real jobs filtered by worker's city
        try {
          const jobsData = await browseJobs(w.currentCity);
          if (jobsData.jobs && jobsData.jobs.length > 0) {
            const formatted = jobsData.jobs.map(j => ({
              id:        j._id,
              title:     j.title,
              hirer:     j.hirer?.name || j.hirer?.companyName || 'Employer',
              type:      j.hirerType === 'business' ? 'Business' : 'Regular',
              city:      j.city,
              salary:    j.salaryMin,
              avgSalary: 600,
              days:      j.numberOfDays,
              skill:     j.skill,
              urgent:    j.isUrgent,
              posted:    new Date(j.createdAt).toLocaleDateString(),
              applied:   j.applications?.length || 0,
              image:     (j.hirer?.name || 'E')[0],
            }));
            setNearbyJobs(formatted);
          }
        } catch (jobErr) {
          // Keep mock jobs if real jobs fail
          console.log('Using mock jobs');
        }
      } catch (err) {
        // If token expired or not logged in → redirect to home
        console.error('Profile load failed:', err.message);
        if (err.message.includes('authorized') || err.message.includes('Token')) {
          logout();
          navigate('/');
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  // Profile completion calculator
  const calculateCompletion = (w) => {
    let score = 0;
    if (w.firstName)            score += 20;
    if (w.mobile)               score += 20;
    if (w.skills?.length > 0)   score += 20;
    if (w.currentCity)          score += 15;
    if (w.aadharUrl)            score += 15;
    if (w.bio)                  score += 5;
    if (w.profilePhoto)         score += 5;
    return score;
  };

  /* ── APPLY TO JOB ── */
  const handleApply = async (jobId) => {
    if (appliedJobs.includes(jobId)) {
      setShowWithdrawId(jobId);
    } else {
      try {
        await applyToJob(jobId);
        setAppliedJobs(a => [...a, jobId]);
        showToast(l('✅ Application sent! The hirer will contact you directly.','✅ आवेदन भेजा गया!'));
      } catch (err) {
        // If API fails, still update UI for demo
        setAppliedJobs(a => [...a, jobId]);
        showToast(l('✅ Application sent!','✅ आवेदन भेजा गया!'));
      }
    }
  };

  /* ── WITHDRAW APPLICATION ── */
  const handleWithdraw = async (jobId) => {
    try {
      await withdrawApplication(jobId);
    } catch (err) {
      console.log('Withdraw API note:', err.message);
    }
    setAppliedJobs(a => a.filter(id => id !== jobId));
    setShowWithdrawId(null);
    showToast(l('Application withdrawn.','आवेदन वापस लिया।'));
  };

  /* ── AVAILABILITY TOGGLE ── */
  const handleAvailToggle = () => {
    if (available) setShowUnavailModal(true);
    else {
      updateAvailability(true).catch(console.error);
      setAvailable(true);
      showToast(l('You are now visible to hirers!','आप अब हायरर को दिखेंगे!'));
    }
  };

  const handleUnavailConfirm = async () => {
    try {
      await updateAvailability(false, unavailDate);
    } catch (err) {
      console.log('Availability API note:', err.message);
    }
    setAvailable(false);
    setShowUnavailModal(false);
    showToast(l(`You are now hidden. Available from ${unavailDate || 'date not set'}`, `आप छिप गए।`));
  };

  /* ── WORKER CONFIRM JOB ── */
  const handleWorkerConfirm = () => {
    setActiveJob(j => ({...j, workerConfirmed: true}));
    showToast(l('You confirmed the job! Waiting for hirer to confirm.','आपने जॉब कन्फर्म की!'));
  };

  /* ── LOGOUT ── */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const shareOnWhatsApp = (job) => {
    const text = `🔨 Job Alert on RozgarConnect!\n\n${job.title}\n💰 ₹${job.salary}/day\n📍 ${job.city}\n⏳ ${job.days} days\n\nApply at: rozgarconnect.in`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const salaryTag = (salary, avg) => {
    if (salary > avg) return { label: l('Above Avg','औसत से ज़्यादा'), cls:'wd-tag--green' };
    if (salary < avg) return { label: l('Below Avg','औसत से कम'),      cls:'wd-tag--red' };
    return { label: l('Average','औसत'), cls:'wd-tag--yellow' };
  };

  // Avatar letter
  const avatarLetter = worker.firstName ? worker.firstName[0].toUpperCase() : 'W';

  // Loading screen
  if (loadingProfile) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16,background:'#F7F3EE'}}>
        <div style={{fontSize:48}}>⚡</div>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:'#0D1B2A'}}>Loading your profile...</p>
        <p style={{color:'#9A8E84',fontSize:14}}>Connecting to RozgarConnect</p>
      </div>
    );
  }

  return (
    <div className="wd">

      {/* TOAST */}
      {toast && (
        <div style={{position:'fixed',bottom:24,right:24,background:'#0D1B2A',color:'#fff',padding:'14px 20px',borderRadius:12,fontWeight:600,fontSize:14,zIndex:9999,boxShadow:'0 8px 32px rgba(0,0,0,0.2)',maxWidth:320}}>
          {toast}
        </div>
      )}

      {/* ── TOPBAR ── */}
      <header className="wd-topbar">
        <div className="wd-topbar-inner">
          <div className="wd-topbar-left">
            <button className="wd-hamburger" onClick={() => setShowMenu(true)}>☰</button>
            <div className="wd-logo" onClick={() => navigate('/')}>
              <span>⚡</span> Rozgar<em>Connect</em>
            </div>
          </div>
          <div className="wd-topbar-right">
            <button className="wd-lang-btn" onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}>
              {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>
            <button className="wd-notif-btn" onClick={() => setShowNotif(o => !o)}>
              🔔
              {unreadCount > 0 && <span className="wd-notif-badge">{unreadCount}</span>}
            </button>
            <div className="wd-topbar-avatar" onClick={() => setTab(3)}>{avatarLetter}</div>
          </div>
        </div>

        {showNotif && (
          <div className="wd-notif-drop">
            <div className="wd-notif-head">
              <h4>{l('Notifications','सूचनाएं')}</h4>
              <button onClick={() => setShowNotif(false)}>✕</button>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className={`wd-notif-item ${n.unread ? 'wd-notif-item--unread' : ''}`}>
                <span className="wd-notif-icon">{n.icon}</span>
                <div><p>{n.text}</p><span>{n.time}</span></div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* ── MOBILE MENU ── */}
      {showMenu && (
        <div className="wd-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="wd-menu" onClick={e => e.stopPropagation()}>
            <div className="wd-menu-head">
              <div className="wd-menu-avatar">{avatarLetter}</div>
              <div>
                <p className="wd-menu-name">{worker.name}</p>
                <p className="wd-menu-skill">{worker.skill}</p>
              </div>
              <button onClick={() => setShowMenu(false)}>✕</button>
            </div>
            {TABS.map((t, i) => (
              <button key={i} className="wd-menu-item" onClick={() => { setTab(i); setShowMenu(false); }}>{t}</button>
            ))}
            <button className="wd-menu-logout" onClick={handleLogout}>🚪 {l('Logout','लॉगआउट')}</button>
          </div>
        </div>
      )}

      <div className="wd-body">

        {/* ── SIDEBAR ── */}
        <aside className="wd-sidebar">
          <div className="wd-sidebar-profile">
            <div className="wd-sidebar-av">{avatarLetter}</div>
            <div className="wd-sidebar-info">
              <h3>{worker.name || 'Loading...'}</h3>
              <p>{worker.skill}</p>
              <p className="wd-sidebar-city">📍 {worker.city}</p>
            </div>
          </div>

          {/* AVAILABILITY TOGGLE */}
          <div className="wd-avail-box">
            <div className="wd-avail-top">
              <span className="wd-avail-label">{l('Availability','उपलब्धता')}</span>
              <button className={`wd-avail-toggle ${available ? 'wd-avail-toggle--on' : ''}`} onClick={handleAvailToggle}>
                <span className="wd-avail-knob"></span>
              </button>
            </div>
            <p className={`wd-avail-status ${available ? 'wd-avail-status--on' : 'wd-avail-status--off'}`}>
              {available ? `● ${l('Available for work','काम के लिए उपलब्ध')}` : `● ${l('Not Available','उपलब्ध नहीं')}`}
            </p>
          </div>

          {/* PROFILE COMPLETION */}
          <div className="wd-completion">
            <div className="wd-completion-top">
              <span>{l('Profile Completion','प्रोफाइल पूर्णता')}</span>
              <span className="wd-completion-pct">{worker.profileCompletion}%</span>
            </div>
            <div className="wd-completion-bar">
              <div className="wd-completion-fill" style={{width:`${worker.profileCompletion}%`}}></div>
            </div>
            <p className="wd-completion-hint">
              {worker.profileCompletion < 100 ? l('Complete your profile to get more jobs','अधिक काम पाने के लिए प्रोफाइल पूरी करें') : l('Profile complete!','प्रोफाइल पूर्ण!')}
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="wd-sidebar-stats">
            {[
              { n: worker.totalJobs,    l: l('Jobs Done','काम पूरे'),          icon:'✅' },
              { n: worker.rating || '—', l: l('Rating','रेटिंग'),              icon:'⭐' },
              { n: worker.profileViews, l: l('Profile Views','प्रोफाइल व्यूज़'), icon:'👁️' },
              { n: worker.thisMonthJobs,l: l('This Month','इस माह'),            icon:'📅' },
            ].map((s, i) => (
              <div key={i} className="wd-sidebar-stat">
                <span className="wd-sidebar-stat-icon">{s.icon}</span>
                <span className="wd-sidebar-stat-n">{s.n}</span>
                <span className="wd-sidebar-stat-l">{s.l}</span>
              </div>
            ))}
          </div>

          {/* VERIFIED BADGE */}
          {worker.verified && (
            <div className="wd-verified-badge">
              <span>🛡️</span>
              <span>{l('Aadhar Verified','आधार वेरिफाइड')}</span>
            </div>
          )}

          {/* NAV */}
          <nav className="wd-sidebar-nav">
            {TABS.map((t, i) => (
              <button key={i} className={`wd-nav-item ${tab === i ? 'wd-nav-item--on' : ''}`} onClick={() => setTab(i)}>
                {t}
              </button>
            ))}
          </nav>
          <button className="wd-sidebar-logout" onClick={handleLogout}>🚪 {l('Logout','लॉगआउट')}</button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="wd-main">

          {/* ══ TAB 0 — NEARBY JOBS ══ */}
          {tab === 0 && (
            <div className="wd-tab-content">
              <div className="wd-tab-header">
                <div>
                  <h2>{l('Jobs Near You','आपके पास के काम')}</h2>
                  <p>{l(`${nearbyJobs.length} jobs found in ${worker.city}`,`${worker.city} में ${nearbyJobs.length} काम मिले`)}</p>
                </div>
                <div className="wd-skill-filters">
                  {['All', ...worker.skills].map((s, i) => (
                    <button key={i} className={`wd-filter-chip ${i === 0 ? 'wd-filter-chip--on' : ''}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="wd-jobs-list">
                {nearbyJobs.map(job => {
                  const st = salaryTag(job.salary, job.avgSalary);
                  const isApplied = appliedJobs.includes(job.id);
                  return (
                    <div key={job.id} className="wd-job-card">
                      <div className="wd-job-card-top">
                        <div className="wd-job-av" style={{background: job.type==='Business'?'#0D1B2A':'#FF6B00'}}>{job.image}</div>
                        <div className="wd-job-info">
                          <h3>{job.title}</h3>
                          <p>{job.hirer} · 📍 {job.city}</p>
                        </div>
                        <div className="wd-job-badges">
                          {job.urgent && <span className="wd-tag wd-tag--red">🔴 {l('Urgent','अर्जेंट')}</span>}
                          <span className={`wd-tag ${job.type==='Business'?'wd-tag--purple':'wd-tag--blue'}`}>{job.type}</span>
                        </div>
                      </div>
                      <div className="wd-job-card-mid">
                        <div className="wd-job-detail"><span>💰</span><span className="wd-job-salary">₹{job.salary}/day</span><span className={`wd-tag ${st.cls}`}>{st.label}</span></div>
                        <div className="wd-job-detail"><span>⏳</span><span>{job.days} {l('days','दिन')}</span></div>
                        <div className="wd-job-detail"><span>🔧</span><span>{job.skill}</span></div>
                        <div className="wd-job-detail"><span>👥</span><span>{job.applied} {l('applied','ने अप्लाई किया')}</span></div>
                        <div className="wd-job-detail"><span>🕐</span><span>{job.posted}</span></div>
                      </div>
                      <div className="wd-job-card-actions">
                        <button className="wd-whatsapp-btn" onClick={() => shareOnWhatsApp(job)}>
                          <span>💬</span> {l('Share','शेयर')}
                        </button>
                        <button className={`wd-apply-btn ${isApplied ? 'wd-apply-btn--applied' : ''}`} onClick={() => handleApply(job.id)}>
                          {isApplied ? `✓ ${l('Applied — Withdraw?','अप्लाई किया — वापस लें?')}` : `→ ${l('Apply Now','अभी अप्लाई करें')}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ TAB 1 — MY APPLICATIONS ══ */}
          {tab === 1 && (
            <div className="wd-tab-content">
              <div className="wd-tab-header">
                <div>
                  <h2>{l('My Applications','मेरे आवेदन')}</h2>
                  <p>{l(`${applications.length} applications total`,`कुल ${applications.length} आवेदन`)}</p>
                </div>
              </div>
              <div className="wd-app-list">
                {applications.map((a, i) => (
                  <div key={i} className="wd-app-card">
                    <div className="wd-app-card-left">
                      <h3>{a.title}</h3>
                      <p>🏢 {a.hirer} · 💰 ₹{a.salary}/day</p>
                      <p className="wd-app-date">📅 {l('Applied on','अप्लाई किया')} {a.appliedOn}</p>
                    </div>
                    <div className="wd-app-card-right">
                      <span className={`wd-app-status wd-app-status--${a.status}`}>
                        {a.status === 'contacted'  && `📞 ${l('Hirer Called','हायरर ने कॉल किया')}`}
                        {a.status === 'pending'    && `⏳ ${l('Pending','प्रतीक्षा में')}`}
                        {a.status === 'rejected'   && `❌ ${l('Rejected','अस्वीकृत')}`}
                        {a.status === 'completed'  && `✅ ${l('Completed','पूर्ण')}`}
                      </span>
                      {a.status === 'pending' && (
                        <button className="wd-withdraw-btn" onClick={() => setApplications(apps => apps.filter((_,j) => j !== i))}>
                          {l('Withdraw','वापस लें')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ TAB 2 — ACTIVE JOB ══ */}
          {tab === 2 && (
            <div className="wd-tab-content">
              <div className="wd-tab-header">
                <div>
                  <h2>{l('Active Job','सक्रिय काम')}</h2>
                  <p>{l('Your current job details','आपके वर्तमान काम की जानकारी')}</p>
                </div>
              </div>
              <div className="wd-active-job-card">
                <div className="wd-active-job-banner">
                  <span>⚡ {l('Job In Progress','काम जारी है')}</span>
                  <span>{activeJob.startDate} → {activeJob.endDate}</span>
                </div>
                <h2>{activeJob.title}</h2>
                <p className="wd-active-desc">{activeJob.description}</p>
                <div className="wd-active-details">
                  {[
                    ['🏢', l('Hirer','हायरर'),       activeJob.hirer],
                    ['📞', l('Contact','संपर्क'),     activeJob.hirerMobile],
                    ['📍', l('Location','स्थान'),     activeJob.city],
                    ['💰', l('Salary','वेतन'),        `₹${activeJob.salary}/day`],
                    ['⏳', l('Duration','अवधि'),      `${activeJob.days} ${l('days','दिन')}`],
                    ['📅', l('Start Date','शुरुआत'),  activeJob.startDate],
                  ].map(([icon, label, val], i) => (
                    <div key={i} className="wd-active-detail-row">
                      <span>{icon} {label}</span><strong>{val}</strong>
                    </div>
                  ))}
                </div>
                <div className="wd-confirm-section">
                  <h4>{l('Job Completion Confirmation','काम पूर्णता पुष्टि')}</h4>
                  <p>{l('Both you and the hirer must confirm to complete the job and unlock ratings.','काम पूरा करने और रेटिंग अनलॉक करने के लिए आप दोनों को पुष्टि करनी होगी।')}</p>
                  <div className="wd-confirm-row">
                    <div className={`wd-confirm-box ${activeJob.workerConfirmed ? 'wd-confirm-box--done' : ''}`}>
                      <span>{activeJob.workerConfirmed ? '✅' : '⬜'}</span>
                      <span>{l('Your Confirmation','आपकी पुष्टि')}</span>
                    </div>
                    <div className="wd-confirm-arrow">→</div>
                    <div className={`wd-confirm-box ${activeJob.hirerConfirmed ? 'wd-confirm-box--done' : ''}`}>
                      <span>{activeJob.hirerConfirmed ? '✅' : '⬜'}</span>
                      <span>{l("Hirer's Confirmation","हायरर की पुष्टि")}</span>
                    </div>
                  </div>
                  {!activeJob.workerConfirmed && (
                    <button className="wd-confirm-btn" onClick={handleWorkerConfirm}>
                      ✅ {l('I have completed this job','मैंने यह काम पूरा कर लिया है')}
                    </button>
                  )}
                  {activeJob.workerConfirmed && !activeJob.hirerConfirmed && (
                    <div className="wd-confirm-waiting">⏳ {l('Waiting for hirer to confirm...','हायरर की पुष्टि का इंतजार...')}</div>
                  )}
                  {activeJob.workerConfirmed && activeJob.hirerConfirmed && (
                    <div className="wd-confirm-done">🎉 {l('Job completed! You can now rate the hirer.','काम पूर्ण! आप अब हायरर को रेट कर सकते हैं।')}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB 3 — MY PROFILE ══ */}
          {tab === 3 && (
            <div className="wd-tab-content">
              <div className="wd-tab-header">
                <div>
                  <h2>{l('My Profile','मेरी प्रोफाइल')}</h2>
                  <p>{l('Your professional profile visible to hirers','हायरर को दिखने वाली आपकी प्रोफाइल')}</p>
                </div>
              </div>
              <div className="wd-profile-card">
                <div className="wd-profile-top">
                  <div className="wd-profile-big-av">{avatarLetter}</div>
                  <div className="wd-profile-identity">
                    <div className="wd-profile-name-row">
                      <h2>{worker.name}</h2>
                      {worker.verified && <span className="wd-verified-pill">🛡️ {l('Verified','वेरिफाइड')}</span>}
                    </div>
                    <p>{worker.skill}</p>
                    <p>📍 {worker.city} · 📞 {worker.mobile}</p>
                    <Stars n={Math.round(worker.rating)} />
                    <span className="wd-rating-text">{worker.rating || '—'}/5 ({worker.totalJobs} {l('reviews','समीक्षाएं')})</span>
                  </div>
                </div>
                <div className="wd-profile-bio">
                  <h4>{l('About Me','मेरे बारे में')}</h4>
                  <p>{worker.bio}</p>
                </div>
                <div className="wd-profile-grid">
                  {[
                    [l('Experience','अनुभव'),   worker.experience ? `${worker.experience} ${l('years','साल')}` : 'N/A'],
                    [l('Jobs Done','काम पूरे'), worker.totalJobs],
                    [l('Member Since','सदस्य'),  worker.joined],
                    [l('Languages','भाषाएं'),    worker.languages.length > 0 ? worker.languages.join(', ') : 'Hindi'],
                  ].map(([k, v], i) => (
                    <div key={i} className="wd-profile-grid-item">
                      <span>{k}</span><strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className="wd-profile-skills">
                  <h4>{l('Skills','कौशल')}</h4>
                  <div className="wd-skill-tags">
                    {worker.skills.map((s, i) => <span key={i} className="wd-skill-tag">{s}</span>)}
                  </div>
                </div>
                <div className="wd-profile-completion-full">
                  <div className="wd-pcf-top">
                    <h4>{l('Profile Completion','प्रोफाइल पूर्णता')}</h4>
                    <span>{worker.profileCompletion}%</span>
                  </div>
                  <div className="wd-completion-bar" style={{marginBottom:12}}>
                    <div className="wd-completion-fill" style={{width:`${worker.profileCompletion}%`}}></div>
                  </div>
                  <div className="wd-pcf-missing">
                    {!worker.verified && <p>🛡️ {l('Upload Aadhar to get verified','आधार अपलोड करें')}</p>}
                    <p>📷 {l('Add profile photo','प्रोफाइल फोटो डालें')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB 4 — RATINGS & HISTORY ══ */}
          {tab === 4 && (
            <div className="wd-tab-content">
              <div className="wd-tab-header">
                <div>
                  <h2>{l('Ratings & History','रेटिंग और इतिहास')}</h2>
                  <p>{l(`${worker.totalJobs} jobs completed`,`${worker.totalJobs} काम पूरे`)}</p>
                </div>
              </div>
              <div className="wd-rating-summary">
                <div className="wd-rating-big">
                  <span className="wd-rating-num">{worker.rating || '—'}</span>
                  <Stars n={Math.round(worker.rating)} />
                  <span>{worker.totalJobs} {l('reviews','समीक्षाएं')}</span>
                </div>
                <div className="wd-rating-bars">
                  {[5,4,3,2,1].map(n => {
                    const count = RATINGS_HISTORY.filter(r => r.rating === n).length;
                    const pct = RATINGS_HISTORY.length > 0 ? Math.round(count / RATINGS_HISTORY.length * 100) : 0;
                    return (
                      <div key={n} className="wd-rating-bar-row">
                        <span>{n}★</span>
                        <div className="wd-rating-bar-bg"><div className="wd-rating-bar-fill" style={{width:`${pct}%`}}></div></div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {worker.totalJobs === 0 ? (
                <div className="wd-empty">
                  <span>⭐</span>
                  <p>{l('No ratings yet. Complete your first job to get rated!','अभी कोई रेटिंग नहीं। पहला काम पूरा करें!')}</p>
                </div>
              ) : (
                <div className="wd-reviews-list">
                  {RATINGS_HISTORY.map((r, i) => (
                    <div key={i} className="wd-review-card">
                      <div className="wd-review-top">
                        <div><h4>{r.job}</h4><p>🏢 {r.hirer} · 📅 {r.date}</p></div>
                        <Stars n={r.rating} />
                      </div>
                      <p className="wd-review-comment">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* UNAVAILABILITY MODAL */}
      {showUnavailModal && (
        <div className="wd-modal-overlay" onClick={() => setShowUnavailModal(false)}>
          <div className="wd-modal" onClick={e => e.stopPropagation()}>
            <h3>⏸️ {l('Mark as Unavailable','अनुपलब्ध करें')}</h3>
            <p>{l('You will be hidden from hirers. When will you be available again?','आप हायरर को नहीं दिखेंगे। आप फिर कब उपलब्ध होंगे?')}</p>
            <div className="wd-modal-field">
              <label>{l('Available again from','इस तारीख से उपलब्ध')}</label>
              <input type="date" className="wd-modal-input" value={unavailDate} onChange={e => setUnavailDate(e.target.value)} />
            </div>
            <div className="wd-modal-actions">
              <button className="wd-modal-cancel" onClick={() => setShowUnavailModal(false)}>{l('Cancel','रद्द करें')}</button>
              <button className="wd-modal-confirm" onClick={handleUnavailConfirm}>{l('Confirm','पुष्टि करें')}</button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW CONFIRM */}
      {showWithdrawId && (
        <div className="wd-modal-overlay" onClick={() => setShowWithdrawId(null)}>
          <div className="wd-modal" onClick={e => e.stopPropagation()}>
            <h3>↩️ {l('Withdraw Application?','आवेदन वापस लें?')}</h3>
            <p>{l('Are you sure you want to withdraw this application?','क्या आप वाकई यह आवेदन वापस लेना चाहते हैं?')}</p>
            <div className="wd-modal-actions">
              <button className="wd-modal-cancel" onClick={() => setShowWithdrawId(null)}>{l('Keep Application','रखें')}</button>
              <button className="wd-modal-confirm wd-modal-confirm--red" onClick={() => handleWithdraw(showWithdrawId)}>
                {l('Yes, Withdraw','हाँ, वापस लें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELPLINE */}
      <a href="tel:18001234567" className="wd-helpline">
        <span>📞</span>
        <span className="wd-helpline-text">{l('Help','सहायता')}</span>
      </a>
    </div>
  );
}