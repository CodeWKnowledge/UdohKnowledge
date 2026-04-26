import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useSupabase } from '../context/SupabaseContext';
import { Toaster, toast } from 'react-hot-toast';

const Login = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.message);
    } else if (authData?.user) {
      // Check admin users table
      const { data: adminUsers, error: adminErr } = await supabase.from('admin_users').select('*');
      
      if (adminErr) {
        toast.error("Could not verify permissions. Check database schema.");
        await supabase.auth.signOut();
      } else {
        if (adminUsers.length === 0) {
          // First user to ever log in successfully becomes the sole admin
          const { error: insertErr } = await supabase.from('admin_users').insert({ email: authData.user.email });
          if (!insertErr) {
            toast.success("First admin registered! Welcome.");
            navigate('/admin');
          } else {
             toast.error("Failed to register as admin.");
             await supabase.auth.signOut();
          }
        } else {
          // Verify if they are the designated admin
          const isAdmin = adminUsers.some(admin => admin.email === authData.user.email);
          if (isAdmin) {
             toast.success('Logged in successfully!');
             navigate('/admin');
          } else {
             await supabase.auth.signOut();
             toast.error("Access denied. Only the authorized administrator can access this dashboard.");
          }
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-[Inter]">
      <div className="w-full max-w-md p-8 bg-[#111] rounded-2xl border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-theme/50">Sign in to access the admin dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#222', color: '#fff' }
      }} />
    </div>
  );
};

export default Login;
