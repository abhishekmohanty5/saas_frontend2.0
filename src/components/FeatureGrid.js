import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, BarChart3, Zap } from 'lucide-react';

const FeatureGrid = () => {
    return (
        <div className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Card - AI-First Lifecycle Management */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card glass-card-hover p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                AI-First Lifecycle Management
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-8">
                            Automate your entire subscription lifecycle with intelligent billing cycles,
                            prorated adjustments, and seamless plan transitions.
                        </p>

                        {/* Dashboard Visual */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-gray-700">Billing Cycles</span>
                                <span className="text-xs text-gray-500">Automated</span>
                            </div>

                            <div className="space-y-3">
                                <BillingCycleRow status="active" plan="Enterprise" amount="$499" date="Feb 28" />
                                <BillingCycleRow status="pending" plan="Professional" amount="$199" date="Mar 05" />
                                <BillingCycleRow status="active" plan="Starter" amount="$49" date="Mar 12" />
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs text-gray-600">AI automatically handles prorations and upgrades</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Card - Natural Language Analytics */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card glass-card-hover p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                Natural Language Analytics
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-8">
                            Ask questions in plain English and get instant insights about your subscription metrics,
                            churn patterns, and revenue trends.
                        </p>

                        {/* Chat UI */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                            {/* User Question */}
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                                        <p className="text-sm text-gray-800">
                                            Why did my churn increase by 5%?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl rounded-tl-sm p-4 border border-purple-100">
                                        <p className="text-sm text-gray-800 mb-3">
                                            Analysis shows 3 key factors:
                                        </p>
                                        <ul className="text-sm text-gray-700 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5" />
                                                <span>Payment failures increased 12% (dunning needed)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5" />
                                                <span>Gold tier saw 8% voluntary cancellations</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5" />
                                                <span>Feature usage dropped 15% before churn</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Billing Cycle Row Component
const BillingCycleRow = ({ status, plan, amount, date }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium text-gray-900">{plan}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-purple-600">{amount}</span>
            <span className="text-xs text-gray-500">{date}</span>
        </div>
    </div>
);

export default FeatureGrid;
