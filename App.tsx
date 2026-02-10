
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { Testimonials } from './components/Testimonials';
import { PurchaseModal } from './components/modals/PurchaseModal';
import { AdminPanel } from './components/modals/AdminPanel';
import { AppConfig, Review, ProductStyle } from './types';
import { DEFAULT_CONFIG, PRODUCTS, CATEGORY_ICONS, PAYMENT_METHODS_LIST } from './constants';
import { loadConfig, saveConfig } from './services/storageService';
import { simpleHash } from './utils';
import { useToast } from './context/ToastContext';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const { addToast } = useToast();
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [livePulse, setLivePulse] = useState("Store synchronized.");
  
  const [purchaseProduct, setPurchaseProduct] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState<string | null>(null);
  const [showRequestConfig, setShowRequestConfig] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState({ name: '', product: PRODUCTS[0], rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });

  const syncFromCloud = useCallback(async () => {
    const loaded = await loadConfig();
    setConfig(loaded);
  }, []);

  useEffect(() => {
    syncFromCloud();
    generatePulse();

    const interval = setInterval(syncFromCloud, 30000);
    return () => clearInterval(interval);
  }, [syncFromCloud]);

  const generatePulse = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate a short (max 8 words) status update for a premium Dota 2 shop. Make it hype and themed. Example: Roshan has spawned with fresh discounts!',
      });
      if (response.text) setLivePulse(response.text.trim());
    } catch (e) {
      setLivePulse("Reseller hub is active.");
    }
  };

  const handleUpdateConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    await saveConfig(newConfig);
  };

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0 || !reviewForm.name || !reviewForm.comment) {
      addToast("Complete the form first", "error");
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      name: reviewForm.name,
      product: reviewForm.product,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [...(config.reviews || []), newReview];
    await handleUpdateConfig({ ...config, reviews: updatedReviews });
    setShowReviewModal(false);
    addToast("Review shared with the community!", "success");
  };

  const handleLogin = () => {
    const inputHash = simpleHash(loginForm.pass);
    if (loginForm.user === config.adminAuth.username && inputHash === config.adminAuth.password) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      addToast("Authenticated", "success");
    } else {
      addToast("Wrong password", "error");
    }
  };

  return (
    <Layout 
      config={config}
      onAdminTrigger={() => isAdminLoggedIn ? setShowAdminPanel(true) : setShowLoginModal(true)}
      onOpenPaymentMethods={() => setShowPaymentMethods(true)}
      onOpenRequestConfig={() => addToast("Request Config feature coming soon", "info")}
      onOpenRefundPolicy={() => setShowRefundPolicy(true)}
      onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
    >
      <div className="bg-brand-accent/20 border-b border-brand-accent/30 py-2 text-center sticky top-16 z-30 backdrop-blur-md">
        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          LIVE PULSE: <span className="text-white italic">"{livePulse}"</span>
        </p>
      </div>

      <Hero onOpenPaymentMethods={() => setShowPaymentMethods(true)} onOpenRequestConfig={() => addToast("Config available in Discord", "info")} />
      
      <ProductList 
        config={config} 
        onBuy={setPurchaseProduct} 
        isAdmin={isAdminLoggedIn} 
        onEditStyle={(p) => addToast("Style editor coming soon", "info")} 
      />
      
      <Testimonials reviews={config.reviews} onWriteReview={() => setShowReviewModal(true)} />

      {purchaseProduct && (
        <PurchaseModal 
          product={purchaseProduct} 
          onClose={() => setPurchaseProduct(null)} 
          config={config}
          onOpenPrivacy={() => setShowPrivacyPolicy(true)}
          onOpenRefund={() => setShowRefundPolicy(true)}
        />
      )}

      {showAdminPanel && (
        <AdminPanel 
          config={config} 
          onClose={() => setShowAdminPanel(false)}
          onLogout={() => { setIsAdminLoggedIn(false); setShowAdminPanel(false); }}
          onSaveConfig={handleUpdateConfig}
        />
      )}

      {/* --- MODALS --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowReviewModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">Write Live Review</h3>
            <div className="space-y-4">
              <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" placeholder="Username" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})}/>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" value={reviewForm.product} onChange={e => setReviewForm({...reviewForm, product: e.target.value})}>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex justify-center gap-2 text-2xl py-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReviewForm({...reviewForm, rating: s})} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
                    <i className={`fa-star ${(hoverRating || reviewForm.rating) >= s ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-600'}`}></i>
                  </button>
                ))}
              </div>
              <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white min-h-[100px]" placeholder="Experience..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
              <button onClick={handleSubmitReview} className="w-full bg-brand-accent py-4 rounded-xl text-white font-bold shadow-lg">SYNC TO CLOUD</button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-8 border border-white/10 shadow-2xl text-center">
             <i className="fa-solid fa-lock text-3xl text-brand-accent mb-4"></i>
             <h3 className="text-xl font-bold mb-6 text-white">Admin Authentication</h3>
             <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-3 text-white outline-none focus:border-brand-accent" placeholder="Username" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
             <input type="password" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-6 text-white outline-none focus:border-brand-accent" placeholder="Access Key" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
             <button onClick={handleLogin} className="w-full bg-brand-accent py-4 rounded-xl text-white font-bold hover:bg-brand-accentHover transition">ACCESS PANEL</button>
          </div>
        </div>
      )}

      {showPaymentMethods && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowPaymentMethods(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-lg p-6 border border-white/10 max-h-[85vh] flex flex-col shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white"><i className="fa-solid fa-credit-card mr-2 text-brand-accent"></i> Payment Systems</h3>
              <button onClick={() => setShowPaymentMethods(false)} className="text-gray-400 hover:text-white transition"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {Object.entries(PAYMENT_METHODS_LIST).map(([cat, methods]) => {
                const isExpanded = expandedPaymentCategory === cat;
                return (
                  <div key={cat} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                    <button 
                      onClick={() => setExpandedPaymentCategory(isExpanded ? null : cat)}
                      className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition text-left"
                    >
                      <span className="font-bold text-sm text-gray-200 flex items-center gap-3">
                        <i className={`fa-solid ${CATEGORY_ICONS[cat] || 'fa-wallet'} text-brand-accent`}></i>
                        {cat}
                      </span>
                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-500 text-xs`}></i>
                    </button>
                    {isExpanded && (
                      <div className="p-4 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-2 animate-fadeIn">
                        {methods.map(m => (
                          <div key={m} className="bg-white/5 p-2 rounded text-[10px] text-gray-400 border border-white/5 flex items-center gap-2">
                            <i className="fa-solid fa-circle-check text-brand-success text-[8px]"></i>
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] text-gray-500 text-center italic">Automated delivery after successful payment.</p>
          </div>
        </div>
      )}

      {/* --- REFUND POLICY MODAL --- */}
      {showRefundPolicy && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/95" onClick={() => setShowRefundPolicy(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-2xl p-8 border border-white/10 overflow-y-auto max-h-[80vh] shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-brand-accent">Refund Policy</h3>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p className="font-bold text-white">1. Digital Goods Policy</p>
              <p>Due to the nature of digital software and license keys, all sales are considered final once the product information has been delivered to the customer.</p>
              <p className="font-bold text-white">2. Eligibility for Refund</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Refunds are only issued if the key is proven to be non-functional (invalid) at the time of purchase.</li>
                <li>The customer must contact support within 24 hours of purchase with proof (screenshots/video).</li>
                <li>If the software is incompatible with the customer's hardware/OS but this was clearly stated in the requirements, no refund will be given.</li>
              </ul>
              <p className="font-bold text-white">3. Process</p>
              <p>Approved refunds will be processed back to the original payment method within 5-7 business days, depending on the payment provider.</p>
            </div>
            <button onClick={() => setShowRefundPolicy(false)} className="mt-8 w-full bg-brand-accent py-3 rounded-xl font-bold hover:bg-brand-accentHover transition">I Understand</button>
          </div>
        </div>
      )}

      {/* --- PRIVACY POLICY MODAL --- */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/95" onClick={() => setShowPrivacyPolicy(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-2xl p-8 border border-white/10 overflow-y-auto max-h-[80vh] shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-brand-accent">Privacy Policy & Terms</h3>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p className="font-bold text-white">1. Data Collection</p>
              <p>We only collect minimal information required to process your order, such as email or Discord ID. We do not store payment card information on our servers; all payments are handled by secure 3rd party providers.</p>
              <p className="font-bold text-white">2. Usage Rights</p>
              <p>By purchasing from Miuw Store, you agree that you are purchasing a license to use the software. You do not own the intellectual property. Any attempt to reverse engineer or redistribute the software will result in an immediate permanent ban.</p>
              <p className="font-bold text-white">3. Third-Party Links</p>
              <p>Our store contains links to external sites (Selly, G2G, etc.). We are not responsible for the privacy practices or content of those external websites.</p>
            </div>
            <button onClick={() => setShowPrivacyPolicy(false)} className="mt-8 w-full bg-brand-accent py-3 rounded-xl font-bold hover:bg-brand-accentHover transition">Accept Terms</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
