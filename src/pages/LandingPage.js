import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Experience blazing fast subscription management with optimized performance'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to keep your subscription data safe'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Get insights with powerful analytics and reporting tools'
    },
    {
      icon: '💳',
      title: 'Easy Billing',
      description: 'Automated billing and payment processing made simple'
    },
    {
      icon: '🎯',
      title: 'Smart Management',
      description: 'Intuitive dashboard designed for seamless subscription control'
    },
    {
      icon: '🚀',
      title: 'Scale Effortlessly',
      description: 'Grow your business without worrying about subscription limits'
    }
  ];

  return (
    <div className="landing-page-new">
      {/* Navigation */}
      <nav className="navbar-new">
        <div className="nav-container">
          <div className="logo-section">
            <div className="logo-icon">S</div>
            <span className="logo-text">SubHub</span>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>Pricing</a>
            <button className="nav-login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-signup-btn" onClick={() => navigate('/pricing')}>Start Free Trial</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-new">
        <div className="hero-content-new">
          <div className="hero-text">
            <h1 className="hero-title-new">
              Elevate Your <span className="gradient-text">Subscription</span><br />
              Management with SubHub
            </h1>
            <p className="hero-subtitle-new">
              Streamline, Optimize, and Scale Your Subscription Management with Our Powerful SaaS Solution
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-new" onClick={() => navigate('/pricing')}>
                14 Days Free Trial
              </button>
              <button className="btn-secondary-new" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500K+</span>
                <span className="stat-label">Subscriptions Managed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="dashboard-preview">
            <div className="dashboard-window">
              <div className="window-header">
                <div className="window-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="window-title">SubHub Dashboard</div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-sidebar">
                  <div className="sidebar-item active">
                    <span className="sidebar-icon">📊</span>
                    <span className="sidebar-text">Dashboard</span>
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">📦</span>
                    <span className="sidebar-text">Subscriptions</span>
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">💳</span>
                    <span className="sidebar-text">Billing</span>
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">⚙️</span>
                    <span className="sidebar-text">Settings</span>
                  </div>
                </div>
                <div className="dashboard-main">
                  <div className="dashboard-header-section">
                    <h2>Welcome back, User</h2>
                    <p>Subscription management shouldn't be complicated. It should be automated.</p>
                  </div>
                  <div className="dashboard-cards">
                    <div className="metric-card">
                      <div className="metric-label">Active Plan</div>
                      <div className="metric-value">PRO</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Subscriptions</div>
                      <div className="metric-value">24</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">This Month</div>
                      <div className="metric-value">$1,247</div>
                    </div>
                  </div>
                  <div className="chart-placeholder">
                    <div className="chart-bars">
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                      <div className="bar" style={{height: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-new">
        <div className="features-container">
          <h2 className="section-title-new">Why Choose SubHub?</h2>
          <p className="section-subtitle">Everything you need to manage subscriptions effortlessly</p>
          
          <div className="features-grid-new">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-new">
                <div className="feature-icon-new">{feature.icon}</div>
                <h3 className="feature-title-new">{feature.title}</h3>
                <p className="feature-desc-new">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-new">
        <div className="cta-content">
          <h2>Ready to Transform Your Subscription Management?</h2>
          <p>Join thousands of satisfied customers today</p>
          <button className="cta-btn" onClick={() => navigate('/pricing')}>
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-new">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">S</div>
              <span className="logo-text">SubHub</span>
            </div>
            <p className="footer-desc">Streamline your subscription management with SubHub</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#docs">Documentation</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#careers">Careers</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SubHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;