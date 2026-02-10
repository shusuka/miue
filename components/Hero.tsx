
import React from 'react';
import { AppConfig } from '../types';

interface HeroProps {
  config: AppConfig;
  onOpenPaymentMethods: () => void;
  onOpenRequestConfig: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenPaymentMethods, onOpenRequestConfig }) => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="relative pt-24 pb-12 sm:pt-40 sm:pb-16 lg:pb-24 overflow-hidden">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-dota/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 text-xs text-gray-200 mb-6">
          <i className="fa-solid fa-shield-halved text-brand-success"></i>
          <span>Fast delivery • Cheapest • Trusted seller</span>
        </div>

        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
          <span className="block">Level Up Your</span>
          <span className="block text-brand-accent">Gaming Performance</span>
        </h1>

        <p className="mt-3 max-w-md mx-auto text-base text-gray-300/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-10 leading-relaxed">
          Official reseller of premium digital tools for Dota 2 & Deadlock.
          Experience the most stable solutions in the market.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button onClick={scrollToProducts}
            className="px-6 py-3 border border-transparent text-sm sm:text-base font-bold rounded-full text-white bg-brand-accent hover:bg-brand-accentHover transition transform hover:scale-[1.05] shadow-lg shadow-brand-accent/25"
          >
            View Catalog
          </button>

          <a 
            href={config.discordLink} 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-3 border border-white/10 text-sm sm:text-base font-bold rounded-full text-gray-200 bg-white/5 hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white transition transform hover:scale-[1.05] flex items-center gap-2"
          >
            <i className="fa-brands fa-discord"></i> Contact Support
          </a>

          <button onClick={onOpenPaymentMethods}
            className="px-6 py-3 border border-white/10 text-sm sm:text-base font-bold rounded-full text-gray-200 hover:bg-white/10 transition">
            <i className="fa-regular fa-credit-card mr-2"></i> Payment Systems
          </button>

          <button onClick={onOpenRequestConfig}
            className="px-6 py-3 border border-white/10 text-sm sm:text-base font-bold rounded-full text-gray-200 hover:bg-white/10 transition">
            <i className="fa-solid fa-file-signature mr-2"></i> Request Config
          </button>
        </div>
      </div>
    </header>
  );
};
