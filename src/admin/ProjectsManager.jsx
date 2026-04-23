import React, { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { createProject, updateProject, deleteProject, uploadMedia, updateContent } from '../services/api';
import { toast } from 'react-hot-toast';
import { PlusSignIcon, Edit02Icon, Delete01Icon, Image01Icon, ArrowUp02Icon, ArrowDown02Icon } from 'hugeicons-react';

const ProjectsManager = () => {
  const { projects, refreshData } = useSupabase();
  const [editingProject, setEditingProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    technologies: '',
    image_url: '',
    live_url: '',
    github_url: '',
    date: '',
    type: '',
    client: '',
    category: [],
    featured: false
  });

  const resetForm = () => {
    setFormData({ 
      title: '', description: '', details: '', technologies: '', 
      image_url: '', live_url: '', github_url: '', 
      date: '', type: '', client: '', category: [], featured: false 
    });
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      details: project.details || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      image_url: project.image_url || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      date: project.date || '',
      type: project.type || '',
      client: project.client || '',
      category: Array.isArray(project.category) ? project.category : (project.category ? [project.category] : []),
      featured: project.featured || false
    });
    setIsAdding(false);
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const current = prev.category || [];
      const next = current.includes(cat) 
        ? current.filter(c => c !== cat) 
        : [...current, cat];
      return { ...prev, category: next };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const url = await uploadMedia(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Image upload failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
        toast.success('Project updated!');
      } else {
        await createProject(payload);
        toast.success('Project created!');
      }
      await refreshData();
      resetForm();
    } catch (err) {
      toast.error('Failed to save project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success('Project deleted!');
        await refreshData();
      } catch (err) {
        toast.error('Failed to delete project.');
      }
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;
    
    // Prepare the new order based on current list of IDs
    const currentOrder = projects.map(p => p.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap IDs
    [currentOrder[index], currentOrder[swapIndex]] = [currentOrder[swapIndex], currentOrder[index]];
    
    try {
      await updateContent('project_order', JSON.stringify(currentOrder));
      toast.success('Project order updated!');
      await refreshData();
    } catch (err) {
      toast.error('Failed to update project order.');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Projects Manager</h2>
          <p className="text-white/60 text-sm">Manage your portfolio projects.</p>
        </div>
        {!isAdding && !editingProject && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium shadow-lg shadow-primary/20"
          >
            <PlusSignIcon size={18} /> Add New Project
          </button>
        )}
      </div>

      {(isAdding || editingProject) ? (
        <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8 max-w-5xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            {editingProject ? 'Edit Project' : 'New Project'}
            {formData.title && <span className="text-primary font-normal text-sm opacity-50">&mdash; {formData.title}</span>}
          </h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Column 1: Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Project Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Short Description (for Cards)</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 min-h-[100px] outline-none focus:border-primary" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="featured" className="text-xs font-bold uppercase text-white/60">Featured on Home Page</label>
                </div>
              </div>

              {/* Column 2: Meta Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Date</label>
                    <input name="date" placeholder="May 2024" value={formData.date} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Project Type</label>
                    <input name="type" placeholder="SaaS / Web App" value={formData.type} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Client / Organization</label>
                  <input name="client" value={formData.client} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Project Category (Filtering)</label>
                  <div className="flex flex-wrap gap-2">
                    {["E-commerce", "Web apps", "Dashboards", "Sales"].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          formData.category?.includes(cat)
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-black border-white/20 text-white/40 hover:border-white/40"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Technologies (Comma Separated)</label>
                  <input name="technologies" placeholder="React, Tailwind, Node.js" value={formData.technologies} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary font-mono text-xs" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Live Preview URL</label>
                    <input type="url" name="live_url" value={formData.live_url} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Source Code (GitHub)</label>
                    <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary font-mono text-xs" />
                  </div>
                </div>
              </div>

              {/* Column 3: Media & Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Project Cover Image</label>
                  <div className="flex gap-2">
                    <input name="image_url" value={formData.image_url} onChange={handleChange} className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 outline-none focus:border-primary font-mono text-xs" placeholder="https://..." />
                    <label className="bg-white/10 hover:bg-white/20 cursor-pointer px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                      <Image01Icon size={18} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  {formData.image_url && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-white/10">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold mb-2 text-white/40 tracking-wider">Extended Narrative / Project Details</label>
                  <textarea name="details" placeholder="Describe the problem, solution, and impact..." value={formData.details} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 min-h-[150px] outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <button type="button" onClick={resetForm} className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all font-bold shadow-lg shadow-primary/20">
                {saving ? 'Saving...' : 'Publish Project'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-[#111] rounded-xl border border-white/10 overflow-hidden flex flex-col hover:border-white/30 transition-colors">
              <div className="aspect-video bg-black relative">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                )}
                {project.featured && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">Featured</span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                <p className="text-theme/60 text-sm line-clamp-2 mb-4 flex-1">{project.description}</p>
                
                <div className="flex justify-between items-center gap-2 pt-4 border-t border-white/10">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleMove(index, 'up')} 
                      disabled={index === 0}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                      title="Move Up"
                    >
                      <ArrowUp02Icon size={18} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')} 
                      disabled={index === projects.length - 1}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed" 
                      title="Move Down"
                    >
                      <ArrowDown02Icon size={18} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(project)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                      <Edit02Icon size={18} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                      <Delete01Icon size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full p-12 text-center border border-white/10 border-dashed rounded-xl text-white/50">
              No projects found. Add one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
