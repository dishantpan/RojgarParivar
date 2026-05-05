import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormPage.css';
import { workerRegister } from '../api';

const SKILLS = [
  'Mason / राजमिस्त्री','Carpenter / बढ़ई','Electrician / इलेक्ट्रीशियन',
  'Plumber / प्लंबर','Painter / पेंटर','Welder / वेल्डर',
  'Driver / ड्राइवर','Helper / हेल्पर','Loader / Unloader',
  'Factory Worker','Gardener / माली','Cook / रसोइया',
  'Security Guard','Housekeeping','AC Technician',
  'Tile Worker','Crane Operator','Forklift Operator',
  'Tailor / दर्जी','Fabricator','Surveyor','ITI Technician',
];
const CITIES = [
  'Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Anand',
  'Mumbai','Pune','Nashik','Nagpur','Delhi','Noida','Gurgaon',
  'Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Indore',
  'Bhopal','Lucknow','Kanpur','Patna','Coimbatore',
];
const EXP_OPTIONS = [
  {v:'fresher',l:'Fresher (0–6 months)'},
  {v:'1',l:'1 year'},{v:'2',l:'2 years'},
  {v:'3-5',l:'3–5 years'},{v:'5-10',l:'5–10 years'},{v:'10+',l:'10+ years'},
];
const STEPS = [
  {id:1,icon:'👤',title:'Basic Info'},
  {id:2,icon:'🔧',title:'Skills'},
  {id:3,icon:'📍',title:'Location'},
  {id:4,icon:'📄',title:'Documents'},
  {id:5,icon:'🔒',title:'Password'},
];

