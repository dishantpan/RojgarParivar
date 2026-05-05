import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Verifications from './pages/Verifications';
import ManageUsers from './pages/ManageUsers';
import JobPostings from './pages/JobPostings';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import SkillCategories from './pages/SkillCategories';
import CityActivity from './pages/CityActivity';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <Router>
      <Layout onLogout={() => setLoggedIn(false)}>
        <Routes>
          <Route path="/"              element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/verifications" element={<Verifications />} />
          <Route path="/users"         element={<ManageUsers />} />
          <Route path="/jobs"          element={<JobPostings />} />
          <Route path="/reports"       element={<Reports />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/skills"        element={<SkillCategories />} />
          <Route path="/cities"        element={<CityActivity />} />
        </Routes>
      </Layout>
    </Router>
  );
}
