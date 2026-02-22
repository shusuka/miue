
import React, { useState } from 'react';
import { PRICING_DATA } from '../../constants';

interface PriceListModalProps {
  onClose: () => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  "fa-droplet": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "fa-fire": "text-red-400 border-red-400/30 bg-red-400/10",
  "fa-wind": "text-cyan-200 border-cyan-200/30 bg-cyan-200/10",
  "fa-mountain": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  "fa-bolt": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "fa-gem": "text-purple-400 border-purple-400/30 bg-purple-400/10"
};

export const PriceListModal: React.FC<PriceListModalProps> = ({ onClose }) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  const toggleProduct = (name: string) => {
    if (expandedProduct === name) {
      setExpandedProduct(null);
      setExpandedSubCategory(null);
    } else {
      setExpandedProduct(name);
      setExpandedSubCategory(null);
    }
  };

  const toggleSubCategory = (name: string) => {
    setExpandedSubCategory(expandedSubCategory === name ? null : name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/90" onClick={onClose}></div>
      <div className="relative bg-brand-card rounded-2xl w-full max-w-2xl p-6 border border-white/10 max-h-[85vh] flex flex-col shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-tags text-brand-accent"></i> Product Pricing
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {PRICING_DATA.map((product) => {
            const isExpanded = expandedProduct === product.name;
            const elementStyle = ELEMENT_COLORS[product.icon] || "text-brand-accent border-brand-accent/30 bg-brand-accent/10";
            
            return (
              <div 
                key={product.name} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-brand-accent/50 bg-white/5' : 'border-white/10 bg-black/20'
                }`}
              >
                <button 
                  onClick={() => toggleProduct(product.name)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isExpanded ? elementStyle : 'bg-black/40 text-gray-400 border-white/10 group-hover:text-white'
                    }`}>
                      <i className={`fa-solid ${product.icon} text-lg`}></i>
                    </div>
                    <span className={`font-bold text-sm sm:text-base transition-colors ${
                      isExpanded ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {product.name}
                    </span>
                  </div>
                  <i className={`fa-solid fa-chevron-down text-gray-500 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-brand-accent' : ''
                  }`}></i>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-4 pt-0 space-y-3">
                    {product.subCategories ? (
                      <div className="space-y-2">
                        {product.subCategories.map((sub) => {
                          const isSubExpanded = expandedSubCategory === sub.name;
                          return (
                            <div key={sub.name} className="border border-white/5 rounded-lg overflow-hidden bg-black/20">
                              <button 
                                onClick={() => toggleSubCategory(sub.name)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                              >
                                <span className={`text-sm font-bold ${isSubExpanded ? 'text-brand-accent' : 'text-gray-300'}`}>{sub.name}</span>
                                <i className={`fa-solid fa-chevron-right text-xs transition-transform ${isSubExpanded ? 'rotate-90 text-brand-accent' : 'text-gray-500'}`}></i>
                              </button>
                              <div className={`overflow-hidden transition-all duration-300 ${isSubExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-3 pt-0 space-y-2">
                                  {sub.prices.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center px-4 py-2 bg-black/40 rounded border border-white/5">
                                      <span className="text-gray-400 text-xs">{item.duration}</span>
                                      <span className="text-white font-mono font-bold text-xs bg-brand-accent/10 px-2 py-1 rounded border border-brand-accent/20">
                                        {item.price}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {product.prices?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-lg border border-white/5 hover:border-brand-accent/30 transition-colors group">
                            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{item.duration}</span>
                            <span className="text-white font-mono font-bold bg-brand-accent/10 px-3 py-1 rounded-md text-sm border border-brand-accent/20">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500">
            Prices are subject to change. Contact us on Discord for custom bulk orders.
          </p>
        </div>
      </div>
    </div>
  );
};
