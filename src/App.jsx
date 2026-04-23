import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SupabaseProvider, useSupabase } from './context/SupabaseContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';

// Site Manager to handle dynamic SEO and Themes
const SiteManager = () => {
  const { settings, projects } = useSupabase();
  const location = useLocation();

  useEffect(() => {
    // 1. Handle Themes
    if (settings && settings.primary_color) {
      document.documentElement.style.setProperty('--color-primary', settings.primary_color);
    }

    // 2. Handle Dynamic Titles & Meta
    const siteName = settings?.site_name || "Knowledge Udoh";
    let title = `${siteName} | Frontend Engineer & UI Designer`;
    let description = "Knowledge Udoh is a high-performance Frontend Engineer specializing in React, UI/UX design, and building scalable digital products.";

    // Route-specific logic
    if (location.pathname.startsWith('/project/')) {
      const projectId = location.pathname.split('/').pop();
      const project = projects?.find(p => p.id === projectId || p.slug === projectId);
      if (project) {
        title = `${project.title} | Projects by ${siteName}`;
        description = project.description;
      }
    } else if (location.pathname.startsWith('/admin')) {
      title = `Admin Dashboard | ${siteName}`;
    }

    document.title = title;
    
    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

  }, [settings, projects, location]);

  return null;
};

// Public Lazy load components
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const Reviews = lazy(() => import('./components/Reviews'));
const Services = lazy(() => import('./components/Services'));
const NotFound = lazy(() => import('./components/NotFound'));

// Admin Lazy load components
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Login = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ContentManager = lazy(() => import('./admin/ContentManager'));
const ProjectsManager = lazy(() => import('./admin/ProjectsManager'));
const SettingsManager = lazy(() => import('./admin/SettingsManager'));
const ReviewsManager = lazy(() => import('./admin/ReviewsManager'));

// Loading component for Suspense
const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <Suspense fallback={<SectionLoader />}>
    <Hero />
    <About />
    <Services />
    <Projects limit={3} />
    <Experience />
    <Skills />
    <Reviews />
    <Contact />
  </Suspense>
);

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-theme-bg text-white selection:bg-primary/30 text-[Inter]">
    <Header />
    <main>
      <Suspense fallback={<SectionLoader />}>
        {children}
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </div>
);

function App() {
  return (
    <SupabaseProvider>
      <BrowserRouter>
        <SiteManager />
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <Suspense fallback={<SectionLoader />}>
              <Login />
            </Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<SectionLoader />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="reviews" element={<ReviewsManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/project/:id" element={<PublicLayout><ProjectDetails /></PublicLayout>} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </SupabaseProvider>
  );
}

export default App;
