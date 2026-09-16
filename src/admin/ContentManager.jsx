import React, { useState, useEffect, useMemo } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { updateContent } from '../services/api';
import { toast } from 'react-hot-toast';
import { CheckmarkBadge04Icon, PlusSignIcon, Delete01Icon } from 'hugeicons-react';

const ContentManager = () => {
  const { content, refreshData } = useSupabase();
  const [formData, setFormData] = useState({});
  const [modifiedKeys, setModifiedKeys] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      // Initialize form data with parsed arrays where applicable
      const initialData = {};
      Object.entries(content).forEach(([key, val]) => {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            initialData[key] = parsed;
          } else {
            initialData[key] = val;
          }
        } catch (e) {
          initialData[key] = val;
        }
      });
      setFormData(initialData);
      setModifiedKeys(new Set());
    }
  }, [content]);

  // Group keys by prefix (e.g., 'hero_title' -> 'Hero')
  const groupedContent = useMemo(() => {
    const groups = {};
    Object.keys(formData).forEach(key => {
      let groupName = 'General';
      const parts = key.split('_');
      if (parts.length > 1) {
        groupName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(key);
    });
    return groups;
  }, [formData]);

  const handleFieldChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setModifiedKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const handleArrayChange = (key, idx, objKey, val) => {
    const newArr = [...formData[key]];
    if (objKey) {
      newArr[idx] = { ...newArr[idx], [objKey]: val };
    } else {
      newArr[idx] = val;
    }
    handleFieldChange(key, newArr);
  };

  const addArrayItem = (key) => {
    const arr = formData[key] || [];
    let newItem = "";
    if (arr.length > 0) {
      const template = arr[0];
      if (typeof template === 'object' && template !== null) {
        newItem = {};
        Object.keys(template).forEach(k => {
          newItem[k] = typeof template[k] === 'boolean' ? false : "";
        });
      }
    }
    handleFieldChange(key, [...arr, newItem]);
  };

  const removeArrayItem = (key, idx) => {
    const newArr = [...formData[key]];
    newArr.splice(idx, 1);
    handleFieldChange(key, newArr);
  };

  const handleSaveAll = async () => {
    if (modifiedKeys.size === 0) return;
    
    setSaving(true);
    const loadingToast = toast.loading('Saving changes...');
    try {
      const promises = Array.from(modifiedKeys).map(key => {
        const val = formData[key];
        const valueToSave = typeof val === 'string' ? val : JSON.stringify(val);
        return updateContent(key, valueToSave);
      });
      
      await Promise.all(promises);
      toast.success('All changes saved successfully!', { id: loadingToast });
      setModifiedKeys(new Set());
      await refreshData();
    } catch (err) {
      toast.error('Failed to save changes: ' + err.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const formatTitle = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="animate-in fade-in duration-500 pb-32">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Website Texts & Copy</h2>
          <p className="text-white/60">Edit the text that appears on your website.</p>
        </div>
        
        {/* Sticky Save Button (Desktop) */}
        <div className="hidden md:block">
          <button
            onClick={handleSaveAll}
            disabled={saving || modifiedKeys.size === 0}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2 hover:bg-primary/90"
          >
            <CheckmarkBadge04Icon size={18} />
            {saving ? 'Saving...' : `Save ${modifiedKeys.size > 0 ? modifiedKeys.size : ''} Changes`}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedContent)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([groupName, keys]) => (
          <div key={groupName} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 font-semibold text-lg text-primary font-heading">
              {groupName} Section
            </div>
            
            <div className="divide-y divide-white/5 p-6 space-y-6">
              {keys.sort().map(key => {
                const val = formData[key];
                const isArray = Array.isArray(val);
                
                return (
                  <div key={key} className="pt-6 first:pt-0">
                    <div className="mb-3">
                      <label className="block text-sm font-bold text-white/90">
                        {formatTitle(key)}
                      </label>
                      <span className="text-[10px] text-white/30 font-mono mt-1 block">Key: {key}</span>
                    </div>

                    {isArray ? (
                      <div className="space-y-4">
                        {val.map((item, idx) => (
                          <div key={idx} className="p-4 bg-black border border-white/10 rounded-xl relative group">
                            <button 
                              onClick={() => removeArrayItem(key, idx)} 
                              className="absolute -right-2 -top-2 w-6 h-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all text-xs border border-red-500/20"
                              title="Remove Item"
                            >
                              <Delete01Icon size={12} />
                            </button>
                            
                            {typeof item === 'object' && item !== null ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.keys(item).map(objKey => (
                                  <div key={objKey}>
                                    <label className="block text-xs uppercase font-bold mb-1.5 text-white/50 tracking-wider">
                                      {objKey.replace(/_/g, ' ')}
                                    </label>
                                    {typeof item[objKey] === 'boolean' ? (
                                      <select 
                                        value={item[objKey] ? "true" : "false"}
                                        onChange={(e) => handleArrayChange(key, idx, objKey, e.target.value === 'true')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
                                      >
                                        <option value="true" className="bg-black text-white">True</option>
                                        <option value="false" className="bg-black text-white">False</option>
                                      </select>
                                    ) : (
                                      <input 
                                        value={item[objKey] || ''} 
                                        onChange={(e) => handleArrayChange(key, idx, objKey, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors text-white"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <input 
                                value={item || ''}
                                onChange={(e) => handleArrayChange(key, idx, null, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors text-white"
                                placeholder="List Item"
                              />
                            )}
                          </div>
                        ))}
                        <button 
                          onClick={() => addArrayItem(key)}
                          className="w-full py-3 border border-white/10 hover:border-white/30 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm text-theme hover:text-white transition-colors font-medium bg-white/5"
                        >
                          <PlusSignIcon size={16} /> Add Another Item
                        </button>
                      </div>
                    ) : (
                      <textarea
                        value={val || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-lg p-4 outline-none focus:border-primary min-h-[100px] text-sm text-white/90"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(formData).length === 0 && (
          <div className="p-12 text-center text-white/50 border border-white/10 rounded-xl border-dashed">
            No content fields found. Connect your database to populate values.
          </div>
        )}
      </div>

      {/* Floating Mobile Save Button */}
      {modifiedKeys.size > 0 && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-2xl shadow-primary/30 flex items-center justify-center gap-2"
          >
            <CheckmarkBadge04Icon size={20} />
            {saving ? 'Saving...' : `Save ${modifiedKeys.size} Changes`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
