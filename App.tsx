
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
  const [livePulse, setLivePulse] = useState("Store is active and secure.");
  
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

  const syncData = useCallback(async () => {
    const loaded = await loadConfig();
    setConfig(loaded);
  }, []);

  useEffect(() => {
    syncData();
    generateLivePulse();

    // Auto-sync polling every 30 seconds
    const interval = setInterval(syncData, 30000);
    return () => clearInterval(interval);
  }, [syncData]);

  const generateLivePulse = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Create a very short (max 10 words) encouraging dota-themed status message for a digital reseller store. Be creative!',
      });
      if (response.text) setLivePulse(response.text.trim());
    } catch (e) {
      console.error("Gemini context error", e);
    }
  };

  const handleUpdateConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    await saveConfig(newConfig);
  };

  const handleSubmitRequest = async () => {
    if (!requestForm.discord || !requestForm.order) {
      addToast("Please fill in all fields", "error");
      return;
    }
    const newReq: RequestConfig = {
      id: Date.now(),
      product: requestForm.product,
      discord: requestForm.discord,
      orderId: requestForm.order,
      status: 'pending'
    };
    await handleUpdateConfig({ ...config, requests: [...(config.requests || []), newReq] });
    setShowRequestConfig(false);
    addToast("Request sent! Synchronized with Admin panel.", "success");
    setRequestForm({ product: PRODUCTS[0], discord: '', order: '' });
  };

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0 || !reviewForm.name || !reviewForm.comment) {
      addToast("Please complete the review form.", "error");
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
    await handleUpdateConfig({ ...config, reviews: [...(config.reviews || []), newReview] });
    setShowReviewModal(false);
    addToast("Your review is now live for all users!", "success");
  };

  const handleLogin = () => {
    const inputHash = simpleHash(loginForm.pass);
    if (loginForm.user === config.adminAuth.username && inputHash === config.adminAuth.password) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      addToast("Admin Access Synchronized", "success");
    } else {
      addToast("Access Denied", "error");
    }
  };

  const handleSaveStyle = async () => {
    if(!showStyleEditor) return;
    const newStyles = { ...config.productStyles };
    newStyles[showStyleEditor] = styleForm;
    await handleUpdateConfig({ ...config, productStyles: newStyles });
    setShowStyleEditor(null);
    addToast(`Global theme updated`, "success");
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
      <div className="bg-brand-accent/15 border-b border-brand-accent/20 py-1.5 text-center backdrop-blur-sm sticky top-16 z-30">
        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          LIVE PULSE: <span className="text-white italic tracking-normal">"{livePulse}"</span>
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

      {/* PURCHASE MODAL - FIXED BUTTON SIZING FOR DOTA ACCOUNT */}
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

      {/* Other Modals (Payment, Review, Login, etc.) follow similar pattern as provided previously */}
      {showPaymentMethods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowPaymentMethods(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-3xl p-6 border border-white/10 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2"><i className="fa-regular fa-credit-card text-brand-accent"></i> Payment Methods</h3>
              <button onClick={() => setShowPaymentMethods(false)}><i className="fa-solid fa-xmark text-xl text-gray-400"></i></button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-2">
              {Object.entries(PAYMENT_METHODS_LIST).map(([cat, methods]) => (
                <div key={cat} className="border border-white/10 rounded-xl p-4 bg-black/20">
                  <p className="text-brand-accent font-bold text-sm mb-3 uppercase tracking-wider">{cat}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {methods.map(m => <div key={m} className="bg-white/5 p-2 rounded text-[10px] text-center border border-white/5 text-gray-300">{m}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90 animate-fadeIn" onClick={() => setShowReviewModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white text-center">Share Your Feedback</h3>
            <div className="space-y-4">
              <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-accent" placeholder="Display Name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})}/>
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
              <textarea className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white min-h-[100px]" placeholder="How was your experience?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
              <button onClick={handleSubmitReview} className="w-full bg-brand-accent hover:bg-brand-accentHover text-white font-bold py-4 rounded-xl transition shadow-lg">POST REVIEW LIVE</button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-8 border border-white/10 shadow-2xl text-center">
             <i className="fa-solid fa-lock text-4xl text-brand-accent mb-4"></i>
             <h3 className="text-2xl font-bold mb-6 text-white">Admin Synchronizer</h3>
             <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-3 text-white" placeholder="ID" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
             <input type="password" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mb-6 text-white" placeholder="Passkey" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
             <button onClick={handleLogin} className="w-full bg-brand-accent py-4 rounded-xl text-white font-bold shadow-lg">AUTHENTICATE</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
