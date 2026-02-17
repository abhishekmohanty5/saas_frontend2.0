import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionAPI, userSubscriptionAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [planSubscription, setPlanSubscription] = useState(null);
  const [personalSubscriptions, setPersonalSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        subscriptionAPI.getUserSubscription(),
        userSubscriptionAPI.getStats(),
        userSubscriptionAPI.getAllSubscriptions(),
        userSubscriptionAPI.getInsights(),
        userSubscriptionAPI.getUpcomingRenewals(7)
      ]);

      // Plan subscription
      if (results[0].status === 'fulfilled') {
        setPlanSubscription(results[0].value.data?.data);
      }

      // Personal subscription stats
      if (results[1].status === 'fulfilled') {
        setStats(results[1].value.data?.data);
      }

      // Personal subscriptions
      if (results[2].status === 'fulfilled') {
        const subs = results[2].value.data?.data || [];
        setPersonalSubscriptions(subs.slice(0, 5)); // Show only first 5
      }

      // Insights
      if (results[3].status === 'fulfilled') {
        setInsights(results[3].value.data?.data || []);
      }

      // Upcoming renewals
      if (results[4].status === 'fulfilled') {
        setUpcomingRenewals(results[4].value.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPlanSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your plan subscription?')) {
      return;
    }

    try {
      await subscriptionAPI.cancelSubscription();
      alert('Plan subscription cancelled successfully');
      fetchAllData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard-premium">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-premium">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="brand-icon">S</div>
            <span className="brand-text">SubHub</span>
          </div>

          <div className="nav-actions">
            <button className="nav-btn" onClick={() => navigate('/my-subscriptions')}>
              <span className="btn-icon">📦</span>
              All Subscriptions
            </button>
            
            {user?.role === 'ADMIN' && (
              <button className="nav-btn" onClick={() => navigate('/admin')}>
                <span className="btn-icon">⚙️</span>
                Admin Panel
              </button>
            )}

            <div className="notification-container">
              <button 
                className="nav-btn icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="btn-icon">🔔</span>
                {upcomingRenewals.length > 0 && (
                  <span className="notification-badge">{upcomingRenewals.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setShowNotifications(false)}>✕</button>
                  </div>
                  <div className="dropdown-content">
                    {upcomingRenewals.length > 0 ? (
                      upcomingRenewals.map((renewal, idx) => (
                        <div key={idx} className="notification-item">
                          <span className="notif-icon">🔔</span>
                          <div className="notif-content">
                            <p className="notif-title">{renewal.subscriptionName}</p>
                            <p className="notif-desc">
                              Renews on {formatDate(renewal.nextBillingDate)} - {formatCurrency(renewal.amount)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No upcoming renewals</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="nav-btn logout-btn" onClick={() => { logout(); navigate('/'); }}>
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header-premium">
          <div className="header-text">
            <h1 className="header-title">
              {getGreeting()}, <span className="user-name">{user?.email?.split('@')[0] || 'User'}</span>! 👋
            </h1>
            <p className="header-subtitle">Here's an overview of your subscriptions and spending</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid-premium">
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper purple">
              <span className="stat-icon">💎</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Current Plan</p>
              <h3 className="stat-value">
                {planSubscription?.plan?.name || 'FREE'}
              </h3>
              <p className="stat-meta">
                {planSubscription ? `Until ${formatDate(planSubscription.endDate)}` : 'No active plan'}
              </p>
            </div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-icon-wrapper green">
              <span className="stat-icon">💰</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Monthly Cost</p>
              <h3 className="stat-value">
                {formatCurrency(stats?.totalMonthlyCost || 0)}
              </h3>
              <p className="stat-meta">From personal subscriptions</p>
            </div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-icon-wrapper blue">
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Subscriptions</p>
              <h3 className="stat-value">{stats?.activeCount || 0}</h3>
              <p className="stat-meta">Currently being tracked</p>
            </div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-icon-wrapper orange">
              <span className="stat-icon">🔔</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Renewals This Week</p>
              <h3 className="stat-value">{upcomingRenewals.length}</h3>
              <p className="stat-meta">Due in next 7 days</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="content-grid-premium">
          {/* Left Column */}
          <div className="left-column">
            {/* Plan Card */}
            <div className="plan-card-premium">
              <div className="card-header-premium">
                <h2 className="card-title">Your Plan</h2>
                <span className={`plan-badge ${planSubscription?.status?.toLowerCase() || 'inactive'}`}>
                  {planSubscription?.status || 'No Plan'}
                </span>
              </div>

              {planSubscription ? (
                <div className="plan-details">
                  <div className="plan-info-row">
                    <div className="plan-info-item">
                      <span className="info-label">Plan Name</span>
                      <span className="info-value">{planSubscription.plan?.name}</span>
                    </div>
                    <div className="plan-info-item">
                      <span className="info-label">Price</span>
                      <span className="info-value">{formatCurrency(planSubscription.plan?.price)}</span>
                    </div>
                  </div>

                  <div className="plan-info-row">
                    <div className="plan-info-item">
                      <span className="info-label">Start Date</span>
                      <span className="info-value">{formatDate(planSubscription.startDate)}</span>
                    </div>
                    <div className="plan-info-item">
                      <span className="info-label">End Date</span>
                      <span className="info-value">{formatDate(planSubscription.endDate)}</span>
                    </div>
                  </div>

                  <div className="plan-actions">
                    <button className="btn-upgrade" onClick={() => navigate('/pricing')}>
                      ⬆️ Upgrade Plan
                    </button>
                    {planSubscription.status === 'ACTIVE' && (
                      <button className="btn-cancel" onClick={handleCancelPlanSubscription}>
                        ❌ Cancel Plan
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-plan">
                  <p>You don't have an active plan subscription</p>
                  <button className="btn-get-plan" onClick={() => navigate('/pricing')}>
                    View Plans
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => navigate('/my-subscriptions')}>
                  <span className="action-icon">➕</span>
                  <div className="action-text">
                    <span className="action-title">Add Subscription</span>
                    <span className="action-desc">Track new subscription</span>
                  </div>
                </button>
                
                <button className="action-btn" onClick={() => navigate('/pricing')}>
                  <span className="action-icon">💳</span>
                  <div className="action-text">
                    <span className="action-title">Upgrade Plan</span>
                    <span className="action-desc">Get premium features</span>
                  </div>
                </button>

                <button className="action-btn" onClick={() => navigate('/my-subscriptions')}>
                  <span className="action-icon">📊</span>
                  <div className="action-text">
                    <span className="action-title">View Analytics</span>
                    <span className="action-desc">Spending insights</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Recent Subscriptions */}
            <div className="subscriptions-card-premium">
              <div className="card-header-premium">
                <h2 className="card-title">Recent Subscriptions</h2>
                <button className="view-all-btn" onClick={() => navigate('/my-subscriptions')}>
                  View All →
                </button>
              </div>

              {personalSubscriptions.length > 0 ? (
                <div className="subscriptions-list-premium">
                  {personalSubscriptions.map((sub) => (
                    <div key={sub.id} className="subscription-item-premium">
                      <div className="sub-icon">{sub.subscriptionCategory?.name?.[0] || '📦'}</div>
                      <div className="sub-info">
                        <h4 className="sub-name">{sub.subscriptionName}</h4>
                        <p className="sub-category">{sub.subscriptionCategory?.name || 'Other'}</p>
                      </div>
                      <div className="sub-amount">
                        <span className="amount">{formatCurrency(sub.amount)}</span>
                        <span className="cycle">/{sub.billingCycle?.toLowerCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-subscriptions">
                  <p>No subscriptions tracked yet</p>
                  <button className="btn-add-first" onClick={() => navigate('/my-subscriptions')}>
                    Add Your First Subscription
                  </button>
                </div>
              )}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div className="insights-card-premium">
                <h3 className="card-title">💡 Smart Insights</h3>
                <div className="insights-list-premium">
                  {insights.map((insight, idx) => (
                    <div key={idx} className="insight-item">
                      <span className="insight-bullet">•</span>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Renewals Section */}
        {upcomingRenewals.length > 0 && (
          <div className="renewals-section-premium">
            <h2 className="section-title">⏰ Upcoming Renewals</h2>
            <div className="renewals-grid">
              {upcomingRenewals.map((renewal) => (
                <div key={renewal.id} className="renewal-card-premium">
                  <div className="renewal-header">
                    <h4>{renewal.subscriptionName}</h4>
                    <span className="renewal-amount">{formatCurrency(renewal.amount)}</span>
                  </div>
                  <p className="renewal-date">
                    Due on {formatDate(renewal.nextBillingDate)}
                  </p>
                  <div className="renewal-category">
                    {renewal.subscriptionCategory?.name || 'Other'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;