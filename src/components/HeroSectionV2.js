import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, DollarSign } from 'lucide-react';

const HeroSectionV2 = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative min-h-screen overflow-hidden" style={{ background: 'transparent' }}>
            {/* Soft radial glow behind hero heading */}
            <div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
                {/* Hero Content */}
                <div className="text-center mb-16">
                    <div className="hero-heading-wrapper">
                        <h1
                            className="hero-heading-premium"
                            style={{
                                fontSize: 'clamp(3.5rem, 7vw, 4.5rem)',
                                fontWeight: 600,
                                marginBottom: '1.5rem',
                                color: 'rgba(240, 245, 255, 0.98)',
                                lineHeight: 1.08,
                                letterSpacing: '-0.02em',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 40px rgba(0, 20, 60, 0.35)',
                                animation: 'heroReveal 1.2s ease-out forwards'
                            }}
                        >
                            Build your Subscription<br />Infrastructure by talking to AI
                        </h1>
                        {/* Subtle underline glow */}
                        <div
                            style={{
                                width: '40%',
                                height: '2px',
                                margin: '1.5rem auto 0',
                                background: 'rgba(59, 130, 246, 0.25)',
                                filter: 'blur(1px)'
                            }}
                        />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.8)', opacity: 0.75, lineHeight: 1.6 }}>
                        The plug-and-play engine for complex billing logic, prorated adjustments,
                        and automated dunning management.
                    </p>
                </div>

                {/* Interactive Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-16"
                >
                    <div
                        className="glass-sweep max-w-3xl mx-auto p-2"
                        style={{
                            position: 'relative',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '1.5rem',
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden'
                        }}
                    >
                        <div className="flex items-center gap-4 p-4">
                            <Search className="w-6 h-6 text-blue-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Predict churn for my Gold Tier users..."
                                className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400"
                            />
                            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                                Ask AI
                            </button>
                        </div>
                    </div>

                    {/* Floating Result Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto"
                    >
                        <ResultCard
                            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                            title="Growth Rate"
                            value="+24.5%"
                            subtitle="This quarter"
                        />
                        <ResultCard
                            icon={<Users className="w-6 h-6 text-blue-500" />}
                            title="Active Users"
                            value="1,284"
                            subtitle="Gold Tier"
                        />
                        <ResultCard
                            icon={<DollarSign className="w-6 h-6 text-purple-500" />}
                            title="MRR"
                            value="$48.2K"
                            subtitle="Monthly"
                        />
                    </motion.div>
                </motion.div>

                {/* Tech Stack Ribbon */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale"
                >
                    <TechLogo text="Spring Boot 4.0" />
                    <TechLogo text="MySQL" />
                    <TechLogo text="JWT Secure" />
                    <TechLogo text="AWS" />
                </motion.div>
            </div>
        </div>
    );
};

// Result Card Component
const ResultCard = ({ icon, title, value, subtitle }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-sweep p-6 text-center"
        style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '1.5rem',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
        }}
    >
        <div className="flex justify-center mb-3">{icon}</div>
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
    </motion.div>
);

// Tech Logo Component
const TechLogo = ({ text }) => (
    <div
        className="glass-sweep px-6 py-3"
        style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '1.5rem',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
        }}
    >
        <span className="text-sm font-semibold text-gray-700" style={{ position: 'relative', zIndex: 2 }}>{text}</span>
    </div>
);

export default HeroSectionV2;
