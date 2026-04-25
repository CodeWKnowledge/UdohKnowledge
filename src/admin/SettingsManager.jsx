import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { updateSettings } from '../services/api';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { Alert01Icon, DatabaseIcon, Refresh01Icon, Delete02Icon } from 'hugeicons-react';

const SettingsManager = () => {
  const { settings, refreshData } = useSupabase();
  const [formData, setFormData] = useState({
    site_name: '',
    primary_color: '',
    github: '',
    linkedin: '',
    twitter: '',
    tiktok: '',
    resume_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: ''
  });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        primary_color: settings.primary_color || '',
        github: settings.social_links?.github || '',
        linkedin: settings.social_links?.linkedin || '',
        twitter: settings.social_links?.twitter || '',
        tiktok: settings.social_links?.tiktok || '',
        resume_url: settings.social_links?.resume_url || '',
        contact_email: settings.social_links?.contact_email || '',
        contact_phone: settings.social_links?.contact_phone || '',
        contact_address: settings.social_links?.contact_address || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const social_links = {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        tiktok: formData.tiktok,
        resume_url: formData.resume_url,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_address: formData.contact_address
      };

      await updateSettings(settings.id, {
        site_name: formData.site_name,
        primary_color: formData.primary_color,
        social_links
      });
      
      toast.success('Settings updated successfully!');
      await refreshData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      toast('Click again to confirm database reset', { icon: '⚠️' });
      return;
    }

    setResetting(true);
    try {
      // 1. Clear non-essential tables
      const tables = ['projects', 'posts', 'reviews', 'content'];
      for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
        if (error) console.warn(`Error clearing ${table}:`, error.message);
      }

      toast.success('Database cleared successfully. Site is now in clean state.');
      setConfirmReset(false);
      await refreshData();
    } catch (err) {
      toast.error('Reset failed: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  if (!settings) return <div className="text-white/50">No settings found.</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl space-y-12 pb-20">
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Global Settings</h2>
          <p className="text-white/60">Configure main site behavior, branding, and contact details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branding */}
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-6">
            <h3 className="text-sm uppercase tracking-widest text-primary font-bold flex items-center gap-2">
               Identity & Style
            </h3>
            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Site Name</label>
              <input
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Primary Color</label>
              <div className="flex gap-4 items-center">
                <input
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                  placeholder="#8B5CF6"
                />
                <div 
                  className="w-10 h-10 rounded-lg border border-white/20 shrink-0 shadow-lg" 
                  style={{ backgroundColor: formData.primary_color || '#8B5CF6' }} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Resume URL (PDF Path or URL)</label>
              <input
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors font-mono text-sm"
                placeholder="/Resume.pdf"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-6">
            <h3 className="text-sm uppercase tracking-widest text-secondary font-bold flex items-center gap-2">
               Contact Details
            </h3>
            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Public Email</label>
              <input
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Phone Number</label>
              <input
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Location/Address</label>
              <input
                name="contact_address"
                value={formData.contact_address}
                onChange={handleChange}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-6 md:col-span-2">
            <h3 className="text-sm uppercase tracking-widest text-primary font-bold flex items-center gap-2">
               Social Media Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">GitHub URL</label>
                <input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">LinkedIn URL</label>
                <input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Twitter (X) URL</label>
                <input
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">TikTok URL</label>
                <input
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-bold disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Apply Site Settings'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-white/10 pt-12">
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-2">
                <Alert01Icon size={24} />
                Maintenance & Danger Zone
              </h3>
              <p className="text-white/60 max-w-xl">
                Perform administrative maintenance tasks. These actions are destructive and cannot be undone. 
                Use "Reset Database" to clear all projects, blog posts, and reviews before official launch.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { refreshData(); toast.success('Data synchronized'); }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold"
              >
                <Refresh01Icon size={18} />
                Sync Cache
              </button>
              
              <button
                onClick={handleResetData}
                disabled={resetting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold border ${
                  confirmReset 
                    ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'
                }`}
              >
                {resetting ? 'Resetting...' : (
                  <>
                    <Delete02Icon size={18} />
                    {confirmReset ? 'Confirm Full Reset' : 'Reset Database'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
