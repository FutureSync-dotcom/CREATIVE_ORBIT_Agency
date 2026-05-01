import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AllProjects } from './pages/AllProjects';
import { Login } from './admin/Login';
import { Maintenance } from './pages/Maintenance';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Overview } from './admin/Overview';
import { Projects } from './admin/Projects';
import { Clients } from './admin/Clients';
import { Messages } from './admin/Messages';
import { Leads } from './admin/Leads';
import { Deals } from './admin/Deals';
import { Tasks } from './admin/Tasks';
import { Invoices } from './admin/Invoices';
import { Settings } from './admin/Settings';
import { MagneticCursor } from './components/MagneticCursor';

import { AdminRedirect } from './admin/AdminRedirect';

function App() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <MagneticCursor />
      <Routes>
        {/* Main Website */}
        <Route 
          path="/" 
          element={settings?.maintenanceMode ? <Maintenance /> : <Home settings={settings} />} 
        />
        <Route path="/projects" element={<AllProjects settings={settings} />} />
        
        {/* Admin Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute permission="dashboard"><Overview /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute permission="projects"><Projects /></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute permission="clients"><Clients /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute permission="messages"><Messages /></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute permission="leads"><Leads /></ProtectedRoute>} />
        <Route path="/admin/deals" element={<ProtectedRoute permission="deals"><Deals /></ProtectedRoute>} />
        <Route path="/admin/tasks" element={<ProtectedRoute permission="tasks"><Tasks /></ProtectedRoute>} />
        <Route path="/admin/invoices" element={<ProtectedRoute permission="invoices"><Invoices /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute permission="settings"><Settings /></ProtectedRoute>} />

        {/* Catch all */}
        <Route 
          path="*" 
          element={settings?.maintenanceMode ? <Maintenance /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
