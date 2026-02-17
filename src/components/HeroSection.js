import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import './LogoStyles.css';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-new">
            {/* Background Video */}
            <video
                className="hero-bg-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/background.mp4" type="video/mp4" />
                {/* Fallback for browsers that don't support video */}
                Your browser does not support the video tag.
            </video>

            {/* Blurred Background Element */}
            <div className="hero-blur-pill"></div>

            {/* Navigation */}
            <nav className="navbar-new">
                <div className="nav-container-new">
                    <div className="nav-left">
                        {/* SubSphere Logo */}
                        <div className="logo-container">
                            <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" fill="url(#gradient)" stroke="#7b39fc" strokeWidth="2" />
                                <path d="M16 8 L16 24 M10 16 L22 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop offset="0%" stopColor="#7b39fc" />
                                        <stop offset="100%" stopColor="#9333ea" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="logo-text">SubSphere</span>
                        </div>

                        <div className="nav-links-new">
                            <a href="#home" className="nav-link">Home</a>
                            <a href="#services" className="nav-link nav-link-dropdown">
                                Services
                                <svg className="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                            <a href="#reviews" className="nav-link">Reviews</a>
                            <a href="#contact" className="nav-link">Contact us</a>
                        </div>
                    </div>

                    <div className="nav-right">
                        <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
                        <button className="btn-getstarted" onClick={() => navigate('/login')}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="hero-content-new">
                <div className="hero-text-block">
                    <h1 className="hero-heading">
                        <span className="heading-line-1">Build your Subscription</span>
                        <span className="heading-line-2">Infrastructure by talking to AI</span>
                    </h1>
                    <p className="hero-subtitle-new">
                        The plug-and-play engine for complex billing logic, prorated adjustments, and automated dunning management.
                    </p>
                </div>

                <div className="hero-cta-buttons">
                    <button className="cta-primary" onClick={() => navigate('/login')}>Get Started Free</button>
                    <button className="cta-secondary" onClick={() => navigate('/login')}>Watch 2min Demo</button>
                </div>
            </div>

            {/* Dashboard Image */}
            <div className="dashboard-image-container">
                <div className="glassmorphic-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop&q=80"
                        alt="SubSphere Dashboard Preview"
                        className="dashboard-img"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
