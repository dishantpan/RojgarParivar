import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegularHirerDashboard.css';

/* ── WORK PHOTO MOCK IMAGES ── */
const WORK_IMGS = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=60',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=60',
  'https://images.unsplash.com/photo-1590649977673-90b31b6cd1e9?w=200&q=60',
  'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=200&q=60',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60',
];

const SKILL_OPTIONS = ['Mason','Electrician','Plumber','Carpenter','Painter','Welder','Driver','Factory Helper','Tile Work','Plastering'];

/* ── INITIAL MOCK DATA ── */
const HIRER_INIT = {
  name:'Sunita Verma', type:'Regular Hirer', typeHi:'सामान्य हायरर',
  city:'Surat, Gujarat', mobile:'+91 98765 12345', mobile2:'+91 87654 32100',
  email:'sunita.verma@gmail.com', address:'204, Shreeji Apt, Athwa Lines, Surat',
  joined:'Oct 2024', totalJobs:8, activeJobs:2, totalHires:14, rating:4.6,
  bio:'Home owner in Surat. Regularly need workers for home renovation, plumbing repairs, and small construction projects.',
};

const JOBS_INIT = [
  { id:1, title:'Need 2 Masons for bathroom renovation', skill:'Mason', salaryMin:650, salaryMax:750, days:5, city:'Varachha, Surat', address:'B-12, Shanti Nagar, Varachha', posted:'2 hrs ago', deadline:'Nov 20, 2024', status:'active', applicants:8, photos:WORK_IMGS.slice(0,5), urgent:true, description:'Complete bathroom renovation including tile removal, new tile laying, and wall plastering.' },
  { id:2, title:'Electrician for full house wiring', skill:'Electrician', salaryMin:800, salaryMax:900, days:7, city:'Athwa, Surat', address:'204, Shreeji Apt, Athwa', posted:'1 day ago', deadline:'Nov 22, 2024', status:'active', applicants:4, photos:WORK_IMGS.slice(0,5), urgent:false, description:'Complete rewiring of 3BHK flat including switchboard installation.' },
  { id:3, title:'Painter for 2BHK flat', skill:'Painter', salaryMin:550, salaryMax:650, days:4, city:'Adajan, Surat', address:'45, Green Park Society, Adajan', posted:'3 days ago', deadline:'Nov 18, 2024', status:'in_progress', applicants:11, photos:WORK_IMGS.slice(0,5), urgent:false, worker:'Deepak Sharma', workerMobile:'+91 91234 56789', workerConfirmed:false, hirerConfirmed:false, startDate:'Nov 15, 2024', endDate:'Nov 18, 2024' },
  { id:4, title:'Plumber for kitchen pipe repair', skill:'Plumber', salaryMin:600, salaryMax:600, days:1, city:'Piplod, Surat', address:'78, River View, Piplod', posted:'1 week ago', deadline:'Nov 12, 2024', status:'completed', applicants:6, photos:WORK_IMGS.slice(0,5), urgent:false, worker:'Ajay Plumber', rating:5, completedDate:'Nov 12, 2024' },
  { id:5, title:'Carpenter for wardrobe installation', skill:'Carpenter', salaryMin:700, salaryMax:800, days:3, city:'Vesu, Surat', address:'Sunrise Tower, Vesu', posted:'2 weeks ago', deadline:'Nov 5, 2024', status:'completed', applicants:9, photos:WORK_IMGS.slice(0,5), urgent:false, worker:'Kamal Suthar', rating:4, completedDate:'Nov 5, 2024' },
];

const APPLICANTS_DB = {
  1: [
    { id:101, name:'Ramesh Kumar', skills:['Mason','Plastering'], city:'Surat', rating:4.8, experience:12, jobs:24, verified:true, mobile:'+91 98765 43210', bio:'Experienced mason with 12 years in residential construction. Specialize in bathroom and kitchen renovation work.', languages:['Hindi','Gujarati'], reviews:[{from:'Anita Shah',rating:5,text:'Excellent work, very punctual and skilled.'},{from:'Ravi Builders',rating:4,text:'Good quality masonry work.'}], appliedOn:'Nov 12' },
    { id:102, name:'Suresh Yadav', skills:['Mason','Tile Work'], city:'Surat', rating:4.5, experience:8, jobs:15, verified:true, mobile:'+91 91234 56789', bio:'Specialized in tile work and masonry for 8 years.', languages:['Hindi'], reviews:[{from:'DLF Builders',rating:5,text:'Very reliable worker.'}], appliedOn:'Nov 12' },
    { id:103, name:'Manoj Patel', skills:['Mason'], city:'Navsari', rating:4.2, experience:6, jobs:10, verified:true, mobile:'+91 87654 00123', bio:'Mason from Navsari, willing to travel for work.', languages:['Hindi','Gujarati'], reviews:[{from:'ABC Corp',rating:4,text:'Completed on time.'}], appliedOn:'Nov 13' },
    { id:104, name:'Rajesh Singh', skills:['Mason','Plastering','Painting'], city:'Surat', rating:3.9, experience:4, jobs:7, verified:false, mobile:'+91 70001 23456', bio:'Multi-skilled worker available for various construction tasks.', languages:['Hindi'], reviews:[], appliedOn:'Nov 13' },
  ],
  2: [
    { id:201, name:'Vikram Joshi', skills:['Electrician','Wiring'], city:'Surat', rating:4.9, experience:15, jobs:38, verified:true, mobile:'+91 99887 76655', bio:'15 years experience in electrical work, both residential and commercial.', languages:['Hindi','Gujarati','English'], reviews:[{from:'Sunita Verma',rating:5,text:'Best electrician in Surat!'},{from:'Mehta Factory',rating:5,text:'Excellent wiring work.'}], appliedOn:'Nov 14' },
    { id:202, name:'Amit Thakur', skills:['Electrician'], city:'Surat', rating:4.3, experience:7, jobs:12, verified:true, mobile:'+91 88776 65544', bio:'Electrical work specialist, house wiring expert.', languages:['Hindi'], reviews:[{from:'Mehta Factory',rating:4,text:'Good electrical work.'}], appliedOn:'Nov 14' },
  ],
};

