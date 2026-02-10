
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { Testimonials } from './components/Testimonials';
import { PurchaseModal } from './components/modals/PurchaseModal';
import { AdminPanel } from './components/modals/AdminPanel';
import { AppConfig, RequestConfig, Review, ProductStyle } from './types';
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

  const [requestForm, setRequestForm] = useState({ product: PRODUCTS[0], discord: '', order: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', product: PRODUCTS[0], rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [styleForm, setStyleForm] = useState<ProductStyle>({ 
      bgUrl: '', iconUrl: '', gradient: '', bgSize: 'cover', bgPosition: 'center', iconScale: 1
  });

  const syncFromCloud = useCallback(async () => {
    const loaded = await loadConfig();
    setConfig(loaded);
  }, []);

  useEffect(() => {
    syncFromCloud();
    generatePulse();

    // Auto-sync every 30 seconds for live global data
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
      onOpenRequestConfig={() => setShowRequestConfig(true)}
      onOpenRefundPolicy={() => setShowRefundPolicy(true)}
      onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
    >
      <div className="bg-brand-accent/20 border-b border-brand-accent/30 py-2 text-center sticky top-16 z-30 backdrop-blur-md">
        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          LIVE PULSE: <span className="text-white italic">"{livePulse}"</span>
        </p>
      </div>

      <Hero onOpenPaymentMethods={() => setShowPaymentMethods(true)} onOpenRequestConfig={() => setShowRequestConfig(true)} />
      
      <ProductList 
        config={config} 
        onBuy={setPurchaseProduct} 
        isAdmin={isAdminLoggedIn} 
        onEditStyle={(p) => {
          setShowStyleEditor(p);
          setStyleForm(config.productStyles[p] || { bgSize: 'cover', bgPosition: 'center', iconScale: 1 });
        }} 
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
          <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-8 border border-white/10 shadow-2xl">
             <h3 className="text-xl font-bold mb-6 text-white text-center">Sync Admin Panel</h3>
             <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-3 text-white" placeholder="ID" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
             <input type="password" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-6 text-white" placeholder="Access Key" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
             <button onClick={handleLogin} className="w-full bg-brand-accent py-4 rounded-xl text-white font-bold">AUTHENTICATE</button>
          </div>
        </div>
      )}

      {showPaymentMethods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowPaymentMethods(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-3xl p-6 border border-white/10 max-h-[85vh] flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white"><i className="fa-solid fa-credit-card mr-2"></i> Payment Systems</h3>
            <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {Object.entries(PAYMENT_METHODS_LIST).map(([cat, methods]) => (
                <div key={cat} className="p-4 bg-black/20 border border-white/10 rounded-xl">
                  <p className="text-brand-accent font-bold text-xs uppercase mb-3">{cat}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {methods.map(m => <div key={m} className="bg-white/5 p-2 rounded text-[10px] text-center border border-white/5">{m}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
