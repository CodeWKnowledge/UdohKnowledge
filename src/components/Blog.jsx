import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';

const Blog = () => {
  const { posts } = useSupabase();

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-theme-bg text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-[50vh] bg-primary/20 blur-[150px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-logo mb-6">
            Insights & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Strategy</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Deep-dive articles on web engineering, digital growth strategies, and how high-performance custom websites generate revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              key={post.id || post.slug}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-4 text-xs text-white/40 mb-3 uppercase tracking-widest font-bold">
                    <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>
                    <span>•</span>
                    <span>{post.read_time}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-widest uppercase">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
