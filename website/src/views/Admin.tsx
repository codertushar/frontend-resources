import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Tag, FileText, Settings as SettingsIcon, BarChart3, Plus, Trash2, ToggleLeft, ToggleRight,
  Save, AlertCircle, CheckCircle, Crown, Lock, Unlock, Bell, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import contentData from '../data/content.json';
import type { Article, Coupon, NewCoupon, Settings, Message, Stats, AdminTab, AuthContextValue } from '../types';

const Admin = () => {
  const { isSignedIn, isLoaded, getAccessToken } = useAuth() as AuthContextValue;
  const [activeTab, setActiveTab] = useState<AdminTab>('coupons');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<NewCoupon>({ code: '', discountAmount: '', description: '' });
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [couponMessage, setCouponMessage] = useState<Message | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Settings>({ base_price: '' });
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [settingsMessage, setSettingsMessage] = useState<Message | null>(null);

  // Notifications state
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<Message | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string>('');

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getAccessToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }, [getAccessToken]);

  // Check admin status
  useEffect(() => {
    if (!isLoaded) {
      return; // Wait for auth to load
    }

    if (!isSignedIn) {
      setIsCheckingAdmin(false);
      setIsAdmin(false);
      return;
    }

    // User is signed in, check admin status
    setIsCheckingAdmin(true);

    const checkAdmin = async () => {
      try {
        const res = await fetchWithAuth('/api/admin/coupons');
        if (res.status === 403) {
          setIsAdmin(false);
        } else if (res.ok) {
          setIsAdmin(true);
          const data = await res.json();
          setCoupons(data.coupons || []);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [isLoaded, isSignedIn, fetchWithAuth]);

  // Fetch settings
  useEffect(() => {
    if (isAdmin) {
      fetchWithAuth('/api/admin/settings')
        .then(res => res.json())
        .then(data => setSettings(data.settings || {}))
        .catch(err => console.error('Settings fetch error:', err));
    }
  }, [isAdmin, fetchWithAuth]);

  // Coupon handlers
  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const res = await fetchWithAuth('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: newCoupon.code,
          discountAmount: parseInt(newCoupon.discountAmount, 10) * 100, // Convert to paise
          description: newCoupon.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoupons([data.coupon, ...coupons]);
        setNewCoupon({ code: '', discountAmount: '', description: '' });
        setCouponMessage({ type: 'success', text: 'Coupon created successfully' });
      } else {
        setCouponMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setCouponMessage({ type: 'error', text: 'Failed to create coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetchWithAuth('/api/admin/coupons', {
        method: 'PUT',
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.is_active }),
      });

      if (res.ok) {
        setCoupons(coupons.map(c =>
          c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
        ));
      }
    } catch (error) {
      console.error('Toggle coupon error:', error);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetchWithAuth('/api/admin/coupons', {
        method: 'DELETE',
        body: JSON.stringify({ id: couponId }),
      });

      if (res.ok) {
        setCoupons(coupons.filter(c => c.id !== couponId));
      }
    } catch (error) {
      console.error('Delete coupon error:', error);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    setSettingsMessage(null);

    try {
      const res = await fetchWithAuth('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ key: 'base_price', value: settings.base_price }),
      });

      if (res.ok) {
        setSettingsMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setSettingsMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setSettingsMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Notification handlers
  const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedArticle) return;

    const article = (contentData as Article[]).find(a => a.id === selectedArticle);
    if (!article) return;

    setNotificationLoading(true);
    setNotificationMessage(null);

    try {
      const res = await fetchWithAuth('/api/admin/send-notification', {
        method: 'POST',
        body: JSON.stringify({
          title: `New Article: ${article.title}`,
          body: article.description || 'Check out this new article!',
          url: `/resource/${article.id}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotificationMessage({
          type: 'success',
          text: `Notification sent! ${data.sent} delivered, ${data.failed} failed${data.removedInvalid > 0 ? `, ${data.removedInvalid} invalid removed` : ''}`,
        });
        setSelectedArticle('');
      } else {
        setNotificationMessage({ type: 'error', text: data.error || 'Failed to send notification' });
      }
    } catch (error) {
      setNotificationMessage({ type: 'error', text: 'Failed to send notification' });
    } finally {
      setNotificationLoading(false);
    }
  };


  // Calculate stats
  const stats: Stats = {
    totalArticles: (contentData as Article[]).length,
    premiumArticles: (contentData as Article[]).filter(a => a.premium).length,
    freeArticles: (contentData as Article[]).filter(a => !a.premium).length,
    activeCoupons: coupons.filter(c => c.is_active).length,
    totalCoupons: coupons.length,
  };

  // Show loading while auth is loading OR while checking admin status
  if (!isLoaded || isCheckingAdmin) {
    return (
      <div className="admin-container">
        <div className="loading-wrapper">
          <div className="loading-spinner" />
          <p>Verifying access...</p>
        </div>
        <style>{`
          .loading-wrapper {
            min-height: calc(100vh - 200px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border-color);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-wrapper p {
            color: var(--text-muted);
            font-size: 0.95rem;
          }
        `}</style>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="admin-container">
        <div className="auth-required-wrapper">
          <div className="auth-required-card">
            <div className="auth-required-icon">
              <AlertCircle size={32} />
            </div>
            <h2>Authentication Required</h2>
            <p>Please sign in to access the admin panel.</p>
            <a href="/" className="back-home-btn">
              Back to Home
            </a>
          </div>
        </div>
        <style>{`
          .auth-required-wrapper {
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .auth-required-card {
            text-align: center;
            padding: 3rem;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            max-width: 420px;
            box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .auth-required-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: #f59e0b;
          }
          .auth-required-card h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: var(--text-main);
          }
          .auth-required-card p {
            color: var(--text-muted);
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .back-home-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 2rem;
            background: linear-gradient(135deg, var(--primary), #a78bfa);
            color: white !important;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
          }
          .back-home-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -4px rgba(139, 92, 246, 0.4);
          }
        `}</style>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="access-denied-wrapper">
          <div className="access-denied-card">
            <div className="access-denied-icon">
              <Lock size={32} />
            </div>
            <h2>Access Denied</h2>
            <p>You don&apos;t have admin privileges to access this page.</p>
            <a href="/" className="back-home-btn">
              Back to Home
            </a>
          </div>
        </div>
        <style>{`
          .access-denied-wrapper {
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .access-denied-card {
            text-align: center;
            padding: 3rem;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            max-width: 420px;
            box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .access-denied-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: #ef4444;
          }
          .access-denied-card h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: var(--text-main);
          }
          .access-denied-card p {
            color: var(--text-muted);
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .back-home-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 2rem;
            background: linear-gradient(135deg, var(--primary), #a78bfa);
            color: white !important;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
          }
          .back-home-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -4px rgba(139, 92, 246, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-container container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="heading-gradient"
      >
        Admin Panel
      </motion.h1>

      {/* Tabs */}
      <motion.div
        className="admin-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`tab ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <Tag size={18} />
          Coupons
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={18} />
          Settings
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={18} />
          Notifications
        </button>
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={18} />
          Stats
        </button>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="tab-content glass-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="coupons-tab">
            <h2>Manage Coupons</h2>

            {/* Create Coupon Form */}
            <form className="coupon-form" onSubmit={handleCreateCoupon}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g., SAVE500)"
                  value={newCoupon.code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  required
                />
                <input
                  type="number"
                  placeholder="Discount (in ₹)"
                  value={newCoupon.discountAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                  min="1"
                  max="1999"
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCoupon.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                />
                <button type="submit" disabled={couponLoading}>
                  <Plus size={18} />
                  {couponLoading ? 'Creating...' : 'Add Coupon'}
                </button>
              </div>
            </form>

            {couponMessage && (
              <div className={`message ${couponMessage.type}`}>
                {couponMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {couponMessage.text}
              </div>
            )}

            {/* Coupons List */}
            <div className="coupons-list">
              {coupons.length === 0 ? (
                <p className="empty-state">No coupons created yet</p>
              ) : (
                coupons.map(coupon => (
                  <div key={coupon.id} className={`coupon-item ${!coupon.is_active ? 'inactive' : ''}`}>
                    <div className="coupon-info">
                      <span className="coupon-code">{coupon.code}</span>
                      <span className="coupon-discount">₹{coupon.discount_amount / 100} off</span>
                      {coupon.description && (
                        <span className="coupon-desc">{coupon.description}</span>
                      )}
                    </div>
                    <div className="coupon-actions">
                      <button
                        className={`toggle-btn ${coupon.is_active ? 'active' : ''}`}
                        onClick={() => handleToggleCoupon(coupon)}
                        title={coupon.is_active ? 'Disable' : 'Enable'}
                      >
                        {coupon.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Global Settings</h2>

            <div className="setting-item">
              <label>Base Price (in paise)</label>
              <div className="setting-input-group">
                <input
                  type="number"
                  value={settings.base_price || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, base_price: e.target.value })}
                  min="100"
                />
                <span className="setting-hint">
                  Current: ₹{(parseInt(settings.base_price, 10) || 0) / 100}
                </span>
              </div>
            </div>

            {settingsMessage && (
              <div className={`message ${settingsMessage.type}`}>
                {settingsMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {settingsMessage.text}
              </div>
            )}

            <button
              className="save-settings-btn"
              onClick={handleSaveSettings}
              disabled={settingsLoading}
            >
              <Save size={18} />
              {settingsLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <h2>Send Push Notification</h2>
            <p className="tab-description">
              Select an article to notify all subscribed users. Title and body are auto-filled.
            </p>

            <form className="notification-form" onSubmit={handleSendNotification}>
              <div className="form-group">
                <label>Select Article</label>
                <select
                  value={selectedArticle}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedArticle(e.target.value)}
                  className="article-select"
                  required
                >
                  <option value="">-- Select an article --</option>
                  {(contentData as Article[])
                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                    .slice(0, 50)
                    .map(article => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                      </option>
                    ))}
                </select>
              </div>


              {selectedArticle && (() => {
                const article = (contentData as Article[]).find(a => a.id === selectedArticle);
                return (
                  <div className="notification-preview">
                    <h4>Preview</h4>
                    <div className="preview-card">
                      <div className="preview-icon">
                        <Bell size={20} />
                      </div>
                      <div className="preview-content">
                        <strong>New Article: {article?.title}</strong>
                        <p>{article?.description || 'Check out this new article!'}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {notificationMessage && (
                <div className={`message ${notificationMessage.type}`}>
                  {notificationMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {notificationMessage.text}
                </div>
              )}

              <button
                type="submit"
                className="send-notification-btn"
                disabled={notificationLoading || !selectedArticle}
              >
                <Send size={18} />
                {notificationLoading ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="stats-tab">
            <h2>Dashboard Statistics</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <FileText size={32} />
                <div className="stat-value">{stats.totalArticles}</div>
                <div className="stat-label">Total Articles</div>
              </div>
              <div className="stat-card premium">
                <Crown size={32} />
                <div className="stat-value">{stats.premiumArticles}</div>
                <div className="stat-label">Premium Articles</div>
              </div>
              <div className="stat-card free">
                <Unlock size={32} />
                <div className="stat-value">{stats.freeArticles}</div>
                <div className="stat-label">Free Articles</div>
              </div>
              <div className="stat-card">
                <Tag size={32} />
                <div className="stat-value">{stats.activeCoupons}/{stats.totalCoupons}</div>
                <div className="stat-label">Active Coupons</div>
              </div>
            </div>

            <div className="premium-ratio">
              <h3>Premium Content Ratio</h3>
              <div className="ratio-bar">
                <div
                  className="ratio-fill"
                  style={{ width: `${(stats.premiumArticles / stats.totalArticles) * 100}%` }}
                />
              </div>
              <span className="ratio-text">
                {Math.round((stats.premiumArticles / stats.totalArticles) * 100)}% premium
              </span>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .admin-container {
          padding: 2rem 0 4rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .admin-container h1 {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-loading, .admin-error {
          text-align: center;
          padding: 4rem 2rem;
        }

        .admin-error {
          max-width: 400px;
          margin: 4rem auto;
        }

        .admin-error svg {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .admin-error h2 {
          margin-bottom: 0.5rem;
        }

        .admin-error p {
          color: var(--text-muted);
        }

        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .tab:hover {
          background: var(--surface-hover);
          color: var(--text-main);
        }

        .tab.active {
          background: var(--primary);
          color: white;
        }

        .tab-content {
          padding: 2rem;
        }

        .tab-content h2 {
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .tab-description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        /* Coupons Tab */
        .coupon-form {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .form-row input {
          flex: 1;
          min-width: 150px;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--surface-hover);
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .form-row button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .form-row button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .coupons-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .coupon-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .coupon-item.inactive {
          opacity: 0.5;
        }

        .coupon-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .coupon-code {
          font-weight: 700;
          font-family: monospace;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .coupon-discount {
          color: #22c55e;
          font-weight: 600;
        }

        .coupon-desc {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .coupon-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.25rem;
        }

        .toggle-btn.active {
          color: #22c55e;
        }

        .delete-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ef4444;
          padding: 0.25rem;
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
        }

        /* Settings Tab */
        .setting-item {
          margin-bottom: 1.5rem;
        }

        .setting-item label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .setting-input-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .setting-input-group input {
          width: 200px;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--surface-hover);
          color: var(--text-main);
          font-size: 0.9rem;
        }

        .setting-hint {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .save-settings-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .save-settings-btn:disabled {
          opacity: 0.5;
        }

        /* Stats Tab */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          text-align: center;
          padding: 1.5rem;
          background: var(--surface-hover);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .stat-card svg {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .stat-card.premium svg {
          color: var(--primary);
        }

        .stat-card.free svg {
          color: #22c55e;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .premium-ratio {
          background: var(--surface-hover);
          padding: 1.5rem;
          border-radius: 12px;
        }

        .premium-ratio h3 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .ratio-bar {
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .ratio-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #a78bfa);
          border-radius: 4px;
        }

        .ratio-text {
          display: block;
          text-align: right;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Notifications Tab */
        .notifications-tab .notification-form {
          max-width: 600px;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--surface-hover);
          color: var(--text-main);
          font-size: 0.9rem;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group select {
          cursor: pointer;
        }

        .article-select {
          max-width: 100%;
        }

        .notification-preview {
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .notification-preview h4 {
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preview-card {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--background-color);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .preview-icon {
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .preview-content {
          flex: 1;
        }

        .preview-content strong {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .preview-content p {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin: 0;
          line-height: 1.4;
        }

        .send-notification-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .send-notification-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .send-notification-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .admin-tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: 1;
            justify-content: center;
            padding: 0.5rem;
          }

          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;
