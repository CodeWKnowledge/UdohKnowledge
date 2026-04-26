import React, { useState, useEffect, useRef } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, UserIcon, PlusSignIcon, Cancel01Icon, Image01Icon, QuoteUpIcon } from 'hugeicons-react';
import { submitReview, uploadMedia } from '../services/api';
import { toast } from 'react-hot-toast';

const WavyStar = () => (
  <div className="absolute -top-12 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 group">
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce duration-[3000ms]">
      <path d="M20 80C30 70 40 90 50 80C60 70 70 90 80 80" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
      <path d="M15 75C25 65 35 85 45 75C55 65 65 85 75 75" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-secondary/20" />
      <motion.path 
        d="M45 15L48.5 22.5L56 26L48.5 29.5L45 37L41.5 29.5L34 26L41.5 22.5L45 15Z" 
        fill="#58027dff"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  </div>
);

const ReviewCard = ({ review, isMain, y, onMeasure }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        onMeasure(review.id, entry.contentRect.height);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [review.id, onMeasure]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: y + 50, scale: 0.95 }}
      animate={{ 
        opacity: isMain ? 1 : 0.3, 
        y: y, 
        scale: isMain ? 1 : 0.95,
        zIndex: isMain ? 10 : 1
      }}
      exit={{ opacity: 0, y: y - 50, scale: 0.9 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 1.2 } 
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      className={`
        flex gap-5 w-full md:w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl
        ${isMain ? 'border-l-4 border-l-primary md:-ml-12 shadow-[0_20px_50px_rgba(139,92,246,0.15)] bg-white/10' : 'md:ml-4'}
        hover:bg-white/15 cursor-default group
      `}
    >
      <div ref={cardRef} className="flex gap-5 w-full">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
          {review.avatar_url ? (
            <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20"><UserIcon size={20} className="text-primary" /></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h4 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors leading-tight">{review.name}</h4>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    size={12} 
                    className={i < review.rating ? 'text-secondary/80 fill-secondary/80' : 'text-white/10'} 
                  />
                ))}
              </div>
            </div>
            <div className="text-white/10 group-hover:text-primary/40 transition-colors">
              <QuoteUpIcon size={24} />
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mt-2 font-medium">
            {review.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Reviews = () => {
  const { reviews } = useSupabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [cardHeights, setCardHeights] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5,
    avatar_url: ''
  });

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Could be better',
      2: 'Satisfactory',
      3: 'Good experience',
      4: 'Great work!',
      5: 'Exceptional service!'
    };
    return labels[rating] || '';
  };

  const handleMeasure = (id, height) => {
    setCardHeights(prev => {
      // Add padding/gap to the measured height (p-5 for top/bottom add roughly 40px)
      const totalHeight = height + 40; 
      if (prev[id] === totalHeight) return prev;
      return { ...prev, [id]: totalHeight };
    });
  };

  // Rolling Reveal Logic
  useEffect(() => {
    if (reviews.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); 
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  const getVisibleReviewsWithY = () => {
    if (reviews.length === 0) return { visible: [], totalHeight: 0 };
    
    const visible = [];
    const GAP = 20;
    let currentY = 0;

    for (let i = 0; i < 3; i++) {
        const item = reviews[(currentIndex + i) % reviews.length];
        if (item) {
            const h = cardHeights[item.id] || 160; // Fallback height
            visible.push({ ...item, y: currentY, isMain: i === 1 });
            currentY += h + GAP;
        }
    }
    return { visible, totalHeight: currentY };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadMedia(file);
      setFormData(prev => ({ ...prev, avatar_url: url }));
      toast.success('Profile image uploaded!');
    } catch (err) {
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReview(formData);
      toast.success('Review submitted for approval!');
      setIsModalOpen(false);
      setFormData({ name: '', company: '', content: '', rating: 5, avatar_url: '' });
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { visible, totalHeight } = getVisibleReviewsWithY();

  return (
    <section id="reviews" className="py-32 bg-[#080110] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 relative space-y-8 text-center lg:text-left">
            <WavyStar />
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-logo text-white leading-tight">
                Words from<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">My Clients and Partners</span>
              </h2>
              <p className="text-white/60 text-lg max-w-lg mx-auto lg:mx-0">
               Here's what they have to say about my work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                Write a Review
              </button>
              <button
                className="px-8 py-4 bg-white/5 border border-white/10 text-white/80 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
              >
                View All
              </button>
            </div>
          </div>

          {/* Right Side: Measured Virtual Roller */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <motion.div 
              animate={{ height: totalHeight }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-[420px] relative flex flex-col items-center"
              style={{ minHeight: '500px' }}
            >
                <AnimatePresence initial={false}>
                    {visible.map((review) => (
                        <ReviewCard 
                            key={review.id} 
                            review={review} 
                            isMain={review.isMain} 
                            y={review.y}
                            onMeasure={handleMeasure}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
            
            {!reviews.length && (
                <div className="text-white/10 font-logo text-4xl italic tracking-tighter opacity-20">
                    Awaiting Voices...
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-lg relative shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white"
              >
                <Cancel01Icon size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-6">Submit Your Review</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none" 
                    placeholder="Full Name"
                    autoComplete="name"
                  />
                  <input 
                    value={formData.company}
                    onChange={(e) => setFormData(p => ({...p, company: e.target.value}))}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none" 
                    placeholder="Company (Optional)"
                    autoComplete="organization"
                  />
                </div>
                
                <div className="flex gap-4 items-center bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center">
                        {formData.avatar_url ? <img src={formData.avatar_url} className="w-full h-full object-cover" /> : <Image01Icon size={20} className="text-primary" />}
                    </div>
                    <label className="flex-1 cursor-pointer">
                        <span className="text-xs text-primary font-bold uppercase tracking-wider">Upload Profile Picture</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                </div>

                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({...p, content: e.target.value}))}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none min-h-[120px]" 
                  placeholder="Tell us what you think..."
                />

                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="font-bold uppercase tracking-widest text-primary/60">Rating</label>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={hoverRating || formData.rating}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`font-bold uppercase tracking-widest ${
                          (hoverRating || formData.rating) >= 4 ? 'text-green-400/80' : 'text-yellow-500/80'
                        }`}
                      >
                        {getRatingLabel(hoverRating || formData.rating)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    {[1,2,3,4,5].map(num => (
                      <motion.button 
                        type="button"
                        key={num} 
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setFormData(p => ({...p, rating: num}))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-0.5 transition-all duration-300 ${
                          (hoverRating || formData.rating) >= num 
                          ? 'text-primary drop-shadow-[0_0_5px_rgba(139,92,246,0.3)]' 
                          : 'text-white/5'
                        }`}
                      >
                        <StarIcon 
                          size={24} 
                          className={(hoverRating || formData.rating) >= num ? 'fill-primary' : ''} 
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                   <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-12 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
                   >
                     {isSubmitting ? 'Sending Testimony...' : 'Submit Review'}
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reviews;
