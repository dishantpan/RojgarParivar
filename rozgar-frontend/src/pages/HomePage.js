import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import AuthModal from '../components/AuthModal';

/* ── IMAGES from Unsplash — real Indian workers ── */
const IMGS = {
  hero:      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80',
  mason:     'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
  factory:   'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&q=80',
  construct: 'https://images.unsplash.com/photo-1590649977673-90b31b6cd1e9?w=600&q=80',
  labor:     'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
  chowk:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  family:    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
};

const T = {
  en: {
    nav_login: 'Login', nav_about: 'About', nav_how: 'How It Works',
    hero_hindi: 'हर हाथ में हुनर है',
    hero_sub: 'Every Hand Has Skill',
    hero_p: '33 crore informal workers in India wake up every morning with skill in their hands — but no guaranteed work. RozgarConnect changes that.',
    hero_cta1: 'Find Work', hero_cta2: 'Hire Workers',
    reality_tag: 'The Ground Reality',
    reality_title: 'This is what happens every morning at India\'s Labour Chowks',
    reality_p: 'Thousands of skilled workers — masons, electricians, carpenters, welders — stand at street corners waiting to be picked up by a contractor. No dignity. No guarantee. No record of their skill or experience. Just waiting.',
    reality_p2: 'We built RozgarConnect because we saw this every day and knew technology could fix it.',
    stats_label: 'And we are already making a difference',
    mission_title: 'Rozgar Parivar',
    mission_sub: 'We are not just a platform. We are a movement to give India\'s hardest working people a digital voice, a verified identity and direct access to fair work.',
    workers_title: 'The Workers We Serve',
    how_title: 'How It Works',
    testimonial_title: 'From Our Workers',
    who_title: 'Who Uses RozgarConnect',
    cta_hindi: 'आज ही जुड़ें',
    cta_title: 'Join the Rozgar Parivar Today',
    cta_p: 'Free for workers. Always.',
  },
  hi: {
    nav_login: 'लॉगिन', nav_about: 'हमारे बारे में', nav_how: 'कैसे काम करता है',
    hero_hindi: 'हर हाथ में हुनर है',
    hero_sub: 'काम दो, इज़्ज़त दो',
    hero_p: 'भारत के 33 करोड़ असंगठित मजदूर रोज सुबह हुनर लेकर उठते हैं — लेकिन काम की गारंटी नहीं। RozgarConnect यही बदलता है।',
    hero_cta1: 'काम ढूंढें', hero_cta2: 'मजदूर हायर करें',
    reality_tag: 'ज़मीनी हकीकत',
    reality_title: 'हर सुबह भारत के लेबर चौक पर यही होता है',
    reality_p: 'हजारों कुशल मजदूर — राजमिस्त्री, इलेक्ट्रीशियन, बढ़ई, वेल्डर — सड़क के किनारे खड़े होकर किसी ठेकेदार का इंतजार करते हैं। न इज़्ज़त, न गारंटी, न अनुभव का रिकॉर्ड।',
    reality_p2: 'हमने RozgarConnect इसीलिए बनाया — क्योंकि हमने यह रोज देखा और जाना कि टेक्नोलॉजी इसे ठीक कर सकती है।',
    stats_label: 'और हम पहले से बदलाव ला रहे हैं',
    mission_title: 'रोज़गार परिवार',
    mission_sub: 'हम सिर्फ एक प्लेटफॉर्म नहीं हैं। हम एक आंदोलन हैं — भारत के सबसे मेहनती लोगों को डिजिटल पहचान और सम्मानजनक काम दिलाने का।',
    workers_title: 'जिन मजदूरों की हम सेवा करते हैं',
    how_title: 'कैसे काम करता है',
    testimonial_title: 'हमारे मजदूरों की बात',
    who_title: 'कौन उपयोग करता है',
    cta_hindi: 'आज ही जुड़ें',
    cta_title: 'रोज़गार परिवार से जुड़ें',
    cta_p: 'मजदूरों के लिए हमेशा मुफ्त।',
  }
};

