
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
  const [timeLeft, setTimeLeft] = useState(900);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    if (!product) return;
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
        alert("Link not configured. Opening Support Discord.");
        window.open(config.discordLink || DEFAULT_CONFIG.discordLink, "_blank");
        return;
    }
    window.open(url, "_blank");
  };

  const isDotaAccount = product === 'DotaAccount';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-brand-card rounded-2xl w-full max-w-lg overflow-hidden border border-white/10 shadow-2xl animate-fadeIn">
          <div className="p-5 border-b border-white/10 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2"><i className="fa-solid fa-cart-shopping text-brand-accent"></i> Checkout {product}</h3>
            <button onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-red-600/20 border border-red-500/40 p-3 rounded-xl flex justify-between items-center">
              <div className="text-white text-xs font-bold uppercase"><i className="fa-solid fa-fire text-yellow-500 mr-2"></i> Limited Offer</div>
              <div className="text-white font-mono text-lg">{minutes}:{seconds}</div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-gray-400 mb-3 block">1. Select Duration</label>
              <div className={isDotaAccount ? "flex flex-col gap-3" : "grid grid-cols-3 gap-2"}>
                {durations.map(d => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDuration(d); setShowPaymentOptions(false); }}
                    className={`py-3 rounded-lg border font-bold transition-all text-sm
                      ${selectedDuration === d 
                        ? 'bg-brand-accent border-brand-accent text-white shadow-lg' 
                        : 'border-white/10 text-gray-300 hover:border-brand-accent/50'}
                      ${isDotaAccount ? 'w-full py-4 text-base' : ''}
                    `}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
              <input type="checkbox" id="policy" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-brand-accent"/>
              <label htmlFor="policy" className="text-[10px] text-gray-400 leading-tight">I agree to the Refund & Privacy policies. Digital product delivery is instant and final.</label>
            </div>

            {!showPaymentOptions ? (
              <button disabled={!selectedDuration || !agreed} onClick={() => setShowPaymentOptions(true)} className={`w-full py-4 rounded-xl font-bold text-white transition ${(!selectedDuration || !agreed) ? 'bg-gray-700 opacity-50' : 'btn-rgb shadow-lg hover:scale-[1.01]'}`}>
                CONFIRM & SHOW LINKS
              </button>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <button onClick={() => handleProcessPayment('crypto')} className="w-full flex justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-accent text-white">
                  <div className="flex items-center gap-3"><i className="fa-brands fa-bitcoin text-xl text-blue-400"></i> <span className="font-bold">Crypto / PayPal / Global</span></div>
                  <i className="fa-solid fa-chevron-right text-gray-500"></i>
                </button>
                {product !== 'Melonity' && (
                  <button onClick={() => handleProcessPayment('fiat')} className="w-full flex justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-accent text-white">
                    <div className="flex items-center gap-3"><i className="fa-solid fa-credit-card text-xl text-emerald-400"></i> <span className="font-bold">E-Wallets / Cards</span></div>
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
