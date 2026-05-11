import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components & Sections
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { MagneticCursor } from './components/MagneticCursor';
import { ProtectedRoute } from './components/ProtectedRoute';

// Home Sections
import { Hero3D } from './sections/Hero3D';
import { Services } from './sections/Services';
import { Packages } from './sections/Packages';
import { Portfolio } from './sections/Portfolio';
import { TestimonialBook } from './sections/TestimonialBook';
import { Process } from './sections/Process';
import { About } from './sections/About';
import { Contact } from './sections/Contact';

// Pages
import { AllProjects } from './pages/AllProjects';
import { Login } from './admin/Login';
import { Maintenance } from './pages/Maintenance';
import { ProjectDetail } from './pages/ProjectDetail';
import { FeedbackSubmission } from './pages/FeedbackSubmission';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

// Admin Pages
import { Overview } from './admin/Overview';
import { Projects } from './admin/Projects';
import { Clients } from './admin/Clients';
import { Messages } from './admin/Messages';
import { Testimonials as AdminTestimonials } from './admin/Testimonials';
import { Packages as AdminPackages } from './admin/Packages';
import { Leads } from './admin/Leads';
import { Deals } from './admin/Deals';
import { Tasks } from './admin/Tasks';
import { Invoices } from './admin/Invoices';
import { Settings } from './admin/Settings';
import { AdminRedirect } from './admin/AdminRedirect';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll to top on route change
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
    
    // Refresh scroll triggers after a short delay to ensure DOM is ready
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [location.pathname]);

  return <>{children}</>;
}
function MainLayout({ children, settings, hasProjects }: { children: React.ReactNode, settings: any, hasProjects: boolean }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const isMaintenance = settings?.maintenanceMode && location.pathname === '/';

  if (isAdmin || isMaintenance) return <>{children}</>;

  return (
    <main className="min-h-screen bg-primary selection:bg-accent-cyan/30 selection:text-accent-cyan">
      <Navigation settings={settings} hasProjects={hasProjects} />
      {children}
      <Footer settings={settings} />
      <WhatsAppWidget />
    </main>
  );
}

function HomePage({ settings, hasProjects }: { settings: any, hasProjects: boolean }) {
  return (
    <>
      <Hero3D settings={settings} />
      <Services />
      {hasProjects && <Portfolio />}
      <TestimonialBook />
      <Process />
      <Packages />
      <About settings={settings} />
      <Contact settings={settings} />
    </>
  );
}

function App() {
  const [settings, setSettings] = useState<any>(null);
  const [hasProjects, setHasProjects] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/projects')
        ]);

        if (!settingsRes.ok) throw new Error('Settings fetch failed');
        const settingsData = await settingsRes.json();
        setSettings(settingsData);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setHasProjects(Array.isArray(projectsData) && projectsData.length > 0);
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <SmoothScroll>
        <MagneticCursor />
        <MainLayout settings={settings} hasProjects={hasProjects}>
          <Routes>
            {/* Main Website */}
            <Route 
              path="/" 
              element={settings?.maintenanceMode ? <Maintenance /> : <HomePage settings={settings} hasProjects={hasProjects} />} 
            />
            <Route path="/projects" element={<AllProjects settings={settings} />} />
            <Route path="/project/:id" element={<ProjectDetail settings={settings} />} />
            <Route path="/feedback" element={<FeedbackSubmission />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy settings={settings} />} />
            <Route path="/terms-conditions" element={<TermsConditions settings={settings} />} />
            
            {/* Admin Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute permission="dashboard"><Overview /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute permission="projects"><Projects /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute permission="clients"><Clients /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute permission="messages"><Messages /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute permission="testimonials"><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/packages" element={<ProtectedRoute permission="packages"><AdminPackages /></ProtectedRoute>} />
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
        </MainLayout>
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;

