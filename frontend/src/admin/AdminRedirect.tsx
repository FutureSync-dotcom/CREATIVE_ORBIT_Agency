import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminRedirect = () => {
  const userData = localStorage.getItem('adminUser');
  if (!userData) return <Navigate to="/login" replace />;

  const user = JSON.parse(userData);
  const perms = user.permissions || [];

  if (perms.includes('dashboard')) return <Navigate to="/admin/dashboard" replace />;
  if (perms.includes('clients')) return <Navigate to="/admin/clients" replace />;
  if (perms.includes('messages')) return <Navigate to="/admin/messages" replace />;
  if (perms.includes('leads')) return <Navigate to="/admin/leads" replace />;
  if (perms.includes('deals')) return <Navigate to="/admin/deals" replace />;
  if (perms.includes('projects')) return <Navigate to="/admin/projects" replace />;
  if (perms.includes('tasks')) return <Navigate to="/admin/tasks" replace />;
  if (perms.includes('invoices')) return <Navigate to="/admin/invoices" replace />;
  if (perms.includes('settings')) return <Navigate to="/admin/settings" replace />;

  return <Navigate to="/login" replace />;
};
