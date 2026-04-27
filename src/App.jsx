import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SupabaseProvider, useSupabase } from './context/SupabaseContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';

// Site Manager to handle dynamic SEO, Themes, and Analytics
const SiteManager = () => {
  const { settings, projects, posts, content } = useSupabase();
  const location = useLocation();

  useEffect(() => {
    // 1. Handle Themes
    if (settings && settings.primary_color) {
      document.documentElement.style.setProperty('--color-primary', settings.primary_color);
    }

    // 2. Handle Dynamic Titles & Meta
    const siteName = settings?.site_name || "Knowledge Udoh";
    const baseUrl = "https://knowledgeudoh.click";
    let title = `${siteName} | Frontend Engineer & UI Designer`;
    let description = content?.hero_description1 || "Knowledge Udoh is a high-performance Frontend Engineer specializing in React, UI/UX design, and building scalable digital products.";
    let image = `${baseUrl}/og-image.png`;
    let type = "website";
    let schema = [];

    // Default Person & Organization Schema
    const personSchema = {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      "name": "Knowledge Udoh",
      "jobTitle": "Lead Frontend Engineer",
      "url": baseUrl,
      "sameAs": [
        "https://linkedin.com/in/knowledge54",
        "https://github.com/CODEWKNOWLEDGE",
        "https://x.com/CodeWKnowledge"
      ]
    };

    const orgSchema = {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": `${siteName} Web Agency`,
      "url": baseUrl,
      "logo": `${baseUrl}/og-image.png`,
      "description": "Premium business website development and custom React solutions.",
      "founder": { "@id": `${baseUrl}/#person` }
    };

    // Route-specific logic
    if (location.pathname.startsWith('/project/')) {
      const projectId = location.pathname.split('/').pop();
      const project = projects?.find(p => p.id.toString() === projectId.toString() || p.slug === projectId);
      if (project) {
        title = `${project.title} | Projects by ${siteName}`;
        description = project.description;
        image = project.image_url || project.image || image;
        type = "article";
        schema.push({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description,
          "image": image,
          "author": { "@id": `${baseUrl}/#person` }
        });
      }
    } else if (location.pathname.startsWith('/blog/')) {
      const slug = location.pathname.split('/').pop();
      const post = posts?.find(p => p.slug === slug);
      if (post) {
        title = `${post.title} | ${siteName} Blog`;
        
        // Extract plain text for description
        let plainText = '';
        try {
          const blocks = JSON.parse(post.content);
          if (Array.isArray(blocks)) {
            plainText = blocks
              .filter(b => b.type === 'paragraph' || b.type === 'heading' || b.type === 'subheading')
              .map(b => b.value)
              .join(' ');
          }
        } catch (e) {
          plainText = post.content.replace(/<[^>]+>/g, '');
        }
        description = plainText.substring(0, 160).trim() + '...';
        image = post.image_url || image;
        type = "article";
        schema.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": description,
          "image": image,
          "datePublished": post.published_at || post.created_at,
          "author": { "@id": `${baseUrl}/#person` }
        });
      }
    } else if (location.pathname === '/blog') {
      title = `Blog & Insights | ${siteName} Agency`;
      description = "Read our expert insights on custom website development, business web design, and digital scaling.";
    } else if (location.pathname.startsWith('/admin')) {
      title = `Admin Dashboard | ${siteName}`;
      description = "Administrative access for site management.";
    } else {
      // Homepage / default
      schema.push(personSchema, orgSchema);
    }

    // Update Head
    document.title = title;
    
    const updateMeta = (name, value, isProperty = false) => {
      if (!value) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    updateMeta('description', description);
    updateMeta('title', title);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', `${baseUrl}${location.pathname}`, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', type, true);
    updateMeta('twitter:title', title, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', image, true);
    updateMeta('twitter:card', 'summary_large_image', true);

    // Dynamic Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = `${baseUrl}${location.pathname}`;

    // Handle Structured Data
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-schema');
    oldScripts.forEach(s => s.remove());

    if (schema.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.className = 'dynamic-schema';
      script.text = JSON.stringify(schema.length === 1 && schema[0].hasOwnProperty('@context') ? schema[0] : {
        "@context": "https://schema.org",
        "@graph": schema
      });
      document.head.appendChild(script);
    }

  }, [settings, projects, posts, content, location]);

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
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));

// Admin Lazy load components
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Login = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ContentManager = lazy(() => import('./admin/ContentManager'));
const ProjectsManager = lazy(() => import('./admin/ProjectsManager'));
const SettingsManager = lazy(() => import('./admin/SettingsManager'));
const ReviewsManager = lazy(() => import('./admin/ReviewsManager'));
const BlogManager = lazy(() => import('./admin/BlogManager'));

// Loading component for Suspense
const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Helper component to scroll to top or hash on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Small delay to ensure the component is rendered before scrolling
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);
  
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
    <ErrorBoundary>
      <SupabaseProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} />
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
              <Route path="blog" element={<BlogManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/project/:id" element={<PublicLayout><ProjectDetails /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </SupabaseProvider>
    </ErrorBoundary>
  );
}

export default App;

