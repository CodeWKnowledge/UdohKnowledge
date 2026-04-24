import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../services/supabase';
import { DashboardSquare02Icon, Folder03Icon, TextIcon, Settings02Icon, Logout01Icon, Menu01Icon, Cancel01Icon, Message01Icon, BookOpen01Icon } from 'hugeicons-react';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const { user, loading } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-theme-bg text-white">Loading Admin...</div>;
  }

  if (!user) return null; // Wait for redirect

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <DashboardSquare02Icon size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Folder03Icon size={20} /> },
    { name: 'Content', path: '/admin/content', icon: <TextIcon size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Message01Icon size={20} /> },
    { name: 'Blog', path: '/admin/blog', icon: <BookOpen01Icon size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings02Icon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-[Inter] relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/10 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 text-xl font-bold tracking-wider flex items-center justify-between">
        <Link to="/">
          <div className="font-heading"><span className="text-primary font-accent">Knowledge</span>Udoh</div>
        </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-white/60 hover:text-white">
            <Cancel01Icon size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                (location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))
                  ? 'bg-primary/20 font-heading text-primary border border-primary/30'
                  : 'text-white/60 font-accent hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Logout01Icon size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-[#111] sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu01Icon size={24} />
            </button>
            <h1 className="text-lg font-medium text-white/80 line-clamp-1">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Admin'}
            </h1>
          </div>
          <div className="text-sm text-theme/50 hidden sm:block truncate ml-4">{user.email}</div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-black">
          <Outlet />
        </div>
      </main>
      
      <Toaster position="top-right" toastOptions={{
        style: { background: '#333', color: '#fff', borderRadius: '8px' }
      }} />
    </div>
  );
};

export default AdminLayout;
