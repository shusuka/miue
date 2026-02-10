import React, { useState } from 'react';
import { Review } from '../types';

interface TestimonialsProps {
  reviews: Review[];
  onWriteReview: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews, onWriteReview }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 6;

  // Safe navigation: ensure reviews is an array before spreading
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  // Sort by newest first
  const sortedReviews = [...safeReviews].reverse();
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  // Get current page reviews
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const displayReviews = sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of testimonials section gently
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 animate-fadeIn">
            {/* Prev Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition
                    ${currentPage === 1 
                        ? 'border-white/5 text-gray-600 cursor-not-allowed' 
                        : 'border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
                <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                
                // Smart pagination: hide middle pages if there are too many (more than 7)
                // Always show first, last, current, and neighbors
                if (totalPages > 7) {
                    if (
                        pageNum !== 1 && 
                        pageNum !== totalPages && 
                        Math.abs(currentPage - pageNum) > 1
                    ) {
                         if (Math.abs(currentPage - pageNum) === 2) {
                             return <span key={pageNum} className="text-gray-600 text-xs px-1">...</span>;
                         }
                         return null;
                    }
                }

                return (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold border transition
                            ${currentPage === pageNum 
                                ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/20 scale-105' 
                                : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition
                    ${currentPage === totalPages 
                        ? 'border-white/5 text-gray-600 cursor-not-allowed' 
                        : 'border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
                <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
        </div>
      )}
    </section>
  );
};