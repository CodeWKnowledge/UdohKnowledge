import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';

// Lazy load non-critical components
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));

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
    <Projects limit={3} />
    <Experience />
    <Skills />
    <Contact />
  </Suspense>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-theme-bg text-white selection:bg-primary/30 text-[Inter]">
        <Header />
        <main>
          <Suspense fallback={<SectionLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Routes>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
