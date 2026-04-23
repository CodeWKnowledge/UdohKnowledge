import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { getContent, getProjects, getSettings, getReviews } from '../services/api';

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedContent, fetchedProjects, fetchedSettings, fetchedReviews] = await Promise.all([
        getContent(),
        getProjects(),
        getSettings(),
        getReviews()
      ]);
      
      // Sort projects based on fetchedContent.project_order if available
      let sortedProjects = fetchedProjects || [];
      if (fetchedContent?.project_order) {
        try {
          const orderArr = typeof fetchedContent.project_order === 'string' 
            ? JSON.parse(fetchedContent.project_order) 
            : fetchedContent.project_order;
            
          if (Array.isArray(orderArr)) {
            // Create a copy to sort
            sortedProjects = [...sortedProjects].sort((a, b) => {
              const oA = orderArr.indexOf(a.id);
              const oB = orderArr.indexOf(b.id);
              if (oA !== -1 && oB !== -1) return oA - oB;
              if (oA !== -1) return -1;
              if (oB !== -1) return 1;
              return 0; // maintain relative default ordering (created_at desc)
            });
          }
        } catch(e) {
          console.error("Error sorting projects:", e);
        }
      }

      setContent(fetchedContent || {});
      setProjects(sortedProjects);
      setSettings(fetchedSettings || null);
      setReviews(fetchedReviews || []);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Fetch
    fetchData();

    // 2. Auth State Subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // 3. Real-time Subscriptions
    const channel = supabase.channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, (payload) => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
        fetchData();
      })
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ content, projects, settings, reviews, user, loading, refreshData: fetchData }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
