import React, { useState, useEffect } from 'react';
import { LayoutProps } from '../types';

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  config, 
  onAdminTrigger,
  onOpenPaymentMethods,
  onOpenRequestConfig,
  onOpenPriceMenu,
  onOpenGiveAway,
  onOpenRefundPolicy,
  onOpenPrivacyPolicy
}) => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => setClickCount(0), 1000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      onAdminTrigger();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed w-full z-40 glass-effect transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer select-none group focus:outline-none" 
              aria-label="Go to top"
            >
              <i className="fa-solid fa-cat text-brand-accent text-2xl group-hover:animate-bounce"></i>
              <span className="font-bold text-xl tracking-wide">MIUW <span className="text-brand-accent">STORE</span></span>
            </button>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-medium hover:text-brand-accent transition">Home</button>
                <button onClick={() => scrollToSection('products')} className="text-sm font-medium hover:text-brand-accent transition">Products</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium hover:text-brand-accent transition">Feedback</button>
                <button onClick={onOpenGiveAway} className="text-sm font-medium hover:text-brand-accent transition">Give Away</button>
                
                <a 
                  href={config.discordLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm font-medium hover:text-[#5865F2] transition flex items-center gap-1"
                >
                  <i className="fa-brands fa-discord"></i> <span>Contact Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Links (Quick Access) */}
      <div className="fixed bottom-6 right-6 z-30 animate-bounceSmall hidden sm:block">
        <div className="relative group cursor-pointer" onClick={() => scrollToSection('products')}>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulseFast"></div>
            <div className="relative px-4 py-3 bg-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center gap-3">
            <i className="fa-solid fa-bolt text-yellow-400 text-xl"></i>
            <div className="space-y-1">
                <p className="text-white font-bold text-sm">FLASH SALE LIVE</p>
                <p className="text-gray-300 text-xs">Discount up to 20% <span className="text-yellow-400">Buy Now!</span></p>
            </div>
            </div>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/5 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex gap-6">
              <a href={config.youtubeLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition"><i className="fa-brands fa-youtube text-2xl"></i></a>
              <a href={config.facebookLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition"><i className="fa-brands fa-facebook text-2xl"></i></a>
              <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition"><i className="fa-brands fa-whatsapp text-2xl"></i></a>
              <a href={config.discordLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-500 transition"><i className="fa-brands fa-discord text-2xl"></i></a>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <button onClick={onOpenRefundPolicy} className="hover:text-brand-accent transition">Refund Policy</button>
              <span>|</span>
              <button onClick={onOpenPrivacyPolicy} className="hover:text-brand-accent transition">Privacy Policy & Terms</button>
            </div>
          </div>
          <div className="text-center text-gray-300/60 text-sm">
            <p>&copy; {new Date().getFullYear()} Miuw Store. All rights reserved.</p>
            <p className="mt-2 text-[11px] text-gray-400/70">All trademarks and game titles belong to their respective owners.</p>
          </div>
        </div>
      </footer>
    </>
  );
};