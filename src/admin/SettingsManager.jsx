import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { updateSettings } from '../services/api';
import { toast } from 'react-hot-toast';

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

  if (!settings) return <div className="text-white/50">No settings found.</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Global Settings</h2>
        <p className="text-white/60">Configure main site behavior, branding, and contact details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Branding */}
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 space-y-6">
          <h3 className="text-sm uppercase tracking-widest text-primary font-bold">Identity & Style</h3>
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
          <h3 className="text-sm uppercase tracking-widest text-secondary font-bold">Contact Details</h3>
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
          <h3 className="text-sm uppercase tracking-widest text-primary font-bold">Social Media presence</h3>
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
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-bold disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-95"
        >
          {saving ? 'Saving...' : 'Apply Site Settings'}
        </button>
      </div>
    </div>
  );
};
export default SettingsManager;
