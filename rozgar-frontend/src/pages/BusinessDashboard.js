import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessDashboard.css';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Translation helper
  const t = {
    overview: language === 'en' ? 'Overview' : 'अवलोकन',
    myJobs: language === 'en' ? 'Bulk Jobs' : 'थोक नौकरियां',
    applicants: language === 'en' ? 'Bulk Screening' : 'थोक स्क्रीनिंग',
    workforce: language === 'en' ? 'Active Workforce' : 'सक्रिय कार्यबल',
    profile: language === 'en' ? 'Company Profile' : 'कंपनी प्रोफाइल',
    postJob: language === 'en' ? 'Post Bulk Job' : 'थोक नौकरी पोस्ट करें',
  };

  // State: Profile Options
  const [companyProfile, setCompanyProfile] = useState({
    name: 'BuildMate Infra Private Ltd.',
    shortName: 'BuildMate Infra',
    gstin: '09AABCB1234C1Z5',
    address: 'Cyber City, Sector 44, Gurgaon',
    description: 'Leading infrastructure development company specializing in residential complexes and highway construction across North India. Over 10 years of experience with automated workflows and a dedicated workforce of 500+ workers.',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'
  });
  const [editProfileForm, setEditProfileForm] = useState(companyProfile);

  // State: Jobs
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Residential Complex Phase 1', role: 'Masons & Helpers', req: 50, hired: 32, rate: '₹800/day', status: 'Active' },
    { id: 2, title: 'Highway Overpass', role: 'Heavy Machinery Operators', req: 10, hired: 10, rate: '₹1200/day', status: 'Completed' },
  ]);

  // State: Applicants
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'Suresh Verma', role: 'Mason', appliedJob: 'Residential Complex', exp: '5 Years', image: 'https://images.unsplash.com/photo-1543269664-56d56965d1d4?auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Mahesh D.', role: 'Helper', appliedJob: 'Residential Complex', exp: '2 Years', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Ramesh K.', role: 'Helper', appliedJob: 'Residential Complex', exp: '3 Years', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80' },
  ]);
  const [selectedAppIds, setSelectedAppIds] = useState([]);

  // State: Workforce (Active)
  const [workforce, setWorkforce] = useState([
    { id: 101, name: 'Amit Kumar', role: 'Mason', project: 'Brigade Residencia', attendance: '5/6 Days', payment: 'Pending', status: 'active', image: 'https://images.unsplash.com/photo-1543269664-56d56965d1d4?auto=format&fit=crop&w=100&q=80' },
    { id: 102, name: 'Sanjay N.', role: 'Electrician', project: 'Brigade Residencia', attendance: '6/6 Days', payment: 'Paid', status: 'active', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80' },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Action Handlers
  const toggleSelectApp = (id) => {
    setSelectedAppIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleHireSelected = () => {
    if (selectedAppIds.length === 0) return showToast('Please select at least one applicant.');
    const hired = applicants.filter(a => selectedAppIds.includes(a.id));
    const newWorkers = hired.map(a => ({
      id: Math.random(), name: a.name, role: a.role, project: a.appliedJob, attendance: '0/0 Days', payment: 'Pending', status: 'active', image: a.image
    }));
    
    setWorkforce([...newWorkers, ...workforce]);
    setApplicants(applicants.filter(a => !selectedAppIds.includes(a.id)));
    setSelectedAppIds([]);
    showToast(`✅ Successfully hired ${hired.length} workers!`);
  };

  const handleRejectSelected = () => {
    if (selectedAppIds.length === 0) return showToast('Please select at least one applicant.');
    const rejCount = selectedAppIds.length;
    setApplicants(applicants.filter(a => !selectedAppIds.includes(a.id)));
    setSelectedAppIds([]);
    showToast(`❌ Rejected ${rejCount} applicants.`);
  };

  const handleCloseJob = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Closed' } : j));
    showToast('Job marked as Closed');
  };

  const handleSaveProfile = () => {
    setCompanyProfile(editProfileForm);
    setIsEditProfileOpen(false);
    showToast('🏢 Company Profile updated successfully!');
  };

  return (
    <div className="business-dashboard-container">
      {/* Sidebar */}
      <div className={`business-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="business-brand">
          🏭 Rozgar<span>Connect</span>
        </div>
        
        <div className="company-profile-brief">
          <img src={companyProfile.logo} alt="Logo" className="company-logo" />
          <div className="company-info">
            <h3>{companyProfile.shortName}</h3>
            <span className="verified-badge">✓ Verified</span>
          </div>
        </div>

        <div className="nav-links">
          {[
            { id: 0, icon: '📊', label: t.overview },
            { id: 1, icon: '📋', label: t.myJobs },
            { id: 2, icon: '👥', label: t.applicants },
            { id: 3, icon: '👷', label: t.workforce },
            { id: 4, icon: '🏢', label: t.profile }
          ].map(tab => (
            <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>

        <div style={{marginTop: 'auto'}}>
          <div className="nav-item" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            🌐 {language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          </div>
          <div className="nav-item" onClick={() => navigate('/')}>
            🚪 Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="business-main">
        <div className="top-bar">
          <div className="header-title">
            <h1 style={{display:'flex', alignItems:'center', gap:'16px'}}>
              {activeTab === 0 && 'Dashboard Overview'}
              {activeTab === 1 && 'My Bulk Job Posts'}
              {activeTab === 2 && 'Screening & Applicants'}
              {activeTab === 3 && 'Active Workforce Management'}
              {activeTab === 4 && 'Company Profile'}
            </h1>
            <p>Manage your workforce and bulk requirements.</p>
          </div>
          <div className="header-actions">
            <button className="post-bulk-btn" onClick={() => setIsPostJobModalOpen(true)}>
              + {t.postJob}
            </button>
          </div>
        </div>

        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">📋</div>
                <div className="stat-details">
                  <h4>Active Bulk Jobs</h4>
                  <h2>{jobs.filter(j => j.status === 'Active').length}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">👷</div>
                <div className="stat-details">
                  <h4>Total Active Workforce</h4>
                  <h2>{workforce.length}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">👥</div>
                <div className="stat-details">
                  <h4>Pending Applications</h4>
                  <h2>{applicants.length}</h2>
                </div>
              </div>
            </div>

            <div className="data-table-container">
              <div className="table-header">
                <h2>Recent Workforce Activity (Last 48 Hrs)</h2>
              </div>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Project & Role</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workforce.slice(0,3).map(w => (
                    <tr key={w.id}>
                      <td>
                        <div className="worker-cell">
                          <img src={w.image} alt={w.name} className="worker-avatar"/>
                          <div>
                            <div className="worker-name">{w.name}</div>
                            <div className="worker-role">{w.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{w.project}</td>
                      <td>{w.attendance}</td>
                      <td><span className="status-pill active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 1: My Jobs */}
        {activeTab === 1 && (
          <div className="data-table-container">
            <div className="table-header">
              <h2>Active Bulk Postings</h2>
            </div>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Workers Required</th>
                  <th>Hired</th>
                  <th>Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong><br/><span style={{fontSize:12,color:'#778DA9'}}>{job.role}</span></td>
                    <td>{job.req}</td>
                    <td>{job.hired}</td>
                    <td>{job.rate}</td>
                    <td>
                      {job.status === 'Active' ? (
                        <>
                          <button className="action-btn" onClick={() => showToast('Edit modal coming soon...')}>✏️ Edit</button>
                          <button className="action-btn" onClick={() => handleCloseJob(job.id)} style={{color:'#D90429'}}>⏸ Close</button>
                        </>
                      ) : (
                        <span className="status-pill completed">{job.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Applicants (Bulk Screening) */}
        {activeTab === 2 && (
          <div className="data-table-container">
            <div className="table-header">
              <h2>Pending Applicants ({applicants.length})</h2>
              <div className="bulk-actions">
                <button className="btn-secondary" onClick={handleRejectSelected}>Reject Selected</button>
                <button className="post-bulk-btn" onClick={handleHireSelected}>Hire Selected ({selectedAppIds.length})</button>
              </div>
            </div>
            {applicants.length === 0 ? (
              <p style={{padding: '24px 0', textAlign: 'center', color: '#778DA9'}}>No pending applicants.</p>
            ) : (
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>
                       <input type="checkbox" onChange={(e) => {
                         if(e.target.checked) setSelectedAppIds(applicants.map(a => a.id));
                         else setSelectedAppIds([]);
                       }} checked={selectedAppIds.length === applicants.length && applicants.length > 0} />
                    </th>
                    <th>Candidate</th>
                    <th>Applied Job</th>
                    <th>Experience</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app.id}>
                      <td><input type="checkbox" checked={selectedAppIds.includes(app.id)} onChange={() => toggleSelectApp(app.id)} /></td>
                      <td>
                        <div className="worker-cell">
                          <img src={app.image} alt={app.name} className="worker-avatar"/>
                          <div>
                            <div className="worker-name">{app.name}</div>
                            <div className="worker-role">{app.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{app.appliedJob}</td>
                      <td>{app.exp}</td>
                      <td><button className="action-btn" onClick={()=>showToast('Worker profile details coming soon...')}>👁 View Full</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Active Workforce */}
        {activeTab === 3 && (
          <div className="data-table-container">
            <div className="table-header">
              <h2>Active Workforce Management ({workforce.length})</h2>
              <input type="text" placeholder="Search worker by name..." className="form-input" style={{width: 300}} />
            </div>
            {workforce.length === 0 ? (
              <p style={{padding: '24px 0', textAlign: 'center', color: '#778DA9'}}>No active workforce available.</p>
            ) : (
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Worker Details</th>
                    <th>Current Project</th>
                    <th>Attendance</th>
                    <th>Payment Status</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {workforce.map(w => (
                    <tr key={w.id}>
                      <td>
                        <div className="worker-cell">
                          <img src={w.image} alt={w.name} className="worker-avatar"/>
                          <div>
                            <div className="worker-name">{w.name}</div>
                            <div className="worker-role">{w.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{w.project}</td>
                      <td>{w.attendance}</td>
                      <td>
                        <span className={`status-pill ${w.payment === 'Paid' ? 'active' : 'pending'}`}>
                          {w.payment}
                        </span>
                      </td>
                      <td><button className="action-btn" onClick={()=>showToast(`📞 Calling ${w.name}...`)}>📞 Call</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 4 && (
          <div style={{display:'flex', gap:24, flexWrap:'wrap'}}>
            <div className="data-table-container" style={{flex: 1, minWidth: 300}}>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:16, marginBottom:24}}>
                <img src={companyProfile.logo} alt="Company Logo" style={{width:120, height:120, borderRadius:20, objectFit:'cover'}} />
                <h2 style={{textAlign:'center'}}>{companyProfile.name}</h2>
                <span className="verified-badge" style={{fontSize:14, padding:'6px 12px'}}>✓ Verified Business</span>
              </div>
              <div style={{borderBottom:'1px solid #eee', paddingBottom:16, marginBottom:16}}>
                <span style={{color:'#778DA9', fontSize:14}}>GSTIN</span>
                <p style={{margin:'4px 0', fontWeight:600}}>{companyProfile.gstin}</p>
              </div>
              <div style={{borderBottom:'1px solid #eee', paddingBottom:16, marginBottom:16}}>
                <span style={{color:'#778DA9', fontSize:14}}>Business Address</span>
                <p style={{margin:'4px 0', fontWeight:600}}>{companyProfile.address}</p>
              </div>
              <button className="btn-secondary" style={{width:'100%'}} onClick={() => setIsEditProfileOpen(true)}>Edit Company Profile</button>
            </div>
            
            <div className="data-table-container" style={{flex: 2, minWidth: 400}}>
              <h2>Company Details</h2>
              <p style={{color:'#415A77', lineHeight:1.6}}>
                {companyProfile.description}
              </p>
              
              <h3 style={{marginTop:32}}>Verification Documents</h3>
              <div style={{display:'flex', gap:16, marginTop:12}}>
                 <div style={{padding:16, border:'1px solid #E0E1DD', borderRadius:12, display:'flex', alignItems:'center', gap:12}}>
                   <div style={{background:'#F8F9FA', padding:12, borderRadius:8, fontSize:24}}>📄</div>
                   <div>
                     <b style={{display:'block'}}>GST Certificate.pdf</b>
                     <span style={{fontSize:12, color:'#2ECC71'}}>Verified</span>
                   </div>
                 </div>
                 <div style={{padding:16, border:'1px solid #E0E1DD', borderRadius:12, display:'flex', alignItems:'center', gap:12}}>
                   <div style={{background:'#F8F9FA', padding:12, borderRadius:8, fontSize:24}}>📄</div>
                   <div>
                     <b style={{display:'block'}}>Company PAN.pdf</b>
                     <span style={{fontSize:12, color:'#2ECC71'}}>Verified</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="biz-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Company Profile</h2>
              <button className="close-btn" onClick={() => setIsEditProfileOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Registered Company Name</label>
                <input type="text" className="form-input" value={editProfileForm.name} onChange={e => setEditProfileForm({...editProfileForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Display / Short Name</label>
                <input type="text" className="form-input" value={editProfileForm.shortName} onChange={e => setEditProfileForm({...editProfileForm, shortName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>GSTIN Number</label>
                <input type="text" className="form-input" value={editProfileForm.gstin} onChange={e => setEditProfileForm({...editProfileForm, gstin: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Registered Office Address</label>
                <input type="text" className="form-input" value={editProfileForm.address} onChange={e => setEditProfileForm({...editProfileForm, address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Company Description</label>
                <textarea className="form-input" rows="4" value={editProfileForm.description} onChange={e => setEditProfileForm({...editProfileForm, description: e.target.value})}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
              <button className="post-bulk-btn" onClick={handleSaveProfile}>Save Changes ✅</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Bulk Job Modal (Simplified logic equivalent to before) */}
      {isPostJobModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPostJobModalOpen(false)}>
          <div className="biz-modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post a Bulk Requirement</h2>
              <button className="close-btn" onClick={() => setIsPostJobModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Project Name / Job Title</label>
                  <input type="text" className="form-input" placeholder="e.g. Phase 2 Residential Tower Construction" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select className="form-input"><option>Mason</option><option>Helper</option></select>
                </div>
                <div className="form-group">
                  <label>Number of Workers Needed</label>
                  <input type="number" className="form-input" placeholder="e.g. 50" />
                </div>
                <div className="form-group">
                  <label>Daily Wage per Worker (₹)</label>
                  <input type="number" className="form-input" placeholder="e.g. 800" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsPostJobModalOpen(false)}>Cancel</button>
              <button className="post-bulk-btn" onClick={() => {
                showToast('🚀 Bulk Job Posted Successfully!');
                setIsPostJobModalOpen(false);
                setActiveTab(1); // Go to jobs tab
              }}>Publish Job Requirement</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toastMessage && (
        <div className="toast">
          ✨ {toastMessage}
        </div>
      )}
    </div>
  );
}
