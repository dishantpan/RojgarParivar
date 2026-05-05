import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './FormPage.css';
import { hirerRegister, businessRegister } from '../api';

const CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Mumbai', 'Pune', 'Delhi', 'Noida', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'Indore', 'Lucknow', 'Patna', 'Bhopal', 'Nagpur'];
const BUSINESS_TYPES = ['Construction Company', 'Manufacturing Factory', 'Warehouse / Logistics', 'Labour Contractor', 'Real Estate / Builder', 'Manpower Supplier', 'Retail / Shop', 'Hotel / Restaurant', 'IT / Office', 'Other'];

const REGULAR_STEPS = [{ id: 1, icon: '👤', title: 'Personal Info' }, { id: 2, icon: '🔒', title: 'Password' }];
const BUSINESS_STEPS = [{ id: 1, icon: '🏢', title: 'Business Info' }, { id: 2, icon: '👤', title: 'Owner Details' }, { id: 3, icon: '📄', title: 'Documents' }, { id: 4, icon: '🔒', title: 'Password' }];

export default function HirerSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const [hirerType, setHirerType] = useState(typeParam === 'business' ? 'business' : typeParam === 'regular' ? 'regular' : '');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [regular, setRegular] = useState({ name: '', mobile1: '', mobile2: '', email: '', address: '', password: '', confirmPassword: '' });
  const [business, setBusiness] = useState({
    companyName: '', businessType: '', city: '', address: '', yearsOld: '',
    ownerName: '', mobile1: '', mobile2: '', email: '',
    gst: '', license: null,
    password: '', confirmPassword: '',
  });

  const setR = (k, v) => setRegular(f => ({ ...f, [k]: v }));
  const setB = (k, v) => setBusiness(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (hirerType === 'regular') {
      if (step === 1) return regular.name && regular.mobile1.length === 10 && regular.email && regular.address;
      if (step === 2) return regular.password.length >= 6 && regular.password === regular.confirmPassword;
    }
    if (hirerType === 'business') {
      if (step === 1) return business.companyName && business.businessType && business.city && business.address;
      if (step === 2) return business.ownerName && business.mobile1.length === 10 && business.email;
      if (step === 3) return business.gst;
      if (step === 4) return business.password.length >= 6 && business.password === business.confirmPassword;
    }
    return true;
  };

  /* ── REGULAR HIRER SUBMIT ── */
  const handleRegularSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await hirerRegister({
        name: regular.name,
        mobile: regular.mobile1,
        mobile2: regular.mobile2,
        email: regular.email,
        address: regular.address,
        password: regular.password,
        city: regular.address.split(',').pop().trim() || 'Unknown',
      });
      navigate('/dashboard/regular');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── BUSINESS SUBMIT ── */
  const handleBusinessSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await businessRegister({
        companyName: business.companyName,
        businessType: business.businessType,
        city: business.city,
        address: business.address,
        yearsInBusiness: Number(business.yearsOld),
        ownerName: business.ownerName,
        mobile: business.mobile1,
        mobile2: business.mobile2,
        email: business.email,
        gstNumber: business.gst,
        password: business.password,
      });
      // Business goes to admin queue — show success, go home
      alert('✅ Application submitted! Our team will verify your business within 24–48 hours and notify you via Email, SMS and Phone Call.');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-root">
      <div className="fp-top-banner">
        <span>⚡ RozgarConnect</span>
        <span className="fp-banner-sep">|</span>
        <span>Hirer Registration — Connect with verified workers directly</span>
        <span className="fp-banner-sep">|</span>
        <span>✓ Verified workers</span>
        <span>✓ Direct hiring</span>
        <span>✓ Rating system</span>
      </div>

      <div className="fp-header">
        <button className="fp-back" onClick={() => step > 1 ? setStep(s => s - 1) : hirerType ? setHirerType('') : navigate('/')}>← Back</button>
        <div className="fp-header-title">
          {hirerType === 'business' ? '🏭 Business Signup' : hirerType === 'regular' ? '🏠 Regular Hirer Signup' : '🏢 Hirer Signup'}
        </div>
        <div style={{ width: 80 }}></div>
      </div>

      {/* ── TYPE SELECTION ── */}
      {!hirerType && (
        <div className="fp-body">
          <div className="fp-card anim-scaleIn">
            <div className="fp-card-head">
              <h2>👋 Welcome! Who are you?</h2>
              <p>Choose your hirer type to get started with the right signup form</p>
            </div>
            <div className="fp-hirer-types">
              <button className="fp-hirer-type-btn fp-hirer-type-btn--business" onClick={() => setHirerType('business')}>
                <span>🏭</span>
                <span>Business / Factory Owner</span>
                <p>Need 10+ workers for your factory, warehouse or construction site. Requires business verification.</p>
              </button>
              <button className="fp-hirer-type-btn" onClick={() => setHirerType('regular')}>
                <span>🏠</span>
                <span>Regular / Home Hirer</span>
                <p>Need 1–7 days of help for shifting, renovation, household or any general work.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REGULAR HIRER ── */}
      {hirerType === 'regular' && (
        <>
          <div className="fp-progress">
            {REGULAR_STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`fp-dot ${step >= s.id ? 'fp-dot--done' : ''} ${step === s.id ? 'fp-dot--cur' : ''}`}>
                  <div className="fp-dot-circle">{step > s.id ? '✓' : s.icon}</div>
                  <span>{s.title}</span>
                </div>
                {i < REGULAR_STEPS.length - 1 && <div className={`fp-line ${step > s.id ? 'fp-line--done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="fp-body">
            <div className="fp-card anim-scaleIn">

              {step === 1 && (
                <>
                  <div className="fp-card-head">
                    <h2>👤 Personal Information</h2>
                    <p>Basic details so workers can verify who is hiring them</p>
                  </div>
                  <div className="rc-field">
                    <label>Full Name *</label>
                    <input type="text" placeholder="Your full name" value={regular.name} onChange={e => setR('name', e.target.value)} />
                  </div>
                  <div className="rc-row2">
                    <div className="rc-field">
                      <label>Primary Mobile *</label>
                      <div className="rc-input-prefix">
                        <span>+91</span>
                        <input type="tel" maxLength={10} placeholder="9876543210" value={regular.mobile1} onChange={e => setR('mobile1', e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                    <div className="rc-field">
                      <label>Secondary Mobile (Optional)</label>
                      <div className="rc-input-prefix">
                        <span>+91</span>
                        <input type="tel" maxLength={10} placeholder="9876543210" value={regular.mobile2} onChange={e => setR('mobile2', e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                  </div>
                  <div className="rc-field">
                    <label>Email Address *</label>
                    <input type="email" placeholder="you@example.com" value={regular.email} onChange={e => setR('email', e.target.value)} />
                  </div>
                  <div className="rc-field">
                    <label>Full Address *</label>
                    <input type="text" placeholder="House no, Street, Area, City" value={regular.address} onChange={e => setR('address', e.target.value)} />
                    <span className="hint">This helps workers find your location for the job</span>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="fp-card-head">
                    <h2>🔒 Create Password</h2>
                    <p>Secure your account</p>
                  </div>
                  <div className="rc-field">
                    <label>Password *</label>
                    <input type="password" placeholder="••••••••" value={regular.password} onChange={e => setR('password', e.target.value)} />
                    <span className="hint">Minimum 6 characters</span>
                  </div>
                  <div className="rc-field">
                    <label>Confirm Password *</label>
                    <input type="password" placeholder="••••••••" value={regular.confirmPassword} onChange={e => setR('confirmPassword', e.target.value)} />
                    {regular.confirmPassword && regular.password !== regular.confirmPassword && <span className="error">❌ Passwords do not match</span>}
                    {regular.confirmPassword && regular.password === regular.confirmPassword && <span className="success-msg">✅ Passwords match</span>}
                  </div>

                  {error && (
                    <div style={{ background: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: 10, padding: '12px 16px', marginBottom: 12, color: '#C00', fontSize: 14, fontWeight: 600 }}>
                      ❌ {error}
                    </div>
                  )}

                  <div className="fp-summary">
                    <h4>📋 Account Summary</h4>
                    <div className="fp-sum-row"><span>👤</span><span>{regular.name}</span></div>
                    <div className="fp-sum-row"><span>📱</span><span>+91 {regular.mobile1}</span></div>
                    <div className="fp-sum-row"><span>📧</span><span>{regular.email}</span></div>
                    <div className="fp-sum-row"><span>📍</span><span>{regular.address}</span></div>
                  </div>
                </>
              )}

              <div className="fp-nav-btns">
                {step > 1 && <button className="fp-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>}
                {step < 2 ? (
                  <button className={`fp-btn-next ${!canNext() ? 'fp-btn-next--off' : ''}`} disabled={!canNext()} onClick={() => canNext() && setStep(s => s + 1)}>Continue →</button>
                ) : (
                  <button className={`fp-btn-next fp-btn-submit ${(!canNext() || loading) ? 'fp-btn-next--off' : ''}`} disabled={!canNext() || loading} onClick={handleRegularSubmit}>
                    {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                  </button>
                )}
              </div>
              <p className="fp-step-label">Step {step} of {REGULAR_STEPS.length}</p>
            </div>
          </div>
        </>
      )}

      {/* ── BUSINESS OWNER ── */}
      {hirerType === 'business' && (
        <>
          <div className="fp-progress">
            {BUSINESS_STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`fp-dot ${step >= s.id ? 'fp-dot--done' : ''} ${step === s.id ? 'fp-dot--cur' : ''}`}>
                  <div className="fp-dot-circle">{step > s.id ? '✓' : s.icon}</div>
                  <span>{s.title}</span>
                </div>
                {i < BUSINESS_STEPS.length - 1 && <div className={`fp-line ${step > s.id ? 'fp-line--done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="fp-body">
            <div className="fp-card anim-scaleIn">

              {step === 1 && (
                <>
                  <div className="fp-card-head">
                    <h2>🏢 Business Information</h2>
                    <p>Tell us about your company or business</p>
                  </div>
                  <div className="rc-field">
                    <label>Company / Business Name *</label>
                    <input type="text" placeholder="ABC Manufacturing Pvt Ltd" value={business.companyName} onChange={e => setB('companyName', e.target.value)} />
                  </div>
                  <div className="rc-field">
                    <label>Type of Business *</label>
                    <select value={business.businessType} onChange={e => setB('businessType', e.target.value)}>
                      <option value="">Select business type</option>
                      {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="rc-row2">
                    <div className="rc-field">
                      <label>City *</label>
                      <select value={business.city} onChange={e => setB('city', e.target.value)}>
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="rc-field">
                      <label>Business Age (Years)</label>
                      <input type="number" placeholder="5" min={0} value={business.yearsOld} onChange={e => setB('yearsOld', e.target.value)} />
                    </div>
                  </div>
                  <div className="rc-field">
                    <label>Full Business Address *</label>
                    <input type="text" placeholder="Unit no, Industrial Area, City, State, PIN" value={business.address} onChange={e => setB('address', e.target.value)} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="fp-card-head">
                    <h2>👤 Owner / Contact Details</h2>
                    <p>Who is responsible for this account?</p>
                  </div>
                  <div className="rc-field">
                    <label>Owner / Manager Name *</label>
                    <input type="text" placeholder="Full name" value={business.ownerName} onChange={e => setB('ownerName', e.target.value)} />
                  </div>
                  <div className="rc-row2">
                    <div className="rc-field">
                      <label>Primary Mobile *</label>
                      <div className="rc-input-prefix">
                        <span>+91</span>
                        <input type="tel" maxLength={10} placeholder="9876543210" value={business.mobile1} onChange={e => setB('mobile1', e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                    <div className="rc-field">
                      <label>Secondary Mobile</label>
                      <div className="rc-input-prefix">
                        <span>+91</span>
                        <input type="tel" maxLength={10} placeholder="9876543210" value={business.mobile2} onChange={e => setB('mobile2', e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                  </div>
                  <div className="rc-field">
                    <label>Business Email *</label>
                    <input type="email" placeholder="contact@yourbusiness.com" value={business.email} onChange={e => setB('email', e.target.value)} />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="fp-card-head">
                    <h2>📄 Business Documents</h2>
                    <p>Required for verification. Your account will be reviewed by our team.</p>
                  </div>
                  <div className="rc-field">
                    <label>GST Number *</label>
                    <input type="text" placeholder="22AAAAA0000A1Z5" maxLength={15} value={business.gst} onChange={e => setB('gst', e.target.value.toUpperCase())} />
                    <span className="hint">15-digit GST Identification Number</span>
                  </div>
                  <div className="rc-field">
                    <label>Business License / Registration (Optional but Recommended)</label>
                    <div className="fp-upload-box" onClick={() => document.getElementById('lic-upload').click()}>
                      {business.license ? (
                        <span className="fp-upload-done">✅ {business.license.name} uploaded</span>
                      ) : (
                        <>
                          <span className="fp-upload-icon">📤</span>
                          <span>Click to upload Business License</span>
                          <span className="fp-upload-hint">PDF, JPG, PNG — Max 10MB</span>
                        </>
                      )}
                    </div>
                    <input id="lic-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => setB('license', e.target.files[0])} />
                  </div>
                  <div className="fp-pending-notice">
                    <span>⏳</span>
                    <p>After signup, our team will verify your GST and business documents within <strong>24–48 hours</strong>. You will be notified via <strong>Email, SMS, and Phone Call</strong> once your account is approved.</p>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="fp-card-head">
                    <h2>🔒 Create Password</h2>
                    <p>Secure your business account</p>
                  </div>
                  <div className="rc-field">
                    <label>Password *</label>
                    <input type="password" placeholder="••••••••" value={business.password} onChange={e => setB('password', e.target.value)} />
                    <span className="hint">Minimum 6 characters</span>
                  </div>
                  <div className="rc-field">
                    <label>Confirm Password *</label>
                    <input type="password" placeholder="••••••••" value={business.confirmPassword} onChange={e => setB('confirmPassword', e.target.value)} />
                    {business.confirmPassword && business.password !== business.confirmPassword && <span className="error">❌ Passwords do not match</span>}
                    {business.confirmPassword && business.password === business.confirmPassword && <span className="success-msg">✅ Passwords match</span>}
                  </div>

                  {error && (
                    <div style={{ background: '#FFF0F0', border: '1px solid #FFB3B3', borderRadius: 10, padding: '12px 16px', marginBottom: 12, color: '#C00', fontSize: 14, fontWeight: 600 }}>
                      ❌ {error}
                    </div>
                  )}

                  <div className="fp-summary">
                    <h4>📋 Business Account Summary</h4>
                    <div className="fp-sum-row"><span>🏢</span><span>{business.companyName} ({business.businessType})</span></div>
                    <div className="fp-sum-row"><span>👤</span><span>{business.ownerName}</span></div>
                    <div className="fp-sum-row"><span>📱</span><span>+91 {business.mobile1}</span></div>
                    <div className="fp-sum-row"><span>📧</span><span>{business.email}</span></div>
                    <div className="fp-sum-row"><span>📍</span><span>{business.city} — {business.address}</span></div>
                    <div className="fp-sum-row"><span>🧾</span><span>GST: {business.gst}</span></div>
                  </div>
                </>
              )}

              <div className="fp-nav-btns">
                {step > 1 && <button className="fp-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>}
                {step < 4 ? (
                  <button className={`fp-btn-next ${!canNext() ? 'fp-btn-next--off' : ''}`} disabled={!canNext()} onClick={() => canNext() && setStep(s => s + 1)}>Continue →</button>
                ) : (
                  <button className={`fp-btn-next fp-btn-submit ${(!canNext() || loading) ? 'fp-btn-next--off' : ''}`} disabled={!canNext() || loading} onClick={handleBusinessSubmit}>
                    {loading ? '⏳ Submitting...' : '🚀 Submit Application'}
                  </button>
                )}
              </div>
              <p className="fp-step-label">Step {step} of {BUSINESS_STEPS.length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}