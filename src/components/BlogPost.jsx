import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft02Icon } from 'hugeicons-react';


import { useSupabase } from '../context/SupabaseContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { posts } = useSupabase();
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      // 1. Dynamic Title
      document.title = `${post.title} | Knowledge Udoh Blog`;

      // 2. Extract Plain Text for Meta Description
      let plainText = '';
      try {
        const blocks = JSON.parse(post.content);
        if (Array.isArray(blocks)) {
          plainText = blocks
            .filter(b => b.type === 'paragraph' || b.type === 'heading' || b.type === 'subheading')
            .map(b => b.value)
            .join(' ');
        }
      } catch (e) {
        plainText = post.content.replace(/<[^>]+>/g, '');
      }
      
      const description = plainText.substring(0, 160).trim() + '...';
      
      // Update Primary Meta
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);

      // 3. Dynamic Social Meta (Open Graph)
      const updateMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
        if (el) el.setAttribute('content', content);
      };

      updateMeta('og:title', post.title);
      updateMeta('og:description', description);
      if (post.image_url) updateMeta('og:image', post.image_url);
      updateMeta('twitter:title', post.title);
      updateMeta('twitter:description', description);
      if (post.image_url) updateMeta('twitter:image', post.image_url);
    }
  }, [post, slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="pt-32 pb-20 px-6 min-h-screen bg-theme-bg text-white relative">
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-primary/5 blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-10">
          <ArrowLeft02Icon size={16} /> Back to Insights
        </Link>

        <header className="mb-12 border-b border-white/10 pb-12">
          <h1 className="text-3xl md:text-5xl font-logo mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/40 uppercase tracking-widest text-sm font-bold">
            <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>
            <span>•</span>
            <span className="text-primary">Knowledge Udoh</span>
          </div>
        </header>

        <div className="rich-text max-w-none">
          {(() => {
            try {
              const blocks = JSON.parse(post.content);
              if (!Array.isArray(blocks)) throw new Error();
              return blocks.map((block, i) => {
                switch (block.type) {
                  case 'heading':
                    return <h2 key={i}>{block.value}</h2>;
                  case 'subheading':
                    return <h3 key={i}>{block.value}</h3>;
                  case 'paragraph':
                    // Split paragraphs by double newlines for better spacing if the user didn't use separate blocks
                    return block.value.split('\n\n').map((p, pi) => (
                      <p key={`${i}-${pi}`}>{p}</p>
                    ));
                  case 'image':
                    return (
                      <figure key={i} className="my-12">
                        <img src={block.value} alt={post.title} className="rounded-2xl w-full border border-white/10 h-100 object-center"  />
                      </figure>
                    );
                  default:
                    return null;
                }
              });
            } catch (e) {
              // Fallback for legacy HTML posts
              return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
            }
          })()}
        </div>

        <div className="mt-20 pt-10 border-t border-white/10 text-center">
          <h3 className="text-2xl font-bold mb-4">Need a high-performance business website?</h3>
          <p className="text-white/60 mb-6">Let's build a custom solution that ranks and converts.</p>
          <Link to="/#contact" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(126,34,206,0.3)]">
            Start Your Project
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
