
import React from 'react';
import { PRODUCTS } from '../constants';
import { AppConfig, ProductStyle } from '../types';

interface ProductListProps {
  config: AppConfig;
  onBuy: (productName: string) => void;
  isAdmin: boolean;
  onEditStyle: (productName: string) => void;
}

const DEFAULT_COLORS: Record<string, string> = {
  "Melonity": "from-emerald-900/70",
  "Umbrella Dota 2": "from-rose-900/70",
  "Divine": "from-amber-900/70",
  "Hake": "from-sky-900/70",
  "Umbrella Deadlock": "from-fuchsia-900/70",
  "DotaAccount": "from-brand-dota/60"
};

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
    "Melonity": "The best solution on the dota 2 DLC market",
    "Umbrella Dota 2": "The next-level assistance in games",
    "Divine": "Elegant solution for tactical advantage",
    "Hake": "Comes with a full user scripts using Lua.",
    "Umbrella Deadlock": "Third-person shooter and multiplayer online battle arena",
    "DotaAccount": "The best solution for Dota Account Rank"
};

export const ProductList: React.FC<ProductListProps> = ({ config, onBuy, isAdmin, onEditStyle }) => {
  return (
    <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <h2 className="text-3xl font-extrabold text-center mb-12">Choose Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {PRODUCTS.map(product => {
           const style: ProductStyle | undefined = config.productStyles[product];
           const hasCustomBg = !!style?.bgUrl;
           
           // Card Background Style
           const cardContainerStyle: React.CSSProperties = hasCustomBg ? { 
               backgroundImage: `url('${style.bgUrl}')`,
               backgroundSize: style.bgSize || 'cover',
               backgroundPosition: style.bgPosition || 'top',
               backgroundRepeat: 'no-repeat'
           } : {};

           // Default gradient if no image
           const bgClass = !hasCustomBg 
              ? (style?.gradient || `bg-gradient-to-br ${DEFAULT_COLORS[product] || 'from-gray-900/70'} to-black/30`)
              : '';

           return (
            <section 
                key={product} 
                className={`rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-brand-accent transition-all duration-500 group relative flex flex-col h-full ${bgClass}`}
                style={cardContainerStyle}
            >
                {/* 
                  REMOVED BLUR AND TRANSPARENT OVERLAY 
                  to make the image background clear as requested.
                */}
                
                {/* Vignette/Gradient purely for text readability at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none"></div>

                {isAdmin && (
                    <button 
                        onClick={() => onEditStyle(product)} 
                        className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white border border-white/10 transition transform hover:rotate-45"
                    >
                        <i className="fa-solid fa-paint-brush"></i>
                    </button>
                )}
                
                <div className="relative z-10 flex flex-col h-full">
                    {/* Top spacing to show the art clearly */}
                    <div className="h-44 flex-shrink-0"></div>

                    {/* Content Section with a more focused background for readability */}
                    <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/80">
                        <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            {product === 'DotaAccount' ? 'Dota 2 Accounts' : product}
                        </h3>
                        <p className="text-gray-100 mb-8 text-sm flex-grow leading-relaxed drop-shadow-[0_2px_3px_rgba(0,0,0,1)] font-medium">
                            {PRODUCT_DESCRIPTIONS[product] || "Premium digital product."}
                        </p>
                        
                        <button 
                            onClick={() => onBuy(product)}
                            className="w-full bg-white/10 hover:bg-white hover:text-black text-white font-bold py-4 rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 border border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm"
                        >
                            <i className="fa-solid fa-cart-shopping"></i> <span>Purchase</span>
                        </button>
                    </div>
                </div>
            </section>
           );
        })}
      </div>
    </main>
  );
};
