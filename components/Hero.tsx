import React from 'react';

interface HeroProps {
  onOpenPaymentMethods: () => void;
  onOpenRequestConfig: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPaymentMethods, onOpenRequestConfig }) => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="relative pt-24 pb-12 sm:pt-40 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 text-xs text-gray-200 mb-6">
          <i className="fa-solid fa-shield-halved text-brand-success"></i>
          <span>Fast delivery • Cheapest • Trusted seller</span>
        </div>

        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
          <span className="block">Level Up Your</span>
          <span className="block text-brand-accent">Gaming Performance</span>
        </h1>

        <p className="mt-3 max-w-md mx-auto text-base text-gray-300/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-10">
          Official reseller digital product for Dota 2 & More.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button onClick={scrollToProducts}
            className="px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-full text-white bg-brand-accent hover:bg-brand-accentHover transition transform hover:scale-[1.02] shadow-lg shadow-brand-accent/25"
          >
            View Catalog
          </button>

          <a href="https://shorturl.at/7F7O4" target="_blank" rel="noreferrer"
            className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white/10 text-sm sm:text-base font-medium rounded-full text-gray-200 hover:bg-white/5 transition"
          >
            How to Buy
          </a>

          <button onClick={onOpenPaymentMethods}
            className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white/10 text-sm sm:text-base font-medium rounded-full text-gray-200 hover:bg-white/5 transition">
            <i className="fa-regular fa-credit-card mr-2"></i> Payment Methods
          </button>

          <button onClick={onOpenRequestConfig}
            className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white/10 text-sm sm:text-base font-medium rounded-full text-gray-200 hover:bg-white/5 transition">
            <i className="fa-solid fa-file-signature mr-2"></i> Request Config
          </button>
        </div>
      </div>
    </header>
  );
};