const WORKER_TYPES = [
  { emoji:'🧱', name:'Mason',          hindi:'राजमिस्त्री',      desc:'Building the walls of India, brick by brick',      count:'4,820+' },
  { emoji:'⚡', name:'Electrician',    hindi:'इलेक्ट्रीशियन',    desc:'Powering homes, factories and offices',            count:'3,210+' },
  { emoji:'🪚', name:'Carpenter',      hindi:'बढ़ई',              desc:'Crafting furniture, doors and wooden structures',  count:'2,540+' },
  { emoji:'🔧', name:'Plumber',        hindi:'प्लंबर',            desc:'Laying pipelines, fixing leaks',                   count:'2,890+' },
  { emoji:'🚗', name:'Driver',         hindi:'ड्राइवर',           desc:'Moving people and goods across the city',          count:'3,400+' },
  { emoji:'🏭', name:'Factory Helper', hindi:'फैक्ट्री हेल्पर',  desc:'Keeping production lines running every day',       count:'6,200+' },
  { emoji:'🎨', name:'Painter',        hindi:'पेंटर',             desc:'Bringing colour to every wall and surface',        count:'2,100+' },
  { emoji:'🔩', name:'Welder',         hindi:'वेल्डर',            desc:'Joining metal, building structures that last',     count:'1,980+' },
];

const TESTIMONIALS = [
  { name:'Ramesh Kumar', city:'Surat, Gujarat',     skill:'Mason • राजमिस्त्री', years:12, quote:'Pehle main roz subah chowk pe jaata tha. Kabhi kaam milta, kabhi nahi. Ab mera profile dekh ke khud hirer mujhe call karta hai.', quoteEn:'Before I used to go to the labour chowk every morning. Sometimes I got work, sometimes not. Now hirers call me directly after seeing my profile.', img:'R' },
  { name:'Priya Devi',   city:'Ahmedabad, Gujarat', skill:'Cook • रसोइया',        years:8,  quote:'Mujhe nahi pata tha ki mera kaam bhi internet pe aa sakta hai. Ab main ghar baithe kaam milati hoon.',                              quoteEn:'I did not know my work could also come online. Now I find work from home itself.',                                                                img:'P' },
  { name:'Ajay Singh',   city:'Delhi',              skill:'Driver • ड्राइवर',     years:15, quote:'15 saal ka experience tha lekin koi record nahi tha. Rozgar Connect ne meri pehchaan banayi.',                                        quoteEn:'I had 15 years of experience but no record of it. RozgarConnect gave me my identity.',                                                           img:'A' },
];

const STATS = [
  { n:'50,000+', l:'Workers',   hl:'मजदूर',    icon:'👷' },
  { n:'1.2L+',   l:'Jobs Done', hl:'काम पूरे', icon:'✅' },
  { n:'120+',    l:'Cities',    hl:'शहर',       icon:'🏙️' },
  { n:'8,000+',  l:'Employers', hl:'नियोक्ता', icon:'🏢' },
  { n:'0',       l:'Middlemen', hl:'दलाल',      icon:'🚫' },
];

