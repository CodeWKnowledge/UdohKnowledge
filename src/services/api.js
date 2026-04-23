import { supabase } from './supabase';

// --- CONTENT API ---
export const getContent = async () => {
  const { data, error } = await supabase.from('content').select('*');
  if (error) {
    console.error('Error fetching content:', error);
    return null;
  }
  
  // Convert array of {key, value} to an object mapping
  const contentMap = {};
  data.forEach((item) => {
    contentMap[item.key] = item.value;
  });
  return contentMap;
};

export const updateContent = async (key, value) => {
  const { data, error } = await supabase
    .from('content')
    .upsert({ key, value }, { onConflict: 'key' })
    .select();
    
  if (error) throw error;
  return data;
};

// --- SETTINGS API ---
export const getSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching settings:', error);
    return null;
  }
  return data;
};

export const updateSettings = async (id, settings) => {
  const { data, error } = await supabase
    .from('settings')
    .update(settings)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data;
};

// --- PROJECTS API ---
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data;
};

export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  return data;
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select();
    
  if (error) throw error;
  return data[0];
};

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data[0];
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// --- STORAGE API ---
export const uploadMedia = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
// --- REVIEWS API ---
export const getReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data;
};

export const getAdminReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const submitReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select();
    
  if (error) throw error;
  return data[0];
};

export const updateReviewApproval = async (id, approved) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ approved })
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data[0];
};

export const deleteReview = async (id) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};
