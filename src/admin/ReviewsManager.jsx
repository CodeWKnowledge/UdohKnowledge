import React, { useEffect, useState } from 'react';
import { getAdminReviews, updateReviewApproval, deleteReview } from '../services/api';
import { toast } from 'react-hot-toast';
import { CheckmarkBadge01Icon, Cancel01Icon, Delete01Icon, StarIcon, UserIcon } from 'hugeicons-react';
import { useSupabase } from '../context/SupabaseContext';

const ReviewsManager = () => {
  const { refreshData } = useSupabase();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await getAdminReviews();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await updateReviewApproval(id, !currentStatus);
      toast.success(currentStatus ? 'Review unapproved' : 'Review approved!');
      await refreshData();
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review forever?")) {
      try {
        await deleteReview(id);
        toast.success('Review deleted');
        await refreshData();
        fetchReviews();
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="text-white/50">Loading reviews...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Reviews Moderation</h2>
        <p className="text-white/60">Approve or reject community reviews before they appear on the home page.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reviews.map(review => (
          <div key={review.id} className={`bg-[#111] p-6 rounded-xl border transition-colors ${review.approved ? 'border-primary/30 bg-primary/5' : 'border-white/10'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {review.avatar_url ? (
                    <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-white/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{review.name}</h3>
                  <p className="text-xs text-white/40">{review.company || 'Private Individual'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                <StarIcon size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{review.rating}</span>
              </div>
            </div>

            <blockquote className="text-sm text-white/80 italic mb-6 line-clamp-4 relative">
               "{review.content}"
            </blockquote>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${review.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {review.approved ? 'Live' : 'Pending Approval'}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleToggleApproval(review.id, review.approved)}
                  className={`p-2 rounded-lg transition-colors ${review.approved ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                  title={review.approved ? 'Unapprove' : 'Approve'}
                >
                  {review.approved ? <Cancel01Icon size={18} /> : <CheckmarkBadge01Icon size={18} />}
                </button>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Delete01Icon size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full p-12 text-center border border-white/10 border-dashed rounded-xl text-white/50">
            No reviews submitted yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;