export default function WorkerSignup() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1);
  const [lang, setLang]   = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    firstName:'', lastName:'', mobile:'', age:'', gender:'',
    skills:[], currentCity:'', preferredCities:[],
    aadhar:null, otherDoc:null,
    password:'', confirmPassword:'',
  });
  const [skillSearch, setSkillSearch] = useState('');
  const [citySearch,  setCitySearch]  = useState('');

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const l   = (en,hi) => lang==='hi' ? hi : en;

  const toggleSkill = sk => {
    const ex = form.skills.find(s => s.name===sk);
    if (ex) set('skills', form.skills.filter(s => s.name!==sk));
    else    set('skills', [...form.skills, {name:sk, experience:''}]);
  };
  const setSkillExp = (sk,exp) => set('skills', form.skills.map(s => s.name===sk?{...s,experience:exp}:s));
  const toggleCity  = c => {
    if (form.preferredCities.includes(c)) set('preferredCities', form.preferredCities.filter(x=>x!==c));
    else if (form.preferredCities.length < 5) set('preferredCities', [...form.preferredCities, c]);
  };

  const canNext = () => {
    if (step===1) return form.firstName && form.lastName && form.mobile.length===10 && form.age>=18 && form.gender;
    if (step===2) return form.skills.length>0 && form.skills.every(s=>s.experience);
    if (step===3) return form.currentCity && form.preferredCities.length>0;
    if (step===4) return form.aadhar !== null;
    if (step===5) return form.password.length>=6 && form.password===form.confirmPassword;
    return true;
  };

  const filteredSkills = SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()));
  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  /* ── SUBMIT — calls real backend API ── */
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const workerData = {
        firstName:       form.firstName,
        lastName:        form.lastName,
        mobile:          form.mobile,
        age:             Number(form.age),
        gender:          form.gender.charAt(0).toUpperCase() + form.gender.slice(1), // Male/Female/Other
        skills:          form.skills.map(s => ({
                           name: s.name.split(' / ')[0], // just English part
                           experience: s.experience,
                         })),
        currentCity:     form.currentCity,
        preferredCities: form.preferredCities,
        password:        form.password,
      };

      await workerRegister(workerData);
      // workerRegister saves token to localStorage automatically
      navigate('/dashboard/worker');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-root">
      {/* Platform banner */}
      <div className="fp-top-banner">
        <span>⚡ RozgarConnect</span>
        <span className="fp-banner-sep">|</span>
        <span>{l('Worker Registration — Free & Quick','मजदूर रजिस्ट्रेशन — मुफ्त और तेज़')}</span>
        <span className="fp-banner-sep">|</span>
        <span>✓ {l('No middlemen','कोई दलाल नहीं')}</span>
        <span>✓ {l('Verified hirers','वेरिफाइड नियोक्ता')}</span>
        <span>✓ {l('Direct contact','सीधा संपर्क')}</span>
      </div>

      {/* Header */}
      <div className="fp-header">
        <button className="fp-back" onClick={() => step>1 ? setStep(s=>s-1) : navigate('/')}>
          ← {l('Back','वापस')}
        </button>
        <div className="fp-header-title">
          <span>👷</span> {l('Worker Sign Up','मजदूर साइन अप')}
        </div>
        <button className="fp-lang" onClick={() => setLang(x => x==='en'?'hi':'en')}>
          {lang==='en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
        </button>
      </div>

      {/* Progress */}
      <div className="fp-progress">
        {STEPS.map((s,i) => (
          <React.Fragment key={s.id}>
            <div className={`fp-dot ${step>=s.id?'fp-dot--done':''} ${step===s.id?'fp-dot--cur':''}`}>
              <div className="fp-dot-circle">{step>s.id ? '✓' : s.icon}</div>
              <span>{l(s.title, {1:'बेसिक जानकारी',2:'स्किल्स',3:'लोकेशन',4:'दस्तावेज़',5:'पासवर्ड'}[s.id])}</span>
            </div>
            {i < STEPS.length-1 && <div className={`fp-line ${step>s.id?'fp-line--done':''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="fp-body">
        <div className="fp-card anim-scaleIn">

          {/* STEP 1 — Basic Info */}
          {step===1 && (
            <>
              <div className="fp-card-head">
                <h2>👤 {l('Basic Information','बेसिक जानकारी')}</h2>
                <p>{l('Tell us about yourself so hirers can find you','हायरर आपको ढूंढ सकें इसलिए अपने बारे में बताएं')}</p>
              </div>
              <div className="rc-row2">
                <div className="rc-field">
                  <label>{l('First Name *','पहला नाम *')}</label>
                  <input type="text" placeholder={l('Ram','राम')} value={form.firstName} onChange={e=>set('firstName',e.target.value)} />
                </div>
                <div className="rc-field">
                  <label>{l('Last Name *','उपनाम *')}</label>
                  <input type="text" placeholder={l('Kumar','कुमार')} value={form.lastName} onChange={e=>set('lastName',e.target.value)} />
                </div>
              </div>
              <div className="rc-field">
                <label>{l('Mobile Number *','मोबाइल नंबर *')}</label>
                <div className="rc-input-prefix">
                  <span>+91</span>
                  <input type="tel" placeholder="9876543210" maxLength={10}
                    value={form.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,''))} />
                </div>
                <span className="hint">{l('OTP verification will be done on this number','इस नंबर पर OTP वेरिफिकेशन होगी')}</span>
              </div>
              <div className="rc-row2">
                <div className="rc-field">
                  <label>{l('Age *','उम्र *')}</label>
                  <input type="number" placeholder="25" min={18} max={65}
                    value={form.age} onChange={e=>set('age',parseInt(e.target.value)||'')} />
                  <span className="hint">{l('Minimum age: 18 years','न्यूनतम उम्र: 18 वर्ष')}</span>
                </div>
                <div className="rc-field">
                  <label>{l('Gender *','लिंग *')}</label>
                  <select value={form.gender} onChange={e=>set('gender',e.target.value)}>
                    <option value="">{l('Select','चुनें')}</option>
                    <option value="male">{l('Male','पुरुष')}</option>
                    <option value="female">{l('Female','महिला')}</option>
                    <option value="other">{l('Other','अन्य')}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — Skills */}
          {step===2 && (
            <>
              <div className="fp-card-head">
                <h2>🔧 {l('Your Skills','आपकी स्किल्स')}</h2>
                <p>{l('Select all skills you know. We will ask experience for each.','जो भी काम जानते हैं सब चुनें। हर काम का अनुभव पूछेंगे।')}</p>
              </div>
              <input className="fp-search" type="text"
                placeholder={l('🔍 Search skill...','🔍 स्किल खोजें...')}
                value={skillSearch} onChange={e=>setSkillSearch(e.target.value)} />
              <div className="fp-chips">
                {filteredSkills.map(sk => {
                  const sel = form.skills.find(s=>s.name===sk);
                  return (
                    <button key={sk} className={`fp-chip ${sel?'fp-chip--on':''}`} onClick={()=>toggleSkill(sk)}>
                      {sel && '✓ '}{sk}
                    </button>
                  );
                })}
              </div>
              {form.skills.length > 0 && (
                <div className="fp-exp-box">
                  <h4>{l('Experience for each skill *','हर स्किल का अनुभव *')}</h4>
                  {form.skills.map(s => (
                    <div key={s.name} className="fp-exp-row">
                      <span>{s.name.split(' / ')[0]}</span>
                      <select value={s.experience} onChange={e=>setSkillExp(s.name,e.target.value)}
                        className={!s.experience?'fp-select-empty':''}>
                        <option value="">{l('Select experience','अनुभव चुनें')}</option>
                        {EXP_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 3 — Location */}
          {step===3 && (
            <>
              <div className="fp-card-head">
                <h2>📍 {l('Location','लोकेशन')}</h2>
                <p>{l('Where you live and where you want to work','आप कहाँ रहते हैं और कहाँ काम करना चाहते हैं')}</p>
              </div>
              <div className="rc-field">
                <label>{l('Current City *','वर्तमान शहर *')}</label>
                <select value={form.currentCity} onChange={e=>set('currentCity',e.target.value)}>
                  <option value="">{l('Select your city','अपना शहर चुनें')}</option>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="rc-field">
                <label>{l('Preferred Cities for Work * (max 5)','काम के लिए पसंदीदा शहर * (अधिकतम 5)')}</label>
                <input className="fp-search" type="text"
                  placeholder={l('🔍 Search city...','🔍 शहर खोजें...')}
                  value={citySearch} onChange={e=>setCitySearch(e.target.value)} />
                <div className="fp-chips fp-chips--city">
                  {filteredCities.map(c => {
                    const sel = form.preferredCities.includes(c);
                    return (
                      <button key={c} className={`fp-chip fp-chip--city ${sel?'fp-chip--city-on':''}`}
                        onClick={()=>toggleCity(c)}>
                        {sel?'✓ ':'📍 '}{c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 4 — Documents */}
          {step===4 && (
            <>
              <div className="fp-card-head">
                <h2>📄 {l('Documents','दस्तावेज़')}</h2>
                <p>{l('Upload your ID proof. This helps hirers trust your profile.','अपना ID प्रूफ अपलोड करें। इससे हायरर आप पर भरोसा करेंगे।')}</p>
              </div>
              <div className="rc-field">
                <label>{l('Aadhar Card Photo * (Mandatory)','आधार कार्ड फोटो * (अनिवार्य)')}</label>
                <div className="fp-upload-box" onClick={()=>document.getElementById('aadhar-upload').click()}>
                  {form.aadhar ? (
                    <span className="fp-upload-done">✅ {form.aadhar.name} {l('uploaded','अपलोड हुआ')}</span>
                  ) : (
                    <>
                      <span className="fp-upload-icon">📤</span>
                      <span>{l('Click to upload Aadhar Card','आधार कार्ड अपलोड करने के लिए क्लिक करें')}</span>
                      <span className="fp-upload-hint">{l('JPG, PNG or PDF — Max 5MB','JPG, PNG या PDF — अधिकतम 5MB')}</span>
                    </>
                  )}
                </div>
                <input id="aadhar-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" style={{display:'none'}}
                  onChange={e=>set('aadhar',e.target.files[0])} />
              </div>
              <div className="rc-field">
                <label>{l('Other ID Proof (Optional)','अन्य ID प्रूफ (वैकल्पिक)')}</label>
                <div className="fp-upload-box fp-upload-box--optional" onClick={()=>document.getElementById('other-upload').click()}>
                  {form.otherDoc ? (
                    <span className="fp-upload-done">✅ {form.otherDoc.name}</span>
                  ) : (
                    <>
                      <span className="fp-upload-icon">📎</span>
                      <span>{l('PAN Card, Voter ID, Driving License etc.','पैन कार्ड, वोटर ID, ड्राइविंग लाइसेंस आदि')}</span>
                    </>
                  )}
                </div>
                <input id="other-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" style={{display:'none'}}
                  onChange={e=>set('otherDoc',e.target.files[0])} />
              </div>
              <div className="fp-info-strip">
                <span>🔒</span>
                <p>{l('Your documents are stored securely and only shared with verified employers after your approval.','आपके दस्तावेज़ सुरक्षित रखे जाते हैं और आपकी अनुमति के बाद ही वेरिफाइड नियोक्ताओं के साथ साझा किए जाते हैं।')}</p>
              </div>
            </>
          )}

          {/* STEP 5 — Password */}
          {step===5 && (
            <>
              <div className="fp-card-head">
                <h2>🔒 {l('Create Password','पासवर्ड बनाएं')}</h2>
                <p>{l('Secure your account with a strong password','एक मजबूत पासवर्ड से अपना अकाउंट सुरक्षित करें')}</p>
              </div>
              <div className="rc-field">
                <label>{l('Password *','पासवर्ड *')}</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={e=>set('password',e.target.value)} />
                <span className="hint">{l('Minimum 6 characters','कम से कम 6 अक्षर')}</span>
              </div>
              <div className="rc-field">
                <label>{l('Confirm Password *','पासवर्ड दोबारा *')}</label>
                <input type="password" placeholder="••••••••" value={form.confirmPassword}
                  onChange={e=>set('confirmPassword',e.target.value)} />
                {form.confirmPassword && form.password !== form.confirmPassword &&
                  <span className="error">❌ {l('Passwords do not match','पासवर्ड मेल नहीं खाते')}</span>}
                {form.confirmPassword && form.password === form.confirmPassword &&
                  <span className="success-msg">✅ {l('Passwords match','पासवर्ड मेल खाते हैं')}</span>}
              </div>

              {/* Error message from API */}
              {error && (
                <div style={{background:'#FFF0F0',border:'1px solid #FFB3B3',borderRadius:10,padding:'12px 16px',marginBottom:12,color:'#C00',fontSize:14,fontWeight:600}}>
                  ❌ {error}
                </div>
              )}

              <div className="fp-summary">
                <h4>📋 {l('Your Profile Summary','आपकी प्रोफाइल सारांश')}</h4>
                <div className="fp-sum-row"><span>👤</span><span>{form.firstName} {form.lastName}, {form.age} {l('yrs','वर्ष')}, {form.gender}</span></div>
                <div className="fp-sum-row"><span>📱</span><span>+91 {form.mobile}</span></div>
                <div className="fp-sum-row"><span>🔧</span><span>{form.skills.map(s=>s.name.split(' / ')[0]).join(', ')}</span></div>
                <div className="fp-sum-row"><span>📍</span><span>{form.currentCity} → {form.preferredCities.join(', ')}</span></div>
                <div className="fp-sum-row"><span>📄</span><span>{form.aadhar?.name || l('Aadhar uploaded','आधार अपलोड')}</span></div>
              </div>
            </>
          )}

          {/* Nav Buttons */}
          <div className="fp-nav-btns">
            {step > 1 && (
              <button className="fp-btn-back" onClick={()=>setStep(s=>s-1)}>
                ← {l('Back','पीछे')}
              </button>
            )}
            {step < 5 ? (
              <button className={`fp-btn-next ${!canNext()?'fp-btn-next--off':''}`}
                disabled={!canNext()} onClick={()=>canNext()&&setStep(s=>s+1)}>
                {l('Continue','आगे बढ़ें')} →
              </button>
            ) : (
              <button
                className={`fp-btn-next fp-btn-submit ${(!canNext()||loading)?'fp-btn-next--off':''}`}
                disabled={!canNext() || loading}
                onClick={handleSubmit}>
                {loading ? '⏳ Creating Account...' : `🚀 ${l('Create Account','अकाउंट बनाएं')}`}
              </button>
            )}
          </div>
          <p className="fp-step-label">{l('Step','चरण')} {step} {l('of','में से')} {STEPS.length}</p>
        </div>
      </div>
    </div>
  );
}