export default function HomePage() {
  const [lang, setLang]                     = useState('en');
  const [scrolled, setScrolled]             = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showAuth, setShowAuth]             = useState(false);  // ← LOCAL AUTH STATE
  const navigate = useNavigate();
  const t = T[lang];
  const l = (en, hi) => lang === 'hi' ? hi : en;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hp">

      {/* ── TICKER STRIP ── */}
      <div className="hp-ticker">
        <div className="hp-ticker-track">
          {['✓ Free for Workers — मजदूरों के लिए मुफ्त','✓ No Middlemen — कोई दलाल नहीं','✓ Verified Profiles — वेरिफाइड प्रोफाइल','✓ 120+ Cities — 120+ शहर','✓ Direct Hiring — सीधा संपर्क','✓ Free for Workers — मजदूरों के लिए मुफ्त','✓ No Middlemen — कोई दलाल नहीं','✓ Verified Profiles — वेरिफाइड प्रोफाइल','✓ 120+ Cities — 120+ शहर','✓ Direct Hiring — सीधा संपर्क'].map((item, i) => (
            <span key={i} className="hp-ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`hp-nav ${scrolled ? 'hp-nav--solid' : ''}`}>
        <div className="hp-nav-inner">
          <a href="/" className="hp-logo">
            <div className="hp-logo-mark">⚡</div>
            <div className="hp-logo-text">
              <span>Rozgar<em>Connect</em></span>
              <span className="hp-logo-tagline">काम धूंढो, काम दो</span>
            </div>
          </a>
          <div className={`hp-nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#about"   onClick={() => setMenuOpen(false)}>{t.nav_about}</a>
            <a href="#how"     onClick={() => setMenuOpen(false)}>{t.nav_how}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <div className="hp-nav-actions">
            <button className="hp-lang-toggle" onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}>
              <span>{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            {/* ✅ FIXED: uses setShowAuth(true) — no more onAuth */}
            <button className="hp-nav-login" onClick={() => setShowAuth(true)}>{t.nav_login}</button>
            <button className="hp-hamburger" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? '✕' : '☰'}</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-img-wrap">
          <img src={IMGS.hero} alt="Indian construction workers" className="hp-hero-img" />
          <div className="hp-hero-overlay"></div>
          <div className="hp-hero-grain"></div>
        </div>
        <div className="hp-hero-content">
          <div className="hp-hero-inner">
            <div className="hp-hero-left">
              <div className="hp-hero-eyebrow">
                <span className="hp-eyebrow-dot"></span>
                {l('Built for Bharat\'s 33 Crore Informal Workers', 'भारत के 33 करोड़ असंगठित मजदूरों के लिए')}
              </div>
              <h1 className="hp-hero-h1">
                <span className="hp-hero-hindi">{t.hero_hindi}</span>
                <span className="hp-hero-english">{t.hero_sub}</span>
              </h1>
              <p className="hp-hero-p">{t.hero_p}</p>
              <div className="hp-hero-btns">
                <button className="hp-btn-find" onClick={() => navigate('/signup/worker')}>
                  <span>👷</span> {t.hero_cta1}
                </button>
                <button className="hp-btn-hire" onClick={() => navigate('/signup/hirer')}>
                  <span>🏢</span> {t.hero_cta2}
                </button>
              </div>
              <div className="hp-hero-trust">
                <div className="hp-trust-avatars">
                  {['R', 'S', 'A', 'P', 'M'].map((c, i) => (
                    <div key={i} className="hp-trust-av" style={{ zIndex: 5 - i }}>{c}</div>
                  ))}
                </div>
                <span>{l('50,000+ workers already registered', '50,000+ मजदूर पहले से रजिस्टर्ड')}</span>
              </div>
            </div>
            <div className="hp-hero-right">
              <div className="hp-hero-card">
                <div className="hp-hc-header">
                  <span className="hp-hc-live">● {l('Live Jobs', 'लाइव जॉब्स')}</span>
                  <span className="hp-hc-count">156 {l('posted today', 'आज पोस्ट')}</span>
                </div>
                {[
                  { name: 'Ramesh Kumar',  skill: l('Mason • Surat', 'राजमिस्त्री • सूरत'),               rate: '₹650/day', tag: l('Available', 'उपलब्ध'),   col: '#FF6B00' },
                  { name: 'Mehta Factory', skill: l('Need 20 Helpers • Ahmedabad', '20 हेल्पर चाहिए • अहमदाबाद'), rate: '₹450/day', tag: l('Urgent', 'अर्जेंट'),    col: '#0D1B2A' },
                  { name: 'Priya Sharma',  skill: l('Electrician • Delhi', 'इलेक्ट्रीशियन • दिल्ली'),       rate: '₹800/day', tag: l('3 Applied', '3 अप्लाई'), col: '#138808' },
                ].map((c, i) => (
                  <div key={i} className="hp-hc-row" style={{ '--rc': c.col }}>
                    <div className="hp-hc-av">{c.name[0]}</div>
                    <div className="hp-hc-info">
                      <span>{c.name}</span>
                      <span>{c.skill}</span>
                    </div>
                    <div className="hp-hc-right">
                      <span className="hp-hc-rate">{c.rate}</span>
                      <span className="hp-hc-tag">{c.tag}</span>
                    </div>
                  </div>
                ))}
                <div className="hp-hc-footer">
                  <span>✓ {l('All profiles Aadhar verified', 'सभी प्रोफाइल आधार वेरिफाइड')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hp-hero-scroll-hint">
          <span>↓</span>
          <span>{l('Scroll to know more', 'और जानने के लिए स्क्रॉल करें')}</span>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="hp-stats-band">
        <p className="hp-stats-label">{t.stats_label}</p>
        <div className="hp-stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="hp-stat">
              <span className="hp-stat-icon">{s.icon}</span>
              <span className="hp-stat-n">{s.n}</span>
              <span className="hp-stat-l">{l(s.l, s.hl)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── REALITY SECTION ── */}
      <section className="hp-reality" id="about">
        <div className="hp-reality-inner">
          <div className="hp-reality-text">
            <div className="hp-section-tag">{t.reality_tag}</div>
            <h2 className="hp-reality-h2">{t.reality_title}</h2>
            <p>{t.reality_p}</p>
            <p>{t.reality_p2}</p>
            <div className="hp-reality-quote">
              <span className="hp-quote-mark">"</span>
              <p>{l('I have been a mason for 14 years. I can build a house but I had no proof of my skill. No one knew my name. RozgarConnect gave me my identity.', 'मैं 14 साल से राजमिस्त्री हूं। मैं घर बना सकता हूं लेकिन मेरे हुनर का कोई सबूत नहीं था। RozgarConnect ने मुझे मेरी पहचान दी।')}</p>
              <span className="hp-quote-name">— Suresh, Mason, Surat</span>
            </div>
          </div>
          <div className="hp-reality-images">
            <div className="hp-ri-main">
              <img src={IMGS.chowk} alt="Labour chowk India" />
              <div className="hp-ri-label">{l('A typical morning at a labour chowk', 'एक आम सुबह लेबर चौक पर')}</div>
            </div>
            <div className="hp-ri-grid">
              <div className="hp-ri-sm"><img src={IMGS.mason}     alt="Mason at work"        /><span>{l('Building India', 'भारत बना रहे हैं')}</span></div>
              <div className="hp-ri-sm"><img src={IMGS.construct} alt="Construction worker"  /><span>{l('Skilled hands', 'कुशल हाथ')}</span></div>
              <div className="hp-ri-sm"><img src={IMGS.factory}   alt="Factory work"         /><span>{l('Factory workers', 'फैक्ट्री मजदूर')}</span></div>
              <div className="hp-ri-sm hp-ri-sm--dark">
                <div className="hp-ri-stat-box">
                  <span>33 {l('Crore', 'करोड़')}</span>
                  <span>{l('Informal workers in India', 'असंगठित मजदूर भारत में')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION BAND ── */}
      <section className="hp-mission-band">
        <div className="hp-mission-inner">
          <div className="hp-mission-flag"><span>🇮🇳</span></div>
          <div className="hp-mission-text">
            <h2>{t.mission_title}</h2>
            <p>{t.mission_sub}</p>
          </div>
          <div className="hp-mission-pillars">
            {[
              { icon: '🤝', t: l('No Middlemen', 'कोई दलाल नहीं'),       s: l('Direct connection between worker and employer always', 'हमेशा सीधा संपर्क') },
              { icon: '🔒', t: l('Verified Identity', 'वेरिफाइड पहचान'), s: l('Aadhar-based verification for trust and safety', 'भरोसे के लिए आधार वेरिफिकेशन') },
              { icon: '💰', t: l('Fair Pay', 'उचित मजदूरी'),              s: l('Transparent salary ranges on every job post', 'हर जॉब पर पारदर्शी सैलरी') },
              { icon: '⭐', t: l('Build Reputation', 'प्रतिष्ठा बनाएं'),  s: l('Ratings after every job — skill has a record', 'हर काम के बाद रेटिंग') },
            ].map((p, i) => (
              <div key={i} className="hp-pillar">
                <span className="hp-pillar-icon">{p.icon}</span>
                <span className="hp-pillar-t">{p.t}</span>
                <span className="hp-pillar-s">{p.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKERS WE SERVE ── */}
      <section className="hp-workers">
        <div className="hp-workers-inner">
          <div className="hp-section-head">
            <div className="hp-section-tag">{t.workers_title}</div>
            <h2>{l('Every Skill. Every Worker. One Platform.', 'हर हुनर। हर मजदूर। एक प्लेटफॉर्म।')}</h2>
          </div>
          <div className="hp-workers-grid">
            {WORKER_TYPES.map((w, i) => (
              <div key={i} className="hp-worker-card" onClick={() => navigate('/signup/worker')}>
                <span className="hp-worker-emoji">{w.emoji}</span>
                <div className="hp-worker-names">
                  <span className="hp-worker-en">{w.name}</span>
                  <span className="hp-worker-hi">{w.hindi}</span>
                </div>
                <p>{w.desc}</p>
                <span className="hp-worker-count">{w.count} {l('workers', 'मजदूर')}</span>
              </div>
            ))}
          </div>
          <div className="hp-workers-more">
            <span>+ {l('30 more skill categories available on platform', '30 और स्किल श्रेणियां प्लेटफॉर्म पर उपलब्ध')}</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="hp-how" id="how">
        <div className="hp-how-inner">
          <div className="hp-section-head hp-section-head--center">
            <div className="hp-section-tag hp-section-tag--light">{t.how_title}</div>
            <h2>{l('From Signup to Paycheck in 4 Steps', 'साइनअप से पेमेंट तक — 4 कदम')}</h2>
          </div>
          <div className="hp-how-steps">
            {[
              { n: '01', icon: '📝', t: l('Create Profile', 'प्रोफाइल बनाएं'),        s: l('Add your skills, experience, city and Aadhar. Completely free and takes only 5 minutes.', 'स्किल, अनुभव, शहर और आधार डालें। बिल्कुल मुफ्त, सिर्फ 5 मिनट।'), tag: l('Free & Quick', 'मुफ्त व तेज़') },
              { n: '02', icon: '🔍', t: l('Browse Jobs', 'काम देखें'),                 s: l('See real jobs from your own city that match your exact skill. Apply in one single tap — no calls needed.', 'अपने शहर के असली काम देखें जो आपकी स्किल से मेल खाते हों। एक टैप में अप्लाई।'), tag: l('One Tap Apply', 'एक टैप अप्लाई') },
              { n: '03', icon: '📞', t: l('Hirer Calls You', 'हायरर खुद कॉल करे'),   s: l('The employer reviews your verified profile and contacts you directly. No middleman takes a cut ever.', 'नियोक्ता आपकी वेरिफाइड प्रोफाइल देख खुद कॉल करता है। कोई दलाल नहीं, कोई कमीशन नहीं।'), tag: l('No Middleman', 'कोई दलाल नहीं') },
              { n: '04', icon: '⭐', t: l('Work, Earn & Grow', 'काम करो, कमाओ, बढ़ो'), s: l('Complete the job, get paid directly. Both sides confirm and your rating grows. More jobs, better pay next time.', 'काम पूरा करें, सीधे पैसा पाएं। रेटिंग बढ़ती है, अगली बार बेहतर काम मिलता है।'), tag: l('Build Reputation', 'प्रतिष्ठा बनाएं') },
            ].map((s, i) => (
              <div key={i} className="hp-how-step">
                <div className="hp-how-step-circle">
                  <span>{s.icon}</span>
                  <div className="hp-how-step-num">{s.n}</div>
                </div>
                <div className="hp-how-step-body">
                  <h3>{s.t}</h3>
                  <p>{s.s}</p>
                  <span className="hp-how-step-tag">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="hp-testimonials">
        <div className="hp-test-inner">
          <div className="hp-section-tag">{t.testimonial_title}</div>
          <div className="hp-test-cards">
            {TESTIMONIALS.map((tm, i) => (
              <div key={i} className={`hp-test-card ${i === activeTestimonial ? 'hp-test-card--on' : ''}`}>
                <div className="hp-test-avatar">{tm.img}</div>
                <div className="hp-test-body">
                  <p className="hp-test-quote-hi">"{tm.quote}"</p>
                  <p className="hp-test-quote-en">"{tm.quoteEn}"</p>
                  <div className="hp-test-person">
                    <span className="hp-test-name">{tm.name}</span>
                    <span className="hp-test-info">{tm.skill} · {tm.city} · {tm.years} {l('yrs exp', 'साल अनुभव')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hp-test-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`hp-test-dot ${i === activeTestimonial ? 'hp-test-dot--on' : ''}`} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="hp-who">
        <div className="hp-who-inner">
          <div className="hp-section-tag">{t.who_title}</div>
          <h2>{l('Three Types of People. One Platform.', 'तीन प्रकार के लोग। एक प्लेटफॉर्म।')}</h2>
          <div className="hp-who-cards">
            {[
              { icon: '👷', t: l('Daily Wage Worker', 'दैनिक मजदूर'),             hi: 'Kaam dhundh rahe hain?', en: 'Looking for work?',  col: '#FF6B00', bg: '#FFF3EB',              feat: [l('Build digital skill profile','डिजिटल स्किल प्रोफाइल'), l('Apply to nearby jobs','पास के काम के लिए अप्लाई'), l('Build rating & reputation','रेटिंग और प्रतिष्ठा बनाएं'), l('Aadhar-verified identity','आधार-वेरिफाइड पहचान')],    link: '/signup/worker' },
              { icon: '🏭', t: l('Factory / Business Owner', 'फैक्ट्री / बिज़नेस मालिक'), hi: 'Kaam dena chahte hain?', en: 'Want to hire workers?', col: '#0D1B2A', bg: 'rgba(13,27,42,0.06)', feat: [l('Post bulk requirements','बल्क जरूरत पोस्ट करें'), l('Filter by skill & city','स्किल और शहर से फिल्टर'), l('Admin-verified account','एडमिन-वेरिफाइड अकाउंट'), l('Track all your hires','सभी हायरिंग ट्रैक करें')], link: '/signup/hirer?type=business' },
              { icon: '🏠', t: l('Regular / Home Hirer', 'सामान्य / घरेलू हायरर'), hi: 'Ghar ya event ke liye?', en: 'For home or event?', col: '#138808', bg: '#EDFCE9',             feat: [l('Post job in 2 minutes','2 मिनट में जॉब पोस्ट'), l('Add work photos (unique!)','काम की फोटो डालें (अनोखा!)'), l('OTP verified — instant access','OTP वेरिफाइड — तुरंत'), l('Rate worker after job','काम के बाद रेट करें')],   link: '/signup/hirer?type=regular' },
            ].map((u, i) => (
              <div key={i} className="hp-who-card" style={{ '--uc': u.col, '--ubg': u.bg }}>
                <div className="hp-who-icon">{u.icon}</div>
                <div className="hp-who-caption">
                  <span className="hp-who-hi">{u.hi}</span>
                  <span className="hp-who-en">{u.en}</span>
                </div>
                <h3>{u.t}</h3>
                <ul>
                  {u.feat.map((f, j) => <li key={j}><span>✓</span>{f}</li>)}
                </ul>
                <button onClick={() => navigate(u.link)} className="hp-who-btn">
                  {l('Join Free', 'मुफ्त जुड़ें')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <div className="hp-cta-hindi">{t.cta_hindi}</div>
          <h2>{t.cta_title}</h2>
          <p>{t.cta_p}</p>
          <div className="hp-cta-btns">
            <button className="hp-cta-w" onClick={() => navigate('/signup/worker')}>👷 {l('I am a Worker', 'मैं मजदूर हूं')}</button>
            <button className="hp-cta-h" onClick={() => navigate('/signup/hirer')}>🏢 {l('I want to Hire', 'मुझे हायर करना है')}</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="hp-footer" id="contact">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <div className="hp-footer-logo">⚡ RozgarConnect</div>
            <p className="hp-footer-tagline">काम धूंढो, काम दो</p>
            <p className="hp-footer-desc">{l('Connecting India\'s informal workforce with dignity, directly.', 'भारत के असंगठित कार्यबल को सम्मान से जोड़ना।')}</p>
            <div className="hp-footer-flag">🇮🇳 {l('Made in India, for India', 'भारत में बनाया, भारत के लिए')}</div>
          </div>
          <div className="hp-footer-links">
            {[
              { h: l('Platform', 'प्लेटफॉर्म'), links: [l('About Us','हमारे बारे में'), l('How It Works','कैसे काम करता है'), l('For Workers','मजदूरों के लिए'), l('For Employers','नियोक्ताओं के लिए')] },
              { h: l('Support', 'सहायता'),       links: [l('Help Center','सहायता केंद्र'), l('Safety Guidelines','सुरक्षा'), l('Report Problem','समस्या रिपोर्ट'), l('Contact Us','संपर्क')] },
              { h: l('Legal', 'कानूनी'),         links: [l('Terms & Conditions','नियम व शर्तें'), l('Privacy Policy','गोपनीयता'), l('Cookie Policy','कुकी'), l('Disclaimer','अस्वीकरण')] },
            ].map((col, i) => (
              <div key={i} className="hp-footer-col">
                <h4>{col.h}</h4>
                {col.links.map((lnk, j) => <a key={j} href="#">{lnk}</a>)}
              </div>
            ))}
            <div className="hp-footer-col">
              <h4>{l('Contact', 'संपर्क')}</h4>
              <p>📧 support@rozgarconnect.in</p>
              <p>📞 1800-XXX-XXXX</p>
              <p>🕐 {l('Mon–Sat 9AM–6PM', 'सोम–शनि 9–6')}</p>
            </div>
          </div>
        </div>
        <div className="hp-footer-bottom">
          <p>© 2024 RozgarConnect · {l('All rights reserved', 'सभी अधिकार सुरक्षित')}</p>
          <p>❤️ {l('For every hand that builds India', 'उन हाथों के लिए जो भारत बनाते हैं')}</p>
        </div>
      </footer>

      {/* ✅ AUTH MODAL — renders when Login button clicked */}
      {showAuth && <AuthModal defaultTab="login" onClose={() => setShowAuth(false)} />}

    </div>
  );
}