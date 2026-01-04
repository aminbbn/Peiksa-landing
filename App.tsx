
import React, { useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardLayout } from './components/DashboardLayout';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { About } from './pages/About';
import { Careers } from './pages/Careers';
import { Customers } from './pages/Customers';
import { Support } from './pages/Support';
import { Status } from './pages/Status';
import { Security } from './pages/Security';
import { DashboardOverview } from './pages/dashboard/Overview';
import { DashboardCRM } from './pages/dashboard/CRM';
import { DashboardCampaigns } from './pages/dashboard/Campaigns';
import { DashboardAnalytics } from './pages/dashboard/Analytics';
import { DashboardEmailBuilder } from './pages/dashboard/EmailBuilder';
import { DashboardSmsBuilder } from './pages/dashboard/SmsBuilder';
import { DashboardFileManager } from './pages/dashboard/FileManager';
import { PageRoute } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Component to force navigation to Home on initial mount
const ForceHomeOnMount = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      if (window.location.pathname === '/' || window.location.pathname === '') {
          navigate('/', { replace: true });
      }
      hasRedirected.current = true;
    }
  }, [navigate]);
  
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('peiksa_auth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to={PageRoute.AUTH} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <ForceHomeOnMount />
      <Routes>
        {/* Auth Route (No Layout) */}
        <Route path={PageRoute.AUTH} element={<Auth />} />
        
        {/* Public Routes (With Public Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="careers" element={<Careers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="support" element={<Support />} />
          <Route path="status" element={<Status />} />
          <Route path="security" element={<Security />} />
        </Route>

        {/* Dashboard Routes (With Dashboard Layout) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="crm" element={<DashboardCRM />} />
          <Route path="campaigns" element={<DashboardCampaigns />} />
          <Route path="email-builder" element={<DashboardEmailBuilder />} />
          <Route path="sms-builder" element={<DashboardSmsBuilder />} />
          <Route path="files" element={<DashboardFileManager />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="settings" element={<div className="text-center py-20 text-slate-500">بخش تنظیمات در حال توسعه است...</div>} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;