import React from 'react';
import { PRODUCTS } from '../constants';
import { AppConfig, ProductStyle } from '../types';

interface ProductListProps {
  config: AppConfig;
  onBuy: (productName: string) => void;
  isAdmin: boolean;
  onEditStyle: (productName: string) => void;
}

const DEFAULT_ICONS: Record<string, React.ReactElement> = {
  "Melonity": <i className="fa-solid fa-crosshairs text-7xl text-emerald-300 drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>,
  "Umbrella Dota 2": <i className="fa-solid fa-umbrella text-7xl text-rose-300 drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>,
  "Divine": <i className="fa-solid fa-crown text-7xl text-amber-200 drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>,
  "Hake": <i className="fa-solid fa-code text-7xl text-sky-200 drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>,
  "Umbrella Deadlock": <i className="fa-solid fa-lock text-7xl text-fuchsia-200 drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>,
  "DotaAccount": <i className="fa-brands fa-steam text-7xl text-white drop-shadow-lg transform group-hover:scale-110 transition duration-500"></i>
};

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
           const bgClass = style?.gradient 
              ? style.gradient 
              : `bg-gradient-to-br ${DEFAULT_COLORS[product] || 'from-gray-900/70'} to-black/30`;
           
           const hasCustomBg = !!style?.bgUrl;
           
           // Apply custom background styles
           const headerStyle: React.CSSProperties = hasCustomBg ? { 
               backgroundImage: `url('${style.bgUrl}')`,
               backgroundSize: style.bgSize || 'cover',
               backgroundPosition: style.bgPosition || 'center',
               backgroundRepeat: 'no-repeat'
           } : {};

           // Icon scaling
           const iconScale = style?.iconScale || 1;
           const iconStyle: React.CSSProperties = {
               transform: `scale(${iconScale})`
           };

           return (
            <section key={product} className="bg-brand-card rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-brand-accent/70 transition duration-300 group relative flex flex-col h-full">
                {isAdmin && (
                    <button onClick={() => onEditStyle(product)} className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white border border-white/10">
                        <i className="fa-solid fa-paint-brush"></i>
                    </button>
                )}
                
                <div 
                    className={`h-44 flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-cover bg-center ${!hasCustomBg ? bgClass : ''}`}
                    style={headerStyle}
                >
                    <div className="absolute inset-0 bg-black/25"></div>
                    <div className="relative z-10 transition duration-500 group-hover:scale-105">
                        {style?.iconUrl ? (
                            <img 
                                src={style.iconUrl} 
                                alt={product} 
                                className="w-24 h-24 object-contain drop-shadow-lg"
                                style={iconStyle}
                            />
                        ) : (
                            <div style={iconStyle}>
                                {DEFAULT_ICONS[product]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{product === 'DotaAccount' ? 'Dota 2 Accounts' : product}</h3>
                    <p className="text-gray-300/75 mb-6 text-sm flex-grow">
                        {PRODUCT_DESCRIPTIONS[product] || "Premium digital product."}
                    </p>
                    <button 
                        onClick={() => onBuy(product)}
                        className="w-full bg-white/5 hover:bg-white hover:text-black text-white font-bold py-3 rounded-xl transition duration-200 flex justify-center items-center gap-2 border border-white/10 mt-auto"
                    >
                        <i className="fa-solid fa-cart-shopping"></i> <span>Buy Now</span>
                    </button>
                </div>
            </section>
           );
        })}
      </div>
    </main>
  );
};