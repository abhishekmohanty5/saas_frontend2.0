import React, { useState, useEffect } from 'react';
import '../styles/ApiCredentialsSection.css';
import { 
  Key, 
  Lock, 
  Copy, 
  Check, 
  ShieldCheck, 
  Tag, 
  RefreshCw,
  Plus,
  AlertTriangle,
  LockKeyhole,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardAPI } from '../services/api';

const ApiCredentialsSection = ({ clientId: initialClientId }) => {
  const [credentials, setCredentials] = useState({
    clientId: initialClientId || 'loading...',
    clientSecret: '',
    createdAt: 'Joined Oct 2025'
  });

  const [hasCopied, setHasCopied] = useState({ id: false, secret: false });
  const [isRolling, setIsRolling] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showOneTimeModal, setShowOneTimeModal] = useState(false);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);
  const [modalType, setModalType] = useState('reveal');
  const [keyHistory, setKeyHistory] = useState([]);

  useEffect(() => {
    if (credentials.clientId && credentials.clientId !== 'loading...') {
      const stored = localStorage.getItem(`api_keys_${credentials.clientId}`);
      if (stored) {
        setKeyHistory(JSON.parse(stored));
      } else {
        const initial = [{
          id: Date.now().toString(),
          prefix: 'sk_live_••••••••••••••••••••',
          created: 'Upon Registration',
          status: 'ACTIVE'
        }];
        setKeyHistory(initial);
        localStorage.setItem(`api_keys_${credentials.clientId}`, JSON.stringify(initial));
      }
    }
  }, [credentials.clientId]);

  useEffect(() => {
    fetchInitialData();
  }, [initialClientId]);

  const fetchInitialData = async () => {
    try {
        const response = await dashboardAPI.getOverview();
        const data = response.data.data;
        setCredentials(prev => ({
            ...prev,
            clientId: data.clientId,
            createdAt: data.createdAt || 'Joined Oct 2025'
        }));
    } catch (error) {
        console.error("Error fetching credentials:", error);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setHasCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setHasCopied(prev => ({ ...prev, [field]: false })), 2000);
  };

  const handleRegenerate = async () => {
    setIsRolling(true);
    try {
        const response = await dashboardAPI.regenerateSecret();
        const data = response.data.data;
        setCredentials(prev => ({ ...prev, clientSecret: data.clientSecret }));
        
        // Frontend managed key history
        const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const newHistory = keyHistory.map(k => ({ ...k, status: 'REVOKED' }));
        newHistory.unshift({
            id: Date.now().toString(),
            prefix: 'sk_live_••••••••••••••••••••',
            created: nowStr,
            status: 'ACTIVE'
        });
        setKeyHistory(newHistory);
        if (credentials.clientId && credentials.clientId !== 'loading...') {
            localStorage.setItem(`api_keys_${credentials.clientId}`, JSON.stringify(newHistory));
        }

        setModalType('generate');
        setShowDangerConfirm(false);
        setShowOneTimeModal(true);
    } catch (error) {
        alert("Failed to regenerate secret.");
    } finally {
        setIsRolling(false);
    }
  };

  const handleRevealCurrent = async () => {
    setIsRevealing(true);
    try {
        const response = await dashboardAPI.getApiKeys();
        const data = response.data.data;
        setCredentials(prev => ({ ...prev, clientSecret: data.clientSecret }));
        setModalType('reveal');
        setShowOneTimeModal(true);
    } catch (error) {
        alert("Failed to reveal secret.");
    } finally {
        setIsRevealing(false);
    }
  };

  return (
    <div className="v2-credentials-page">
      <div className="v2-header">
         <div className="v2-status">Live Environment</div>
         <h1>API Credentials</h1>
         <p>Manage your keys and secure your backend communication.</p>
      </div>

      <div className="v2-card identity-section">
         <div className="v2-id-row">
            <div className="v2-id-info">
               <span className="v2-id-label">PROJECT CLIENT ID</span>
               <code>{credentials.clientId}</code>
            </div>
            <button className="v2-id-copy" onClick={() => copyToClipboard(credentials.clientId, 'id')}>
               {hasCopied.id ? <Check size={16} /> : <Copy size={16} />}
            </button>
         </div>
      </div>

      <div className="v2-card secret-section" style={{ padding: 32, borderRadius: 24, border: '1px solid var(--theme-border)', background: 'var(--surface)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
         <div className="v2-secret-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>Secret Keys</h3>
            <button 
               onClick={() => setShowDangerConfirm(true)}
               style={{
                  background: 'var(--ink)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', 
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
               }}
               onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'; }}
               onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            >
               + Generate New Key
            </button>
         </div>

         <div style={{ border: '1px solid var(--theme-border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--theme-border)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                     <th style={{ padding: '16px 24px', fontWeight: 600 }}>Secret Key</th>
                     <th style={{ padding: '16px 24px', fontWeight: 600 }}>Created</th>
                     <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                  </tr>
               </thead>
               <tbody>
                  {keyHistory.map((keyItem, index) => (
                    <tr key={keyItem.id} style={{ borderBottom: index < keyHistory.length - 1 ? '1px solid var(--theme-border)' : 'none', fontSize: 14 }}>
                       <td style={{ padding: '20px 24px', fontFamily: 'var(--ff-mono)', color: keyItem.status === 'ACTIVE' ? 'var(--ink)' : 'var(--muted)', fontWeight: 500, letterSpacing: '0.5px' }}>
                          {keyItem.prefix}
                       </td>
                       <td style={{ padding: '20px 24px', color: 'var(--muted)', fontSize: 13 }}>
                          {keyItem.created === 'Upon Registration' ? credentials.createdAt : keyItem.created}
                       </td>
                       <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                              background: keyItem.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', 
                              color: keyItem.status === 'ACTIVE' ? '#10b981' : 'var(--muted)', 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              fontSize: 10, 
                              fontWeight: 800, 
                              letterSpacing: '0.05em' 
                          }}>
                              {keyItem.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {showDangerConfirm && (
          <div className="v2-modal-overlay" onClick={() => setShowDangerConfirm(false)}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="v2-modal" 
               onClick={e => e.stopPropagation()}
             >
                <AlertTriangle size={32} color="red" />
                <h3>Regenerate production key?</h3>
                <p>This will immediately invalidate your current key. Existing integrations will stop working.</p>
                <div className="v2-modal-btns">
                   <button className="v2-cancel-btn" onClick={() => setShowDangerConfirm(false)}>Cancel</button>
                   <button className="v2-action-btn-red" onClick={handleRegenerate}>
                      {isRolling ? 'Generating...' : 'Yes, Regenerate'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}

        {showOneTimeModal && (
          <div className="v2-modal-overlay">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="v2-modal reveal-modal"
             >
                <h2>{modalType === 'generate' ? 'New Key Created' : 'Key Revealed'}</h2>
                <div className="v2-warn">
                   <Info size={16} />
                   Copy this key now. It will not be shown again.
                </div>
                <div className="v2-reveal-box">
                   <code>{credentials.clientSecret}</code>
                   <button className="v2-copy-main" onClick={() => copyToClipboard(credentials.clientSecret, 'secret')}>
                      {hasCopied.secret ? 'Copied!' : 'Copy Key'}
                   </button>
                </div>
                <button className="v2-close-btn" onClick={() => setShowOneTimeModal(false)}>Close Securely</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiCredentialsSection;
