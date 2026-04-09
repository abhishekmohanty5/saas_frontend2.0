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

      <div className="v2-card secret-section">
         <div className="v2-secret-header">
            <h3>Secret Management</h3>
            <button className="v2-main-btn" onClick={() => setShowDangerConfirm(true)}>
               Generate New Key
            </button>
         </div>

         <div className="v2-secret-body">
            <div className="v2-lock">
               <Lock size={32} />
            </div>
            <p>Your secret key is encrypted and hidden.</p>
            <div className="v2-secret-links">
               <button onClick={handleRevealCurrent}>{isRevealing ? 'Revealing...' : 'Reveal Current Key'}</button>
               <span className="v2-sep">|</span>
               <button className="v2-danger-link" onClick={() => setShowDangerConfirm(true)}>Regenerate</button>
            </div>
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
