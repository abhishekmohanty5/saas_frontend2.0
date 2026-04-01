import React, { useState } from 'react';
import '../styles/ApiCredentialsSection.css';

const ApiCredentialsSection = () => {
  const [credentials, setCredentials] = useState({
    clientId: 'sb_8c92539935d064df0',
    clientSecret: 'sk_2cda39f1d2a14952a4e724f743c9ec30',
  });

  const [revealed, setRevealed] = useState({
    clientId: false,
    clientSecret: false,
  });

  const [locked, setLocked] = useState({
    clientId: false,
    clientSecret: false,
  });

  const [copied, setCopied] = useState({
    clientId: false,
    clientSecret: false,
  });

  const [newApiKey, setNewApiKey] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [showAddKey, setShowAddKey] = useState(false);

  const toggleReveal = (field) => {
    if (!locked[field]) {
      setRevealed(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    }
  };

  const toggleLock = (field) => {
    setLocked(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopied(prev => ({
      ...prev,
      [field]: true
    }));
    setTimeout(() => {
      setCopied(prev => ({
        ...prev,
        [field]: false
      }));
    }, 2000);
  };

  const addApiKey = () => {
    if (newApiKey.trim()) {
      setApiKeys(prev => [...prev, {
        id: Date.now(),
        name: newApiKey,
        key: `key_${Math.random().toString(36).substr(2, 9)}`,
        created: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        locked: false,
        revealed: false
      }]);
      setNewApiKey('');
      setShowAddKey(false);
    }
  };

  const deleteApiKey = (id) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const toggleApiKeyReveal = (id) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, revealed: !key.revealed && !key.locked } : key
    ));
  };

  const toggleApiKeyLock = (id) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, locked: !key.locked } : key
    ));
  };

  const copyApiKey = (value, id) => {
    navigator.clipboard.writeText(value);
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, copied: true } : key
    ));
    setTimeout(() => {
      setApiKeys(prev => prev.map(key =>
        key.id === id ? { ...key, copied: false } : key
      ));
    }, 2000);
  };

  return (
    <div className="api-credentials-container">
      {/* Header */}
      <div className="api-creds-header">
        <div className="header-content">
          <h1>🔐 Security & Access</h1>
          <p>Manage your API credentials and keys securely</p>
        </div>
      </div>

      {/* Main Credentials Section */}
      <div className="creds-section">
        <div className="section-title">
          <span className="title-label">API Credentials</span>
          <span className="title-description">Secure keys to authenticate your application</span>
        </div>

        {/* Client ID Credential */}
        <div className="credential-card">
          <div className="credential-label">CLIENT ID</div>
          <div className="credential-input-container">
            <input
              type={revealed.clientId ? 'text' : 'password'}
              value={credentials.clientId}
              readOnly
              className="credential-input"
            />
            <div className="credential-actions">
              <button
                className={`lock-btn ${locked.clientId ? 'locked' : 'unlocked'}`}
                onClick={() => toggleLock('clientId')}
                title={locked.clientId ? 'Locked - Click to unlock' : 'Unlocked - Click to lock'}
              >
                {locked.clientId ? '🔒' : '🔓'}
              </button>
              {!locked.clientId && (
                <button
                  className="reveal-btn"
                  onClick={() => toggleReveal('clientId')}
                  title={revealed.clientId ? 'Hide' : 'Show'}
                >
                  {revealed.clientId ? '👁️' : '👁️‍🗨️'}
                </button>
              )}
              <button
                className={`copy-btn ${copied.clientId ? 'copied' : ''}`}
                onClick={() => copyToClipboard(credentials.clientId, 'clientId')}
              >
                {copied.clientId ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        </div>

        {/* Client Secret Credential */}
        <div className="credential-card">
          <div className="credential-label">CLIENT SECRET</div>
          <div className="credential-input-container">
            <input
              type={revealed.clientSecret ? 'text' : 'password'}
              value={credentials.clientSecret}
              readOnly
              className="credential-input"
            />
            <div className="credential-actions">
              <button
                className={`lock-btn ${locked.clientSecret ? 'locked' : 'unlocked'}`}
                onClick={() => toggleLock('clientSecret')}
                title={locked.clientSecret ? 'Locked - Click to unlock' : 'Unlocked - Click to lock'}
              >
                {locked.clientSecret ? '🔒' : '🔓'}
              </button>
              {!locked.clientSecret && (
                <button
                  className="reveal-btn"
                  onClick={() => toggleReveal('clientSecret')}
                  title={revealed.clientSecret ? 'Hide' : 'Show'}
                >
                  {revealed.clientSecret ? '👁️' : '👁️‍🗨️'}
                </button>
              )}
              <button
                className={`copy-btn ${copied.clientSecret ? 'copied' : ''}`}
                onClick={() => copyToClipboard(credentials.clientSecret, 'clientSecret')}
              >
                {copied.clientSecret ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="api-keys-section">
        <div className="api-keys-header">
          <div>
            <div className="section-title">
              <span className="title-label">API Keys</span>
              <span className="title-description">Generate and manage additional API keys</span>
            </div>
          </div>
          <button
            className="add-key-btn"
            onClick={() => setShowAddKey(!showAddKey)}
          >
            {showAddKey ? '✕ Cancel' : '+ Add API Key'}
          </button>
        </div>

        {/* Add New Key Form */}
        {showAddKey && (
          <div className="add-key-form">
            <div className="form-group">
              <label>Key Name</label>
              <input
                type="text"
                placeholder="e.g., Production API Key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addApiKey()}
                className="form-input"
              />
            </div>
            <button className="submit-btn" onClick={addApiKey}>
              Generate Key
            </button>
          </div>
        )}

        {/* API Keys List */}
        <div className="api-keys-list">
          {apiKeys.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔑</span>
              <p>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            apiKeys.map(key => (
              <div key={key.id} className="api-key-card">
                <div className="key-header">
                  <div className="key-info">
                    <h4>{key.name}</h4>
                    <span className="key-created">Created {key.created}</span>
                  </div>
                  <button
                    className="delete-key-btn"
                    onClick={() => deleteApiKey(key.id)}
                    title="Delete key"
                  >
                    ✕
                  </button>
                </div>
                <div className="key-value-container">
                  <input
                    type={key.revealed ? 'text' : 'password'}
                    value={key.key}
                    readOnly
                    className="key-value-input"
                  />
                  <div className="key-actions">
                    <button
                      className={`lock-btn ${key.locked ? 'locked' : 'unlocked'}`}
                      onClick={() => toggleApiKeyLock(key.id)}
                      title={key.locked ? 'Locked' : 'Unlocked'}
                    >
                      {key.locked ? '🔒' : '🔓'}
                    </button>
                    {!key.locked && (
                      <button
                        className="reveal-btn"
                        onClick={() => toggleApiKeyReveal(key.id)}
                      >
                        {key.revealed ? '👁️' : '👁️‍🗨️'}
                      </button>
                    )}
                    <button
                      className={`copy-btn ${key.copied ? 'copied' : ''}`}
                      onClick={() => copyApiKey(key.key, key.id)}
                    >
                      {key.copied ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        <span className="notice-icon">⚠️</span>
        <p>
          Keep your API credentials secure. Never share your secret key or expose it in client-side code.
          Use environment variables for production.
        </p>
      </div>
    </div>
  );
};

export default ApiCredentialsSection;
