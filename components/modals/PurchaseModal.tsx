import React, { useState, useEffect } from 'react';
import { PRODUCT_DURATIONS, DEFAULT_LINKS, DEFAULT_CONFIG } from '../../constants';
import { AppConfig } from '../../types';

interface PurchaseModalProps {
  product: string | null;
  onClose: () => void;
  config: AppConfig;
  onOpenPrivacy: () => void;
  onOpenRefund: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ 
  product, 
  onClose, 
  config,
  onOpenPrivacy,
  onOpenRefund
}) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [selectedDuration, setSelectedDuration] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    if (!product) return;
    setTimeLeft(900);
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [product]);

  if (!product) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

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
    if (!url) url = DEFAULT_LINKS[key] || "";
    if (!url || url === "https://") {
        if (confirm("Link not configured. Contact support?")) {
            window.open(config.discordLink || DEFAULT_CONFIG.discordLink, "_blank");
        }
        return;
    }
    window.open(url, "_blank");
  };

  const isMelonity = product === "Melonity";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/80 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-brand-card rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-white/10 animate-fadeIn">
          <div className="bg-black/25 px-4 py-4 sm:px-6 flex justify-between items-center border-b border-white/10 text-white">
            <h3 className="text-lg leading-6 font-bold flex items-center gap-2">
              <i className="fa-solid fa-cart-shopping text-brand-accent"></i>
              <span>Purchase <span className="text-brand-accent">{product}</span></span>
            </h3>
            <button onClick={onClose}><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-5 bg-gradient-to-r from-red-900/90 to-brand-dota/90 border border-red-500/50 rounded-xl p-3 flex justify-between items-center shadow-lg shadow-red-900/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
              <div className="flex items-center gap-3 relative z-10 text-white">
                <div className="bg-yellow-500/20 p-2 rounded-full border border-yellow-500/50"><i className="fa-solid fa-fire text-yellow-400 text-lg animate-bounce"></i></div>
                <div><p className="text-[10px] text-red-200 font-bold uppercase mb-1">Flash Sale Offer</p><p className="text-sm font-extrabold">Limited Stock!</p></div>
              </div>
              <div className="text-right relative z-10 text-white">
                <p className="text-[10px] text-red-200 font-medium mb-0.5">Ends in</p>
                <p className="text-xl font-mono font-bold">{minutes}:{seconds}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-200 mb-3">1. Select Duration</label>
              <div className="flex flex-col gap-2">
                {durations.map(d => {
                  const isFullWidth = d.includes("Lifetime") || product === 'DotaAccount' || product === 'Dota Account Rank';
                  return (
                    <button
                      key={d}
                      onClick={() => { setSelectedDuration(d); setShowPaymentOptions(false); }}
                      className={`
                        border rounded-lg py-3 text-sm font-bold transition w-full
                        ${selectedDuration === d 
                          ? 'bg-brand-accent border-brand-accent text-white shadow-lg' 
                          : 'border-white/10 text-gray-200 hover:border-brand-accent hover:text-white'}
                        ${isFullWidth ? 'bg-brand-accent/5 border-brand-accent/20' : ''}
                      `}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 flex items-start gap-2">
              <input type="checkbox" id="policy-chk" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-brand-accent"/>
              <label htmlFor="policy-chk" className="text-xs text-gray-300">
                I agree to the <button onClick={onOpenRefund} className="text-brand-accent underline">Refund Policy</button> and <button onClick={onOpenPrivacy} className="text-brand-accent underline">Privacy Policy</button>.
              </label>
            </div>

            {!showPaymentOptions ? (
               <button disabled={!selectedDuration || !agreed} onClick={() => setShowPaymentOptions(true)} className={`w-full py-3 rounded-xl font-bold text-white ${(!selectedDuration || !agreed) ? 'bg-gray-700 opacity-50' : 'btn-rgb'}`}>
                 CONFIRM & SHOW LINKS
               </button>
            ) : (
                <div className="animate-fadeIn space-y-3">
                    <label className="block text-sm font-bold text-gray-200 mb-1 text-left">2. Select Payment Method</label>
                    <button onClick={() => handleProcessPayment('crypto')} className="w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent text-white">
                        <div className="flex items-center"><i className="fa-brands fa-bitcoin text-xl text-blue-300 mr-3"></i><span className="font-bold">Crypto / PayPal</span></div>
                        <i className="fa-solid fa-chevron-right text-gray-500"></i>
                    </button>
                    {!isMelonity && (
                         <button onClick={() => handleProcessPayment('fiat')} className="w-full flex justify-between items-center px-4 py-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-brand-accent text-white">
                            <div className="flex items-center"><i className="fa-solid fa-credit-card text-xl text-emerald-300 mr-3"></i><span className="font-bold">Cards & Wallets</span></div>
                            <i className="fa-solid fa-chevron-right text-gray-500"></i>
                        </button>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};