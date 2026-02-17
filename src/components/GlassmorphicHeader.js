import React from 'react';
import { useNavigate } from 'react-router-dom';

const GlassmorphicHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50" style={{ background: 'transparent', border: 'none' }}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Modern Sphere Design */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Layered concentric circles */}
                                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" opacity="0.3" />
                                <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" opacity="0.6" />
                                <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
                                {/* Orbital ring */}
                                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="white" strokeWidth="1" opacity="0.5" transform="rotate(45 12 12)" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            SubSphere
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a
                            href="#platform"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                            style={{ outline: 'none', border: 'none' }}
                        >
                            Platform
                        </a>
                        <a
                            href="#features"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                            style={{ outline: 'none', border: 'none' }}
                        >
                            Features
                        </a>
                        <a
                            href="#api-docs"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                            style={{ outline: 'none', border: 'none' }}
                        >
                            API Docs
                        </a>
                        <a
                            href="#pricing"
                            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                            style={{ outline: 'none', border: 'none' }}
                        >
                            Pricing
                        </a>
                    </nav>

                    {/* CTA Button - Frosted Glass */}
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.45)',
                            borderRadius: '9999px',
                            padding: '10px 20px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#111827',
                            cursor: 'pointer',
                            transition: 'all 0.28s ease-in-out',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.6)',
                            filter: 'drop-shadow(0 0 1px rgba(147, 197, 253, 0.1)) drop-shadow(0 0 1px rgba(196, 181, 253, 0.1))',
                            transform: 'translateY(0)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.85)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.7)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.75)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.6)';
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.6)';
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </header>
    );
};

export default GlassmorphicHeader;
