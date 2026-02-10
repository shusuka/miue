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

const App: React.FC = () => {
  const { addToast } = useToast();
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Modal States
  const [purchaseProduct, setPurchaseProduct] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState<string | null>(null); // State for accordion
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
  const [hoverRating, setHoverRating] = useState(0); // Add hover state for stars
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [styleForm, setStyleForm] = useState<ProductStyle>({ bgUrl: '', iconUrl: '', gradient: '' });

  // Load config on mount
  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
  }, []);

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleSubmitRequest = () => {
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
    handleUpdateConfig({ ...config, requests: [...config.requests, newReq] });
    setShowRequestConfig(false);
    addToast("Config Request Sent! We will contact you shortly.", "success");
    setRequestForm({ product: PRODUCTS[0], discord: '', order: '' });
  };

  const handleSubmitReview = () => {
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
    handleUpdateConfig({ ...config, reviews: [...config.reviews, newReview] });
    setShowReviewModal(false);
    setReviewForm({ name: '', product: PRODUCTS[0], rating: 0, comment: '' }); // Reset form
    setHoverRating(0);
    addToast("Review submitted successfully!", "success");
  };

  const handleLogin = () => {
    // SECURITY UPDATE: Compare hash instead of plain text
    const inputHash = simpleHash(loginForm.pass);
    if (loginForm.user === config.adminAuth.username && inputHash === config.adminAuth.password) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setShowAdminPanel(true);
      // Reset form for security
      setLoginForm({ user: '', pass: '' });
      addToast("Welcome back, Admin!", "success");
    } else {
      addToast("Invalid credentials", "error");
    }
  };

  const handleSaveStyle = () => {
      if(!showStyleEditor) return;
      const newStyles = { ...config.productStyles };
      newStyles[showStyleEditor] = styleForm;
      handleUpdateConfig({ ...config, productStyles: newStyles });
      setShowStyleEditor(null);
      addToast(`Style updated for ${showStyleEditor}`, "success");
  };

  const handleResetStyle = () => {
      if(!showStyleEditor) return;
      const newStyles = { ...config.productStyles };
      delete newStyles[showStyleEditor];
      handleUpdateConfig({ ...config, productStyles: newStyles });
      setShowStyleEditor(null);
      addToast(`Style reset for ${showStyleEditor}`, "info");
  }

  // Reset expanded category when modal closes
  useEffect(() => {
    if (!showPaymentMethods) {
        setExpandedPaymentCategory(null);
    }
  }, [showPaymentMethods]);

  return (
    <Layout 
      config={config}
      onAdminTrigger={() => isAdminLoggedIn ? setShowAdminPanel(true) : setShowLoginModal(true)}
      onOpenPaymentMethods={() => setShowPaymentMethods(true)}
      onOpenRequestConfig={() => setShowRequestConfig(true)}
      onOpenRefundPolicy={() => setShowRefundPolicy(true)}
      onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
    >
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
            setStyleForm(config.productStyles[p] || { bgUrl: '', iconUrl: '', gradient: '' });
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

      {/* Purchase Modal */}
      {purchaseProduct && (
        <PurchaseModal 
          product={purchaseProduct} 
          onClose={() => setPurchaseProduct(null)} 
          config={config}
          onOpenPrivacy={() => setShowPrivacyPolicy(true)}
          onOpenRefund={() => setShowRefundPolicy(true)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          config={config} 
          onClose={() => setShowAdminPanel(false)}
          onLogout={() => { setIsAdminLoggedIn(false); setShowAdminPanel(false); addToast("Logged out", "info"); }}
          onSaveConfig={handleUpdateConfig}
        />
      )}

      {/* Payment Methods Info Modal - ACCORDION STYLE */}
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
                        <button 
                            onClick={() => setExpandedPaymentCategory(isExpanded ? null : cat)}
                            className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isExpanded ? 'bg-brand-accent text-white border-brand-accent' : 'bg-black/40 text-gray-400 border-white/10 group-hover:text-white'}`}>
                                    <i className={`fa-solid ${CATEGORY_ICONS[cat] || 'fa-circle'} text-sm`}></i>
                                </div>
                                <span className={`font-bold text-sm sm:text-base transition-colors ${isExpanded ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{cat}</span>
                            </div>
                            <i className={`fa-solid fa-chevron-down text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand-accent' : ''}`}></i>
                        </button>
                        
                        {/* Animated Content */}
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
            <p className="text-center text-[10px] text-gray-500 mt-4 pt-4 border-t border-white/5">
                Supported payment methods may vary by region.
            </p>
          </div>
        </div>
      )}

      {/* Request Config Modal */}
      {showRequestConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowRequestConfig(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">Request Config</h3>
            <div className="space-y-4">
              <select 
                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white"
                value={requestForm.product}
                onChange={e => setRequestForm({...requestForm, product: e.target.value})}
              >
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" 
                placeholder="Discord ID"
                value={requestForm.discord}
                onChange={e => setRequestForm({...requestForm, discord: e.target.value})}
              />
              <input 
                className="w-full bg-black/30 border border-white/10 rounded p-2 text-white" 
                placeholder="Order ID"
                value={requestForm.order}
                onChange={e => setRequestForm({...requestForm, order: e.target.value})}
              />
              <button onClick={handleSubmitRequest} className="w-full bg-brand-accent hover:bg-brand-accentHover py-2 rounded text-white font-bold">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/90" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-6 border border-white/10">
             <h3 className="text-xl font-bold mb-4 text-center text-white">Admin Login</h3>
             <input 
                className="w-full bg-black/30 border border-white/10 rounded p-2 mb-2 text-white" 
                placeholder="ID"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
             />
             <input 
                type="password" 
                className="w-full bg-black/30 border border-white/10 rounded p-2 mb-4 text-white" 
                placeholder="Password"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
             />
             <button onClick={handleLogin} className="w-full bg-brand-accent py-2 rounded text-white font-bold">Login</button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/90" onClick={() => setShowReviewModal(false)}></div>
            <div className="relative bg-brand-card rounded-2xl w-full max-w-md p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Write Review</h3>
                    <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-white">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div className="space-y-3">
                    <input 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-white focus:border-brand-accent outline-none transition" 
                        placeholder="Your Name (e.g. JohnDota)"
                        value={reviewForm.name}
                        onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                    />
                    
                    <select 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-white focus:border-brand-accent outline-none transition"
                        value={reviewForm.product}
                        onChange={e => setReviewForm({...reviewForm, product: e.target.value})}
                    >
                        {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <div className="flex flex-col items-center py-2 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-xs text-gray-400 mb-1">Click to rate:</span>
                        <div className="flex gap-2 text-2xl cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                            {[1,2,3,4,5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                                    onMouseEnter={() => setHoverRating(star)}
                                >
                                    <i className={`fa-star transition-colors ${
                                        (hoverRating || reviewForm.rating) >= star 
                                            ? 'fa-solid text-yellow-400' 
                                            : 'fa-regular text-gray-500'
                                    }`}></i>
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-brand-accent h-4 mt-1">
                            {hoverRating > 0 ? `${hoverRating} Stars` : reviewForm.rating > 0 ? `${reviewForm.rating} Stars` : ''}
                        </span>
                    </div>

                    <textarea 
                        className="w-full bg-black/30 border border-white/10 rounded p-2 text-white focus:border-brand-accent outline-none transition" 
                        rows={3}
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                    ></textarea>

                    <button 
                        onClick={handleSubmitReview} 
                        className="w-full bg-brand-accent hover:bg-brand-accentHover py-2.5 rounded text-white font-bold shadow-lg shadow-brand-accent/20 transition-all transform active:scale-95"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* Style Editor Modal */}
      {showStyleEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/90" onClick={() => setShowStyleEditor(null)}></div>
            <div className="relative bg-brand-card rounded-2xl w-full max-w-sm p-6 border border-white/10">
                <h3 className="font-bold mb-4 text-white">Edit Style: <span className="text-brand-accent">{showStyleEditor}</span></h3>
                <input 
                    className="w-full bg-black/30 border border-white/10 rounded p-2 mb-2 text-white" 
                    placeholder="Background Image URL"
                    value={styleForm.bgUrl}
                    onChange={e => setStyleForm({...styleForm, bgUrl: e.target.value})}
                />
                <input 
                    className="w-full bg-black/30 border border-white/10 rounded p-2 mb-2 text-white" 
                    placeholder="Icon URL"
                    value={styleForm.iconUrl}
                    onChange={e => setStyleForm({...styleForm, iconUrl: e.target.value})}
                />
                <select 
                    className="w-full bg-black/30 border border-white/10 rounded p-2 mb-4 text-white"
                    value={styleForm.gradient || ''}
                    onChange={e => setStyleForm({...styleForm, gradient: e.target.value})}
                >
                    <option value="">Default Gradient</option>
                    <option value="bg-gradient-to-r from-pink-500 to-rose-500">Pink-Rose</option>
                    <option value="bg-gradient-to-r from-blue-600 to-violet-600">Blue-Violet</option>
                    <option value="bg-gradient-to-r from-emerald-500 to-lime-600">Emerald-Lime</option>
                </select>
                <button onClick={handleSaveStyle} className="w-full bg-brand-accent py-2 rounded text-white mb-2">Save</button>
                <button onClick={handleResetStyle} className="w-full border border-red-500/50 text-red-400 py-2 rounded hover:bg-red-500/10">Reset to Default</button>
            </div>
        </div>
      )}

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="fixed inset-0 bg-black/90" onClick={() => setShowRefundPolicy(false)}></div>
                <div className="relative bg-brand-card rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[85vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 flex-shrink-0">
                        <h3 className="text-xl font-bold text-white">Refund Policy</h3>
                        <button onClick={() => setShowRefundPolicy(false)} className="text-gray-300"><i className="fa-solid fa-xmark text-xl"></i></button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <p>All products are digital and delivered instantly. Therefore, all sales are final unless explicitly stated otherwise. By purchasing, you acknowledge and agree to this policy.</p>

                        <h4 className="font-bold text-white mt-4">Eligible Refund Cases</h4>
                        <p>Refunds will be considered only under the following strict conditions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Duplicate purchase of the same product within 24 hours of the transaction.</li>
                            <li>Payment was successfully processed but no license/key was delivered, and our support team is unable to provide a replacement within a reasonable timeframe.</li>
                        </ul>

                        <h4 className="font-bold text-white mt-4">Non-Refundable Cases (No Exceptions)</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Any key or product that has been viewed, revealed, activated, or used.</li>
                            <li>Incompatibility caused by unsupported operating systems, outdated BIOS, drivers, or failure to follow installation instructions.</li>
                            <li>Bans, suspensions, flags, or penalties imposed by game publishers, platforms, or anti-cheat systems.</li>
                            <li>Requests due to change of mind, incorrect purchase, or dissatisfaction after delivery.</li>
                            <li>Accounts, devices, or environments that fail safety requirements.</li>
                        </ul>

                        <h4 className="font-bold text-white mt-4">Exchanges & Store Credits</h4>
                        <p>At our sole discretion, we may offer a replacement key or store credit only if the product is discontinued or temporarily unavailable due to mandatory safety updates.</p>

                        <h4 className="font-bold text-white mt-4">Refund Requests Procedure</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Open a support ticket via the Support link.</li>
                            <li>Include your Order ID, registered email, and a clear explanation of the issue.</li>
                            <li>Response time is typically 24–48 hours. This policy is final and binding.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Privacy Policy / Terms Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="fixed inset-0 bg-black/90" onClick={() => setShowPrivacyPolicy(false)}></div>
                <div className="relative bg-brand-card rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[85vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2 flex-shrink-0">
                        <h3 className="text-xl font-bold text-white">Terms of Service & Privacy</h3>
                        <button onClick={() => setShowPrivacyPolicy(false)} className="text-gray-300"><i className="fa-solid fa-xmark text-xl"></i></button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="font-medium text-white">Welcome to Miuw Store.</p>
                        <p>These Terms of Service (“Terms”) govern your access to and use of our website, digital products, licenses, configurations, subscriptions, and related services.</p>

                        <div className="space-y-4 mt-4">
                            <div>
                                <h5 className="font-bold text-white text-base">1. Nature of Products & Purpose</h5>
                                <p className="mt-1">All products are provided “as is” and intended for technical, testing, and educational purposes only. You acknowledge that use of modification tools may violate game publisher policies and may result in bans. All risks are assumed by the user.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">2. Eligibility & Legal Compliance</h5>
                                <p className="mt-1">You must be at least 18 years old. You are solely responsible for ensuring that use of the Services is legal in your jurisdiction.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">3. Accounts & Security</h5>
                                <p className="mt-1">You are responsible for all activity under your account. Miuw Store reserves the right to suspend accounts involved in abuse or fraud.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">4. Licenses, Subscriptions & Keys</h5>
                                <p className="mt-1">All keys are single-user, non-transferable, and non-resellable. Attempting to resell or bypass checks will result in termination.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">5. System Requirements</h5>
                                <p className="mt-1">You are responsible for maintaining compatible operating systems and drivers. Incompatibility is not grounds for refund.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">6. Risks & Absolute Disclaimer</h5>
                                <p className="mt-1">Anti-cheat systems evolve constantly. Miuw Store makes no guarantees regarding safety or detection status. We are not liable for bans or lost accounts.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">7. Payments & Chargebacks</h5>
                                <p className="mt-1">Unauthorized chargebacks will result in immediate account termination and a permanent blacklist.</p>
                            </div>

                            <div>
                                <h5 className="font-bold text-white text-base">13. Contact & Support</h5>
                                <p className="mt-1">For questions regarding these Terms, contact us exclusively through the Support link or official help widget.</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-gray-400">
                            By purchasing or using any product from Miuw Store, you confirm that you have read, understood, and fully accepted all Terms above.
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </Layout>
  );
};

export default App;