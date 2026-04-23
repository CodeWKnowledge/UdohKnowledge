import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { updateContent } from '../services/api';
import { toast } from 'react-hot-toast';
import { CheckmarkBadge04Icon, Edit02Icon, PlusSignIcon, Delete01Icon } from 'hugeicons-react';

const ContentManager = () => {
  const { content, refreshData } = useSupabase();
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [contentKeys, setContentKeys] = useState([]);

  useEffect(() => {
    if (content) {
      // Sort keys alphabetically
      setContentKeys(Object.entries(content).sort(([a], [b]) => a.localeCompare(b)));
    }
  }, [content]);

  const handleEdit = (key, val) => {
    setEditingKey(key);
    let initialValue = val;
    try {
      // Try to parse JSON strictly to create a builder if it's an array
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        initialValue = parsed;
      }
    } catch (e) {
      // Not an array JSON string, keep as simple string
    }
    setEditValue(initialValue);
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      const valueToSave = typeof editValue === 'string' ? editValue : JSON.stringify(editValue);
      await updateContent(key, valueToSave);
      toast.success('Content updated successfully!');
      await refreshData();
      setEditingKey(null);
    } catch (err) {
      toast.error('Failed to update content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Content Manager</h2>
        <p className="text-white/60">Edit static text values across the portfolio effortlessly.</p>
      </div>

      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 font-semibold text-white/80">
          <div className="col-span-3">Key Identifier</div>
          <div className="col-span-7">Content Value</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/10">
          {contentKeys.map(([key, val]) => (
            <div key={key} className="flex flex-col lg:grid lg:grid-cols-12 gap-4 p-4 lg:items-start hover:bg-white/5 transition-colors">
              {/* Key Identifier */}
              <div className="col-span-3 lg:pt-2">
                <span className="text-[10px] uppercase tracking-wider text-theme/40 font-bold mb-1 block lg:hidden">Key Identifier</span>
                <div className="font-mono text-sm text-primary break-all">{key}</div>
              </div>
              
              {/* Content Value */}
              <div className="col-span-7">
                <span className="text-[10px] uppercase tracking-wider text-theme/40 font-bold mb-1 block lg:hidden">Content Value</span>
                
                {editingKey === key ? (
                  Array.isArray(editValue) ? (
                    // ------------------ DYNAMIC ARRAY BUILDER ------------------
                    <div className="space-y-4 w-full">
                      {editValue.map((item, idx) => (
                        <div key={idx} className="p-4 bg-black border border-white/10 rounded-xl relative group focus-within:border-white/30 transition-colors">
                          <button 
                            onClick={() => {
                              const newVal = [...editValue];
                              newVal.splice(idx, 1);
                              setEditValue(newVal);
                            }} 
                            className="absolute -right-2 -top-2 w-6 h-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all text-xs border border-red-500/20 focus:opacity-100"
                            title="Remove Item"
                          >
                            <Delete01Icon size={12} />
                          </button>
                          
                          {typeof item === 'object' && item !== null ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.keys(item).map(objKey => (
                                <div key={objKey}>
                                  <label className="block text-[10px] uppercase font-bold mb-1 text-white/40 tracking-wider">
                                    {objKey.replace(/_/g, ' ')}
                                  </label>
                                  {typeof item[objKey] === 'boolean' ? (
                                     <select 
                                       value={item[objKey] ? "true" : "false"}
                                       onChange={(e) => {
                                         const newVal = [...editValue];
                                         newVal[idx] = { ...newVal[idx], [objKey]: e.target.value === 'true' };
                                         setEditValue(newVal);
                                       }}
                                       className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
                                     >
                                       <option value="true" className="bg-black text-white">True</option>
                                       <option value="false" className="bg-black text-white">False</option>
                                     </select>
                                  ) : (
                                    <input 
                                      value={item[objKey] || ''} 
                                      onChange={(e) => {
                                         const newVal = [...editValue];
                                         newVal[idx] = { ...newVal[idx], [objKey]: e.target.value };
                                         setEditValue(newVal);
                                      }}
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <input 
                              value={item || ''}
                              onChange={(e) => {
                                 const newVal = [...editValue];
                                 newVal[idx] = e.target.value;
                                 setEditValue(newVal);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors text-white font-mono"
                              placeholder="Array Item"
                            />
                          )}
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          let newItem = "";
                          if (editValue.length > 0) {
                             // Clone structure of the first item
                             const template = editValue[0];
                             if (typeof template === 'object' && template !== null) {
                                newItem = {};
                                Object.keys(template).forEach(k => {
                                  newItem[k] = typeof template[k] === 'boolean' ? false : "";
                                });
                             }
                          }
                          setEditValue([...editValue, newItem]);
                        }}
                        className="w-full py-2.5 border border-white/10 hover:border-white/30 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm text-theme hover:text-white transition-colors font-medium bg-white/5 hover:bg-white/10"
                      >
                        <PlusSignIcon size={16} /> Add New Item
                      </button>
                    </div>
                  ) : (
                    // ------------------ FALLBACK TEXTAREA ------------------
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg p-3 outline-none focus:border-primary min-h-[100px] text-sm font-mono text-white/90"
                      autoFocus
                    />
                  )
                ) : (
                  // ------------------ DISPLAY MODE ------------------
                  <div className="text-sm text-white/90 whitespace-pre-wrap">
                    {(() => {
                      // Attempt to nicely format JSON items in preview
                      try {
                        const parsed = JSON.parse(val);
                        if (Array.isArray(parsed)) {
                          return (
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">List ({parsed.length} items)</span>
                              <div className="text-white/60 line-clamp-2 text-xs font-mono mt-2">
                                {val}
                              </div>
                            </div>
                          );
                        }
                      } catch (e) {}
                      return <div className="line-clamp-3 lg:line-clamp-2 leading-relaxed">{val}</div>;
                    })()}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end items-start mt-2 lg:mt-0 xl:pt-2">
                {editingKey === key ? (
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => setEditingKey(null)}
                      className="flex-1 lg:flex-none px-4 py-2 lg:px-3 lg:py-1.5 text-xs font-bold border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(key)}
                      disabled={saving}
                      className="flex-1 lg:flex-none px-4 py-2 lg:px-3 lg:py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 lg:gap-1 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      <CheckmarkBadge04Icon size={14} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(key, val)}
                    className="p-2 text-white/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <Edit02Icon size={18} />
                    <span className="lg:hidden">Edit Block</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {contentKeys.length === 0 && (
            <div className="p-8 text-center text-white/50 border-t border-white/10">
              No content fields found. Connect your database to populate values.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
