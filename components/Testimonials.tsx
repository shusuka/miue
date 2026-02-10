import React from 'react';
import { Review } from '../types';

interface TestimonialsProps {
  reviews: Review[];
  onWriteReview: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews, onWriteReview }) => {
  // Safe navigation: ensure reviews is an array before spreading
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayReviews = [...safeReviews].reverse().slice(0, 6);

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl font-extrabold text-center">Trusted by Gamers</h2>
        <p className="text-gray-300/70 text-sm mt-2">Real reviews from our community.</p>

        <button 
          onClick={onWriteReview}
          className="mt-4 px-6 py-2 border border-brand-accent text-brand-accent rounded-full hover:bg-brand-accent hover:text-white transition"
        >
          <i className="fa-regular fa-pen-to-square mr-2"></i> Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displayReviews.length === 0 ? (
          <p className="col-span-3 text-center text-gray-400 italic py-10">No reviews yet. Be the first!</p>
        ) : (
          displayReviews.map((r) => (
            <div key={r.id} className="bg-black/20 p-6 rounded-2xl border border-white/10 animate-fadeIn">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i 
                      key={i} 
                      className={`${i < r.rating ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-600'} fa-star text-xs`}
                    ></i>
                  ))}
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-gray-200 border border-white/10">
                  {r.product}
                </span>
              </div>
              <p className="text-gray-200/90 text-sm italic mb-4">"{r.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-accent/15 text-brand-accent rounded-full flex items-center justify-center text-sm font-bold uppercase border border-brand-accent/20">
                  {(r.name && r.name.charAt(0)) || '?'}
                </div>
                <div className="text-sm font-bold text-white">{r.name || 'Anonymous'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};