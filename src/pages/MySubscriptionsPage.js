import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSubscriptionAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './MySubscriptionsPage.css';

const MySubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'category'
  
  const [formData, setFormData] = useState({
    subscriptionName: '',
    amount: '',
    billingCycle: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    categoryId: '',
    notes: ''
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [subsRes, statsRes, insightsRes, upcomingRes, categoriesRes] = await Promise.all([
        userSubscriptionAPI.getAllSubscriptions(),
        userSubscriptionAPI.getStats(),
        userSubscriptionAPI.getInsights(),
        userSubscriptionAPI.getUpcomingRenewals(7),
        userSubscriptionAPI.getCategories()
      ]);

      setSubscriptions(subsRes.data.data || []);
      setStats(statsRes.data.data || null);
      setInsights(insightsRes.data.data || []);
      setUpcomingRenewals(upcomingRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const subscriptionDto = {
        subscriptionName: formData.subscriptionName,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle,
        startDate: formData.startDate,
        category: categories.find(c => c.id === parseInt(formData.categoryId)),
        notes: formData.notes
      };

      if (editingSubscription) {
        await userSubscriptionAPI.updateSubscription(editingSubscription.id, subscriptionDto);
        alert('Subscription updated successfully!');
      } else {
        await userSubscriptionAPI.createSubscription(subscriptionDto);
        alert('Subscription added successfully!');
      }

      // Reset form and refresh data
      setShowAddForm(false);
      setEditingSubscription(null);
      setFormData({
        subscriptionName: '',
        amount: '',
        billingCycle: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        categoryId: '',
        notes: ''
      });
      fetchAllData();
    } catch (err) {
      alert('Failed to save subscription: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      subscriptionName: subscription.subscriptionName,
      amount: subscription.amount,
      billingCycle: subscription.billingCycle,
      startDate: subscription.startDate,
      categoryId: subscription.subscriptionCategory?.id || '',
      notes: subscription.notes || ''
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await userSubscriptionAPI.cancelSubscription(subscriptionId);
      alert('Subscription cancelled successfully!');
      fetchAllData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly',
      YEARLY: 'Yearly'
    };
    return labels[cycle] || cycle;
  };

  const getFilteredSubscriptions = () => {
    if (activeFilter === 'active') {
      return subscriptions.filter(s => s.status === 'ACTIVE');
    }
    return subscriptions;
  };

  if (loading) {
    return (
      <div className="my-subscriptions-page">
        <div className="loading">Loading subscriptions...</div>
      </div>
    );
  }

  const filteredSubscriptions = getFilteredSubscriptions();

  return (
    <div className="my-subscriptions-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Subscriptions</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')}>Plan Dashboard</button>
            {user?.role === 'ADMIN' && (
              <button onClick={() => navigate('/admin')}>Admin Panel</button>
            )}
            <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </header>

      <div className="subscriptions-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-box">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Monthly Cost</h3>
              <p className="stat-number">{stats ? formatCurrency(stats.totalMonthlyCost) : '₹0'}</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Active Subscriptions</h3>
              <p className="stat-number">{stats?.activeCount || 0}</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🔔</div>
            <div className="stat-info">
              <h3>Upcoming Renewals</h3>
              <p className="stat-number">{upcomingRenewals.length}</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div className="insights-section">
            <h2>💡 Smart Insights</h2>
            <div className="insights-list">
              {insights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <span className="insight-icon">⚠️</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Renewals */}
        {upcomingRenewals.length > 0 && (
          <div className="renewals-section">
            <h2>🔔 Upcoming Renewals (Next 7 Days)</h2>
            <div className="renewals-list">
              {upcomingRenewals.map((sub) => (
                <div key={sub.id} className="renewal-card">
                  <div className="renewal-info">
                    <h4>{sub.subscriptionName}</h4>
                    <p className="renewal-date">Renews on {formatDate(sub.nextBillingDate)}</p>
                  </div>
                  <div className="renewal-amount">{formatCurrency(sub.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Subscription Form */}
        <div className="subscription-actions">
          <h2>Manage Subscriptions</h2>
          <button 
            className="btn-add-subscription"
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingSubscription(null);
                setFormData({
                  subscriptionName: '',
                  amount: '',
                  billingCycle: 'MONTHLY',
                  startDate: new Date().toISOString().split('T')[0],
                  categoryId: '',
                  notes: ''
                });
              }
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add Subscription'}
          </button>
        </div>

        {showAddForm && (
          <form className="subscription-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Subscription Name *</label>
                <input
                  type="text"
                  name="subscriptionName"
                  value={formData.subscriptionName}
                  onChange={handleInputChange}
                  placeholder="e.g., Netflix, Spotify, Gym"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="499.00"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Billing Cycle *</label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleInputChange}
                  required
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              {editingSubscription ? 'Update Subscription' : 'Add Subscription'}
            </button>
          </form>
        )}

        {/* Filters */}
        <div className="filter-tabs">
          <button 
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All ({subscriptions.length})
          </button>
          <button 
            className={activeFilter === 'active' ? 'active' : ''}
            onClick={() => setActiveFilter('active')}
          >
            Active ({subscriptions.filter(s => s.status === 'ACTIVE').length})
          </button>
        </div>

        {/* Subscriptions List */}
        <div className="subscriptions-list">
          {filteredSubscriptions.length === 0 ? (
            <div className="no-subscriptions">
              <p>No subscriptions found. Add your first subscription to get started!</p>
            </div>
          ) : (
            <div className="subscriptions-grid">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="subscription-card">
                  <div className="card-header">
                    <h3>{sub.subscriptionName}</h3>
                    <span className={`status-badge ${sub.status?.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="subscription-detail">
                      <span className="label">Amount:</span>
                      <span className="value amount">{formatCurrency(sub.amount)}</span>
                    </div>

                    <div className="subscription-detail">
                      <span className="label">Billing:</span>
                      <span className="value">{getBillingCycleLabel(sub.billingCycle)}</span>
                    </div>

                    <div className="subscription-detail">
                      <span className="label">Category:</span>
                      <span className="value">{sub.subscriptionCategory?.name || 'N/A'}</span>
                    </div>

                    <div className="subscription-detail">
                      <span className="label">Start Date:</span>
                      <span className="value">{formatDate(sub.startDate)}</span>
                    </div>

                    <div className="subscription-detail">
                      <span className="label">Next Billing:</span>
                      <span className="value highlight">{formatDate(sub.nextBillingDate)}</span>
                    </div>

                    {sub.notes && (
                      <div className="subscription-notes">
                        <span className="label">Notes:</span>
                        <p>{sub.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(sub)}
                    >
                      Edit
                    </button>
                    {sub.status === 'ACTIVE' && (
                      <button 
                        className="btn-cancel-sub"
                        onClick={() => handleCancel(sub.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptionsPage;