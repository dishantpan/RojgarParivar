import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkerSignup from './pages/WorkerSignup';
import HirerSignup from './pages/HirerSignup';
import WorkerDashboard from './pages/WorkerDashboard';
import RegularHirerDashboard from './pages/RegularHirerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import PostJobRegular from './pages/PostJobRegular';
import PostJobBusiness from './pages/PostJobBusiness';
import AuthModal from './components/AuthModal';

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuth(true); };
  const closeAuth = () => setShowAuth(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup/worker"      element={<WorkerSignup />} />
        <Route path="/signup/hirer"       element={<HirerSignup />} />
        <Route path="/dashboard/worker"   element={<WorkerDashboard />} />
        <Route path="/dashboard/regular"  element={<RegularHirerDashboard />} />
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/post-job/regular"   element={<PostJobRegular />} />
        <Route path="/post-job/business"  element={<PostJobBusiness />} />
      </Routes>
      {showAuth && <AuthModal defaultTab={authTab} onClose={closeAuth} />}
    </Router>
  );
}