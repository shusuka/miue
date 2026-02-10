import React, { useState, useEffect } from 'react';
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
  
  // Modal States
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

  // Form States
  const [requestForm, setRequestForm] = useState({ product: PRODUCTS[0], discord: '', order: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', product: PRODUCTS[0], rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [styleForm, setStyleForm] = useState<ProductStyle>({ 
      bgUrl: '', iconUrl: '', gradient: '', bgSize: 'cover', bgPosition: 'center', iconScale: 1
  });

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
        const loaded = await loadConfig();
        setConfig(loaded);
        generateLivePulse();
    };
    init();

    // Setup Polling (Check cloud every 30 seconds for live data sync)
    const pollInterval = setInterval(async () => {
        const remote = await loadConfig();
        setConfig(remote);
        console.log("Auto-synced with cloud...");
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  // Use Gemini to generate a live "Status" message for the store
  const generateLivePulse = async () => {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: 'Create a very short (max 10 words) encouraging dota-themed status message for a digital store. Example: Roshan is down, grab your aegis of savings! or Radiant victory is close with these scripts!',
          });
          if (response.text) setLivePulse(response.text.trim());
      } catch (e) {
          console.error("Gemini Pulse error", e);
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
    await handleUpdateConfig({ ...config, requests: [...config.requests, newReq] });
    setShowRequestConfig(false);
    addToast("Config Request Sent Live! Admin will be notified.", "success");
    setRequestForm({ product: PRODUCTS[0], discord: '', order: '' });
  };

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0) { addToast("Please click on the stars to rate.", "error"); return; }
    if (!reviewForm.name || !reviewForm.comment) { addToast("Please fill in all fields.", "error"); return; }

    const newReview: Review = {
      id: Date.now(),
      name: reviewForm.name,
      product: reviewForm.product,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString()
    };
    await handleUpdateConfig({ ...config, reviews: [...config.reviews, newReview] });
    setShowReviewModal(false);
    setReviewForm({ name: '', product: PRODUCTS[0], rating: 0, comment: '' });
    setHoverRating(0);
    addToast("Review shared live with the community!", "success");
  };

  const handleLogin = () => {
    const inputHash = simpleHash(loginForm.pass);
    if (loginForm.user === config.adminAuth.username && inputHash === config.adminAuth.password) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      setLoginForm({ user: '', pass: '' });
      addToast("Admin Synchronized", "success");
    } else {
      addToast("Invalid credentials", "error");
    }
  };

  const handleSaveStyle = async () => {
      if(!showStyleEditor) return;
      const newStyles = { ...config.productStyles };
      newStyles[showStyleEditor] = styleForm;
      await handleUpdateConfig({ ...config, productStyles: newStyles });
      setShowStyleEditor(null);
      addToast(`Theme updated globally`, "success");
  };

  const handleResetStyle = async () => {
      if(!showStyleEditor) return;
      const newStyles = { ...config.productStyles };
      delete newStyles[showStyleEditor];
      await handleUpdateConfig({ ...config, productStyles: newStyles });
      setShowStyleEditor(null);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bgUrl' | 'iconUrl') => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 800 * 1024) {
          addToast("Image too large! Max 800KB", "error");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          if (typeof reader.result === 'string') {
              setStyleForm(prev => ({ ...prev, [field]: reader.result as string }));
              addToast("Image prepared for upload", "success");
          }
      };
      reader.readAsDataURL(file);
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
      <div className="bg-brand-accent/10 border-b border-brand-accent/20 py-1 text-center">
          <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              LIVE COMMUNITY PULSE: <span className="text-white italic">"{livePulse}"</span>
          </p>
      </div>

      <Hero 
        onOpenPaymentMethods={() => setShowPaymentMethods(true)}
        onOpenRequestConfig={() => setShowRequestConfig(true)}
      />
      
      <ProductList 
        config={config}
        onBuy={setPurchaseProduct}
        isAdmin={isAdminLoggedIn}
        onEditStyle={(p) => {
            setShowStyleEditor(p);
            setStyleForm({
                bgUrl: config.productStyles[p]?.bgUrl || '', 
                iconUrl: config.productStyles[p]?.iconUrl || '', 
                gradient: config.productStyles[p]?.gradient || '',
                bgSize: config.productStyles[p]?.bgSize || 'cover',
                bgPosition: config.productStyles[p]?.bgPosition || 'center',
                iconScale: config.productStyles[p]?.iconScale || 1
            });
        }}
      />
      
      <Testimonials 
        reviews={config.reviews} 
        onWriteReview={() => {
            setReviewForm({ name: '', product: PRODUCTS[0], rating: 0, comment: '' });
            setHoverRating(0);
            setShowReviewModal(true);
        }}
      />

      {/* --- MODALS --- */}
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
          onLogout={() => { setIsAdminLoggedIn(false); setShowAdminPanel(false); addToast("Logged out", "info"); }}
          onSaveConfig={handleUpdateConfig}
        />
      )}

      {showPaymentMethods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowPaymentMethods(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-3xl p-6 border border-white/10 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-regular fa-credit-card text-brand-accent"></i> Payment Methods
              </h3>
              <button onClick={() => setShowPaymentMethods(false)} className="text-gray-300 hover:text-white transition">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {Object.entries(PAYMENT_METHODS_LIST).map(([cat, methods]) => {
                const isExpanded = expandedPaymentCategory === cat;
                return (
                    <div key={cat} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-brand-accent/50 bg-white/5' : 'border-white/10 bg-black/20'}`}>
                        <button onClick={() => setExpandedPaymentCategory(isExpanded ? null : cat)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isExpanded ? 'bg-brand-accent text-white border-brand-accent' : 'bg-black/40 text-gray-400 border-white/10 group-hover:text-white'}`}>
                                    <i className={`fa-solid ${CATEGORY_ICONS[cat] || 'fa-circle'} text-sm`}></i>
                                </div>
                                <span className={`font-bold text-sm sm:text-base transition-colors ${isExpanded ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{cat}</span>
                            </div>
                            <i className={`fa-solid fa-chevron-down text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand-accent' : ''}`}></i>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {methods.map(m => (
                                <div key={m} className="px-3 py-2 bg-black/40 rounded border border-white/5 text-xs text-gray-300 text-center hover:border-brand-accent/30 hover:text-white transition select-none cursor-default flex items-center justify-center min-h-[40px]">
                                    {m}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showRequestConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowRequestConfig(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">Request Config</h3>
            <div className="space-y-4">
              <select className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" value={requestForm.product} onChange={e => setRequestForm({...requestForm, product: e.target.value})}>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" placeholder="Discord ID" value={requestForm.discord} onChange={e => setRequestForm({...requestForm, discord: e.target.value})}/>
              <input className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" placeholder="Order ID" value={requestForm.order} onChange={e => setRequestForm({...requestForm, order: e.target.value})}/>
              <button onClick={handleSubmitRequest} className="w-full bg-brand-accent hover:bg-brand-accentHover py-2 rounded text-white font-bold">Submit Live</button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-6 border border-white/10">
             <h3 className="text-xl font-bold mb-4 text-center text-white">Admin Login</h3>
             <input className="w-full bg-black/30 border border-white/10 rounded p-2 mb-2 text-white" placeholder="ID" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
             <input type="password" className="w-full bg-black/30 border border-white/10 rounded p-2 mb-4 text-white" placeholder="Password" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
             <button onClick={handleLogin} className="w-full bg-brand-accent py-2 rounded text-white font-bold">Login</button>
          </div>
        </div>
      )}

      {showReviewModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/90" onClick={() => setShowReviewModal(false)}></div>
            <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4 text-white">
                    <h3 className="text-xl font-bold">Write Review</h3>
                    <button onClick={() => setShowReviewModal(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="space-y-3">
                    <input className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" placeholder="Your Name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})}/>
                    <select className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" value={reviewForm.product} onChange={e => setReviewForm({...reviewForm, product: e.target.value})}>
                        {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="flex flex-col items-center py-2 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex gap-2 text-2xl cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                            {[1,2,3,4,5].map(star => (
                                <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})} onMouseEnter={() => setHoverRating(star)}>
                                    <i className={`fa-star transition-colors ${(hoverRating || reviewForm.rating) >= star ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-500'}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" rows={3} placeholder="Share experience..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                    <button onClick={handleSubmitReview} className="w-full bg-brand-accent py-2.5 rounded text-white font-bold">Post Review</button>
                </div>
            </div>
         </div>
      )}

      {showStyleEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/90" onClick={() => setShowStyleEditor(null)}></div>
            <div className="relative bg-brand-card rounded-2xl w-full max-w-lg p-6 border border-white/10 overflow-y-auto max-h-[90vh]">
                <h3 className="font-bold mb-4 text-white">Edit Style: {showStyleEditor}</h3>
                <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <label className="text-xs text-gray-400 block mb-2">Background Image</label>
                        <input className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white mb-2" placeholder="URL..." value={styleForm.bgUrl} onChange={e => setStyleForm({...styleForm, bgUrl: e.target.value})}/>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bgUrl')} className="text-xs text-gray-400"/>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <label className="text-xs text-gray-400 block mb-2">Product Icon</label>
                        <input className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white mb-2" placeholder="URL..." value={styleForm.iconUrl} onChange={e => setStyleForm({...styleForm, iconUrl: e.target.value})}/>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'iconUrl')} className="text-xs text-gray-400"/>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={styleForm.iconScale || 1} onChange={e => setStyleForm({...styleForm, iconScale: parseFloat(e.target.value)})} className="w-full mt-3"/>
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={handleSaveStyle} className="flex-1 bg-brand-accent py-2 rounded text-white font-bold">Save Global</button>
                    <button onClick={handleResetStyle} className="flex-1 border border-red-500/50 text-red-400 py-2 rounded">Reset</button>
                </div>
            </div>
        </div>
      )}

      {showRefundPolicy && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="fixed inset-0 bg-black/90" onClick={() => setShowRefundPolicy(false)}></div>
                <div className="relative bg-brand-card rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[85vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 flex-shrink-0 text-white">
                        <h3 className="text-xl font-bold">Refund Policy</h3>
                        <button onClick={() => setShowRefundPolicy(false)}><i className="fa-solid fa-xmark text-xl"></i></button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <p>All sales are final once delivered.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </Layout>
  );
};

export default App;