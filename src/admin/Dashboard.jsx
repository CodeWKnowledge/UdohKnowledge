import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';
import { Folder03Icon, TextIcon, Edit02Icon } from 'hugeicons-react';

const Dashboard = () => {
  const { projects = [], content = {}, settings = {}, reviews = [] } = useSupabase();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 italic font-heading">Welcome to Admin, {settings?.site_name || 'CodeW/Knowledge'}</h2>
        <p className="text-white/60 text-sm md:text-base">Command your digital kingdom. Everything is dynamic.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4 mb-4 text-primary">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Folder03Icon size={24} />
            </div>
            <h3 className="font-semibold text-lg text-white font-heading">Projects</h3>
          </div>
          <div className="text-4xl font-bold font-logo italic">{projects.length}</div>
          <div className="text-xs uppercase tracking-widest text-theme/30 mt-2 font-bold">Published</div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4 mb-4 text-secondary">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <TextIcon size={24} />
            </div>
            <h3 className="font-semibold text-lg text-white font-heading">Text Keys</h3>
          </div>
          <div className="text-4xl font-bold font-logo italic">{Object.keys(content).length}</div>
          <div className="text-xs uppercase tracking-widest text-theme/30 mt-2 font-bold">Dynamic Nodes</div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4 mb-4 text-primary">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Folder03Icon size={24} />
            </div>
            <h3 className="font-semibold text-lg text-white font-heading">Reviews</h3>
          </div>
          <div className="text-4xl font-bold font-logo italic">{reviews.length}</div>
          <div className="text-xs uppercase tracking-widest text-theme/30 mt-2 font-bold">Total Feedback</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold font-heading italic">Quick Command</h3>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/projects" className="flex flex-col items-center justify-center p-6 bg-black border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group">
             <Folder03Icon size={32} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
             <span className="text-xs uppercase tracking-widest font-bold opacity-60">Projects</span>
          </Link>
          <Link to="/admin/content" className="flex flex-col items-center justify-center p-6 bg-black border border-white/5 rounded-2xl hover:border-secondary/40 hover:bg-secondary/5 transition-all group">
             <TextIcon size={32} className="text-secondary mb-3 group-hover:scale-110 transition-transform" />
             <span className="text-xs uppercase tracking-widest font-bold opacity-60">Content</span>
          </Link>
          <Link to="/admin/settings" className="flex flex-col items-center justify-center p-6 bg-black border border-white/5 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all group">
             <Edit02Icon size={32} className="text-white mb-3 group-hover:scale-110 transition-transform opacity-60" />
             <span className="text-xs uppercase tracking-widest font-bold opacity-60">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
