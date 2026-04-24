import React, { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { createPost, updatePost, deletePost, uploadMedia } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  PlusSignIcon, 
  Edit02Icon, 
  Delete01Icon, 
  CheckmarkBadge04Icon, 
  Image01Icon,
  ViewIcon,
  Cancel01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  TextIcon,
  Heading01Icon,
  Heading02Icon,
  ImageAdd01Icon
} from 'hugeicons-react';

const BlogManager = () => {
  const { posts, refreshData } = useSupabase();
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '[]', // JSON string of blocks
    category: '',
    image_url: '',
    read_time: ''
  });

  const [contentBlocks, setContentBlocks] = useState([]);

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      let blocks = [];
      try {
        blocks = JSON.parse(post.content);
        if (!Array.isArray(blocks)) throw new Error();
      } catch (e) {
        // Fallback for legacy HTML posts
        blocks = [{ type: 'paragraph', value: post.content }];
      }
      setContentBlocks(blocks);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        category: post.category || '',
        image_url: post.image_url || '',
        read_time: post.read_time || ''
      });
    } else {
      setEditingPost(null);
      setContentBlocks([{ type: 'paragraph', value: '' }]);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '[]',
        category: '',
        image_url: '',
        read_time: ''
      });
    }
    setShowModal(true);
  };

  const handleAddBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, value: '' }]);
  };

  const handleUpdateBlock = (index, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].value = value;
    setContentBlocks(newBlocks);
  };

  const handleRemoveBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const handleMoveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;
    
    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const handleBlockImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading('Uploading image...');
    try {
      const url = await uploadMedia(file);
      handleUpdateBlock(index, url);
      toast.success('Uploaded!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed: ' + err.message, { id: loadingToast });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading('Uploading cover...');
    try {
      const url = await uploadMedia(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Uploaded!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed: ' + err.message, { id: loadingToast });
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: title,
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const submissionData = {
      ...formData,
      content: JSON.stringify(contentBlocks)
    };
    try {
      if (editingPost) {
        await updatePost(editingPost.id, submissionData);
        toast.success('Post updated!');
      } else {
        await createPost(submissionData);
        toast.success('Post created!');
      }
      await refreshData();
      setShowModal(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      toast.success('Post deleted');
      await refreshData();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Blog Manager</h2>
          <p className="text-white/60 text-sm">Create structured articles using a block-based system.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-lg shadow-primary/20"
        >
          <PlusSignIcon size={20} />
          <span>New Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col hover:shadow-2xl hover:shadow-primary/5">
            <div className="h-40 bg-white/5 relative overflow-hidden">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image01Icon size={32} className="text-white/10" />
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-primary uppercase tracking-widest">
                {post.category || 'Uncategorized'}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-white/40 text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">{post.excerpt}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-[10px] text-white/20 font-mono uppercase">
                  /{post.slug}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(post)} className="p-2 bg-white/5 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"><Edit02Icon size={16} /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><Delete01Icon size={16} /></button>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors"><ViewIcon size={16} /></a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'Create Article'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"><Cancel01Icon size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
              {/* Metadata Cluster */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-white/40 mb-2 tracking-widest leading-none">Title</label>
                    <input required value={formData.title} onChange={handleTitleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-white/40 mb-2 tracking-widest leading-none">Category</label>
                      <input value={formData.category} onChange={(e) => setFormData(p => ({...p, category: e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" placeholder="Guides" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-white/40 mb-2 tracking-widest leading-none">Read Time</label>
                      <input value={formData.read_time} onChange={(e) => setFormData(p => ({...p, read_time: e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" placeholder="6 min" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-white/40 mb-2 tracking-widest leading-none">Excerpt</label>
                    <textarea rows="2" value={formData.excerpt} onChange={(e) => setFormData(p => ({...p, excerpt: e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm" />
                  </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-white/40 mb-3 tracking-widest leading-none">Cover Image</label>
                    <div className="flex gap-4">
                      <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {formData.image_url ? <img src={formData.image_url} className="w-full h-full object-cover" /> : <Image01Icon size={32} className="text-white/10" />}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input value={formData.image_url} onChange={(e) => setFormData(p => ({...p, image_url: e.target.value}))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="URL..." />
                        <label className="block w-full py-3 bg-primary/10 border border-primary/20 border-dashed rounded-xl text-center text-[10px] uppercase font-bold text-primary hover:bg-primary/20 cursor-pointer transition-colors">
                          Upload Cover
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                </div>
              </div>

              {/* Block Editor Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Content Blocks</h4>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAddBlock('heading')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all font-bold"><Heading01Icon size={14}/> H2</button>
                    <button type="button" onClick={() => handleAddBlock('subheading')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all font-bold"><Heading02Icon size={14}/> H3</button>
                    <button type="button" onClick={() => handleAddBlock('paragraph')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all font-bold"><TextIcon size={14}/> P</button>
                    <button type="button" onClick={() => handleAddBlock('image')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs flex items-center gap-2 border border-white/10 transition-all font-bold"><ImageAdd01Icon size={14}/> IMG</button>
                  </div>
                </div>

                <div className="space-y-4 min-h-[300px] p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                  {contentBlocks.map((block, index) => (
                    <div key={index} className="group relative bg-[#0D0D0D] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all">
                      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => handleMoveBlock(index, 'up')} className="p-1.5 hover:text-primary transition-colors"><ArrowUp01Icon size={16}/></button>
                        <button type="button" onClick={() => handleMoveBlock(index, 'down')} className="p-1.5 hover:text-primary transition-colors"><ArrowDown01Icon size={16}/></button>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-3">
                          {block.type === 'heading' && <Heading01Icon size={18} className="text-primary"/>}
                          {block.type === 'subheading' && <Heading02Icon size={18} className="text-secondary"/>}
                          {block.type === 'paragraph' && <TextIcon size={18} className="text-white/40"/>}
                          {block.type === 'image' && <Image01Icon size={18} className="text-green-500"/>}
                        </div>
                        
                        <div className="flex-1">
                          {block.type === 'image' ? (
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 rounded-lg bg-black flex items-center justify-center border border-white/5 overflow-hidden">
                                {block.value ? <img src={block.value} className="w-full h-full object-cover"/> : <Image01Icon size={20} className="text-white/20"/>}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input value={block.value} onChange={(e) => handleUpdateBlock(index, e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60" placeholder="Image URL..."/>
                                <label className="inline-block text-[9px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline">
                                  Upload
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockImageUpload(e, index)}/>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <textarea 
                              value={block.value} 
                              onChange={(e) => handleUpdateBlock(index, e.target.value)} 
                              rows={block.type === 'paragraph' ? 4 : 1}
                              className={`w-full bg-transparent border-none outline-none resize-none text-white ${block.type === 'heading' ? 'text-xl font-bold font-logo' : block.type === 'subheading' ? 'text-lg font-bold font-logo text-secondary' : 'text-sm'}`}
                              placeholder={`Type your ${block.type} component...`}
                            />
                          )}
                        </div>

                        <button type="button" onClick={() => handleRemoveBlock(index)} className="p-2 text-white/10 hover:text-red-500 transition-colors"><Delete01Icon size={16}/></button>
                      </div>
                    </div>
                  ))}
                  {contentBlocks.length === 0 && <div className="h-40 flex items-center justify-center text-white/20 text-sm italic">Add a content block to get started...</div>}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors uppercase tracking-widest">Discard</button>
                <button type="submit" disabled={saving} className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center gap-3 transition-all">
                  {saving ? 'Saving...' : <><CheckmarkBadge04Icon size={18} /> SAVE CHANGES</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;

