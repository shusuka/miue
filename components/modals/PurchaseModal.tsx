
import React, { useState, useEffect } from 'react';
import { PRODUCT_DURATIONS, PRODUCT_PRICES, DEFAULT_LINKS, DEFAULT_CONFIG } from '../../constants';
import { AppConfig } from '../../types';

interface PurchaseModalProps {
  product: string | null;
  onClose: () => void;
  config: AppConfig;
  onOpenPrivacy: () => void;
  onOpenRefund: () => void;
  flashSaleTime: number;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ 
  product, 
  onClose, 
  config,
  onOpenPrivacy,
  onOpenRefund,
  flashSaleTime
}) => {
  const [selectedDuration, setSelectedDuration] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  if (!product) return null;

  const minutes = Math.floor(flashSaleTime / 60).toString().padStart(2, '0');
  const seconds = (flashSaleTime % 60).toString().padStart(2, '0');

  const durations = PRODUCT_DURATIONS[product] || PRODUCT_DURATIONS["default"];

  const handleProcessPayment = (type: 'crypto' | 'fiat' | 'fiat-world' | 'fiat-region') => {
    const key = `${product}_${selectedDuration}`;
    const override = config.overrides[key];
    
    let url = "";
    
    if (override) {
        if (type === 'crypto') url = override.crypto || "";
        else if (type === 'fiat') url = override.fiat || "";
        else if (type === 'fiat-world') url = override.fiatWorld || "";
        else if (type === 'fiat-region') url = override.fiatRegion || "";
    }

    if (!url) {
        url = DEFAULT_LINKS[key] || "";
    }
    
    if (!url || url === "https://") {
        if (confirm("Link not configured for this specific option. Contact support on Discord?")) {
            window.open(config.discordLink || DEFAULT_CONFIG.discordLink, "_blank");
        }
        return;
    }
    
    window.open(url, "_blank");
  };

  const isMelonity = product === "Melonity";
  const isDotaAccount = product === "DotaAccount" || product.includes("Account");

  // RGB Text Style helper
  const rgbTextStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
    backgroundSize: '400%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'rgbFlow 5s linear infinite'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/80 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-brand-card rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-white/10 animate-fadeIn">
          {/* Header */}
          <div className="bg-black/25 px-4 py-4 sm:px-6 flex justify-between items-center border-b border-white/10">
            <h3 className="text-lg leading-6 font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-cart-shopping text-brand-accent"></i>
              <span>Purchase <span className="text-brand-accent">{product === 'DotaAccount' ? 'Dota 2 Account' : product}</span></span>
            </h3>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Flash Sale Banner */}
            <div className="mb-5 bg-gradient-to-r from-red-900/90 to-brand-dota/90 border border-red-500/50 rounded-xl p-3 flex justify-between items-center shadow-lg shadow-red-900/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-yellow-500/20 p-2 rounded-full border border-yellow-500/50">
                  <i className="fa-solid fa-fire text-yellow-400 text-lg animate-bounce"></i>
                </div>
                <div>
                  <p className="text-[10px] text-red-200 font-bold uppercase tracking-wider leading-none mb-1">Flash Sale Offer</p>
                  <p className="text-sm font-extrabold text-white leading-none">Limited Stock Available!</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-[10px] text-red-200 font-medium mb-0.5">Ends in</p>
                <p className="text-xl font-mono font-bold text-white tabular-nums tracking-tight">{minutes}:{seconds}</p>
              </div>
            </div>

            {/* Duration Select */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-200 mb-3">1. Select Option</label>
              <div className="grid grid-cols-3 gap-2">
                {durations.map(d => {
                  const isFullWidth = isDotaAccount || d.includes("Lifetime");
                  return (
                    <button
                      key={d}
                      onClick={() => { setSelectedDuration(d); setShowPaymentOptions(false); }}
                      className={`
                        border rounded-lg py-3 px-1 text-sm font-bold transition flex flex-col items-center justify-center leading-tight
                        ${selectedDuration === d 
                          ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]' 
                          : 'border-white/10 text-gray-200 hover:border-brand-accent hover:text-white'}
                        ${isFullWidth ? 'col-span-3 border-brand-accent/40 bg-brand-accent/10 text-brand-accent' : 'col-span-1'}
                      `}
                    >
                      <div className="flex flex-wrap items-center justify-center gap-x-1">
                        <span className="whitespace-nowrap">{d}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Policy Checkbox */}
            <div className="mb-6 flex items-start gap-2">
              <input 
                type="checkbox" 
                id="policy-chk" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-brand-accent bg-black/50 border-white/20 rounded cursor-pointer" 
              />
              <label htmlFor="policy-chk" className="text-xs text-gray-300 cursor-pointer select-none">
                I agree to the <button onClick={onOpenRefund} className="text-brand-accent underline">Refund Policy</button> and <button onClick={onOpenPrivacy} className="text-brand-accent underline">Privacy Policy</button>.
              </label>
            </div>

            {/* Actions */}
            {!showPaymentOptions ? (
               <button 
                disabled={!selectedDuration || !agreed}
                onClick={() => setShowPaymentOptions(true)}
                className={`w-full py-3 rounded-xl shadow-lg transform transition hover:scale-[1.02] font-bold text-white
                   ${(!selectedDuration || !agreed) ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'btn-rgb'}
                `}
               >
                 CONFIRM & SHOW LINKS
               </button>
            ) : (
                <div className="animate-fadeIn">
                    <label className="block text-sm font-bold text-gray-200 mb-3">2. Select Payment Method</label>
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => handleProcessPayment('crypto')} className="group w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent transition-all">
                            <div className="flex items-center">
                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-300 border border-blue-500/20"><i className="fa-brands fa-bitcoin text-xl w-6 text-center"></i></div>
                                <div className="ml-3 text-left"><p className="text-sm font-bold text-white">Crypto / PayPal</p></div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-white"></i>
                        </button>

                        {!isMelonity && (
                             <button onClick={() => handleProcessPayment('fiat')} className="group w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent transition-all">
                                <div className="flex items-center">
                                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-300 border border-emerald-500/20"><i className="fa-solid fa-credit-card text-xl w-6 text-center"></i></div>
                                    <div className="ml-3 text-left">
                                      <p className="text-sm font-bold text-white leading-tight">Credit Card & Others</p>
                                      <p className="text-[10px] font-extrabold tracking-tighter" style={rgbTextStyle}>(ignore country restriction)</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-white"></i>
                            </button>
                        )}

                        {isMelonity && (
                            <>
                                <button onClick={() => handleProcessPayment('fiat-world')} className="group w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent transition-all">
                                    <div className="flex items-center">
                                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-300 border border-emerald-500/20"><i className="fa-solid fa-globe text-xl w-6 text-center"></i></div>
                                        <div className="ml-3 text-left">
                                          <p className="text-sm font-bold text-white leading-tight">Credit Card (World)</p>
                                          <p className="text-[10px] font-extrabold tracking-tighter" style={rgbTextStyle}>(ignore country restriction)</p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-white"></i>
                                </button>
                                <button onClick={() => handleProcessPayment('fiat-region')} className="group w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent transition-all">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-300 border border-indigo-500/20"><i className="fa-solid fa-location-dot text-xl w-6 text-center"></i></div>
                                        <div className="ml-3 text-left">
                                            <p className="text-sm font-bold text-white leading-tight">Credit Card (Region)</p>
                                            <p className="text-[10px] font-extrabold tracking-tighter" style={rgbTextStyle}>(ignore country restriction)</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Indonesia, Malaysia, Peru, Brazil and Filipina</p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-white"></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
