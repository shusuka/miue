import React, { useState, useEffect } from 'react';
import { AppConfig, RequestConfig, Review } from '../../types';
import { PRODUCTS, PRODUCT_DURATIONS, DEFAULT_CONFIG } from '../../constants';
import { simpleHash } from '../../utils';
import { useToast } from '../../context/ToastContext';

interface AdminPanelProps {
  config: AppConfig;
  onClose: () => void;
  onLogout: () => void;
  onSaveConfig: (newConfig: AppConfig) => void;
}

type AdminTab = 'dashboard' | 'requests' | 'products' | 'reviews' | 'settings' | 'system';

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onClose, onLogout, onSaveConfig }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Local state for product link editing
  const [linkProduct, setLinkProduct] = useState(PRODUCTS[0]);
  const [linkDuration, setLinkDuration] = useState(PRODUCT_DURATIONS[PRODUCTS[0]][0]);
  const [linkCrypto, setLinkCrypto] = useState('');
  const [linkFiat, setLinkFiat] = useState('');
  const [linkFiatWorld, setLinkFiatWorld] = useState('');
  const [linkFiatRegion, setLinkFiatRegion] = useState('');

  // 2-Step Delete State
  // Stores the ID of the item currently pending deletion confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Local state for settings
  // Pass is kept empty for security display reasons
  const [settings, setSettings] = useState({
      wa: config.whatsappNumber,
      discord: config.discordLink,
      yt: config.youtubeLink,
      fb: config.facebookLink,
      user: config.adminAuth.username,
      pass: '' // Do not show existing hash
  });

  // Clear confirmation when tab changes
  useEffect(() => {
    setConfirmDeleteId(null);
  }, [activeTab]);

  // --- DELETE HANDLERS ---
  const handleDeleteRequest = (id: number) => {
    const sId = String(id);
    if (confirmDeleteId === sId) {
        // Confirmed
        const newReqs = (config.requests || []).filter(r => String(r.id) !== sId);
        onSaveConfig({ ...config, requests: newReqs });
        setConfirmDeleteId(null);
        addToast("Request deleted", "info");
    } else {
        // First click
        setConfirmDeleteId(sId);
        // Auto-clear after 3 seconds
        setTimeout(() => setConfirmDeleteId(prev => prev === sId ? null : prev), 3000);
    }
  };

  const handleDeleteReview = (id: number) => {
    const sId = String(id);
    if (confirmDeleteId === sId) {
        // Confirmed
        const newRevs = (config.reviews || []).filter(r => String(r.id) !== sId);
        onSaveConfig({ ...config, reviews: newRevs });
        setConfirmDeleteId(null);
        addToast("Review deleted", "info");
    } else {
        // First click
        setConfirmDeleteId(sId);
        setTimeout(() => setConfirmDeleteId(prev => prev === sId ? null : prev), 3000);
    }
  };

  // --- BACKUP & RESTORE LOGIC ---
  const handleBackup = () => {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `miuw_store_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        addToast("Backup downloaded", "success");
    } catch (err) {
        console.error("Backup failed", err);
        addToast("Failed to create backup", "error");
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result;
            if (typeof content === 'string') {
                const parsed = JSON.parse(content);
                
                // STABILITY FIX: Merge with DEFAULT_CONFIG
                const restoredConfig: AppConfig = {
                    ...DEFAULT_CONFIG,
                    ...parsed,
                    overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
                    adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) },
                    productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) },
                    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
                    requests: Array.isArray(parsed.requests) ? parsed.requests : []
                };

                if (restoredConfig.adminAuth) {
                    // Use standard alert since window.confirm might be the issue in some environments
                    onSaveConfig(restoredConfig);
                    alert("Data restored successfully! The page will now reload.");
                    window.location.reload();
                } else {
                    addToast("Invalid backup: Missing adminAuth", "error");
                }
            }
        } catch (err) {
            console.error(err);
            addToast("Failed to parse JSON", "error");
        }
    };
    reader.readAsText(fileObj);
    event.target.value = ''; // Reset input
  };

  // Link Management
  const handleLoadLink = () => {
    const key = `${linkProduct}_${linkDuration}`;
    const data = (config.overrides && config.overrides[key]) || {};
    setLinkCrypto(data.crypto || '');
    setLinkFiat(data.fiat || '');
    setLinkFiatWorld(data.fiatWorld || '');
    setLinkFiatRegion(data.fiatRegion || '');
  };

  const handleSaveLink = () => {
    const key = `${linkProduct}_${linkDuration}`;
    const newOverrides = { ...(config.overrides || {}) };
    newOverrides[key] = {
        crypto: linkCrypto,
        fiat: linkFiat,
        fiatWorld: linkFiatWorld,
        fiatRegion: linkFiatRegion
    };
    onSaveConfig({...config, overrides: newOverrides});
    addToast("Link Override Saved!", "success");
  };

  const handleSaveSettings = () => {
      // Logic: Only update password if user typed a new one.
      // If field is empty, keep existing hash.
      const finalPassword = settings.pass 
          ? simpleHash(settings.pass) 
          : config.adminAuth.password;

      onSaveConfig({
          ...config,
          whatsappNumber: settings.wa,
          discordLink: settings.discord,
          youtubeLink: settings.yt,
          facebookLink: settings.fb,
          adminAuth: {
              username: settings.user,
              password: finalPassword
          }
      });
      addToast("Settings Updated!", "success");
      // Clear password field after save
      setSettings({...settings, pass: ''});
  };

  useEffect(() => {
      handleLoadLink();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkProduct, linkDuration, config]);


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/90" onClick={onClose}></div>
        <div className="relative bg-brand-card rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-white/10 animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">Admin Dashboard</h3>
                    <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded border border-brand-accent/30">v1.7 Stable</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onLogout} className="text-red-400 text-xs border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition">Logout</button>
                    <button onClick={onClose} className="text-gray-400 px-2 hover:text-white transition"><i className="fa-solid fa-xmark"></i></button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-48 bg-black/20 border-r border-white/10 flex flex-col overflow-y-auto">
                    {(['dashboard', 'requests', 'products', 'reviews', 'settings', 'system'] as AdminTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-left p-3 text-sm capitalize border-l-2 hover:bg-white/5 transition-colors flex items-center gap-2
                                ${activeTab === tab ? 'border-brand-accent bg-brand-accent/10 text-white' : 'border-transparent text-gray-400'}
                            `}
                        >
                            {tab === 'system' && <i className="fa-solid fa-database w-4 text-center"></i>}
                            {tab === 'reviews' && <i className="fa-solid fa-comments w-4 text-center"></i>}
                            {tab === 'settings' && <i className="fa-solid fa-gear w-4 text-center"></i>}
                            {tab === 'products' && <i className="fa-solid fa-link w-4 text-center"></i>}
                            {tab === 'requests' && <i className="fa-solid fa-inbox w-4 text-center"></i>}
                            {tab === 'dashboard' && <i className="fa-solid fa-chart-line w-4 text-center"></i>}
                            {tab}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto bg-black/10">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-brand-card border border-white/10 p-6 rounded-xl">
                                <h4 className="text-gray-400 text-xs uppercase mb-1">Total Requests</h4>
                                <p className="text-3xl font-bold text-white">{(config.requests || []).length}</p>
                            </div>
                            <div className="bg-brand-card border border-white/10 p-6 rounded-xl">
                                <h4 className="text-gray-400 text-xs uppercase mb-1">Total Reviews</h4>
                                <p className="text-3xl font-bold text-white">{(config.reviews || []).length}</p>
                            </div>
                            <div className="bg-brand-card border border-white/10 p-6 rounded-xl">
                                <h4 className="text-gray-400 text-xs uppercase mb-1">Active Overrides</h4>
                                <p className="text-3xl font-bold text-white">{Object.keys(config.overrides || {}).length}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div>
                            <h4 className="font-bold text-white mb-4">Config Requests</h4>
                            {(!config.requests || config.requests.length === 0) && <p className="text-gray-400 italic">No pending requests.</p>}
                            {(config.requests || []).map((r, idx) => {
                                const isConfirming = confirmDeleteId === String(r.id);
                                return (
                                <div key={`${r.id}-${idx}`} className="bg-white/5 p-4 rounded-xl mb-3 border border-white/10 flex justify-between items-center hover:border-brand-accent/30 transition">
                                    <div className="flex-1 pr-4">
                                        <div className="font-bold text-sm text-white flex items-center gap-2">
                                            {r.product} 
                                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">{r.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Discord: <span className="text-white select-all">{r.discord}</span></div>
                                        <div className="text-xs text-gray-400">Order ID: <span className="text-white select-all">{r.orderId}</span></div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRequest(r.id);
                                        }} 
                                        className={`p-2 rounded transition cursor-pointer z-10 border flex items-center gap-2
                                            ${isConfirming 
                                                ? 'bg-red-500 text-white border-red-500 shadow-lg animate-pulseFast' 
                                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-transparent hover:border-red-500/20'}
                                        `}
                                        title={isConfirming ? "Click again to confirm" : "Delete Request"}
                                    >
                                        {isConfirming && <span className="text-xs font-bold">Confirm?</span>}
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            )})}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                             <h4 className="font-bold text-white mb-4">Feedback & Reviews</h4>
                             {(!config.reviews || config.reviews.length === 0) && <p className="text-gray-400 italic">No reviews yet.</p>}
                             <div className="grid gap-3">
                                {(config.reviews || []).map((r, idx) => {
                                    const isConfirming = confirmDeleteId === String(r.id);
                                    return (
                                    <div key={`${r.id}-${idx}`} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-start hover:border-white/20 transition">
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-white">{r.name}</span>
                                                <span className="text-[10px] bg-white/10 text-gray-300 px-2 rounded-full border border-white/10">{r.product}</span>
                                                <div className="text-yellow-400 text-xs flex gap-0.5">
                                                    {Array.from({length: r.rating}).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300 italic">"{r.comment}"</p>
                                            <p className="text-[10px] text-gray-500 mt-2">{new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteReview(r.id);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg transition border flex items-center gap-2
                                                ${isConfirming 
                                                    ? 'bg-red-500 text-white border-red-500 shadow-lg animate-pulseFast' 
                                                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20 group'}
                                            `}
                                            title={isConfirming ? "Click again to confirm" : "Delete Review"}
                                        >
                                            {isConfirming ? (
                                                <span className="text-xs font-bold">Confirm?</span>
                                            ) : (
                                                <span className="text-xs font-bold hidden group-hover:inline">Delete</span>
                                            )}
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                )})}
                             </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="max-w-xl">
                            <h4 className="font-bold mb-4 text-white">Payment Link Manager</h4>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Product</label>
                                        <select value={linkProduct} onChange={e => setLinkProduct(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white outline-none focus:border-brand-accent">
                                            {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Duration</label>
                                        <select value={linkDuration} onChange={e => setLinkDuration(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white outline-none focus:border-brand-accent">
                                            {PRODUCT_DURATIONS[linkProduct] ? PRODUCT_DURATIONS[linkProduct].map(d => <option key={d} value={d}>{d}</option>) : <option>Loading...</option>}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-400">Crypto / General Link</label>
                                        <div className="flex gap-2">
                                            <div className="bg-black/30 p-2 rounded border border-white/10 text-gray-500"><i className="fa-brands fa-bitcoin"></i></div>
                                            <input value={linkCrypto} onChange={e => setLinkCrypto(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm" placeholder="https://..." />
                                        </div>
                                    </div>
                                    
                                    {linkProduct !== "Melonity" ? (
                                        <div>
                                            <label className="text-xs text-gray-400">Fiat Link (Cards/E-Wallet)</label>
                                            <div className="flex gap-2">
                                                <div className="bg-black/30 p-2 rounded border border-white/10 text-gray-500"><i className="fa-solid fa-credit-card"></i></div>
                                                <input value={linkFiat} onChange={e => setLinkFiat(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm" placeholder="https://..." />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="text-xs text-gray-400">Fiat World Link</label>
                                                <input value={linkFiatWorld} onChange={e => setLinkFiatWorld(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-400">Fiat Region Link</label>
                                                <input value={linkFiatRegion} onChange={e => setLinkFiatRegion(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <button onClick={handleSaveLink} className="w-full bg-brand-accent hover:bg-brand-accentHover text-white font-bold py-2 rounded mt-4 transition">
                                    Save Override
                                </button>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h5 className="text-xs font-bold mb-3 text-gray-400 uppercase">Active Custom Links</h5>
                                <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.keys(config.overrides || {}).length === 0 && <p className="text-gray-500 text-sm">No custom links set.</p>}
                                    {Object.keys(config.overrides || {}).map(k => (
                                        <div key={k} className="text-[11px] text-gray-300 mb-1 flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                                            <span>{k.replace('_', ' - ')}</span> 
                                            <i className="fa-solid fa-check text-green-400 bg-green-400/10 p-1 rounded-full"></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-md">
                             <h4 className="font-bold mb-4 text-white">Social Media & Links</h4>

                             <label className="text-xs text-gray-400">WhatsApp (Number only, e.g. 62812...)</label>
                             <input value={settings.wa} onChange={e => setSettings({...settings, wa: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white"/>
                             
                             <label className="text-xs text-gray-400">Discord Link</label>
                             <input value={settings.discord} onChange={e => setSettings({...settings, discord: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white"/>
                             
                             <label className="text-xs text-gray-400">YouTube Link</label>
                             <input value={settings.yt} onChange={e => setSettings({...settings, yt: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white"/>

                             <label className="text-xs text-gray-400">Facebook Link</label>
                             <input value={settings.fb} onChange={e => setSettings({...settings, fb: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white"/>

                             <div className="mt-6 pt-4 border-t border-white/10">
                                <h4 className="text-xs text-brand-accent font-bold uppercase mb-3">Admin Account</h4>
                                
                                <label className="text-[10px] text-gray-400">New Username</label>
                                <input value={settings.user} onChange={e => setSettings({...settings, user: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white" placeholder="Username"/>
                                
                                <label className="text-[10px] text-gray-400">New Password</label>
                                <input value={settings.pass} onChange={e => setSettings({...settings, pass: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 mb-2 text-white" placeholder="Enter new password to change" type="password"/>
                             </div>

                             <button onClick={handleSaveSettings} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-4">Save All Settings</button>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="max-w-md">
                            <h4 className="font-bold mb-4 text-white">System & Data Backup</h4>
                            <p className="text-xs text-gray-400 mb-6">Manage your store data manually. Use backup to save your current configuration (links, reviews, users) and restore to load it back.</p>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
                                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-download text-brand-accent"></i> Backup Data
                                </h5>
                                <p className="text-[10px] text-gray-400 mb-4">Download a JSON file containing all reviews, requests, product overrides, and admin credentials.</p>
                                <button onClick={handleBackup} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 rounded transition">
                                    Download Backup (.json)
                                </button>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-upload text-green-400"></i> Restore Data
                                </h5>
                                <p className="text-[10px] text-gray-400 mb-4 text-red-300">Warning: Uploading a file will completely overwrite the current store configuration.</p>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        accept=".json" 
                                        onChange={handleRestore}
                                        className="block w-full text-sm text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-xs file:font-semibold
                                        file:bg-brand-accent file:text-white
                                        hover:file:bg-brand-accentHover
                                        cursor-pointer
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
      </div>
    </div>
  );
};