const NOTIFS_INIT = [
  { icon:'👷', text:'Ramesh Kumar applied to your Mason job', time:'10 min ago', unread:true },
  { icon:'👷', text:'Suresh Yadav applied to your Mason job', time:'30 min ago', unread:true },
  { icon:'✅', text:'Your Electrician job post is now live', time:'1 hr ago', unread:true },
  { icon:'⭐', text:'Ajay Plumber rated you 5 stars!', time:'2 hrs ago', unread:false },
  { icon:'🎉', text:'Plumber job completed successfully', time:'Yesterday', unread:false },
];

const TABS = ['📋 My Jobs','👷 Applicants','⚡ Active Job','📜 Past Jobs','👤 Profile'];
const Stars = ({n}) => <span className="rh-past-stars">{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?'#F59E0B':'#D1C4A8'}}>★</span>)}</span>;

export default function RegularHirerDashboard() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [lang, setLang] = useState('en');
  const [tab, setTab] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [viewWorker, setViewWorker] = useState(null);
  const [contactedWorkers, setContactedWorkers] = useState([]);
  const [toast, setToast] = useState(null);
  const [jobs, setJobs] = useState(JOBS_INIT);
  const [hirer, setHirer] = useState(HIRER_INIT);

  // Post Job state
  const [showPostJob, setShowPostJob] = useState(false);
  const [postStep, setPostStep] = useState(0);
  const [newJob, setNewJob] = useState({ title:'', skill:'Mason', salaryMin:'', salaryMax:'', days:'', city:'', address:'', description:'', urgent:false, deadline:'' });
  const [jobPhotos, setJobPhotos] = useState([null,null,null,null,null]);
  const [photoSlotIdx, setPhotoSlotIdx] = useState(-1);

  // Edit Profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({...HIRER_INIT});

  // Edit Job state
  const [editingJob, setEditingJob] = useState(null);

  const l = (en,hi) => lang==='hi' ? hi : en;
  const unreadCount = NOTIFS_INIT.filter(n=>n.unread).length;

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };
  const activeJobs = jobs.filter(j=>j.status==='active');
  const filteredJobs = jobs.filter(j => jobFilter==='all' || j.status===jobFilter);
  const activeJob = jobs.find(j=>j.status==='in_progress');

  /* ── Post Job Handlers ── */
  const handlePhotoUpload = (idx) => { setPhotoSlotIdx(idx); fileRef.current?.click(); };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && photoSlotIdx >= 0) {
      const url = URL.createObjectURL(file);
      setJobPhotos(p => { const n=[...p]; n[photoSlotIdx]=url; return n; });
    }
    e.target.value = '';
  };
  const removePhoto = (idx) => setJobPhotos(p => { const n=[...p]; n[idx]=null; return n; });
  const filledPhotos = jobPhotos.filter(Boolean).length;

  const canPostStep1 = newJob.title && newJob.skill && newJob.salaryMin && newJob.days && newJob.city && newJob.address && newJob.deadline;
  const canPostStep2 = filledPhotos === 5;

  const handleSubmitJob = () => {
    const posted = {
      id: Date.now(), title:newJob.title, skill:newJob.skill,
      salaryMin:Number(newJob.salaryMin), salaryMax:Number(newJob.salaryMax)||Number(newJob.salaryMin),
      days:Number(newJob.days), city:newJob.city, address:newJob.address,
      description:newJob.description, urgent:newJob.urgent, deadline:newJob.deadline,
      posted:'Just now', status:'active', applicants:0,
      photos: jobPhotos.map((p,i) => p || WORK_IMGS[i]),
    };
    setJobs(prev => [posted, ...prev]);
    setHirer(h => ({...h, totalJobs:h.totalJobs+1, activeJobs:h.activeJobs+1}));
    setShowPostJob(false);
    setPostStep(0);
    setNewJob({title:'',skill:'Mason',salaryMin:'',salaryMax:'',days:'',city:'',address:'',description:'',urgent:false,deadline:''});
    setJobPhotos([null,null,null,null,null]);
    setTab(0);
    showToast(l('✅ Job posted successfully! Workers will start applying soon.','✅ जॉब पोस्ट हो गई! मजदूर जल्द अप्लाई करेंगे।'));
  };

  /* ── Other Handlers ── */
  const handleContactWorker = (worker) => {
    setContactedWorkers(c=>[...c, worker.id]);
    showToast(`📞 ${l('Call','कॉल करें')} ${worker.name}: ${worker.mobile}`);
  };

  const handleHirerConfirm = (jobId) => {
    setJobs(prev => prev.map(j => j.id===jobId ? {...j, hirerConfirmed:true} : j));
    showToast(l('✅ You confirmed! Waiting for worker.','✅ आपने कन्फर्म किया! मजदूर का इंतजार।'));
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm(l('Are you sure you want to delete this job post?','क्या आप वाकई इस जॉब पोस्ट को हटाना चाहते हैं?'))) {
      setJobs(prev => prev.filter(j=>j.id!==jobId));
      showToast(l('🗑️ Job post deleted.','🗑️ जॉब पोस्ट हटा दी गई।'));
    }
  };

  const handleSaveProfile = () => {
    setHirer({...editProfile});
    setShowEditProfile(false);
    showToast(l('✅ Profile updated successfully!','✅ प्रोफाइल अपडेट हो गई!'));
  };

  const handleSaveEditJob = () => {
    setJobs(prev => prev.map(j => j.id===editingJob.id ? editingJob : j));
    setEditingJob(null);
    showToast(l('✅ Job updated successfully!','✅ जॉब अपडेट हो गई!'));
  };

  const openPostJob = () => { setShowPostJob(true); setPostStep(0); };

  return (
    <div className="rh">
      {/* TOAST */}
      {toast && <div className="rh-toast">{toast}</div>}
      {/* Hidden file input */}
      <input type="file" ref={fileRef} accept="image/*" style={{display:'none'}} onChange={handleFileChange} />

      {/* ── TOPBAR ── */}
      <header className="rh-topbar">
        <div className="rh-topbar-inner">
          <div className="rh-topbar-left">
            <button className="rh-hamburger" onClick={()=>setShowMenu(true)}>☰</button>
            <div className="rh-logo" onClick={()=>navigate('/')}><span>⚡</span> Rozgar<em>Connect</em></div>
          </div>
          <div className="rh-topbar-right">
            <button className="rh-lang-btn" onClick={()=>setLang(g=>g==='en'?'hi':'en')}>{lang==='en'?'🇮🇳 हिंदी':'🇬🇧 English'}</button>
            <button className="rh-notif-btn" onClick={()=>setShowNotif(o=>!o)}>🔔{unreadCount>0&&<span className="rh-notif-badge">{unreadCount}</span>}</button>
            <div className="rh-topbar-avatar" onClick={()=>setTab(4)}>{hirer.name[0]}</div>
          </div>
        </div>
        {showNotif && (
          <div className="rh-notif-drop">
            <div className="rh-notif-head"><h4>{l('Notifications','सूचनाएं')}</h4><button onClick={()=>setShowNotif(false)}>✕</button></div>
            {NOTIFS_INIT.map((n,i)=>(<div key={i} className={`rh-notif-item ${n.unread?'rh-notif-item--unread':''}`}><span className="rh-notif-icon">{n.icon}</span><div><p>{n.text}</p><span>{n.time}</span></div></div>))}
          </div>
        )}
      </header>

      {/* ── MOBILE MENU ── */}
      {showMenu && (
        <div className="rh-menu-overlay" onClick={()=>setShowMenu(false)}>
          <div className="rh-menu" onClick={e=>e.stopPropagation()}>
            <div className="rh-menu-head">
              <div className="rh-menu-avatar">{hirer.name[0]}</div>
              <div><p className="rh-menu-name">{hirer.name}</p><p className="rh-menu-skill">🏠 {l(hirer.type,hirer.typeHi)}</p></div>
              <button onClick={()=>setShowMenu(false)}>✕</button>
            </div>
            <button className="rh-menu-item" style={{background:'#EDFCE9',color:'#138808',fontWeight:800,textAlign:'center',marginBottom:8}} onClick={()=>{setShowMenu(false);openPostJob();}}>+ {l('Post a Job','जॉब पोस्ट करें')}</button>
            {TABS.map((t,i)=>(<button key={i} className="rh-menu-item" onClick={()=>{setTab(i);setShowMenu(false);}}>{t}</button>))}
            <button className="rh-menu-logout" onClick={()=>navigate('/')}>🚪 {l('Logout','लॉगआउट')}</button>
          </div>
        </div>
      )}

      <div className="rh-body">
        {/* ── SIDEBAR ── */}
        <aside className="rh-sidebar">
          <div className="rh-sidebar-profile">
            <div className="rh-sidebar-av">{hirer.name[0]}</div>
            <div className="rh-sidebar-info">
              <h3>{hirer.name}</h3>
              <p>🏠 {l(hirer.type,hirer.typeHi)}</p>
              <p className="rh-sidebar-city">📍 {hirer.city}</p>
              <span className="rh-sidebar-badge">✓ {l('OTP Verified','OTP वेरिफाइड')}</span>
            </div>
          </div>
          <button className="rh-post-job-btn" onClick={openPostJob}>+ {l('Post a New Job','नई जॉब पोस्ट करें')}</button>
          <div className="rh-sidebar-stats">
            {[{n:hirer.totalJobs,lb:l('Jobs Posted','जॉब पोस्ट'),icon:'📋'},{n:hirer.activeJobs,lb:l('Active','सक्रिय'),icon:'🟢'},{n:hirer.totalHires,lb:l('Total Hires','कुल हायर'),icon:'👷'},{n:hirer.rating,lb:l('Rating','रेटिंग'),icon:'⭐'}].map((s,i)=>(
              <div key={i} className="rh-sidebar-stat"><span className="rh-sidebar-stat-icon">{s.icon}</span><span className="rh-sidebar-stat-n">{s.n}</span><span className="rh-sidebar-stat-l">{s.lb}</span></div>
            ))}
          </div>
          <nav className="rh-sidebar-nav">
            {TABS.map((t,i)=>(<button key={i} className={`rh-nav-item ${tab===i?'rh-nav-item--on':''}`} onClick={()=>setTab(i)}>{t}</button>))}
          </nav>
          <button className="rh-sidebar-logout" onClick={()=>navigate('/')}>🚪 {l('Logout','लॉगआउट')}</button>
        </aside>

        {/* ── MAIN ── */}
        <main className="rh-main">

          {/* ══ TAB 0 — MY JOBS ══ */}
          {tab===0 && (
            <div className="rh-tab-content">
              <div className="rh-tab-header">
                <div><h2>{l('My Job Posts','मेरी जॉब पोस्ट')}</h2><p>{l(`${jobs.length} jobs posted total`,`कुल ${jobs.length} जॉब पोस्ट`)}</p></div>
                <button className="rh-post-btn-top" onClick={openPostJob}>+ {l('Post New Job','नई जॉब')}</button>
              </div>
              <div className="rh-filter-row">
                {[{key:'all',lb:l('All','सभी')},{key:'active',lb:l('Active','सक्रिय')},{key:'in_progress',lb:l('In Progress','जारी')},{key:'completed',lb:l('Completed','पूर्ण')}].map(f=>(
                  <button key={f.key} className={`rh-filter-chip ${jobFilter===f.key?'rh-filter-chip--on':''}`} onClick={()=>setJobFilter(f.key)}>{f.lb}</button>
                ))}
              </div>
              <div className="rh-jobs-list">
                {filteredJobs.map(job=>(
                  <div key={job.id} className="rh-job-card">
                    <div className="rh-job-card-top">
                      <div className="rh-job-icon">🔧</div>
                      <div className="rh-job-info">
                        <h3>{job.title}</h3>
                        <p>📍 {job.city} · 🕐 {l('Posted','पोस्ट')} {job.posted}</p>
                      </div>
                      <div className="rh-job-badges">
                        {job.urgent && <span className="rh-tag rh-tag--red">🔴 {l('Urgent','अर्जेंट')}</span>}
                        {job.status==='active' && <span className="rh-tag rh-tag--green">● {l('Active','सक्रिय')}</span>}
                        {job.status==='in_progress' && <span className="rh-tag rh-tag--orange">⚡ {l('In Progress','जारी')}</span>}
                        {job.status==='completed' && <span className="rh-tag rh-tag--blue">✅ {l('Done','पूर्ण')}</span>}
                      </div>
                    </div>
                    <div className="rh-job-card-mid">
                      <div className="rh-job-detail"><span>💰</span><span className="rh-job-salary">₹{job.salaryMin}{job.salaryMax>job.salaryMin?`-${job.salaryMax}`:''}/day</span></div>
                      <div className="rh-job-detail"><span>⏳</span><span>{job.days} {l('days','दिन')}</span></div>
                      <div className="rh-job-detail"><span>🔧</span><span>{job.skill}</span></div>
                      <div className="rh-job-detail"><span>📅</span><span>{job.deadline}</span></div>
                    </div>
                    {job.photos && <div className="rh-job-photos">{job.photos.slice(0,4).map((p,i)=><img key={i} src={p} alt="" className="rh-job-photo"/>)}{job.photos.length>4&&<div className="rh-job-photo-more">+{job.photos.length-4}</div>}</div>}
                    <div className="rh-job-card-bottom">
                      <div className="rh-job-applicants-info"><span>👥</span><span className="rh-applicant-count">{job.applicants}</span><span>{l('applicants','आवेदक')}</span></div>
                      <div className="rh-job-actions">
                        {job.status==='active' && <button className="rh-btn-view-applicants" onClick={()=>{setSelectedJobId(job.id);setTab(1);}}>👷 {l('Applicants','आवेदक')}</button>}
                        {job.status==='in_progress' && <button className="rh-btn-view-applicants" style={{background:'linear-gradient(135deg,#138808,#1CAD0A)'}} onClick={()=>setTab(2)}>⚡ {l('Active Job','सक्रिय')}</button>}
                        {job.status!=='completed' && <button className="rh-btn-edit" onClick={()=>setEditingJob({...job})}>✏️</button>}
                        {job.status==='active' && <button className="rh-btn-delete" onClick={()=>handleDeleteJob(job.id)}>🗑️</button>}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredJobs.length===0 && <div className="rh-empty"><span>📋</span><p>{l('No jobs with this filter.','इस फ़िल्टर से कोई जॉब नहीं।')}</p><button className="rh-empty-btn" onClick={openPostJob}>+ {l('Post a Job','जॉब पोस्ट करें')}</button></div>}
              </div>
            </div>
          )}

          {/* ══ TAB 1 — APPLICANTS ══ */}
          {tab===1 && (
            <div className="rh-tab-content">
              <div className="rh-tab-header"><div><h2>{l('Applicants','आवेदक')}</h2><p>{l('Workers who applied to your jobs','आपकी जॉब के लिए अप्लाई करने वाले मजदूर')}</p></div></div>
              <div className="rh-applicant-header">
                <span style={{fontSize:14,fontWeight:700,color:'#5A4E44'}}>{l('Select Job:','जॉब चुनें:')}</span>
                <select className="rh-job-select" value={selectedJobId} onChange={e=>setSelectedJobId(Number(e.target.value))}>
                  {activeJobs.map(j=>(<option key={j.id} value={j.id}>{j.title} ({j.applicants} {l('applicants','आवेदक')})</option>))}
                </select>
              </div>
              <div className="rh-applicants-list">
                {(APPLICANTS_DB[selectedJobId]||[]).map(w=>(
                  <div key={w.id} className="rh-applicant-card">
                    <div className="rh-applicant-left">
                      <div className="rh-applicant-av">{w.name[0]}</div>
                      <div className="rh-applicant-info">
                        <h4>{w.name} {w.verified && <span style={{fontSize:11,color:'#138808',marginLeft:4}}>🛡️ {l('Verified','वेरिफाइड')}</span>}</h4>
                        <p>📍 {w.city} · ⭐ {w.rating}/5 · {w.experience} {l('yrs','साल')} · {w.jobs} {l('jobs','काम')}</p>
                        <div className="rh-applicant-skills">{w.skills.map((s,i)=><span key={i} className="rh-applicant-skill-tag">{s}</span>)}</div>
                      </div>
                    </div>
                    <div className="rh-applicant-right">
                      <div className="rh-applicant-actions">
                        <button className="rh-btn-view-profile" onClick={()=>setViewWorker(w)}>👤 {l('Profile','प्रोफाइल')}</button>
                        <button className={`rh-btn-contact ${contactedWorkers.includes(w.id)?'rh-btn-contacted':''}`} onClick={()=>!contactedWorkers.includes(w.id)&&handleContactWorker(w)}>
                          📞 {contactedWorkers.includes(w.id)?l('Contacted','संपर्क किया'):l('Contact','संपर्क')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!APPLICANTS_DB[selectedJobId]||APPLICANTS_DB[selectedJobId].length===0)&&<div className="rh-empty"><span>👷</span><p>{l('No applicants yet.','अभी कोई आवेदक नहीं।')}</p></div>}
              </div>
            </div>
          )}

          {/* ══ TAB 2 — ACTIVE JOB ══ */}
          {tab===2 && (
            <div className="rh-tab-content">
              <div className="rh-tab-header"><div><h2>{l('Active Job','सक्रिय काम')}</h2><p>{l('Your current job in progress','आपका वर्तमान जारी काम')}</p></div></div>
              {activeJob ? (
                <div className="rh-job-card" style={{overflow:'hidden',padding:0}}>
                  <div className="rh-active-banner"><span>⚡ {l('Job In Progress','काम जारी है')}</span><span>{activeJob.startDate} → {activeJob.endDate}</span></div>
                  <div style={{padding:22}}>
                    <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:10}}>{activeJob.title}</h2>
                    <div className="rh-job-card-mid" style={{margin:'16px 0'}}>
                      <div className="rh-job-detail"><span>👷</span><span style={{fontWeight:700}}>{activeJob.worker}</span></div>
                      <div className="rh-job-detail"><span>📞</span><span>{activeJob.workerMobile}</span></div>
                      <div className="rh-job-detail"><span>📍</span><span>{activeJob.city}</span></div>
                      <div className="rh-job-detail"><span>💰</span><span className="rh-job-salary">₹{activeJob.salaryMin}-{activeJob.salaryMax}/day</span></div>
                      <div className="rh-job-detail"><span>⏳</span><span>{activeJob.days} {l('days','दिन')}</span></div>
                    </div>
                    <div className="rh-confirm-section">
                      <h4>{l('Job Completion Confirmation','काम पूर्णता पुष्टि')}</h4>
                      <p>{l('Both you and the worker must confirm to complete the job and unlock ratings.','रेटिंग अनलॉक करने के लिए आप दोनों को पुष्टि करनी होगी।')}</p>
                      <div className="rh-confirm-row">
                        <div className={`rh-confirm-box ${activeJob.workerConfirmed?'rh-confirm-box--done':''}`}><span>{activeJob.workerConfirmed?'✅':'⬜'}</span><span>{l("Worker's Confirmation",'मजदूर की पुष्टि')}</span></div>
                        <div className="rh-confirm-arrow">→</div>
                        <div className={`rh-confirm-box ${activeJob.hirerConfirmed?'rh-confirm-box--done':''}`}><span>{activeJob.hirerConfirmed?'✅':'⬜'}</span><span>{l('Your Confirmation','आपकी पुष्टि')}</span></div>
                      </div>
                      {!activeJob.hirerConfirmed && <button className="rh-confirm-btn" onClick={()=>handleHirerConfirm(activeJob.id)}>✅ {l('I confirm — work is complete','मैं पुष्टि करता/करती हूं — काम पूरा')}</button>}
                      {activeJob.hirerConfirmed && !activeJob.workerConfirmed && <div className="rh-confirm-waiting">⏳ {l('Waiting for worker to confirm...','मजदूर की पुष्टि का इंतजार...')}</div>}
                      {activeJob.hirerConfirmed && activeJob.workerConfirmed && <div className="rh-confirm-done">🎉 {l('Job completed! You can now rate the worker.','काम पूर्ण! अब मजदूर को रेट करें।')}</div>}
                    </div>
                  </div>
                </div>
              ) : <div className="rh-empty"><span>⚡</span><p>{l('No active job right now.','अभी कोई सक्रिय काम नहीं।')}</p><button className="rh-empty-btn" onClick={openPostJob}>+ {l('Post a Job','जॉब पोस्ट करें')}</button></div>}
            </div>
          )}

          {/* ══ TAB 3 — PAST JOBS ══ */}
          {tab===3 && (
            <div className="rh-tab-content">
              <div className="rh-tab-header"><div><h2>{l('Past Jobs','पिछले काम')}</h2><p>{l(`${jobs.filter(j=>j.status==='completed').length} jobs completed`,`${jobs.filter(j=>j.status==='completed').length} काम पूरे`)}</p></div></div>
              <div className="rh-past-list">
                {jobs.filter(j=>j.status==='completed').map(job=>(
                  <div key={job.id} className="rh-past-card">
                    <div className="rh-past-card-top">
                      <div><h3>{job.title}</h3><p>👷 {job.worker} · 📅 {job.completedDate}</p></div>
                      <div className="rh-past-rating"><Stars n={job.rating}/><span style={{fontSize:14,fontWeight:800,color:'#F59E0B'}}>{job.rating}/5</span></div>
                    </div>
                    <div className="rh-past-details">
                      <div className="rh-past-detail"><span>💰</span><span style={{fontWeight:700}}>₹{job.salaryMin}{job.salaryMax>job.salaryMin?`-${job.salaryMax}`:''}/day</span></div>
                      <div className="rh-past-detail"><span>⏳</span><span>{job.days} {l('days','दिन')}</span></div>
                      <div className="rh-past-detail"><span>🔧</span><span>{job.skill}</span></div>
                      <div className="rh-past-detail"><span>📍</span><span>{job.city}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ TAB 4 — PROFILE ══ */}
          {tab===4 && (
            <div className="rh-tab-content">
              <div className="rh-tab-header"><div><h2>{l('My Profile','मेरी प्रोफाइल')}</h2><p>{l('Your hirer profile','आपकी हायरर प्रोफाइल')}</p></div><button className="rh-edit-btn" onClick={()=>{setEditProfile({...hirer});setShowEditProfile(true);}}>✏️ {l('Edit Profile','प्रोफाइल बदलें')}</button></div>
              <div className="rh-profile-card">
                <div className="rh-profile-top">
                  <div className="rh-profile-big-av">{hirer.name[0]}</div>
                  <div className="rh-profile-identity">
                    <div className="rh-profile-name-row"><h2>{hirer.name}</h2><span className="rh-profile-type-pill">🏠 {l(hirer.type,hirer.typeHi)}</span></div>
                    <p>📍 {hirer.city}</p><p>📞 {hirer.mobile}</p><p>📧 {hirer.email}</p>
                    <div style={{marginTop:6,display:'flex',alignItems:'center',gap:6}}><Stars n={Math.round(hirer.rating)}/><span style={{fontSize:12,color:'#9A8E84'}}>{hirer.rating}/5</span></div>
                  </div>
                </div>
                <div className="rh-profile-bio"><h4>{l('About','बारे में')}</h4><p>{hirer.bio}</p></div>
                <div className="rh-profile-grid">
                  {[[l('Member Since','सदस्य'),hirer.joined],[l('Jobs Posted','जॉब'),hirer.totalJobs],[l('Total Hires','हायर'),hirer.totalHires],[l('Rating','रेटिंग'),`${hirer.rating} ⭐`],[l('City','शहर'),hirer.city],[l('Address','पता'),hirer.address]].map(([k,v],i)=>(
                    <div key={i} className="rh-profile-grid-item"><span>{k}</span><strong>{v}</strong></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ POST JOB MODAL ══ */}
      {showPostJob && (
        <div className="rh-modal-overlay" onClick={()=>setShowPostJob(false)}>
          <div className="rh-modal" style={{maxWidth:580}} onClick={e=>e.stopPropagation()}>
            <div className="rh-modal-header"><h3>{l('Post a New Job','नई जॉब पोस्ट करें')}</h3><button className="rh-modal-close" onClick={()=>setShowPostJob(false)}>✕</button></div>
            {/* Steps */}
            <div className="rh-step-indicator">
              <div className={`rh-step-dot ${postStep>=0?postStep===0?'rh-step-dot--active':'rh-step-dot--done':''}`}>1</div>
              <div className={`rh-step-line ${postStep>0?'rh-step-line--done':''}`}/>
              <div className={`rh-step-dot ${postStep>=1?postStep===1?'rh-step-dot--active':'rh-step-dot--done':''}`}>2</div>
              <div className={`rh-step-line ${postStep>1?'rh-step-line--done':''}`}/>
              <div className={`rh-step-dot ${postStep===2?'rh-step-dot--active':''}`}>3</div>
            </div>

            {/* Step 0: Details */}
            {postStep===0 && (<>
              <div className="rh-form-field"><label>{l('Job Title','जॉब टाइटल')} <em>*</em></label><input className="rh-form-input" placeholder={l('e.g. Need 2 Masons for bathroom work','जैसे: बाथरूम के लिए 2 मिस्त्री चाहिए')} value={newJob.title} onChange={e=>setNewJob(j=>({...j,title:e.target.value}))}/></div>
              <div className="rh-form-row">
                <div className="rh-form-field"><label>{l('Skill Needed','स्किल')} <em>*</em></label><select className="rh-form-input" value={newJob.skill} onChange={e=>setNewJob(j=>({...j,skill:e.target.value}))}>{SKILL_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="rh-form-field"><label>{l('Days Required','दिन')} <em>*</em></label><input className="rh-form-input" type="number" min="1" placeholder="5" value={newJob.days} onChange={e=>setNewJob(j=>({...j,days:e.target.value}))}/></div>
              </div>
              <div className="rh-form-row">
                <div className="rh-form-field"><label>{l('Min Salary (₹/day)','न्यूनतम वेतन')} <em>*</em></label><input className="rh-form-input" type="number" placeholder="600" value={newJob.salaryMin} onChange={e=>setNewJob(j=>({...j,salaryMin:e.target.value}))}/></div>
                <div className="rh-form-field"><label>{l('Max Salary (₹/day)','अधिकतम वेतन')}</label><input className="rh-form-input" type="number" placeholder="800" value={newJob.salaryMax} onChange={e=>setNewJob(j=>({...j,salaryMax:e.target.value}))}/></div>
              </div>
              <div className="rh-form-field"><label>{l('Work Location / City','कार्य स्थान / शहर')} <em>*</em></label><input className="rh-form-input" placeholder={l('e.g. Varachha, Surat','जैसे: वराछा, सूरत')} value={newJob.city} onChange={e=>setNewJob(j=>({...j,city:e.target.value}))}/></div>
              <div className="rh-form-field"><label>{l('Full Address','पूरा पता')} <em>*</em></label><input className="rh-form-input" placeholder={l('House/Shop no, Street, Area','मकान/दुकान नं, गली, क्षेत्र')} value={newJob.address} onChange={e=>setNewJob(j=>({...j,address:e.target.value}))}/></div>
              <div className="rh-form-field"><label>{l('Application Deadline','अंतिम तिथि')} <em>*</em></label><input className="rh-form-input" type="date" value={newJob.deadline} onChange={e=>setNewJob(j=>({...j,deadline:e.target.value}))}/></div>
              <div className="rh-form-field"><label>{l('Job Description','विवरण')}</label><textarea className="rh-form-input" rows={3} placeholder={l('Describe the work details...','काम का विवरण लिखें...')} value={newJob.description} onChange={e=>setNewJob(j=>({...j,description:e.target.value}))}/></div>
              <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:700,color:'#5A4E44',cursor:'pointer'}}><input type="checkbox" checked={newJob.urgent} onChange={e=>setNewJob(j=>({...j,urgent:e.target.checked}))} style={{width:18,height:18,accentColor:'#DC2626'}}/> 🔴 {l('Mark as Urgent','अर्जेंट मार्क करें')}</label>
              <div className="rh-form-btns"><div/><button className="rh-form-btn-next" disabled={!canPostStep1} onClick={()=>setPostStep(1)}>{l('Next → Upload Photos','अगला → फोटो अपलोड')}</button></div>
            </>)}

            {/* Step 1: Photos */}
            {postStep===1 && (<>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:6}}>{l('Upload 5 Work Photos','5 काम की फोटो अपलोड करें')}</h4>
              <p style={{fontSize:13,color:'#9A8E84',marginBottom:16,lineHeight:1.6}}>{l('Workers need to see the actual work site. Upload 5 real photos. This prevents fake job posts and builds trust.','मजदूरों को असली काम की जगह दिखनी चाहिए। 5 असली फोटो अपलोड करें।')}</p>
              <div className="rh-photo-grid">
                {jobPhotos.map((photo,i)=>(
                  <div key={i} className={`rh-photo-slot ${photo?'rh-photo-slot--filled':''}`} onClick={()=>!photo&&handlePhotoUpload(i)}>
                    {photo ? (<><img src={photo} alt={`Work ${i+1}`}/><button className="rh-photo-remove" onClick={e=>{e.stopPropagation();removePhoto(i);}}>✕</button></>) : (<><span className="rh-photo-icon">📷</span><span>{l(`Photo ${i+1}`,`फोटो ${i+1}`)}</span></>)}
                  </div>
                ))}
              </div>
              <p style={{fontSize:13,fontWeight:700,color:filledPhotos===5?'#138808':'#D97706',textAlign:'center'}}>{filledPhotos}/5 {l('photos uploaded','फोटो अपलोड')}</p>
              <div className="rh-form-btns"><button className="rh-form-btn-back" onClick={()=>setPostStep(0)}>← {l('Back','पीछे')}</button><button className="rh-form-btn-next" disabled={!canPostStep2} onClick={()=>setPostStep(2)}>{l('Next → Preview','अगला → प्रीव्यू')}</button></div>
            </>)}

            {/* Step 2: Preview */}
            {postStep===2 && (<>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:16}}>{l('Preview Your Job Post','अपनी जॉब पोस्ट देखें')}</h4>
              <div className="rh-preview-card">
                {[[l('Title','टाइटल'),newJob.title],[l('Skill','स्किल'),newJob.skill],[l('Salary','वेतन'),`₹${newJob.salaryMin}${newJob.salaryMax?`-${newJob.salaryMax}`:''}/day`],[l('Duration','अवधि'),`${newJob.days} ${l('days','दिन')}`],[l('Location','स्थान'),newJob.city],[l('Address','पता'),newJob.address],[l('Deadline','तिथि'),newJob.deadline],[l('Urgent','अर्जेंट'),newJob.urgent?'🔴 Yes':'No']].map(([k,v],i)=>(
                  <div key={i} className="rh-preview-row"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
              {newJob.description && <div style={{marginTop:12}}><p style={{fontSize:12,fontWeight:700,color:'#9A8E84',textTransform:'uppercase',marginBottom:4}}>{l('Description','विवरण')}</p><p style={{fontSize:14,color:'#5A4E44',lineHeight:1.6}}>{newJob.description}</p></div>}
              <div className="rh-job-photos" style={{marginTop:14}}>{jobPhotos.filter(Boolean).map((p,i)=><img key={i} src={p} alt="" className="rh-job-photo"/>)}</div>
              <div className="rh-form-btns"><button className="rh-form-btn-back" onClick={()=>setPostStep(1)}>← {l('Back','पीछे')}</button><button className="rh-form-btn-next" style={{background:'linear-gradient(135deg,#138808,#1CAD0A)'}} onClick={handleSubmitJob}>✅ {l('Post Job Now','अभी जॉब पोस्ट करें')}</button></div>
            </>)}
          </div>
        </div>
      )}

      {/* ══ EDIT PROFILE MODAL ══ */}
      {showEditProfile && (
        <div className="rh-modal-overlay" onClick={()=>setShowEditProfile(false)}>
          <div className="rh-modal" onClick={e=>e.stopPropagation()}>
            <div className="rh-modal-header"><h3>{l('Edit Profile','प्रोफाइल बदलें')}</h3><button className="rh-modal-close" onClick={()=>setShowEditProfile(false)}>✕</button></div>
            <div className="rh-form-row"><div className="rh-form-field"><label>{l('Name','नाम')}</label><input className="rh-form-input" value={editProfile.name} onChange={e=>setEditProfile(p=>({...p,name:e.target.value}))}/></div><div className="rh-form-field"><label>{l('City','शहर')}</label><input className="rh-form-input" value={editProfile.city} onChange={e=>setEditProfile(p=>({...p,city:e.target.value}))}/></div></div>
            <div className="rh-form-row"><div className="rh-form-field"><label>{l('Mobile 1','मोबाइल 1')}</label><input className="rh-form-input" value={editProfile.mobile} onChange={e=>setEditProfile(p=>({...p,mobile:e.target.value}))}/></div><div className="rh-form-field"><label>{l('Mobile 2','मोबाइल 2')}</label><input className="rh-form-input" value={editProfile.mobile2} onChange={e=>setEditProfile(p=>({...p,mobile2:e.target.value}))}/></div></div>
            <div className="rh-form-field"><label>{l('Email','ईमेल')}</label><input className="rh-form-input" value={editProfile.email} onChange={e=>setEditProfile(p=>({...p,email:e.target.value}))}/></div>
            <div className="rh-form-field"><label>{l('Address','पता')}</label><input className="rh-form-input" value={editProfile.address} onChange={e=>setEditProfile(p=>({...p,address:e.target.value}))}/></div>
            <div className="rh-form-field"><label>{l('About','बारे में')}</label><textarea className="rh-form-input" rows={3} value={editProfile.bio} onChange={e=>setEditProfile(p=>({...p,bio:e.target.value}))}/></div>
            <div className="rh-form-btns"><button className="rh-form-btn-back" onClick={()=>setShowEditProfile(false)}>{l('Cancel','रद्द')}</button><button className="rh-form-btn-next" onClick={handleSaveProfile}>✅ {l('Save Changes','बदलाव सेव करें')}</button></div>
          </div>
        </div>
      )}

      {/* ══ EDIT JOB MODAL ══ */}
      {editingJob && (
        <div className="rh-modal-overlay" onClick={()=>setEditingJob(null)}>
          <div className="rh-modal" onClick={e=>e.stopPropagation()}>
            <div className="rh-modal-header"><h3>{l('Edit Job','जॉब बदलें')}</h3><button className="rh-modal-close" onClick={()=>setEditingJob(null)}>✕</button></div>
            <div className="rh-form-field"><label>{l('Title','टाइटल')}</label><input className="rh-form-input" value={editingJob.title} onChange={e=>setEditingJob(j=>({...j,title:e.target.value}))}/></div>
            <div className="rh-form-row"><div className="rh-form-field"><label>{l('Skill','स्किल')}</label><select className="rh-form-input" value={editingJob.skill} onChange={e=>setEditingJob(j=>({...j,skill:e.target.value}))}>{SKILL_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div><div className="rh-form-field"><label>{l('Days','दिन')}</label><input className="rh-form-input" type="number" value={editingJob.days} onChange={e=>setEditingJob(j=>({...j,days:Number(e.target.value)}))}/></div></div>
            <div className="rh-form-row"><div className="rh-form-field"><label>{l('Min Salary','न्यूनतम')}</label><input className="rh-form-input" type="number" value={editingJob.salaryMin} onChange={e=>setEditingJob(j=>({...j,salaryMin:Number(e.target.value)}))}/></div><div className="rh-form-field"><label>{l('Max Salary','अधिकतम')}</label><input className="rh-form-input" type="number" value={editingJob.salaryMax} onChange={e=>setEditingJob(j=>({...j,salaryMax:Number(e.target.value)}))}/></div></div>
            <div className="rh-form-field"><label>{l('Location','स्थान')}</label><input className="rh-form-input" value={editingJob.city} onChange={e=>setEditingJob(j=>({...j,city:e.target.value}))}/></div>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:700,color:'#5A4E44',cursor:'pointer',marginBottom:12}}><input type="checkbox" checked={editingJob.urgent} onChange={e=>setEditingJob(j=>({...j,urgent:e.target.checked}))} style={{width:18,height:18,accentColor:'#DC2626'}}/> 🔴 {l('Urgent','अर्जेंट')}</label>
            <div className="rh-form-btns"><button className="rh-form-btn-back" onClick={()=>setEditingJob(null)}>{l('Cancel','रद्द')}</button><button className="rh-form-btn-next" onClick={handleSaveEditJob}>✅ {l('Save Changes','बदलाव सेव करें')}</button></div>
          </div>
        </div>
      )}

      {/* ══ WORKER PROFILE MODAL ══ */}
      {viewWorker && (
        <div className="rh-modal-overlay" onClick={()=>setViewWorker(null)}>
          <div className="rh-modal" onClick={e=>e.stopPropagation()}>
            <div className="rh-modal-header"><h3>{l('Worker Profile','मजदूर प्रोफाइल')}</h3><button className="rh-modal-close" onClick={()=>setViewWorker(null)}>✕</button></div>
            <div className="rh-wp-top">
              <div className="rh-wp-avatar">{viewWorker.name[0]}</div>
              <div className="rh-wp-info">
                <div className="rh-wp-name-row"><h3>{viewWorker.name}</h3>{viewWorker.verified&&<span className="rh-wp-verified">🛡️ {l('Verified','वेरिफाइड')}</span>}</div>
                <p>📍 {viewWorker.city} · ⭐ {viewWorker.rating}/5</p>
                <p>{viewWorker.experience} {l('yrs experience','साल अनुभव')} · {viewWorker.jobs} {l('jobs done','काम पूरे')}</p>
              </div>
            </div>
            <div className="rh-wp-section"><h4>{l('Skills','कौशल')}</h4><div className="rh-wp-skills">{viewWorker.skills.map((s,i)=><span key={i} className="rh-wp-skill-tag">{s}</span>)}</div></div>
            <div className="rh-wp-section"><h4>{l('About','बारे में')}</h4><p className="rh-wp-bio">{viewWorker.bio}</p></div>
            <div className="rh-wp-section"><h4>{l('Quick Info','जानकारी')}</h4>
              <div className="rh-wp-grid">
                {[[l('Experience','अनुभव'),`${viewWorker.experience} ${l('years','साल')}`],[l('Jobs','काम'),viewWorker.jobs],[l('Rating','रेटिंग'),`${viewWorker.rating} ⭐`],[l('Languages','भाषाएं'),viewWorker.languages.join(', ')]].map(([k,v],i)=>(
                  <div key={i} className="rh-wp-grid-item"><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </div>
            {viewWorker.reviews.length>0 && <div className="rh-wp-section"><h4>{l('Reviews','समीक्षाएं')} ({viewWorker.reviews.length})</h4><div className="rh-wp-reviews">{viewWorker.reviews.map((r,i)=>(<div key={i} className="rh-wp-review"><div className="rh-wp-review-top"><span>{r.from}</span><span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></div><p>"{r.text}"</p></div>))}</div></div>}
            <div className="rh-wp-actions">
              <button className="rh-wp-contact-btn" onClick={()=>{handleContactWorker(viewWorker);setViewWorker(null);}}>📞 {l('Contact Worker','संपर्क करें')}</button>
              <button className="rh-wp-close-btn" onClick={()=>setViewWorker(null)}>{l('Close','बंद')}</button>
            </div>
          </div>
        </div>
      )}

      <a href="tel:18001234567" className="rh-helpline"><span>📞</span><span className="rh-helpline-text">{l('Help','सहायता')}</span></a>
    </div>
  );
}
