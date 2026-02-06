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
    <div className="landing-page-premium">
      {/* Navigation */}
      <nav className="navbar-premium">
        <div className="nav-container-premium">
          <div className="logo-section-premium">
            <div className="logo-icon-premium">S</div>
            <span className="logo-text-premium">SubHub</span>
          </div>
          <div className="nav-links-premium">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>Pricing</a>
            <button className="nav-login-btn-premium" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-signup-btn-premium" onClick={() => navigate('/pricing')}>
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dashboard */}
      <section className="hero-premium">
        <div className="hero-glow"></div>
        <div className="hero-content-premium">
          <div className="hero-text-premium">
            <div className="hero-badge">✨ #1 Subscription Management Platform</div>
            <h1 className="hero-title-premium">
              Elevate Your <span className="gradient-text-premium">Subscription</span><br />
              Management with SubHub
            </h1>
            <p className="hero-subtitle-premium">
              Streamline, Optimize, and Scale Your Subscription Management with Our Powerful SaaS Solution. Join 1000+ companies managing their subscriptions effortlessly.
            </p>
            <div className="hero-buttons-premium">
              <button className="btn-primary-premium" onClick={() => navigate('/pricing')}>
                <span>14 Days Free Trial</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-secondary-premium" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
            <div className="hero-stats-premium">
              <div className="stat-item-premium">
                <span className="stat-number-premium">1000+</span>
                <span className="stat-label-premium">Active Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item-premium">
                <span className="stat-number-premium">500K+</span>
                <span className="stat-label-premium">Subscriptions</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item-premium">
                <span className="stat-number-premium">99.9%</span>
                <span className="stat-label-premium">Uptime</span>
              </div>
            </div>
          </div>

          {/* Premium Dashboard Mockup */}
          <div className="dashboard-mockup-premium">
            <div className="mockup-glow"></div>
            <div className="dashboard-window-premium">
              <div className="window-titlebar">
                <div className="titlebar-buttons">
                  <span className="btn-close"></span>
                  <span className="btn-minimize"></span>
                  <span className="btn-maximize"></span>
                </div>
                <span className="window-title-text">SubHub Dashboard</span>
              </div>
              
              <div className="dashboard-layout">
                <div className="dashboard-sidebar-premium">
                  <div className="sidebar-section">
                    <div className="sidebar-item-premium active">
                      <span className="item-icon">📊</span>
                      <span className="item-text">Overview</span>
                    </div>
                    <div className="sidebar-item-premium">
                      <span className="item-icon">📦</span>
                      <span className="item-text">Subscriptions</span>
                    </div>
                    <div className="sidebar-item-premium">
                      <span className="item-icon">💳</span>
                      <span className="item-text">Billing</span>
                    </div>
                    <div className="sidebar-item-premium">
                      <span className="item-icon">📈</span>
                      <span className="item-text">Analytics</span>
                    </div>
                    <div className="sidebar-item-premium">
                      <span className="item-icon">⚙️</span>
                      <span className="item-text">Settings</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-main-premium">
                  <div className="dashboard-header-premium">
                    <div>
                      <h2 className="dashboard-welcome">Welcome back, Abhishek</h2>
                      <p className="dashboard-subtitle">Here's what's happening with your subscriptions today.</p>
                    </div>
                  </div>

                  <div className="metrics-grid-premium">
                    <div className="metric-card-premium">
                      <div className="metric-header">
                        <span className="metric-icon">📦</span>
                        <span className="metric-trend positive">+12%</span>
                      </div>
                      <div className="metric-value-premium">$12,426</div>
                      <div className="metric-label-premium">Monthly Revenue</div>
                    </div>
                    <div className="metric-card-premium">
                      <div className="metric-header">
                        <span className="metric-icon">👥</span>
                        <span className="metric-trend positive">+8%</span>
                      </div>
                      <div className="metric-value-premium">1,247</div>
                      <div className="metric-label-premium">Active Users</div>
                    </div>
                    <div className="metric-card-premium">
                      <div className="metric-header">
                        <span className="metric-icon">⚡</span>
                        <span className="metric-trend negative">-3%</span>
                      </div>
                      <div className="metric-value-premium">89</div>
                      <div className="metric-label-premium">Churn Rate</div>
                    </div>
                  </div>

                  <div className="chart-section-premium">
                    <div className="chart-header">
                      <h3>Revenue Overview</h3>
                      <div className="chart-tabs">
                        <span className="tab active">Week</span>
                        <span className="tab">Month</span>
                        <span className="tab">Year</span>
                      </div>
                    </div>
                    <div className="chart-container-premium">
                      <div className="chart-bars-premium">
                        <div className="bar-premium" style={{height: '45%'}}></div>
                        <div className="bar-premium" style={{height: '65%'}}></div>
                        <div className="bar-premium" style={{height: '55%'}}></div>
                        <div className="bar-premium" style={{height: '80%'}}></div>
                        <div className="bar-premium" style={{height: '70%'}}></div>
                        <div className="bar-premium" style={{height: '90%'}}></div>
                        <div className="bar-premium" style={{height: '75%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-premium" id="features">
        <div className="features-container-premium">
          <div className="section-header-premium">
            <span className="section-badge">FEATURES</span>
            <h2 className="section-title-premium">Why Choose SubHub?</h2>
            <p className="section-description">Everything you need to manage subscriptions effortlessly</p>
          </div>
          
          <div className="features-grid-premium">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-premium">
                <div className="feature-icon-premium">{feature.icon}</div>
                <h3 className="feature-title-premium">{feature.title}</h3>
                <p className="feature-desc-premium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-premium">
        <div className="cta-glow"></div>
        <div className="cta-content-premium">
          <h2 className="cta-title">Ready to Transform Your Subscription Management?</h2>
          <p className="cta-subtitle">Join thousands of satisfied customers today</p>
          <button className="cta-button-premium" onClick={() => navigate('/pricing')}>
            Start Your Free Trial
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="footer-premium">
        <div className="footer-container-premium">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon-premium">S</div>
                <span className="logo-text-premium">SubHub</span>
              </div>
              <p className="footer-description">
                Streamline your subscription management with SubHub. The all-in-one platform trusted by thousands.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">𝕏</a>
                <a href="#" className="social-link">in</a>
                <a href="#" className="social-link">f</a>
                <a href="#" className="social-link">ig</a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="footer-link">Pricing</a>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API Reference</a>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Company</h4>
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Blog</a>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Legal</h4>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Security</a>
              <a href="#" className="footer-link">Cookies</a>
            </div>
          </div>

          <div className="footer-bottom-premium">
            <p className="footer-copyright">© 2024 SubHub. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge-premium">🔒 Enterprise Security</span>
              <span className="badge-premium">✓ SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;