import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Smartphone, ArrowRight } from 'lucide-react';

const ArchitectureDiagram = () => {
    return (
        <div className="py-24 px-6 bg-gradient-to-b from-white to-subsphere-light">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Seamless Integration Architecture
                    </h2>
                    <p className="text-xl text-gray-600">
                        SubSphere sits at the heart of your subscription infrastructure
                    </p>
                </motion.div>

                {/* Isometric Diagram */}
                <div className="relative">
                    {/* Center Node - SubSphere */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, type: 'spring' }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                        <div className="glass-card p-8 shadow-glow">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-subsphere-purple to-subsphere-dark-purple flex items-center justify-center mb-3">
                                <Server className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-gray-900 text-lg">SubSphere</div>
                                <div className="text-xs text-gray-600">Core Engine</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Connected Nodes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-48 pb-24">
                        <ConnectedNode
                            icon={<Smartphone className="w-8 h-8" />}
                            title="Client App"
                            description="React, iOS, Android"
                            delay={0.2}
                            position="left"
                        />
                        <ConnectedNode
                            icon={<Database className="w-8 h-8" />}
                            title="Payment Gateway"
                            description="Stripe, PayPal, Square"
                            delay={0.4}
                            position="center"
                        />
                        <ConnectedNode
                            icon={<Database className="w-8 h-8" />}
                            title="Database"
                            description="MySQL, PostgreSQL"
                            delay={0.6}
                            position="right"
                        />
                    </div>

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#7b39fc" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#7b39fc" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#7b39fc" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>

                        {/* Animated connection paths */}
                        <motion.line
                            x1="50%" y1="50%" x2="20%" y2="75%"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="50%" y2="75%"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="80%" y2="75%"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// Connected Node Component
const ConnectedNode = ({ icon, title, description, delay, position }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="glass-card glass-card-hover p-6 text-center"
    >
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 text-subsphere-purple">
            {icon}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-subsphere-purple">
            <span>API Connected</span>
            <ArrowRight className="w-3 h-3" />
        </div>
    </motion.div>
);

export default ArchitectureDiagram;
